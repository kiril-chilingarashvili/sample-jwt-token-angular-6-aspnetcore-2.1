import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { RefactorxAppTitleService } from './app-title.service';
import {
  RefactorxApiService,
  RefactorxUserService,
  RefactorxStorage,
  RefactorxStorageService
} from 'app/core';
import { Router } from '@angular/router';

class RefactorxAppComponentStorage {
  public sidenavOpened = true;
}

@Component({
  selector: 'refactorx-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class RefactorxAppComponent implements OnInit, OnDestroy, AfterViewInit {
  private _storage: RefactorxStorage<RefactorxAppComponentStorage>;
  private _loadingChangedSubscription: Subscription;
  private _userChangedSubscription: Subscription;
  private _loggedOutSubscription: Subscription;
  private _username = '';
  private _defaultAppName = 'sample-jwt-token-angular-6-aspnetcore-2.1';
  private _title = 'sample-jwt-token-angular-6-aspnetcore-2.1';
  public get title(): string {
    return this._title;
  }
  public get $username(): string {
    return this._username;
  }
  public get $fullName(): string {
    return this._userService.isLoggedIn ? this._userService.data.fullName : '';
  }
  private _isLoading = false;
  public get $isLoading() {
    return this._isLoading;
  }

  constructor(
    private _router: Router,
    private _appTitleService: RefactorxAppTitleService,
    private _userService: RefactorxUserService,
    private _apiService: RefactorxApiService,
    private _storageService: RefactorxStorageService) {
    let loadStorage = () => this._storage = this._storageService.storage('RefactorxAppComponent', new RefactorxAppComponentStorage());
    loadStorage();
    this._setTitle(this._defaultAppName);
    this._loadingChangedSubscription = this._apiService.loadingChanged.pipe(
      debounceTime(100)).subscribe(data => {
        this._isLoading = data.isLoading;
      });
    this._isLoading = false;
    this._userChangedSubscription = this._userService.userChanged.subscribe(() => {
      this._setUsername();
      loadStorage();
    });
    this._loggedOutSubscription = this._userService.loggedOut.subscribe(() => {
      this._router.navigate(['/login']);
    });
    this._setUsername();
  }
  private _setTitle(title: string) {
    this._appTitleService.setTitle(title);
    this._title = title;
  }
  private _setUsername() {
    let username = '';
    if (this._userService.isLoggedIn && this._userService.data) {
      username = this._userService.data.username;
    }
    this._username = username;
  }
  ngAfterViewInit() {
  }
  ngOnInit() {
  }
  ngOnDestroy() {
    this._loadingChangedSubscription.unsubscribe();
    this._userChangedSubscription.unsubscribe();
    this._loggedOutSubscription.unsubscribe();
  }
}
