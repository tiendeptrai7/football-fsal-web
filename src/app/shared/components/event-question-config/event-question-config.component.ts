import {
  Component,
  EventEmitter,
  Injector,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AppBaseComponent } from '../../app.base.component';
import {
  CUSTOM_FORMAT_EVENT_FORM_OPTION,
  DEFAULT_FORMAT_EVENT_FORM_OPTION,
} from '../../constant/constant';
import {
  EEventFormDetailFormat,
  EEventFormDetailType,
  EStatus,
} from '../../constant/enum';
import {
  EventFormDetailDto,
  UpSertEventFormDetailDto,
} from '../../types/event-form-detail';
import { EnumSelectOption, enumToOption } from '../../utils/common-helper';
import { SelectOption } from '../lazy-select/lazy-select.component';

@Component({
  selector: 'app-event-question-config',
  templateUrl: './event-question-config.component.html',
})
export class EventQuestionConfigComponent
  extends AppBaseComponent
  implements OnInit
{
  @Input() title: string = 'Event Question Config';
  @Input() value?: EventFormDetailDto;
  @Input() isVisible: boolean = false;

  @Output() isVisibleChange: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  @Output() submitQuestion: EventEmitter<UpSertEventFormDetailDto> =
    new EventEmitter<UpSertEventFormDetailDto>();

  EEventFormDetailFormat = EEventFormDetailFormat;

  typeOptions: EnumSelectOption<typeof EEventFormDetailType>[] =
    enumToOption(EEventFormDetailType);

  defaultTypeOptions = DEFAULT_FORMAT_EVENT_FORM_OPTION;
  customTypeOptions = CUSTOM_FORMAT_EVENT_FORM_OPTION;

  validateForm: FormGroup = this.formBuilder.group({
    content: ['', [Validators.required]],
    is_required: [EStatus.active],
    type: [EEventFormDetailType.custom],
    format: [null as EEventFormDetailFormat | null, [Validators.required]],
    event_form_options: this.formBuilder.array([]),
  });

  constructor(
    injector: Injector,
    private readonly formBuilder: FormBuilder
  ) {
    super(injector);
  }

  ngOnInit(): void {
    if (this.value) {
      this.validateForm.patchValue(this.value);

      for (const option of this.value.event_form_options) {
        const _newForm = this.createFormOption();
        _newForm.patchValue(option);
        this.formOptions.push(_newForm);
      }
    }
  }

  get formatOptions(): SelectOption[] {
    return this.validateForm.get('type')?.value === EEventFormDetailType.default
      ? this.defaultTypeOptions
      : this.customTypeOptions;
  }

  get formOptions(): FormArray {
    return this.validateForm.get('event_form_options') as FormArray;
  }

  hasChoiceOption(format: EEventFormDetailFormat): boolean {
    return [
      EEventFormDetailFormat.single_choice,
      EEventFormDetailFormat.multiple_choice,
      EEventFormDetailFormat.dropdown,
    ].includes(format);
  }

  handleCancel(): void {
    this.isVisible = false;
    this.isVisibleChange.emit(this.isVisible);
  }

  handleOk(): void {
    if (this.validateForm.valid) {
      const { format, event_form_options } = this.validateForm.value;

      if (this.hasChoiceOption(format) && event_form_options.length <= 0)
        this.msgService.error(
          'This format of question must have at least 1 option'
        );

      const data = {
        ...this.validateForm.getRawValue(),
        is_required: this.validateForm.value.is_required
          ? EStatus.active
          : EStatus.inactive,
      };

      this.submitQuestion.emit(data);
      this.handleCancel();
    } else {
      this.validateFormGroup(this.validateForm);
    }
  }

  handleChangeType(): void {
    this.validateForm.get('format')?.setValue(null);
  }

  handleChangeFormat(value: EEventFormDetailFormat): void {
    if (this.clearOptions(value)) {
      this.formOptions.clear();
    }
  }

  createFormOption(): FormGroup {
    return this.formBuilder.group({
      id: [null as number | null],
      content: ['', [Validators.required]],
      require_input: [EStatus.inactive],
    });
  }

  addFormOption(): void {
    this.formOptions.push(this.createFormOption());
  }

  removeFormOption(index: number): void {
    this.formOptions.removeAt(index);
  }

  toggleStatus(status: EStatus): EStatus {
    return status === EStatus.active ? EStatus.inactive : EStatus.active;
  }

  onChangeRequireInput(index: number): void {
    this.formOptions.controls.forEach((group, i) => {
      if (i === index) {
        const currentValue = group.value.require_input;

        group.patchValue({
          require_input: this.toggleStatus(currentValue),
        });
      } else {
        group.patchValue({
          require_input: EStatus.inactive,
        });
      }
    });
  }

  clearOptions(format: EEventFormDetailFormat): boolean {
    return [
      EEventFormDetailFormat.percentage,
      EEventFormDetailFormat.text,
    ].includes(format);
  }
}
