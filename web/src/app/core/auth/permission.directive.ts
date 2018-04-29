import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  OnDestroy
} from '@angular/core';
import { Subscription } from 'rxjs';
import { RefactorxPermissionService } from './permission.service';
import { RefactorxUserService } from './user.service';

@Directive({
  selector: '[refactorxPermission]'
})
export class RefactorxPermissionDirective implements OnDestroy {

  private _userChangedSubscription: Subscription;
  private _permission = '';
  private _lastShow = false;

  @Input() public set refactorxPermission(val) {
    this._permission = val;
    this._checkPermission();
  }
  constructor(
    private _templateRef: TemplateRef<any>,
    private _viewContainer: ViewContainerRef,
    private _permissionService: RefactorxPermissionService,
    private _userService: RefactorxUserService
  ) {
    this._userChangedSubscription = this._userService.userChanged.subscribe(() => {
      this._checkPermission();
    });
  }
  private _showHide(show: boolean) {
    if (show != this._lastShow) {
      this._lastShow = show;
      if (show) {
        this._viewContainer.createEmbeddedView(this._templateRef);
      } else {
        this._viewContainer.clear();
      }
    }
  }
  private _checkPermission() {
    this._showHide((!this._permission || this._permissionService.check(this._permission)) && !!this._templateRef);
  }
  ngOnDestroy(): void {
    if (this._userChangedSubscription) {
      this._userChangedSubscription.unsubscribe();
    }
  }
}
