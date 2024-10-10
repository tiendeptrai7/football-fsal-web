import { Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { RoleService } from '@services/role.service';
import { AppBaseComponent } from '@shared/app.base.component';
import { ListPermissionDto } from '@shared/types/permission';
import { CreateRole, EditRole, RoleDto } from '@shared/types/role';
import { getNumber } from '@utils/common-helper';
import slugify from 'slugify';

import { EStatus } from '@/app/shared/constant/enum';

@Component({
  templateUrl: './create-edit-role.component.html',
})
export class CreateEditRoleComponent
  extends AppBaseComponent
  implements OnInit
{
  roles: RoleDto[] = [];

  permissionDict: ListPermissionDto = {};
  validateForm = this.formBuilder.group({
    name: ['', [Validators.required]],
    slug: [{ value: '', disabled: !!this.id }, [Validators.required]],
    permission_ids: [[] as number[], [Validators.required]],
    status: [EStatus.active],
  });

  selectedItem: { [key: string]: number[] } = {};

  roleStatus = EStatus;

  get id(): number | undefined {
    return getNumber(this.getRouteParam('id'));
  }

  constructor(
    injector: Injector,
    private readonly formBuilder: FormBuilder,
    private readonly roleService: RoleService
  ) {
    super(injector);
  }
  ngOnInit(): void {
    this.permissionService.getList().subscribe(permissions => {
      this.permissionDict = permissions;
    });

    if (this.id) {
      this.roleService.getById(this.id).subscribe(data => {
        this.validateForm.patchValue({
          name: data.name,
          slug: data.slug,
        });
        this.selectedItem = Object.entries(data.permissions).reduce(
          (acc, item) => {
            acc[item[0]] = item[1].map(i => i.id);
            return acc;
          },
          {} as { [key: string]: number[] }
        );
        this._patchPermissionIds(false);
      });
    }
  }

  goBack() {
    this.redirect('/role');
  }

  save() {
    if (this.validateForm.valid) {
      const body = {
        id: this.id,
        ...this.validateForm.getRawValue(),
        status: this.validateForm.value.status
          ? EStatus.active
          : EStatus.inactive,
      } as unknown as CreateRole | EditRole;

      this._handleSubmitForm(body, this.id);
    } else {
      this.validateFormGroup(this.validateForm);
    }
  }

  isCheckAll(key: string): boolean {
    return this.permissionDict[key]?.length === this.selectedItem[key]?.length;
  }

  isCheckAllPermission(): boolean {
    return Object.keys(this.selectedItem).every(key => this.isCheckAll(key));
  }

  isIndeterminate(key: string): boolean {
    return !!(
      this.selectedItem[key]?.length &&
      this.selectedItem[key]?.length !== this.permissionDict[key]?.length
    );
  }

  onCheckAll(key: string, event: boolean): void {
    if (!event) {
      this.selectedItem[key] = [];
    } else {
      this.selectedItem[key] = [
        ...(this.permissionDict[key]?.map(p => p.id as number) || []),
      ];
    }
    this._patchPermissionIds();
  }

  isCheckedPermission(id: number, key: string): boolean {
    return this.selectedItem[key]?.includes(id);
  }

  checkAllPermission(event: boolean): void {
    this.selectedItem = event ? this._getAllPermissions() : {};
    this._patchPermissionIds();
  }

  private _getAllPermissions(): { [key: string]: number[] } {
    return Object.entries(this.permissionDict).reduce(
      (acc, [key, value]) => {
        acc[key] = value.map(item => item.id);
        return acc;
      },
      {} as { [key: string]: number[] }
    );
  }

  onCheckPermission(id: number, key: string): void {
    const permissions = this.selectedItem[key] || [];
    const index = permissions.indexOf(id);

    if (index === -1) {
      permissions.push(id);
    } else {
      permissions.splice(index, 1);
    }

    this.selectedItem[key] = permissions;
    this._patchPermissionIds();
  }

  changeSlug(): void {
    if (this.id) return;
    const slug = slugify(this.validateForm.value.name || '', {
      replacement: '-',
      lower: true,
      strict: true,
      locale: 'vi',
      trim: true,
    });
    this.validateForm.controls.slug.patchValue(slug);
  }

  private _handleSubmitForm(body: CreateRole | EditRole, id?: number): void {
    if (id) {
      this.roleService.update(<EditRole>body).subscribe(() => {
        this.msgService.success('Update role successful!');
        this.goBack();
      });
    } else {
      this.roleService.create(<CreateRole>body).subscribe(() => {
        this.msgService.success('Create role successful!');
        this.goBack();
      });
    }
  }

  private _patchPermissionIds(idTouched = true): void {
    this.validateForm.controls.permission_ids.patchValue(
      Object.values(this.selectedItem)
        .map(value => value)
        .flat()
    );

    if (idTouched) {
      this.validateForm.controls.permission_ids.markAsTouched();
    }
  }
}
