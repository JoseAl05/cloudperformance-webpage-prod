import { getCollection } from '@/lib/mongodb';
import type { Empresa } from '@/types/db';

export async function findCompanyConnectors(companyName: string | undefined | null) {
  if (!companyName) return [];

  const empresas = await getCollection<Empresa>('Empresas');
  const company = await empresas.findOne({ name: companyName }, { projection: { _id: 1 } });

  const scope = company
    ? {
        $or: [
          { company_id: String(company._id) },
          { company_id: { $exists: false }, 'created_by.client': companyName },
        ],
      }
    : { company_id: { $exists: false }, 'created_by.client': companyName };

  const connectors = await getCollection('cloudperformance_external_connectors');
  return connectors
    .find(scope)
    .project({
      _id: 0,
      connector_type: 1,
      created_by: 1,
      config: 1,
      created_at: 1,
      updated_at: 1,
      status: 1,
    })
    .toArray();
}
