import { EStatus } from '../constant/enum';
import { BaseModel, BaseQuery } from './base';
import { EventDto } from './event';

export type RecapDto = BaseModel & {
  name: string;
  code: string;
  recap_days_before: number;
  recap_sent_at: Date;
  content: string;
  status: EStatus;
  event_id: number;
  event: EventDto;
};

export type CreateRecap = {
  name: string;
  recap_days_before: number;
  recap_sent_at: Date;
  content: string;
  status: EStatus;
  event_id: number;
};

export type UpdateRecap = Partial<CreateRecap> & {
  id: number;
};

export type QueryRecap = BaseQuery & {
  event_id?: number;
  status?: EStatus;
  date_range?: Date[];
  date_from?: Date;
  date_to?: Date;
};
