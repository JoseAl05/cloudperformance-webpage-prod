import { getCollection } from '@/lib/mongodb';
import { Empresa } from '@/types/db';

export async function findCompanyByName(name: string): Promise<Empresa | null> {
  try {
    const empresasCollection = await getCollection<Empresa>('Empresas');

    const company = await empresasCollection.findOne({ name: name });

    return company;
  } catch (error) {
    console.error("Error en findCompanyByName:", error);
    return null;
  }
}