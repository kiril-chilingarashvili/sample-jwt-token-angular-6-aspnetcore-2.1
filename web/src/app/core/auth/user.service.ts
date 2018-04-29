import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

import { RefactorxJwtTokenService } from './jwt-token.service';
import { RefactorxToken } from './token';
import { RefactorxUserTokenStoreService } from './user-token-store.service';
import { RefactorxStorageService } from 'app/core/common';


@Injectable()
export class RefactorxUserService {

    private _isLoggedIn = false;
    private _userChangedSource = new Subject();
    private _loggedOutSource = new Subject();
    private _data: RefactorxToken;
    private _token: string;
    private _refreshToken: string;

    userChanged = this._userChangedSource.asObservable();
    loggedOut = this._loggedOutSource.asObservable();

    constructor(
        private _storageService: RefactorxStorageService,
        private _jwtTokenService: RefactorxJwtTokenService,
        private _userTokenStoreService: RefactorxUserTokenStoreService
    ) {
        this._init();
    }

    // private
    private _init() {
        this.setToken(this._userTokenStoreService.getToken());
        this.setRefreshToken(this._userTokenStoreService.getRefreshToken());
    }
    private _notifyUserChanged() {
        this._userChangedSource.next({});
    }

    // public
    get data(): RefactorxToken { return this._data; }
    get token() { return this._token; }
    get refreshToken() { return this._refreshToken; }
    get isLoggedIn() { return this._isLoggedIn; }
    public setToken(token: string): void {
        let data = this._jwtTokenService.decryptJwt(token);
        if (data != null) {
            this._userTokenStoreService.setToken(token);
            this._data = data;
            this._token = token;
            this._isLoggedIn = true;
            // console.log('user service recieved new token', data);
        } else {
            this._userTokenStoreService.setToken(null);
            this._data = null;
            this._token = null;
            this._isLoggedIn = false;
            // console.log('user service recieved EMPTY token');
        }
        this._notifyUserChanged();
    }
    public setRefreshToken(refreshToken: string): void {
        this._userTokenStoreService.setRefreshToken(refreshToken);
        this._refreshToken = refreshToken;
    }
    public logout() {
        this.setToken(null);
        this.setRefreshToken(null);
        this._loggedOutSource.next({});
        this._storageService.clean();
    }
}
