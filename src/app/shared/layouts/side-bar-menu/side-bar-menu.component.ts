import { Component, Input, OnInit } from '@angular/core';
import { PermissionService } from '@services/permission.service';
import { document, feedback, luckyWheel } from '@shared/constant/icon';
import { NzIconService } from 'ng-zorro-antd/icon';

export type MenuItem = {
  title: string;
  path?: string;
  icon?: string;
  permission?: string | string[];
  children?: Omit<MenuItem, 'icon'>[];
};

@Component({
  selector: 'side-bar-menu',
  templateUrl: './side-bar-menu.component.html',
})
export class SideBarMenuComponent implements OnInit {
  @Input() isCollapsed = false;

  menus: MenuItem[] = [
    {
      title: 'User Management',
      icon: 'team',
      permission: ['role_manage_read', 'user_manage_read'],
      children: [
        {
          title: 'Role',
          path: 'role',
          permission: 'role_manage_read',
        },
        {
          title: 'User',
          path: 'user',
          permission: 'user_manage_read',
        },
      ],
    },
    {
      title: 'Account Management',
      icon: 'user',
      children: [
        {
          title: 'HCP Management',
          path: 'hcps',
          permission: 'hcp_manage_read',
        },
        {
          title: 'Med Rep Management',
          path: 'med-reps',
          permission: 'medrep_manage_read',
        },
        {
          title: 'HCO Management',
          path: 'hcos',
        },
      ],
    },
    {
      title: 'Event Management',
      icon: 'appstore',
      permission: 'event_manage_read',
      path: 'events',
    },
    {
      title: 'Recap Management',
      path: 'recaps',
      icon: 'ng-zorro:feedback',
      permission: 'recap_manage_read',
    },
    {
      title: 'Feedback Management',
      icon: 'star',
      permission: 'feedback_manage_read',
      path: 'feedbacks',
    },
    {
      title: 'Survey Management',
      icon: 'form',
      permission: 'survey_manage_read',
      path: 'surveys',
    },
    {
      title: 'Registration Management',
      icon: 'build',
      permission: 'event_form_manage_read',
      path: 'event-forms',
    },
    {
      title: 'Report',
      icon: 'pie-chart',
      children: [
        {
          path: 'zalo-messages',
          title: 'Zalo Message Report',
          permission: 'zalo_message_manage_observe',
        },
      ],
    },
    {
      title: 'News Management',
      icon: 'container',
      permission: 'news_manage_read',
      path: 'news',
    },
    {
      title: 'Setting',
      icon: 'setting',
      permission: 'system_manage_read',
      children: [
        {
          title: 'System Config',
          path: 'system/SYSTEM_SETTING',
        },
        {
          title: 'Zalo Management',
          path: 'system/ZALO',
        },
        {
          title: 'Email Management',
          path: 'system/EMAIL_SMTP',
        },
      ],
    },
  ];

  constructor(
    private readonly permissionService: PermissionService,
    private iconService: NzIconService
  ) {
    this.iconService.addIconLiteral('ng-zorro:lucky_wheel', luckyWheel);
    this.iconService.addIconLiteral('ng-zorro:feedback', feedback);
    this.iconService.addIconLiteral('ng-zorro:document', document);
  }

  ngOnInit(): void {
    this.menus = this._filterMenusByPermissions(
      this.menus,
      this.permissionService.currentPermissions
    );
  }

  private _filterMenusByPermissions(
    menuItems: MenuItem[],
    permissions: string[]
  ): MenuItem[] {
    return menuItems.filter(menu => {
      const needPermissions = Array.isArray(menu.permission)
        ? menu.permission
        : menu.permission
          ? [menu.permission]
          : null;
      if (needPermissions?.length) {
        if (!needPermissions?.some(p => permissions?.includes(p))) {
          return false;
        }
      }

      if (menu?.children?.length) {
        menu.children = this._filterMenusByPermissions(
          menu.children,
          permissions
        );
        return menu.children.length > 0;
      }

      return true;
    });
  }
}
