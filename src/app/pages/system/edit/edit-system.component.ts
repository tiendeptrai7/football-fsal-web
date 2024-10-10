import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SystemService } from '@services/system.service';
import { EStatus, ESystemType } from '@shared/constant/enum';
import { UpdateSystem } from '@shared/types/setting';
import { AppBaseComponent } from 'src/app/shared/app.base.component';

import { UploadComponent } from '@/app/shared/components/upload/upload.component';

@Component({
  templateUrl: './edit-system.component.html',
})
export class EditSystemComponent extends AppBaseComponent implements OnInit {
  get id(): number {
    return parseInt(this.getRouteParam('id'));
  }

  validateForm = this.formBuilder.group({
    id: [this.id],
    key: [{ value: '', disabled: true }, [Validators.required]],
    name: [{ value: '', disabled: true }, [Validators.required]],
    value: ['', [Validators.required]],
    unit: [0, [Validators.required]],
    group: [{ value: '', disabled: true }, [Validators.required]],
    is_public: [true],
    status: [true],
  });

  passwordVisible = false;
  unit = ESystemType.text;
  protected readonly ESystemType = ESystemType;

  @ViewChild('imageUpload') imageUpload?: UploadComponent;

  constructor(
    injector: Injector,
    private readonly formBuilder: FormBuilder,
    private readonly systemService: SystemService
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.systemService.getById(this.id).subscribe(data => {
      this.unit = data.unit;
      this.validateForm.patchValue({
        key: data.key,
        name: data.name,
        value: data.value,
        unit: data.unit,
        group: data.group,
        is_public: data.is_public === EStatus.active,
        status: data.status === EStatus.active,
      });
    });
  }

  goBack() {
    this.redirect('../../');
  }

  async save() {
    if (this.unit === ESystemType.file) {
      const url = await this.imageUpload?.uploadImage();

      this.validateForm.patchValue({
        value: url || '',
      });
    }

    if (this.validateForm.valid) {
      const body: UpdateSystem = {
        id: this.id,
        value: this.validateForm.value.value?.toString(),
        is_public: this.validateForm.value.is_public
          ? EStatus.active
          : EStatus.inactive,
        status: this.validateForm.value.status
          ? EStatus.active
          : EStatus.inactive,
      };

      this.systemService.update(body).subscribe(() => {
        this.msgService.success('Update successful!');
        this.goBack();
      });
    } else {
      this.validateFormGroup(this.validateForm);
    }
  }
}
