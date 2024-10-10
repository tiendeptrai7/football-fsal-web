import { EStatus } from '../constant/enum';
import { BaseModel, BaseQuery } from './base';
import { EventDto } from './event';
import {
  CreateFormQuestionDto,
  FormQuestionDto,
  UpdateFormQuestionDto,
} from './form-question';

export type SurveyDto = BaseModel & {
  name: string;
  code: string;
  started_at: Date;
  ended_at: Date;
  status: EStatus;
  event_id: number;
  event: EventDto;
  form_questions: FormQuestionDto[];
};

export type CreateSurveyDto = {
  name: string;
  event_id: number;
  status: EStatus;
  started_at: Date;
  ended_at: Date;
  form_questions: CreateFormQuestionDto[];
};

export type UpdateSurveyDto = Omit<
  Partial<CreateSurveyDto>,
  'form_questions'
> & {
  id: number;
  form_questions?: UpdateFormQuestionDto[];
};

export type QuerySurveyDto = BaseQuery & {
  created_at?: Date;
  status?: EStatus;
  date_from?: Date;
  date_to?: Date;
  date_range?: Date[];
};
