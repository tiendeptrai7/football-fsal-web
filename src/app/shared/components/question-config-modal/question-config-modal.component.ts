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
import { QUESTION_TYPE_OPTIONS } from '../../constant/constant';
import { EQuestionType, EStatus } from '../../constant/enum';
import {
  CreateQuestionDto,
  QuestionDto,
  UpdateQuestionDto,
} from '../../types/question';

@Component({
  selector: 'app-question-config-modal',
  templateUrl: './question-config-modal.component.html',
})
export class QuestionConfigModalComponent
  extends AppBaseComponent
  implements OnInit
{
  @Input() isVisible: boolean = false;
  @Input() title: string = 'Question';
  @Input() vm!: QuestionDto | null;
  @Output() submitQuestion: EventEmitter<
    CreateQuestionDto | UpdateQuestionDto
  > = new EventEmitter<CreateQuestionDto | UpdateQuestionDto>();
  @Output() isVisibleChange: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  @Output() hideModal = new EventEmitter();
  @Output() addQuestion = new EventEmitter();

  questionTypeOptions = QUESTION_TYPE_OPTIONS;
  EQuestionType = EQuestionType;

  validateForm: FormGroup = this.fb.group({
    content: ['', [Validators.required]],
    is_required: [EStatus.active, [Validators.required]],
    type: [EQuestionType.multi_choice, [Validators.required]],
    answers: this.fb.array([]),
  });

  constructor(
    injector: Injector,
    private readonly fb: FormBuilder
  ) {
    super(injector);
  }

  ngOnInit(): void {
    if (this.vm) {
      this.validateForm.patchValue(this.vm);

      for (const answer of this.vm.answers) {
        const _newForm = this.createItemAnswer();
        _newForm.patchValue(answer);
        this.frmAnswers.push(_newForm);
      }
    }
  }

  get frmAnswers(): FormArray {
    return this.validateForm.get('answers') as FormArray;
  }

  handleCancel(): void {
    this.isVisible = false;
    this.isVisibleChange.emit(this.isVisible);
  }

  handleOk(): void {
    if (this.validateForm.valid) {
      const { type, answers } = this.validateForm.value;

      if (this.isMultipleChoice(type) && answers.length <= 0) {
        this.msgService.error(
          'This type of question must have at least 1 answer'
        );
        return;
      }

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

  isMultipleChoice(type: EQuestionType): boolean {
    return [EQuestionType.multi_choice, EQuestionType.single_choice].includes(
      type
    );
  }

  createItemAnswer(): FormGroup {
    return this.fb.group({
      id: [null],
      content: ['', [Validators.required]],
      require_input: [EStatus.inactive, [Validators.required]],
    });
  }

  deleteItemAnswer(index: number): void {
    this.frmAnswers.removeAt(index);
  }

  addItemAnswer(): void {
    this.frmAnswers.push(this.createItemAnswer());
  }

  onChangeRequireInput(index: number): void {
    const answerFormGroup = this.frmAnswers.at(index) as FormGroup;
    const currentValue = answerFormGroup.value.require_input;

    answerFormGroup.patchValue({
      require_input: this.toggleStatus(currentValue),
    });
  }

  toggleStatus(status: EStatus): EStatus {
    return status === EStatus.active ? EStatus.inactive : EStatus.active;
  }

  onChangeFormat(event: EQuestionType): void {
    if (this.shouldClearAnswers(event)) {
      this.frmAnswers.clear();
    }
  }

  shouldClearAnswers(type: EQuestionType): boolean {
    return [
      EQuestionType.percentage,
      EQuestionType.rating,
      EQuestionType.text,
    ].includes(type);
  }
}
