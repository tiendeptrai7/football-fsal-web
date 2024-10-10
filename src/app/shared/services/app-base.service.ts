import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ListPaginate } from '@shared/types/base';
import { getUrlParams } from '@utils/common-helper';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AppBaseService<
  TPrimaryKey,
  TEntityDto,
  TCreateEntityDto,
  TEditEntityDto,
  TQueryEntityDto,
> {
  protected readonly apiUrl: string;
  constructor(
    protected readonly httpClient: HttpClient,
    @Inject('string') protected readonly prefix: string,
    @Inject('string') protected readonly serviceName: string
  ) {
    this.apiUrl = prefix + '/' + serviceName;
  }

  getByPaged(
    params = {} as TQueryEntityDto
  ): Observable<ListPaginate<TEntityDto>> {
    return this.httpClient.get<ListPaginate<TEntityDto>>(
      `${this.apiUrl}` +
        getUrlParams(
          params as { [key: string]: string | string[] | number | boolean }
        )
    );
  }

  getById(id: TPrimaryKey): Observable<TEntityDto> {
    return this.httpClient.get<TEntityDto>(`${this.apiUrl}/${id}`);
  }

  deleteById(id: TPrimaryKey): Observable<null> {
    return this.httpClient.delete<null>(`${this.apiUrl}/${id}`);
  }

  create(body: TCreateEntityDto): Observable<TPrimaryKey> {
    return this.httpClient.post<TPrimaryKey>(`${this.apiUrl}`, body);
  }

  update(body: TEditEntityDto): Observable<TPrimaryKey> {
    return this.httpClient.put<TPrimaryKey>(`${this.apiUrl}`, body);
  }

  toggle(id: TPrimaryKey, type = 'status'): Observable<null> {
    return this.httpClient.put<null>(
      `${this.apiUrl}/toggle/${type}/${id}`,
      null
    );
  }
}
