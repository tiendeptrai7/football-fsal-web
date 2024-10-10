import {
  Component,
  Injector,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import dayjs from 'dayjs';
import { find, isEmpty } from 'lodash';
import { map, Subscription } from 'rxjs';

import { AppBaseComponent } from '@/app/shared/app.base.component';
import {
  LazySelectDataSource,
  SelectOption,
} from '@/app/shared/components/lazy-select/lazy-select.component';
import { UploadMultiComponent } from '@/app/shared/components/upload-multi/upload-multi.component';
import { QUESTION_TYPE_OPTIONS } from '@/app/shared/constant/constant';
import {
  EQuestionType,
  EStatus,
  EUploadType,
} from '@/app/shared/constant/enum';
import { EventService } from '@/app/shared/services/event.service';
import { FeedbackService } from '@/app/shared/services/feedback.service';
import { EventDto } from '@/app/shared/types/event';
import {
  CreateFeedbackDto,
  QueryFeedbackDto,
  UpdateFeedbackDto,
} from '@/app/shared/types/feedback';
import {
  CreateFeedbackDocumentDto,
  UpdateFeedbackDocumentDto,
} from '@/app/shared/types/feedback-document';
import {
  CreateFormQuestionDto,
  UpdateFormQuestionDto,
} from '@/app/shared/types/form-question';
import {
  CreateQuestionDto,
  QuestionDto,
  UpdateQuestionDto,
} from '@/app/shared/types/question';

@Component({
  selector: 'app-create-edit-feedback',
  templateUrl: './create-edit-feedback.component.html',
})
export class CreateEditFeedbackComponent
  extends AppBaseComponent
  implements OnInit, OnDestroy
{
  uploadType: string = EUploadType.document;

  validateForm: FormGroup = this.formBuilder.group({
    event_id: [
      { value: null as number | null, disabled: false },
      [Validators.required],
    ],
    name: [{ value: '', disabled: false }, [Validators.required]],
    status: [EStatus.active],
    feedback_days_before: [{ value: null as number | null, disabled: true }],
    feedback_expire_days: [{ value: null as number | null, disabled: true }],
    feedback_send_at: [
      { value: null as Date | null, disabled: true },
      [Validators.required],
    ],
    feedback_expire_at: [
      { value: null as Date | null, disabled: true },
      [Validators.required],
    ],
    feedback_documents: [
      [] as CreateFeedbackDocumentDto[] | UpdateFeedbackDocumentDto[],
    ],
    form_questions: [[] as CreateFormQuestionDto[] | UpdateFormQuestionDto[]],
    documents_urls: [[]],
  });

  events: EventDto[] = [];
  questionEdit: { index: number; question: QuestionDto } | null = null;

  isDisable: boolean = false;
  saveLoading: boolean = false;
  isVisibleQuestionModal: boolean = false;

  lazyEventSource!: LazySelectDataSource;

  private subscription: Subscription[] = [];

  @ViewChild('documentsUpload') imageUpload?: UploadMultiComponent;

  constructor(
    injector: Injector,
    private readonly formBuilder: FormBuilder,
    private readonly eventService: EventService,
    private readonly feedbackService: FeedbackService
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.setupControlSubscription();

    if (this.id) {
      this.feedbackService.getById(this.id).subscribe({
        next: data => {
          this.validateForm.patchValue(data);

          this.validateForm.patchValue({
            documents_urls: data.feedback_documents.map(doc => doc.url),
          });

          this.disableForm();
        },
      });
    } else {
      this.disableForm();
    }

    this.lazyEventSource = (params: QueryFeedbackDto) => {
      const _params: QueryFeedbackDto = {
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
    this.redirect('/feedbacks');
  }

  async save(): Promise<void> {
    this.saveLoading = true;
    const urls = await this.imageUpload?.uploadFiles();

    const feedback_documents = this.mergeDocuments(
      this.validateForm.value.feedback_documents,
      urls || []
    );

    this.validateForm.patchValue({
      feedback_documents,
    });

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

  handleCloseQuestionModal(isVisible: boolean) {
    this.isVisibleQuestionModal = isVisible;

    if (this.questionEdit) this.questionEdit = null;
  }

  handleSubmitQuestion(value: CreateQuestionDto | UpdateQuestionDto): void {
    if (this.questionEdit) {
      const _formQuestion = this.formQuestions?.[
        this.questionEdit.index
      ] as UpdateFormQuestionDto;

      _formQuestion.question = value as UpdateQuestionDto;
      this.questionEdit = null;
    } else {
      const _formQuestion: CreateFormQuestionDto = {
        question: value as CreateQuestionDto,
      };
      this.validateForm.get('form_questions')?.value.push(_formQuestion);
    }
  }

  onBlurSendTimeSetting(): void {
    const feedback_days_before = this.validateForm.get(
      'feedback_days_before'
    )?.value;
    if (feedback_days_before) {
      const event = find(this.events, {
        id: this.validateForm.get('event_id')?.value,
      }) as EventDto;
      const startEventDate = dayjs(event?.started_at);

      this.validateForm.patchValue({
        feedback_send_at: startEventDate
          .add(feedback_days_before, 'days')
          .toDate(),
      });
    }
  }

  onBlurSendTimeAt(panelStatus: boolean): void {
    const feedback_send_at = this.validateForm.get('feedback_send_at')?.value;
    if (feedback_send_at && !panelStatus) {
      const event = find(this.events, {
        id: this.validateForm.get('event_id')?.value,
      }) as EventDto;
      const startEventDate = dayjs(event?.started_at);
      const feedbackSendDate = dayjs(feedback_send_at);

      const feedback_days_before$ = feedbackSendDate.diff(
        startEventDate,
        'days'
      );

      if (!feedback_days_before$) {
        this.validateForm.patchValue({
          feedback_days_before: feedback_days_before$ + 1,
          feedback_send_at: feedbackSendDate
            .add(feedback_days_before$ + 1, 'days')
            .toDate(),
        });
      } else {
        this.validateForm.patchValue({
          feedback_days_before: feedback_days_before$,
        });
      }
    }
  }

  onBlurExpiredTimeSetting(): void {
    const feedback_expire_days = this.validateForm.get(
      'feedback_expire_days'
    )?.value;
    if (feedback_expire_days) {
      const feedbackSendDate = dayjs(
        this.validateForm.get('feedback_send_at')?.value
      );

      this.validateForm.patchValue({
        feedback_expire_at: feedbackSendDate
          .add(feedback_expire_days, 'days')
          .toDate(),
      });
    }
  }

  onBlurExpiredTimeAt(panelStatus: boolean): void {
    const feedback_expire_at =
      this.validateForm.get('feedback_expire_at')?.value;
    if (feedback_expire_at && !panelStatus) {
      const feedbackSendDate = dayjs(
        this.validateForm.get('feedback_send_at')?.value
      );
      const feedbackExpireDate = dayjs(feedback_expire_at);

      const feedback_expire_day$ = feedbackExpireDate.diff(
        feedbackSendDate,
        'days'
      );

      if (!feedback_expire_day$) {
        this.validateForm.patchValue({
          feedback_expire_days: feedback_expire_day$ + 1,
          feedback_expire_at: feedbackExpireDate
            .add(feedback_expire_day$ + 1, 'days')
            .toDate(),
        });
      } else {
        this.validateForm.patchValue({
          feedback_expire_days: feedback_expire_day$,
        });
      }
    }
  }

  private disableForm(): void {
    if (
      this.id &&
      dayjs().isAfter(this.validateForm.get('feedback_send_at')?.value)
    ) {
      this.validateForm.disable();
      this.isDisable = true;
    }
  }

  private setupControlSubscription(): void {
    const eventSubscription = this.validateForm
      .get('event_id')
      ?.valueChanges.subscribe(value => {
        if (value) {
          this.validateForm.get('feedback_days_before')?.enable();
          this.validateForm.get('feedback_send_at')?.enable();
        }
      });

    const feedbackSendAtSubscription = this.validateForm
      .get('feedback_send_at')
      ?.valueChanges.subscribe(value => {
        if (value) {
          this.validateForm.get('feedback_expire_days')?.enable();
          this.validateForm.get('feedback_expire_at')?.enable();
        }
      });

    if (eventSubscription) this.subscription.push(eventSubscription);
    if (feedbackSendAtSubscription)
      this.subscription.push(feedbackSendAtSubscription);
  }

  private mergeDocuments(
    existingDocuments: UpdateFeedbackDocumentDto[],
    updatedDocuments: string[]
  ): UpdateFeedbackDocumentDto[] {
    const existingMap = new Map<string, UpdateFeedbackDocumentDto>();
    existingDocuments.forEach(doc => {
      existingMap.set(doc?.url || '', doc);
    });

    const mergedDocuments: UpdateFeedbackDocumentDto[] = [];

    updatedDocuments.forEach(url => {
      if (existingMap.has(url)) {
        const existingDoc = existingMap.get(url)!;
        mergedDocuments.push(existingDoc);
        existingMap.delete(url);
      } else {
        mergedDocuments.push({ url });
      }
    });

    return mergedDocuments;
  }

  private _handleSubmitForm(
    body: CreateFeedbackDto | UpdateFeedbackDto,
    id?: number
  ): void {
    if (id) {
      this.feedbackService.update(<UpdateFeedbackDto>body).subscribe({
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
      this.feedbackService.create(<CreateFeedbackDto>body).subscribe({
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
