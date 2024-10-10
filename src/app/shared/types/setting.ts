import { EStatus, ESystemType } from '../constant/enum';
import { BaseModel, BaseQuery } from './base';

export type SystemDto = BaseModel & {
  key: string;
  name: string;
  value: string;
  unit: ESystemType;
  group: string;
  is_public: EStatus;
  status: EStatus;
};

export type UpdateSystem = Partial<SystemDto>;

export type QuerySystem = BaseQuery & {
  group?: string;
};
