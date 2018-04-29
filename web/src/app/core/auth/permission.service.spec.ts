/* tslint:disable:no-unused-variable */
import { RefactorxPermissionService } from './permission.service';
import { RefactorxUserService } from './user.service';
import { RefactorxJwtTokenService } from './jwt-token.service';
import { RefactorxStorageService } from '../common/storage.service';
import { RefactorxBase64Service } from './base64.service';
import { RefactorxUserTokenStoreService } from './user-token-store.service';

import { inject, TestBed } from '@angular/core/testing';

class MockAnonymousUserService extends RefactorxUserService {
  constructor(
    storage: RefactorxMockStorageService) {
    super(storage, new RefactorxJwtTokenService(new RefactorxBase64Service()), new RefactorxUserTokenStoreService(storage));
  }

  get isLoggedIn() { return false; }
}

class RefactorxMockStorageService extends RefactorxStorageService {
  private _map: any = {};
  setItem(key: string, data: string): void {
    this._map[key] = data;
  }
  getItem(key: string): any {
    return this._map[key];
  }
}

describe('RefactorxPermissionService', function () {
  beforeEach(() => {
    let userService = new MockAnonymousUserService(new RefactorxMockStorageService());
    let permissionService = new RefactorxPermissionService(userService);
    TestBed.configureTestingModule({
      providers: [
        { provide: RefactorxPermissionService, useValue: permissionService }
      ]
    });
  });
  it('when empty', inject([RefactorxPermissionService], (permissionService: RefactorxPermissionService) => {
    expect(permissionService.check('')).toBe(true, 'should return true for empty string');
    expect(permissionService.check(' ')).toBe(true, 'should return true for empty string with spaces');
    expect(permissionService.check(null)).toBe(true, 'should return true for null string');
  }));
  it('when requires ?', inject([RefactorxPermissionService], (permissionService: RefactorxPermissionService) => {
    expect(permissionService.check('?')).toBe(true);
  }));
  it('when requires !', inject([RefactorxPermissionService], (permissionService: RefactorxPermissionService) => {
    expect(permissionService.check('!')).toBe(false, 'should reject');
  }));
});
