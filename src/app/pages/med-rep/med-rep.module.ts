import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '@/app/shared/shared.module';

import { MedRepComponent } from './med-rep.component';
import { MedRepRoutingModule } from './med-rep-routing.module';

@NgModule({
  declarations: [MedRepComponent],
  imports: [CommonModule, SharedModule, MedRepRoutingModule],
})
export class MedRepModule {}
