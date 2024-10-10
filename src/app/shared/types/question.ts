import { BaseModel } from '@shared/types/base';

import { EQuestionType, EStatus } from '../constant/enum';
import { AnswerDto, CreateAnswerDto } from './answer';

export type QuestionDto = BaseModel & {
  content: string;
  type: EQuestionType;
  is_required: EStatus;
  answers: AnswerDto[];
};

export type CreateQuestionDto = {
  type: EQuestionType;
  content: string;
  is_required: EStatus;
  answers: CreateAnswerDto[];
};

export type UpdateQuestionDto = Omit<Partial<CreateQuestionDto>, 'answers'> & {
  id?: number;
  answers?: UpdateQuestionDto[];
};
