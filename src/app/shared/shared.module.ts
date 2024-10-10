import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ActionBarComponent } from '@components/action-bar/action-bar.component';
import { DataTableComponent } from '@components/data-table/data-table.component';
import { LazySelectComponent } from '@components/lazy-select/lazy-select.component';
import { RichTextComponent } from '@components/richtext/richtext.component';
import { UploadComponent } from '@components/upload/upload.component';
import { UploadFileModalComponent } from '@components/upload-file-modal/upload-file-modal.component';
import { ThrottleClickDirective } from '@shared/directives/throttle-click.directive';
import { BlankLayoutComponent } from '@shared/layouts/blank-layout/blank-layout.component';
import { BreadcrumbComponent } from '@shared/layouts/breadcrumb/breadcrumb.component';
import { MainLayoutComponent } from '@shared/layouts/main-layout/main-layout.component';
import { NavBarComponent } from '@shared/layouts/nav-bar/nav-bar.component';
import { SideBarMenuComponent } from '@shared/layouts/side-bar-menu/side-bar-menu.component';
//ant design
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzUploadModule } from 'ng-zorro-antd/upload';

import { EventQuestionConfigComponent } from './components/event-question-config/event-question-config.component';
import { QuestionConfigModalComponent } from './components/question-config-modal/question-config-modal.component';
import { UploadMultiComponent } from './components/upload-multi/upload-multi.component';
import { CapitalizeFirstPipe } from './pipes/capitalize-first.pipe';
import { FormatDatePipe } from './pipes/format-date.pipe';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';

const layouts = [
  MainLayoutComponent,
  BlankLayoutComponent,
  SideBarMenuComponent,
  NavBarComponent,
  BreadcrumbComponent,
];

const components = [
  ActionBarComponent,
  DataTableComponent,
  LazySelectComponent,
  UploadComponent,
  UploadFileModalComponent,
  RichTextComponent,
  UploadMultiComponent,
  QuestionConfigModalComponent,
  EventQuestionConfigComponent,
];

const directives = [ThrottleClickDirective];
const pipes = [SafeHtmlPipe, FormatDatePipe, CapitalizeFirstPipe];

const antD = [
  NzLayoutModule,
  NzBreadCrumbModule,
  NzButtonModule,
  NzMenuModule,
  NzIconModule,
  NzToolTipModule,
  NzIconModule,
  NzDropDownModule,
  NzAvatarModule,
  NzFormModule,
  NzCheckboxModule,
  NzInputModule,
  NzSelectModule,
  NzDatePickerModule,
  NzTableModule,
  NzDividerModule,
  NzImageModule,
  NzSwitchModule,
  NzCardModule,
  NzInputNumberModule,
  NzPopconfirmModule,
  NzSpinModule,
  NzModalModule,
  NzSpaceModule,
  NzUploadModule,
  NzGridModule,
  NzToolTipModule,
  NzRadioModule,
];
@NgModule({
  declarations: [...layouts, ...components, ...directives, pipes],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    NgOptimizedImage,
    ScrollingModule,
    FormsModule,
    ...antD,
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    FormsModule,
    ...layouts,
    ...components,
    ...antD,
    ...pipes,
  ],
})
export class SharedModule {}
