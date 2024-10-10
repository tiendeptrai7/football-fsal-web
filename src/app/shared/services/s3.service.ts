import { Injectable } from '@angular/core';
import {
  CompletedPart,
  CompleteMultipartUploadCommand,
  CompleteMultipartUploadOutput,
  CompleteMultipartUploadRequest,
  CreateMultipartUploadCommand,
  CreateMultipartUploadRequest,
  GetObjectCommand,
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
  UploadPartCommand,
  UploadPartRequest,
} from '@aws-sdk/client-s3';
import { downloadFileFromBlob } from '@utils/common-helper';
import dayjs from 'dayjs';
import slugify from 'slugify';

import { environment } from '@/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class S3Service {
  private readonly bucketName = environment.s3.bucket;
  private readonly region = environment.s3.region;
  private readonly accessKeyId = environment.s3.access_key;
  private readonly secretAccessKey = environment.s3.access_secret;
  private readonly endPoint = environment.s3.end_point;
  private readonly chunkSize = 5 * 1024 * 1024;

  private readonly s3: S3Client;

  constructor() {
    this.s3 = new S3Client({
      region: this.region,
      endpoint: this.endPoint,
      credentials: {
        accessKeyId: this.accessKeyId,
        secretAccessKey: this.secretAccessKey,
      },
    });
  }

  getFileUrl(key?: string): string | undefined {
    if (!key || !key?.trim().length) {
      return;
    }

    if (key.startsWith('http')) {
      return key;
    }

    return `${environment.s3.public_url}/${key}`;
  }

  async getFile(key?: string): Promise<Uint8Array | undefined> {
    const data = await this.s3.send(
      new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      })
    );

    return data?.Body?.transformToByteArray();
  }

  async getFileAsBase64(file: File): Promise<string | ArrayBuffer | null> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  async uploadFileSync(file: File, isPublic = true): Promise<string> {
    try {
      const key = this._getFileKey(file);

      if (file.size <= this.chunkSize) {
        await this._uploadFile(file, key, isPublic);
      } else {
        const params: CreateMultipartUploadRequest = {
          Bucket: this.bucketName,
          Key: key,
          ContentType: file.type,
        };

        if (isPublic) {
          params.ACL = 'public-read';
        }

        const uploadId = await this.createMultipartUpload(params);

        const parts = await this.uploadMultipartChunks(
          key,
          file,
          uploadId,
          this.chunkSize
        );
        await this.completeMultipartUpload(key, uploadId, parts);
      }

      return key;
    } catch (error) {
      console.error('Error uploading file to S3:', error);
      throw error;
    }
  }

  downloadS3File(key?: string, name?: string): void {
    if (!key || !name) return;
    this.getFile(key).then(data => {
      if (data) {
        downloadFileFromBlob(data, name);
      }
    });
  }

  private async createMultipartUpload(
    params: CreateMultipartUploadRequest
  ): Promise<string> {
    const response = await this.s3.send(
      new CreateMultipartUploadCommand(params)
    );

    return response.UploadId!;
  }

  private async uploadMultipartChunks(
    key: string,
    file: File,
    uploadId: string,
    chunkSize: number
  ): Promise<CompletedPart[]> {
    const parts: CompletedPart[] = [];
    let startPosition = 0;
    let partNumber = 1;

    while (startPosition < file.size) {
      const chunk = file.slice(startPosition, startPosition + chunkSize);
      const part = await this.uploadMultipartChunk(
        key,
        chunk,
        uploadId,
        partNumber
      );

      parts.push(part);
      startPosition += chunkSize;
      partNumber++;
    }

    return parts;
  }

  private async uploadMultipartChunk(
    key: string,
    chunk: Blob,
    uploadId: string,
    partNumber: number
  ): Promise<CompletedPart> {
    const params: UploadPartRequest = {
      Bucket: this.bucketName,
      Key: key,
      PartNumber: partNumber,
      UploadId: uploadId,
      Body: chunk,
    };

    const response = await this.s3.send(new UploadPartCommand(params));

    return { ETag: response.ETag, PartNumber: partNumber };
  }

  private async completeMultipartUpload(
    key: string,
    uploadId: string,
    parts: CompletedPart[]
  ): Promise<CompleteMultipartUploadOutput> {
    const params: CompleteMultipartUploadRequest = {
      Bucket: this.bucketName,
      Key: key,
      UploadId: uploadId,
      MultipartUpload: { Parts: parts },
    };

    return await this.s3.send(new CompleteMultipartUploadCommand(params));
  }

  private async _uploadFile(
    file: File,
    key: string,
    isPublic: boolean
  ): Promise<void> {
    const params: PutObjectCommandInput = {
      Bucket: this.bucketName,
      Key: key,
      Body: file,
    };
    if (isPublic) {
      params.ACL = 'public-read';
    }
    await this.s3.send(new PutObjectCommand(params));
  }

  private _getFileKey(file: File): string {
    const folder = file.type.split('/')[0] + 's';
    const fileName = slugify(file.name, {
      remove: /[*+~()'"!:@]/g,
    });
    const now = Date.now();

    return `${folder}/${dayjs().format('YYYY/MM/DD')}/${now}_${fileName}`;
  }
}
