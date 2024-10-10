import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserService } from '@services/user.service';
import { getFirstCharacter } from '@utils/string';

@Component({
  selector: 'nav-bar',
  templateUrl: './nav-bar.component.html',
})
export class NavBarComponent {
  @Input() isCollapsed = false;
  @Output() isCollapsedChange: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  get user(): {
    name: string;
    role: string;
  } {
    return this.userService.userSimpleProfile;
  }

  constructor(private userService: UserService) {}

  toggleIsCollapsed(): void {
    this.isCollapsedChange.emit(!this.isCollapsed);
  }

  protected readonly getFirstCharacter = getFirstCharacter;
}
