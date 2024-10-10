import { EStatus } from '../constant/enum';
import { BaseModel, BaseQuery } from './base';

export type ReminderDto = BaseModel & {
  id: number;
  reminder_days_before: number | null;
  reminder_expire_days: number | null;
  reminder_sent_at: Date;
  reminder_expire_at: Date;
};

export type CreateReminder = {
  reminder_days_before: number;
  reminder_expire_days: number;
  reminder_sent_at: Date;
  reminder_expire_at: Date;
};

export type EditReminder = Partial<CreateReminder> & {
  id: number;
};

export type QueryReminder = BaseQuery & {
  reminder_sent_at?: Date;
  status?: EStatus;
};
