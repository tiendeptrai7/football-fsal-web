import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { EventGuestComponent } from './event-guest.component';
import { EventGuestRoutingModule } from './event-guest-routing.module';

@NgModule({
  declarations: [EventGuestComponent],
  imports: [SharedModule, EventGuestRoutingModule],
})
export class EventGuestModule {}
