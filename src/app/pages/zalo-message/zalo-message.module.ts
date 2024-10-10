import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '@/app/shared/shared.module';

import { ObserveModalComponent } from './observe-modal/observe-modal.component';
import { ZaloMessageComponent } from './zalo-message.component';
import { ZaloMessageRoutingModule } from './zalo-message-routing.module';

@NgModule({
  declarations: [ZaloMessageComponent, ObserveModalComponent],
  imports: [CommonModule, SharedModule, ZaloMessageRoutingModule],
})
export class ZaloMessageModule {}
