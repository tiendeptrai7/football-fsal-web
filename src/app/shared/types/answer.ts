import { BaseModel } from '@shared/types/base';

import { EStatus } from '../constant/enum';
import { QuestionDto } from './question';

export type AnswerDto = BaseModel & {
  content: string;
  requires_input: EStatus;
  question_id: number;
  question: QuestionDto;
};

export type CreateAnswerDto = {
  content: string;
  require_input: EStatus;
};

export type UpdateAnswerDto = Partial<CreateAnswerDto> & {
  id?: number;
};
