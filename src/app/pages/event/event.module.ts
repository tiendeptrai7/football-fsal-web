import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { CreateEditEventComponent } from './create-edit-event/create-edit-event.component';
import { CreateEditReminderComponent } from './create-edit-reminder/create-edit-reminder.component';
import { EventComponent } from './event.component';
import { EventRoutingModule } from './event-routing.module';

@NgModule({
  declarations: [
    EventComponent,
    CreateEditEventComponent,
    CreateEditReminderComponent,
  ],
  imports: [CommonModule, SharedModule, EventRoutingModule],
})
export class EventModule {}
