import { NextRequest, NextResponse } from 'next/server';
import {
  BlobServiceClient,
  StorageSharedKeyCredential,
  BlobSASPermissions,
} from '@azure/storage-blob';

const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
const containerName = 'cloudperformance-blob-container1';

const sharedKeyCredential = new StorageSharedKeyCredential(
  accountName,
  accountKey
);

const blobServiceClient = new BlobServiceClient(
  `https://${accountName}.blob.core.windows.net`,
  sharedKeyCredential
);

export async function GET(req: NextRequest) {
  const searchparams = req.nextUrl.searchParams;
  const file = searchparams.get('file')
  if (!file) {
    return res.status(400).json({ error: 'No se especificó el archivo' });
  }

  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blobClient = containerClient.getBlobClient(file);

  const sasToken = await blobClient.generateSasUrl({
    permissions: BlobSASPermissions.parse('r'),
    expiresOn: new Date(new Date().valueOf() + 3600 * 1000), // 1 HR
  });

  return NextResponse.json({
    ok: true,
    url: sasToken,
    message: 'Archivo obtenido correctamente',
  });
}
