import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import dayjs from 'dayjs';
import { find, isEmpty, omit } from 'lodash';
import { map, Subscription } from 'rxjs';

import { AppBaseComponent } from '@/app/shared/app.base.component';
import {
  LazySelectDataSource,
  SelectOption,
} from '@/app/shared/components/lazy-select/lazy-select.component';
import { QUESTION_TYPE_OPTIONS } from '@/app/shared/constant/constant';
import { EQuestionType, EStatus } from '@/app/shared/constant/enum';
import { EventService } from '@/app/shared/services/event.service';
import { SurveyService } from '@/app/shared/services/survey.service';
import { EventDto } from '@/app/shared/types/event';
import {
  CreateFormQuestionDto,
  UpdateFormQuestionDto,
} from '@/app/shared/types/form-question';
import {
  CreateQuestionDto,
  QuestionDto,
  UpdateQuestionDto,
} from '@/app/shared/types/question';
import {
  CreateSurveyDto,
  QuerySurveyDto,
  UpdateSurveyDto,
} from '@/app/shared/types/survey';

@Component({
  selector: 'app-create-edit-survey',
  templateUrl: './create-edit-survey.component.html',
})
export class CreateEditSurveyComponent
  extends AppBaseComponent
  implements OnInit, OnDestroy
{
  get isCopy(): boolean {
    return this.router.url.includes('copy');
  }

  validateForm: FormGroup = this.formBuilder.group({
    event_id: [
      { value: null as number | null, disabled: false },
      [Validators.required],
    ],
    name: [{ value: '', disabled: false }, [Validators.required]],
    status: [EStatus.active],
    started_at: [null as Date | null, [Validators.required]],
    ended_at: [null as Date | null, [Validators.required]],
    form_questions: [[] as CreateFormQuestionDto[] | UpdateFormQuestionDto[]],
  });

  events: EventDto[] = [];
  questionEdit: { index: number; question: QuestionDto } | null = null;

  isVisibleQuestionModal: boolean = false;

  lazyEventSource!: LazySelectDataSource;

  private subscription: Subscription[] = [];

  constructor(
    injector: Injector,
    private readonly formBuilder: FormBuilder,
    private readonly eventService: EventService,
    private readonly surveyService: SurveyService
  ) {
    super(injector);
  }

  ngOnInit(): void {
    if (this.id) {
      this.surveyService.getById(this.id).subscribe({
        next: data => {
          if (this.isCopy) {
            return this.validateForm.patchValue(omit(data, 'id'));
          }
          this.validateForm.patchValue(data);
        },
      });
    }

    this.lazyEventSource = (params: QuerySurveyDto) => {
      const _params: QuerySurveyDto = {
        ...params,
        status: EStatus.active,
      };

      return this.eventService.getByPaged(_params).pipe(
        map(data => {
          const listData = data.data;

          this.events = [...this.events, ...listData];

          return listData.map(event => ({
            label: `${event.name} (${dayjs(event?.started_at).format('HH:mm DD/MM/YYYY')} - ${dayjs(event?.ended_at).format('HH:mm DD/MM/YYYY')})`,
            value: event.id,
          })) as SelectOption[];
        })
      );
    };
  }

  ngOnDestroy(): void {
    if (!isEmpty(this.subscription))
      this.subscription.forEach(value => value.unsubscribe);
  }

  get id(): number {
    return parseInt(this.getRouteParam('id'));
  }

  get selectedEvent(): EventDto | null {
    if (this.validateForm.get('event_id')?.value) {
      return find(this.events, {
        id: this.validateForm.get('event_id')?.value,
      }) as EventDto;
    }

    return null;
  }

  get formQuestions(): CreateFormQuestionDto[] | UpdateFormQuestionDto[] {
    return this.validateForm.get('form_questions')?.value;
  }

  goBack(): void {
    this.redirect('/surveys');
  }

  async save(): Promise<void> {
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
      this.validateFormGroup(this.validateForm);
    }
  }

  getNameByValue(value: EQuestionType): string | undefined {
    const option = QUESTION_TYPE_OPTIONS.find(option => option.value === value);
    return option ? option.name : undefined;
  }

  addQuestion(): void {
    this.isVisibleQuestionModal = true;
  }

  editQuestion(index: number): void {
    if (this.formQuestions.length) {
      this.questionEdit = {
        index: index,
        question: this.formQuestions?.[index]?.question as QuestionDto,
      };
      this.isVisibleQuestionModal = true;
    }
  }

  deleteQuestion(index: number): void {
    this.formQuestions.splice(index, 1);
  }

  handleSubmitQuestion(value: CreateQuestionDto | UpdateQuestionDto): void {
    if (this.questionEdit) {
      const _formQuestion = this.formQuestions?.[
        this.questionEdit.index
      ] as UpdateFormQuestionDto;

      _formQuestion.question = value as UpdateQuestionDto;
    } else {
      const _formQuestion: CreateFormQuestionDto = {
        question: value as CreateQuestionDto,
      };
      this.validateForm.get('form_questions')?.value.push(_formQuestion);
    }
  }

  private _handleSubmitForm(
    body: CreateSurveyDto | UpdateSurveyDto,
    id?: number
  ): void {
    if (id) {
      if (this.isCopy) {
        this.surveyService.create(<CreateSurveyDto>body).subscribe(() => {
          this.msgService.success(
            'The new survey has been copied successfully'
          );
          this.goBack();
        });
      } else {
        this.surveyService.update(<UpdateSurveyDto>body).subscribe(() => {
          this.msgService.success('The survey has been changed successfully');
          this.goBack();
        });
      }
    } else {
      this.surveyService.create(<CreateSurveyDto>body).subscribe(() => {
        this.msgService.success('The new survey has been created successfully');
        this.goBack();
      });
    }
  }
}
