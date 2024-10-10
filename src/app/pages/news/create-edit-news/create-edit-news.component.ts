import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import dayjs from 'dayjs';
import { AppBaseComponent } from 'src/app/shared/app.base.component';

import { UploadComponent } from '@/app/shared/components/upload/upload.component';
import { EStatus } from '@/app/shared/constant/enum';
import { NewsService } from '@/app/shared/services/news.service';
import { CreateNews, EditNews } from '@/app/shared/types/news';

@Component({
  templateUrl: './create-edit-news.component.html',
})
export class CreateEditNewsComponent
  extends AppBaseComponent
  implements OnInit
{
  validateForm = this.formBuilder.group({
    title: ['', [Validators.required]],
    thumbnail: ['', [Validators.required]],
    content: ['', [Validators.required]],
    status: [EStatus.active],
    published_at: [null as Date | null, [Validators.required]],
  });

  @ViewChild('imageUpload') imageUpload?: UploadComponent;

  constructor(
    injector: Injector,
    private readonly formBuilder: FormBuilder,
    private readonly newsService: NewsService
  ) {
    super(injector);
  }

  ngOnInit(): void {
    if (this.id) {
      this.newsService.getById(this.id).subscribe({
        next: response => {
          this.validateForm.patchValue(response);

          if (
            dayjs().isAfter(response.published_at) &&
            response.status !== EStatus.inactive
          ) {
            this.validateForm.disable();
          }
        },
      });
    }
  }

  get id(): number {
    return this.getRouteParam('id') as number;
  }

  goBack() {
    this.redirect('/news');
  }

  async save() {
    const url = await this.imageUpload?.uploadImage();

    this.validateForm.patchValue({
      thumbnail: url || '',
    });

    if (this.validateForm.valid) {
      const body = {
        id: this.id,
        ...this.validateForm.getRawValue(),
        status: this.validateForm.value.status
          ? EStatus.active
          : EStatus.inactive,
      } as unknown as CreateNews as EditNews;

      this._handleSubmitForm(body, this.id);
    } else {
      this.validateFormGroup(this.validateForm);
    }
  }

  private _handleSubmitForm(body: CreateNews | EditNews, id?: number): void {
    if (id) {
      this.newsService.update(<EditNews>body).subscribe(() => {
        this.msgService.success('Update news successfully !');
        this.goBack();
      });
    } else {
      this.newsService.create(<CreateNews>body).subscribe(() => {
        this.msgService.success('Create news successfully !');
        this.goBack();
      });
    }
  }
}
