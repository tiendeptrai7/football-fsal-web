import {
  Directive,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subject, Subscription, throttleTime } from 'rxjs';

@Directive({
  selector: '[throttleClick]',
})
export class ThrottleClickDirective implements OnInit, OnDestroy {
  @Input() throttleTime = 200;

  @Output() byClick: EventEmitter<void> = new EventEmitter();

  private clickSubject$: Subject<void> = new Subject();
  private subscription$: Subscription | undefined;

  ngOnInit() {
    this.subscription$ = this.clickSubject$
      .pipe(throttleTime(this.throttleTime))
      .subscribe(() => this.emitThrottledClick());
  }

  emitThrottledClick() {
    this.byClick.emit();
  }

  ngOnDestroy() {
    this.subscription$?.unsubscribe();
  }

  @HostListener('click', ['$event'])
  clickEvent(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.clickSubject$.next();
  }
}
