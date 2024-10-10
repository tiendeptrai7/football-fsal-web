import { Component, Injector, OnInit } from '@angular/core';
import {
  TableAction,
  TableDataType,
  TableHeader,
} from '@components/data-table/data-table.component';
import { AppBaseComponent } from '@shared/app.base.component';
import { ListPaginate } from '@shared/types/base';
import { EventGuestDto, QueryEventGuest } from '@shared/types/event-guest';
import { capitalize } from 'lodash';
import { debounceTime, map, Observable, Subject } from 'rxjs';

import {
  ActionBarCustomAction,
  ActionBarFilter,
} from '@/app/shared/components/action-bar/action-bar.component';
import {
  ImportResultDto,
  UploadDefaultFile,
} from '@/app/shared/components/upload-file-modal/upload-file-modal.component';
import { EGender } from '@/app/shared/constant/enum';
import { EventService } from '@/app/shared/services/event.service';
import { EventGuestService } from '@/app/shared/services/event-guest.service';
import { MedRepService } from '@/app/shared/services/med-rep.service';
import { EventDto } from '@/app/shared/types/event';

@Component({
  templateUrl: './event-guest.component.html',
})
export class EventGuestComponent extends AppBaseComponent implements OnInit {
  filters: ActionBarFilter[] = [
    {
      name: 'filter',
      type: 'search',
      placeholder: 'Search',
      size: 4,
      value: this.getQueryParam('filter'),
    },
    {
      name: 'med_rep_code',
      type: 'select-async',
      placeholder: 'Medrep',
      size: 3,
      value: this.getQueryParam('med_rep_code'),
      $options: this.medrepService.getAll().pipe(
        map(
          response =>
            response.map(medrep => ({
              label: `${medrep.code} - ${medrep.name}`,
              value: medrep.code,
            })) as { label: string; value: string | number }[]
        )
      ),
    },
  ];

  actions: ActionBarCustomAction[] = [
    {
      label: 'Import',
      icon: 'import',
      permission: 'event_guest_manage_import',
      act: () => {
        this.showImportModal();
      },
    },
  ];

  deleteAction: TableAction = {
    confirm: 'Do you want to delete ?',
    permission: 'event_guest_manage_delete',
    act: (id: string | number) => {
      this.eventGuestService.deleteById(id as number).subscribe(() => {
        this.msgService.success('Delete event guest successfully');
        this.getDataSource();
      });
    },
  };

  headers: TableHeader[] = [
    {
      label: 'Imported time',
      key: 'created_at',
      type: TableDataType.date_time,
    },
    {
      label: 'Ticket code',
      key: 'qr_code',
      type: TableDataType.text,
    },
    {
      label: 'HCP ID',
      key: 'hcp.code',
      type: TableDataType.text,
    },
    {
      label: 'HCP Name',
      key: 'hcp.name',
      type: TableDataType.text,
    },
    {
      label: 'Gender',
      key: 'hcp.gender',
      type: TableDataType.render,
      render: data =>
        capitalize(
          `${EGender[data?.['hcp']['gender'] as keyof typeof EGender]}`
        ),
    },
    {
      label: 'Zalo Number',
      key: 'hcp.user.profile.phone',
      type: TableDataType.text,
    },
    {
      label: 'HCO',
      key: 'hcp.hco',
      type: TableDataType.text,
    },
    {
      label: 'City',
      key: 'hcp.city',
      type: TableDataType.text,
    },
    {
      label: 'Speacialty',
      key: 'hcp.specialty',
      type: TableDataType.text,
    },
    {
      label: 'MedRep ID',
      key: 'hcp.medrep.code',
      type: TableDataType.text,
    },
    {
      label: 'Med Rep',
      key: 'hcp.medrep.name',
      type: TableDataType.text,
    },
    {
      label: 'QR Status',
      key: 'qr_status',
      type: TableDataType.switch,
      act: id => {
        this.eventGuestService.toggle(+id, 'qr').subscribe(() => {
          this.msgService.success('Update QR status successful!');
        });
      },
      disable: () => !this.hasPermission('event_guest_manage_update'),
    },
  ];

  event: EventDto | null = null;
  dataSource: ListPaginate<EventGuestDto> | undefined = undefined;

  private _queryParams: QueryEventGuest = {
    filter: this.getQueryParam('filter'),
    page: this.getQueryParam<number>('page') || 1,
    limit: this.getQueryParam<number>('limit') || 10,
    sorting: this.getQueryParam('sorting'),
    event_id: this.getQueryParam<number>('event_id'),
    med_rep_code: this.getQueryParam<string>('med_rep_code'),
  };

  isVisbleImport: boolean = false;
  importTitle: string = '';
  defaultFile: UploadDefaultFile[] = [
    {
      type: 'sample',
      key: '/applications/sample_event_guest.xlsx',
      name: 'Sample_Event_Guest',
    },
  ];

  protected readonly queryParams$: Subject<QueryEventGuest> =
    new Subject<QueryEventGuest>();

  constructor(
    injector: Injector,
    private readonly eventService: EventService,
    private readonly eventGuestService: EventGuestService,
    private readonly medrepService: MedRepService
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.queryParams$.pipe(debounceTime(300)).subscribe(query => {
      this._handleFilterChange(query);
    });

    this.activeRoute.queryParams.subscribe(() => {
      this.getDataSource();
    });
  }

  getDataSource(): void {
    const eventId = this.getQueryParam<number>('event_id');

    this.eventService.getById(eventId).subscribe({
      next: event => (this.event = event),
    });

    this.eventGuestService.getByPaged(this._queryParams).subscribe(data => {
      this.dataSource = data;
    });
  }

  backToEvent(): void {
    return this.redirect('/events');
  }

  private _handleFilterChange(query: QueryEventGuest): void {
    const eventID = this._queryParams.event_id;
    const tmp: QueryEventGuest = {
      ...this._queryParams,
      ...query,
    };

    this._queryParams = {
      ...tmp,
      event_id: eventID,
    };

    this.setQueryParam(this._queryParams);
  }

  private showImportModal() {
    this.importTitle = 'Event Guest';
    this.isVisbleImport = true;
  }

  import(key: string): Observable<ImportResultDto> {
    const eventID = this.getQueryParam<number>('event_id');
    return this.eventGuestService.import({ event_id: eventID, key });
  }
}
