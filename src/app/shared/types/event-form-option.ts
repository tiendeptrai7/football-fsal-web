import { EStatus } from '../constant/enum';
import { BaseModel } from './base';
import { EventFormDetailDto } from './event-form-detail';

export type EventFormOptionDto = BaseModel & {
  content: string;
  require_input: EStatus;
  event_form_detail_id: number;
  event_form_detail: EventFormDetailDto;
};

export type UpSertEventFormOptionDto = {
  id?: number;
  require_input: EStatus;
  content: string;
};
