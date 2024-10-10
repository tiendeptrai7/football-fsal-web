import { EStatus } from '../constant/enum';
import { BaseModel, BaseQuery } from './base';
import { EventDto } from './event';
import {
  EventFormDetailDto,
  UpSertEventFormDetailDto,
} from './event-form-detail';

export type EventFormDto = BaseModel & {
  name: string;
  status: EStatus;
  events: EventDto[];
  event_form_details: EventFormDetailDto[];
};

export type CreateEventFormDto = {
  name: string;
  consent: string;
  status: EStatus;
  event_form_details: UpSertEventFormDetailDto[];
};

export type UpdateEventFormDto = Partial<CreateEventFormDto> & {
  id: number;
};

export type QueryEventForm = BaseQuery & {
  status?: EStatus;
  date_range?: Date[];
  date_from?: Date;
  date_to?: Date;
};
