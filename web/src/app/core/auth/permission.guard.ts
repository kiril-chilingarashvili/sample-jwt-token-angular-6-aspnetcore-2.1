import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';

import { RefactorxPermissionService } from './permission.service';

@Injectable()
export class RefactorxPermissionGuard implements CanActivate {

  constructor(
    private _permissionService: RefactorxPermissionService,
    private _router: Router) { }

  canActivate(snapshot: ActivatedRouteSnapshot) {
    let result = true;
    let permission = '';
    if (snapshot && snapshot.data && snapshot.data['permission']) {
      permission = snapshot.data['permission'];
      result = this._permissionService.check(permission);
    }
    if (!result) {
      this._router.navigate(['/login']); // you may reconsider this strategy for case when permission failed because of roles/claims
    }
    // console.log('RefactorxPermissionGuard.canActivate called with permission ', permission);
    return result;
  }
}
