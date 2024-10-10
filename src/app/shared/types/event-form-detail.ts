import {
  EEventFormDetailFormat,
  EEventFormDetailType,
  EStatus,
} from '../constant/enum';
import { BaseModel } from './base';
import { EventFormDto } from './event-form';
import {
  EventFormOptionDto,
  UpSertEventFormOptionDto,
} from './event-form-option';

export type EventFormDetailDto = BaseModel & {
  content: string;
  type: EEventFormDetailType;
  format: EEventFormDetailFormat;
  is_required: EStatus;
  event_form: EventFormDto;
  event_form_options: EventFormOptionDto[];
};

export type UpSertEventFormDetailDto = {
  id?: number;
  content: string;
  type: EEventFormDetailType;
  format: EEventFormDetailFormat;
  is_required: EStatus;
  event_form_options: UpSertEventFormOptionDto[];
};
