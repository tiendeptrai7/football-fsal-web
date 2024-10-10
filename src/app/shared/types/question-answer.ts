import { EStatus } from '../constant/enum';
import { BaseModel } from './base';

export enum EQuestionType {
  single_choice = 1,
  multi_choice,
  rating,
  text,
  percentage,
}

export type CreateAnswerDto = {
  content: string;
  require_input: EStatus;
};

export type CreateQuestionDto = {
  answers?: CreateAnswerDto[];
  type: EQuestionType;
  content: string;
  is_required?: EStatus;
};

export type AnswerDto = CreateAnswerDto & BaseModel;
export type QuestionDto = CreateQuestionDto & BaseModel;
export type EditQuestionDto = CreateQuestionDto;
export type EditAnswerDto = CreateAnswerDto;
