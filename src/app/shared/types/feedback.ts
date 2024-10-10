import { EStatus } from '../constant/enum';
import { BaseModel, BaseQuery } from './base';
import { EventDto } from './event';
import {
  CreateFeedbackDocumentDto,
  FeedbackDocumentDto,
  UpdateFeedbackDocumentDto,
} from './feedback-document';
import {
  CreateFormQuestionDto,
  FormQuestionDto,
  UpdateFormQuestionDto,
} from './form-question';

export type FeedbackDto = BaseModel & {
  name: string;
  code: string;
  feedback_days_before: number;
  feedback_expire_days: number;
  feedback_send_at: Date;
  feedback_expire_at: Date;
  status: EStatus;
  event_id: number;
  event: EventDto;
  feedback_documents: FeedbackDocumentDto[];
  form_questions: FormQuestionDto[];
};

export type CreateFeedbackDto = {
  name: string;
  event_id: number;
  status: EStatus;
  feedback_days_before: number | null;
  feedback_expire_days: number | null;
  feedback_send_at: Date;
  feedback_expire_at: Date;
  feedback_documents: CreateFeedbackDocumentDto[];
  form_questions: CreateFormQuestionDto[];
};

export type UpdateFeedbackDto = Omit<
  Partial<CreateFeedbackDto>,
  'feedback_documents' | 'form_questions'
> & {
  id: number;
  feedback_documents?: UpdateFeedbackDocumentDto[];
  form_questions?: UpdateFormQuestionDto[];
};

export type QueryFeedbackDto = BaseQuery & {
  status?: EStatus;
  event_id?: number;
  date_range?: Date[];
  date_from?: Date;
  date_to?: Date;
};
