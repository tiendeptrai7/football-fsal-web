import { EGender, EQuestionType, EStatus } from '../constant/enum';
import { BaseQuery } from './base';
import { EventGuestDto } from './event-guest';
import { SubmissionDto } from './form-question';
import { SurveyDto } from './survey';

export type SurveyReportDto = SurveyDto & {
  event_guest_total: number;
};

export type ParticipantReportDto = EventGuestDto & {
  submit_status: EStatus;
  submit_time: Date;
};

export type OverviewResultDto = {
  total_completed: number;
  total_uncompleted: number;
};

export type DetailResultDto = {
  question_type: EQuestionType;
  question_id: number;
  question_content: string;
};

export interface ShortAnswerDto {
  answer_text: string;
}

export interface BarChartDto {
  categories: string[];
  data: string[];
}

export interface SubmissionDetailDto {
  participant: Participant;
  survey_result?: SubmissionDto[];
}

export interface Participant {
  full_name: string;
  specialty: string;
  date_of_birth?: string;
  hco: string;
  gender: EGender;
  survey_status: EStatus;
  zalo_number: string;
  time_of_submission: Date;
}

export interface LineChartDto extends BarChartDto {}

export type QuerySurveyReportDto = BaseQuery & {
  created_at?: Date;
  status?: EStatus;
  date_from?: Date;
  date_to?: Date;
  date_range?: Date[];
};

export type QueryChartDto = {
  question_id: number;
};

export type QuerySubmissionDetailDto = {
  event_guest_id: number;
};

export type QueryParticipantReportDto = BaseQuery & {
  created_at?: Date;
  status?: EStatus;
  survey_id?: number;
};
