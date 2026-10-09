import { getCollection } from '@/lib/mongodb';
import type { Empresa } from '@/types/db';

/**
 * Conectores externos (Jira, ServiceNow) de una EMPRESA.
 *
 * Se leen desde la BD en cada uso y NO viajan en el JWT: así todos los usuarios de la
 * empresa los ven al instante y un admin_global que cambia de empresa ve los de la destino.
 * Los conectores creados antes de guardar `company_id` se reconocen por `created_by.client`.
 */
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
