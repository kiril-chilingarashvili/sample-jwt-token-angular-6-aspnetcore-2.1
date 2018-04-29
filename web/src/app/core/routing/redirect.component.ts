import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

import { RefactorxPermissionService } from 'app/core/auth';

@Component({
  template: '<div>Please wait...</div>'
})
export class RefactorxRedirectComponent implements OnInit, OnDestroy {

  private _subscription: Subscription;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _permissionService: RefactorxPermissionService
  ) {
    // console.log('RefactorxRedirectComponent init');
    if (!this._activatedRoute.snapshot.firstChild) {
      this._subscription = this._activatedRoute.data.subscribe(data => {
        // console.log('RefactorxRedirectComponent data', data);
        let arr: Array<any> = data['redirectTo'];
        if (arr && arr.length) {
          for (let i = 0; i < arr.length; i++) {
            let value = arr[i];
            let permission = value.permission;
            let target = value.target;
            if (target && this._permissionService.check(permission)) {
              // console.log('redirect component redirecting to ', target);
              this._router.navigate([target]);
              break;
            }
          }
        }
      });
    }
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
