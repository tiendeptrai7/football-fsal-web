import { BaseModel } from './base';
import { FeedbackDto } from './feedback';

export type FeedbackDocumentDto = BaseModel & {
  url: string;
  feedback_id: number;
  feedback: FeedbackDto;
};

export type CreateFeedbackDocumentDto = {
  url: string;
};

export type UpdateFeedbackDocumentDto = Partial<CreateFeedbackDocumentDto> & {
  id?: number;
};
