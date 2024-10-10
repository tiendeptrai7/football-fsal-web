import { Injectable } from '@angular/core';
import {
  BlobServiceClient,
  BlockBlobClient,
  ContainerClient,
} from '@azure/storage-blob';
import dayjs from 'dayjs';
import slugify from 'slugify';

import { environment } from '@/environments/environment';

import { downloadFileFromBlob } from '../utils/common-helper';

@Injectable({
  providedIn: 'root',
})
export class AzureStorageService {
  private readonly sasConnectionString =
    environment.azure.sas_connection_string;
  private readonly containerName = environment.azure.container_name;
  private readonly chunkSize = 4 * 1024 * 1024; // 4 MB

  private readonly blobServiceClient: BlobServiceClient;
  private readonly containerClient: ContainerClient;

  constructor() {
    this.blobServiceClient = BlobServiceClient.fromConnectionString(
      this.sasConnectionString
    );
    this.containerClient = this.blobServiceClient.getContainerClient(
      this.containerName
    );
  }

  async uploadFileSync(file: File): Promise<string> {
    try {
      const key = this._getFileKey(file);

      if (file.size <= this.chunkSize) {
        await this._uploadFile(file, key);
      } else {
        await this._uploadFileInChunks(file, key);
      }

      return key;
    } catch (error) {
      console.error('Error uploading file to Azure:', error);
      throw error;
    }
  }

  async downloadFile(key: string, name: string) {
    const blobClient = this.containerClient.getBlobClient(key);
    const downloadBlockBlobResponse = await blobClient.download();
    const blob = await downloadBlockBlobResponse.blobBody;
    if (!blob) return;
    downloadFileFromBlob(blob, name);
  }

  getFileUrl(key?: string): string | undefined {
    if (!key || !key?.trim().length) {
      return;
    }

    if (key.startsWith('http')) {
      return key;
    }

    return `${environment.azure.public_url}/${key}`;
  }

  async getFileAsBase64(file: File): Promise<string | ArrayBuffer | null> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  private async _uploadFile(file: File, key: string): Promise<void> {
    const blockBlobClient: BlockBlobClient =
      this.containerClient.getBlockBlobClient(key);

    await blockBlobClient.uploadBrowserData(file, {
      blobHTTPHeaders: { blobContentType: file.type },
    });
  }

  private async _uploadFileInChunks(file: File, key: string): Promise<void> {
    const blockBlobClient: BlockBlobClient =
      this.containerClient.getBlockBlobClient(key);

    const blockIds = [];
    const fileSize = file.size;
    let offset = 0;

    while (offset < fileSize) {
      const chunk = file.slice(offset, offset + this.chunkSize);
      const blockId = this.getBlockId(offset);
      blockIds.push(blockId);

      await blockBlobClient.stageBlock(blockId, chunk, chunk.size);
      offset += this.chunkSize;
    }

    await blockBlobClient.commitBlockList(blockIds, {
      blobHTTPHeaders: { blobContentType: file.type },
    });
  }

  private getBlockId(index: number): string {
    return btoa(index.toString().padStart(48, '0'));
  }

  private _getFileKey(file: File): string {
    const folder = file.type.split('/')[0] + 's';
    const fileName = slugify(file.name, {
      remove: /[*+~()'"!:@]/g,
    });
    const now = Date.now();

    return `/${folder}/${dayjs().format('YYYY/MM/DD')}/${now}_${fileName}`;
  }
}
