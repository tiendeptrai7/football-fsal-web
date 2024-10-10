import { Component, Injector, OnInit } from '@angular/core';

import { AppBaseComponent } from '@/app/shared/app.base.component';
import { EHCPType } from '@/app/shared/constant/enum';
import { EventService } from '@/app/shared/services/event.service';
import { HcpService } from '@/app/shared/services/hcp.service';
import { EventRelatedHCPDto } from '@/app/shared/types/hco';
import { HcpDto } from '@/app/shared/types/hcp';

@Component({
  selector: 'app-hcp-detail',
  templateUrl: './hcp-detail.component.html',
})
export class HcpDetailComponent extends AppBaseComponent implements OnInit {
  hcp: HcpDto | null = null;
  eventJoined: EventRelatedHCPDto[] = [];

  constructor(
    injector: Injector,
    private readonly hcpService: HcpService,
    private readonly eventService: EventService
  ) {
    super(injector);
  }

  ngOnInit(): void {
    if (this.id) {
      this.hcpService.getById(this.id).subscribe({
        next: hcp => (this.hcp = hcp),
      });

      this.eventService.getListEventRelatedHCP({ hcp_id: this.id }).subscribe({
        next: events => (this.eventJoined = events),
      });
    }
  }

  get id(): number {
    return parseInt(this.getRouteParam('id'));
  }

  getHcpType(value: number | undefined): string {
    const hcpTypes: Record<string, unknown> = EHCPType;

    return Object.keys(hcpTypes).find(
      (key: string) => hcpTypes[key] === value
    ) as string;
  }
}
