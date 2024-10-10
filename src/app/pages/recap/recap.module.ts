import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '@/app/shared/shared.module';

import { CreateEditRecapComponent } from './create-edit-recap/create-edit-recap.component';
import { RecapComponent } from './recap.component';
import { RecapRoutingModule } from './recap-routing.module';

@NgModule({
  declarations: [RecapComponent, CreateEditRecapComponent],
  imports: [CommonModule, SharedModule, RecapRoutingModule],
})
export class RecapModule {}
