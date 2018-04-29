import { Component } from '@angular/core';
import { Router } from '@angular/router';

import {
  RefactorxUserService,
  RefactorxStorageService,
  RefactorxApiService
} from 'app/core';

@Component({
  selector: 'refactorx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class RefactorxLoginComponent {
  private _error = '';
  public get $error(): string {
    return this._error;
  }
  private _data = { username: '', password: '' };
  public get $data(): any {
    return this._data;
  }

  constructor(
    private _userService: RefactorxUserService,
    private _router: Router,
    private _apiService: RefactorxApiService,
    private _storageService: RefactorxStorageService
  ) {
    this._data.password = this._storageService.getItem('username');
  }

  public $login() {
    this._error = null;
    this._apiService.login(this._data.username, this._data.password)
      .toPromise().then(
        () => {
          if (this._userService.isLoggedIn) {
            this._storageService.setItem('username', this._data.username);
            return this._router.navigate(['']);
          } else {
            throw new Error('Username and password does not match');
          }
        },
        (error) => {
          this._error = <any>error;
          throw new Error(error);
        });
  }
}
