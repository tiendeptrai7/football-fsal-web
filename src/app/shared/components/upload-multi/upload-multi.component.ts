import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  NzUploadFile,
  NzUploadListType,
  NzUploadXHRArgs,
} from 'ng-zorro-antd/upload';
import { Observable, Subscription } from 'rxjs';

import { AzureStorageService } from '../../services/azure-storage.service';

export enum EUploadType {
  image = 'image/png, image/jpeg',
}

@Component({
  selector: 'file-upload-multi',
  templateUrl: './upload-multi.component.html',
})
export class UploadMultiComponent implements OnChanges {
  @Input() value?: string[] | null;
  @Input() type = '-';
  @Input() nzListType: NzUploadListType = 'picture';

  @Input() maxSize: number = 0;
  @Input() isError: boolean = false;
  @Input() isDisable: boolean = false;
  preview: string | undefined = '';
  previewVisible = false;

  fileList: NzUploadFile[] = [];

  constructor(
    private readonly azureStorageService: AzureStorageService,
    private readonly cd: ChangeDetectorRef
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value'].currentValue) {
      for (let i = 0; i < changes['value'].currentValue.length; i++) {
        const el = changes['value'].currentValue[i];
        this.fileList.push({
          uid: `${i + 1}`,
          name: el.split('/').pop(),
          status: 'done',
          url: this.azureStorageService.getFileUrl(el),
        });
      }
      this.fileList = [...this.fileList];
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
    if (!file.url && !file['preview']) {
      file['preview'] = await this.azureStorageService.getFileAsBase64(
        file.originFileObj!
      );
    }
    this.preview = file.url || file['preview'];
    this.previewVisible = true;
  };

  async uploadFiles(): Promise<string[]> {
    if (!this.fileList.length) {
      return [];
    }

    const oldFileUrls = this.getOldFileUrls();

    const uploadPromises = this.getUploadPromises();

    const uploadedFileUrls = await Promise.all(uploadPromises);
    return oldFileUrls.concat(uploadedFileUrls);
  }

  private getOldFileUrls(): string[] {
    return this.fileList
      .filter(file => !file.originFileObj)
      .map(file => this.removeDomain(file.url as string));
  }

  private getUploadPromises(): Promise<string>[] {
    return this.fileList
      .filter(file => file.originFileObj)
      .map(({ originFileObj }) =>
        this.azureStorageService.uploadFileSync(originFileObj as File)
      );
  }

  private removeDomain(url: string): string {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.pathname;
    } catch (e) {
      return url;
    }
  }
}
