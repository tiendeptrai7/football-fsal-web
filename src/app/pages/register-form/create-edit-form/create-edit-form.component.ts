import { Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { cloneDeep, merge } from 'lodash';

import { AppBaseComponent } from '@/app/shared/app.base.component';
import { EStatus } from '@/app/shared/constant/enum';
import { EventFormService } from '@/app/shared/services/event-form.service';
import {
  CreateEventFormDto,
  UpdateEventFormDto,
} from '@/app/shared/types/event-form';
import {
  EventFormDetailDto,
  UpSertEventFormDetailDto,
} from '@/app/shared/types/event-form-detail';
import { omitObjectDeep } from '@/app/shared/utils/common-helper';

const DEFAULT_FORM = [
  {
    content: 'Số điện thoại Zalo',
    is_required: 1,
    type: 'default',
    format: 'phone',
    event_form_options: [],
  },
];

@Component({
  selector: 'app-create-edit-form',
  templateUrl: './create-edit-form.component.html',
})
export class CreateEditFormComponent
  extends AppBaseComponent
  implements OnInit
{
  validateForm: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required]],
    consent: ['', [Validators.required]],
    status: [EStatus.active],
    event_form_details: [[...DEFAULT_FORM] as UpSertEventFormDetailDto[]],
  });

  saveLoading: boolean = false;
  isVisibleQuestionModal: boolean = false;

  questionEdit: { index: number; question: EventFormDetailDto } | null = null;

  constructor(
    injector: Injector,
    private readonly formBuilder: FormBuilder,
    private readonly eventFormService: EventFormService
  ) {
    super(injector);
  }

  get id(): number {
    return this.getRouteParam('id') as number;
  }

  get event_form_details(): UpSertEventFormDetailDto[] {
    return this.validateForm.get('event_form_details')?.value;
  }

  ngOnInit(): void {
    if (this.id) {
      this.eventFormService.getById(this.id).subscribe({
        next: response => {
          this.validateForm.patchValue(response);
        },
      });
    }
  }

  goBack(): void {
    this.redirect('/event-forms');
  }

  async save(): Promise<void> {
    this.saveLoading = true;

    if (this.validateForm.valid) {
      const body = {
        id: this.id,
        ...this.validateForm.getRawValue(),
        status: this.validateForm.value.status
          ? EStatus.active
          : EStatus.inactive,
      };

      this._handleSubmitForm(body, this.id);
    } else {
      this.saveLoading = false;
      this.validateFormGroup(this.validateForm);
    }
  }

  disableDefaultQuestion(name: string): boolean {
    return ['phone'].includes(name);
  }

  addQuestion(): void {
    this.isVisibleQuestionModal = true;
  }

  copyQuestion(index: number): void {
    const question = cloneDeep(this.event_form_details?.[index]);

    this.event_form_details.splice(
      index + 1,
      0,
      omitObjectDeep(question, ['id', 'event_form_detail_id'])
    );
  }

  editQuestion(index: number): void {
    if (this.event_form_details.length) {
      this.questionEdit = {
        index: index,
        question: this.event_form_details?.[index] as EventFormDetailDto,
      };
      this.isVisibleQuestionModal = true;
    }
  }

  deleteQuestion(index: number): void {
    this.event_form_details.splice(index, 1);
  }

  moveUp(index: number): void {
    if (index <= 0) return;

    const _event_form_details = cloneDeep(this.event_form_details);

    [_event_form_details[index - 1], _event_form_details[index]] = [
      _event_form_details[index],
      _event_form_details[index - 1],
    ];

    this.validateForm.get('event_form_details')?.setValue(_event_form_details);
    return;
  }

  moveDown(index: number): void {
    if (index >= this.event_form_details.length - 1) return;

    const _event_form_details = cloneDeep(this.event_form_details);

    [_event_form_details[index + 1], _event_form_details[index]] = [
      _event_form_details[index],
      _event_form_details[index + 1],
    ];

    this.validateForm.get('event_form_details')?.setValue(_event_form_details);
    return;
  }

  handleCancelModal(isVisible: boolean) {
    this.isVisibleQuestionModal = isVisible;

    if (this.questionEdit) this.questionEdit = null;
  }

  handleSubmitQuestion(value: UpSertEventFormDetailDto): void {
    if (this.questionEdit) {
      const event_form_detail = this.event_form_details?.[
        this.questionEdit.index
      ] as UpSertEventFormDetailDto;

      merge(event_form_detail, value);

      this.questionEdit = null;
      return;
    }

    const event_form_detail = value;

    this.event_form_details.push(event_form_detail);
  }

  private _handleSubmitForm(
    body: CreateEventFormDto | UpdateEventFormDto,
    id?: number
  ): void {
    if (id && !this.router.url.includes('/clone')) {
      this.eventFormService.update(<UpdateEventFormDto>body).subscribe({
        next: () => {
          this.saveLoading = false;
          this.msgService.success('The event  has been changed successfully');
          this.goBack();
        },
        error: () => {
          this.saveLoading = false;
        },
      });
    } else {
      this.eventFormService
        .create(
          <CreateEventFormDto>(
            omitObjectDeep(body, ['id', 'event_form_detail_id'])
          )
        )
        .subscribe({
          next: () => {
            this.saveLoading = false;
            this.msgService.success(
              'The new event  has been created successfully'
            );
            this.goBack();
          },
          error: () => {
            this.saveLoading = false;
          },
        });
    }
  }
}
