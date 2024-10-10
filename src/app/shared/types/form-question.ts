import { BaseModel } from './base';
import { FeedbackDto } from './feedback';
import { CreateQuestionDto, QuestionDto, UpdateQuestionDto } from './question';
import { EQuestionType } from './question-answer';

export type FormQuestionDto = BaseModel & {
  order: number;
  form_type: EFormType;
  form_id: number;
  question_id: number;
  question: QuestionDto;
  feedback: FeedbackDto | null;
};

export interface SubmissionDto {
  question_type: EQuestionType;
  question_content: string;
  answer_value: string;
  answer_text: string;
  form_question_id: number;
  form_question: FormQuestionDto;
  event_guest_id: number;
  submission_answers: SubmissionAnswerDto[];
}

export interface SubmissionAnswerDto {
  submission_id: number;
  answer_id: number;
  answer_content: string;
  answer_text: string;
  submission: SubmissionDto;
}

export type CreateFormQuestionDto = {
  question: CreateQuestionDto;
};

export type UpdateFormQuestionDto = Omit<
  Partial<CreateFormQuestionDto>,
  'question'
> & {
  id?: number;
  question?: UpdateQuestionDto;
};

export enum EFormType {
  survey = 1,
  feedback,
}

export type FormOptionDto = {
  form_id: number;
  form_type: EFormType;
};
