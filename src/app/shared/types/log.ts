import { BaseModel, BaseQuery } from './base';

export type LogDto = BaseModel;

export type CreateLog = object;

export type EditLog = Partial<CreateLog>;

export type QueryLog = BaseQuery;
