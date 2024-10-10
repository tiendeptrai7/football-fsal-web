import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import {
  NzUploadFile,
  NzUploadListType,
  NzUploadXHRArgs,
} from 'ng-zorro-antd/upload';
import { Observable, Subscription } from 'rxjs';

import { AzureStorageService } from '../../services/azure-storage.service';

export enum EUploadType {
  image = 'image/png, image/jpeg, image/bmp',
}

@Component({
  selector: 'file-upload',
  templateUrl: './upload.component.html',
})
export class UploadComponent implements OnChanges {
  @Input() value?: string | null;
  @Input() type: EUploadType = EUploadType.image;
  @Input() nzListType: NzUploadListType = 'picture-card';

  @Input() maxSize: number = 0; // In KB - 0 is unlimited
  @Input() isError = false;
  @Input() disabled: boolean = false;
  previewImage: string | undefined = '';
  previewVisible = false;

  fileList: NzUploadFile[] = [];

  constructor(private readonly azureStorageService: AzureStorageService) {}

  ngOnChanges(changes: SimpleChanges): void {
    // console.log({ changes, value: changes['value']?.currentValue });

    if (changes['value']?.currentValue) {
      this.fileList = [
        {
          uid: '-1',
          name: 'image.png',
          status: 'done',
          url: this.azureStorageService.getFileUrl(
            changes['value'].currentValue
          ),
        },
      ];
    }
  }

  dummyRequest(item: NzUploadXHRArgs): Subscription {
    return new Observable(observer => {
      setTimeout(() => {
        observer.next('ok');
        observer.complete();
      }, 200);
    }).subscribe(value => {
      item.onSuccess?.(value, item.file, null);
    });
  }

  handlePreview = async (file: NzUploadFile): Promise<void> => {
    console.log(file);

    if (!file.url && !file['preview']) {
      file['preview'] = await this.azureStorageService.getFileAsBase64(
        file.originFileObj!
      );
    }
    this.previewImage = file.url || file['preview'];
    this.previewVisible = true;
  };

  async uploadImage(): Promise<string | void> {
    if (this.fileList[0]) {
      if (this.fileList[0].originFileObj) {
        return await this.azureStorageService.uploadFileSync(
          this.fileList[0].originFileObj as File
        );
      }
      return this.fileList[0].url;
    }
  }
}
