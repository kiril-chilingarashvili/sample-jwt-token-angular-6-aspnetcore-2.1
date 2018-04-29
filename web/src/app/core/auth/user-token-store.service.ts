import { Injectable } from '@angular/core';

import { RefactorxStorageService } from 'app/core/common';

@Injectable()
export class RefactorxUserTokenStoreService {

    constructor(private _storageService: RefactorxStorageService) {

    }
    setToken(token: string): void {
        this._storageService.setItem('user-token-service-token', token);
    }
    getToken(): any {
        return this._storageService.getItem('user-token-service-token');
    }
    setRefreshToken(refreshToken: string): void {
        this._storageService.setItem('user-token-service-refresh-token', refreshToken);
    }
    getRefreshToken(): any {
        return this._storageService.getItem('user-token-service-refresh-token');
    }
}
