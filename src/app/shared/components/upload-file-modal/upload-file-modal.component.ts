import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ExportDto } from '@shared/types/base';
import dayjs from 'dayjs';
import { isEmpty } from 'lodash';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadFile, NzUploadXHRArgs } from 'ng-zorro-antd/upload';
import { Observable, Subscription } from 'rxjs';

import { AzureStorageService } from '../../services/azure-storage.service';

export type ImportResultDto = {
  error_key?: string;
  message: string;
};

export type UploadDefaultFile = SampleFile | RefFile;

type SampleFile = {
  type: 'sample';
  key: string;
  name: string;
};

type RefFile = {
  type: 'ref';
  dataSource: Observable<ExportDto>;
  label: string;
  name: string;
};

@Component({
  selector: 'file-upload-modal',
  templateUrl: './upload-file-modal.component.html',
})
export class UploadFileModalComponent {
  @Input() isVisible = false;
  @Output() isVisibleChange: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  @Input() title!: string;

  @Input() defaultFile?: UploadDefaultFile[];
  @Input() errorFileName?: string;
  @Input() import!: (key: string) => Observable<ImportResultDto>;

  @Output() isImportSuccess: EventEmitter<void> = new EventEmitter<void>();

  resultImport?: ImportResultDto;

  fileList: NzUploadFile[] = [];
  isOkLoading = false;

  protected readonly dayjs = dayjs;

  constructor(
    protected readonly azureStorageService: AzureStorageService,
    private readonly messageService: NzMessageService
  ) {}

  get deactiveOk() {
    return isEmpty(this.fileList);
  }

  handleCancel(): void {
    if (this.isOkLoading) {
      this.messageService.warning(
        'The import process is in progress. Please wait a moment.'
      );
      return;
    }
    this.fileList = [];
    this.resultImport = undefined;
    this.isVisibleChange.emit(false);
  }

  dummyRequest(item: NzUploadXHRArgs): Subscription {
    return new Observable(observer => {
      setTimeout(() => {
        observer.next('ok');
        observer.complete();
      }, 200);
    }).subscribe(value => {
      this.resultImport = undefined;
      item.onSuccess?.(value, item.file, null);
    });
  }

  handleOk(): void {
    const file = this.fileList[0].originFileObj;

    if (!file) {
      this.messageService.error('Please select a file');
      return;
    }

    if (!file.name.endsWith('.xlsx')) {
      this.messageService.error('Only .xlsx files are allowed');
      return;
    }

    this.isOkLoading = true;
    this.azureStorageService
      .uploadFileSync(file)
      .then(value => {
        if (value) {
          this.import(value).subscribe({
            next: result => {
              this.resultImport = result;
              this.fileList = [];
              this.isOkLoading = false;
              this.isImportSuccess.emit();
            },
            error: () => {
              this.isOkLoading = false;
            },
          });
        }
      })
      .catch(() => {
        this.isOkLoading = false;
        this.messageService.error(
          'An error occurred during the import process. Please try again!'
        );
      });
  }

  downloadFile(file: RefFile | SampleFile): void {
    if (file.type === 'ref') {
      file.dataSource.subscribe(data => {
        if (data.key) {
          this.downloadS3File(data?.key, file.name);
        }
      });
    } else {
      this.downloadS3File(file.key, file.name);
    }
  }

  downloadS3File(key?: string, name?: string): void {
    if (!key || !name) return;
    this.azureStorageService.downloadFile(key, name).then();
  }
}
