import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '@/app/shared/shared.module';

import { HcpComponent } from './hcp.component';
import { HcpDetailComponent } from './hcp-detail/hcp-detail.component';
import { HcpRoutingModule } from './hcp-routing.module';

@NgModule({
  declarations: [HcpComponent, HcpDetailComponent],
  imports: [CommonModule, SharedModule, HcpRoutingModule],
})
export class HcpModule {}
