import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import { EditSystemComponent } from './edit/edit-system.component';
import { SystemComponent } from './system.component';
import { SystemRoutingModule } from './system-routing.module';

@NgModule({
  declarations: [SystemComponent, EditSystemComponent],
  imports: [SharedModule, SystemRoutingModule],
})
export class SystemModule {}
