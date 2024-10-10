import {
  AfterViewChecked,
  Component,
  ElementRef,
  Injector,
  OnInit,
  ViewChild,
} from '@angular/core';

import { AppBaseComponent } from '@/app/shared/app.base.component';
import { LogService } from '@/app/shared/services/log.service';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./style.component.css'],
})
export class LogComponent
  extends AppBaseComponent
  implements OnInit, AfterViewChecked
{
  listLog: string[] = [];
  data: string = '';

  logSelected: string = '';

  @ViewChild('codeContainer') codeContainer!: ElementRef;

  constructor(
    injector: Injector,
    private logService: LogService
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.getListLogData();
  }

  ngAfterViewChecked(): void {
    this.codeContainer.nativeElement.scrollTop =
      this.codeContainer.nativeElement.scrollHeight;
  }

  getListLogData(): void {
    this.logService.getListLog().subscribe({
      next: response => (this.listLog = response.data),
    });
  }

  logSelecteChange(logName: string): void {
    this.logService.getLog(logName).subscribe(data => {
      const blob = new Blob([data], { type: 'application/octet-stream' });
      const reader = new FileReader();

      reader.onload = () => {
        this.data = reader.result as string;
      };

      reader.readAsText(blob);
    });
  }
}
