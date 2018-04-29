import { Injectable } from '@angular/core';

import { RefactorxUserService } from './user.service';

@Injectable()
export class RefactorxPermissionService {

  constructor(private _userService: RefactorxUserService) { }

  /**
   * checks auth status section in permission string
   * sample: !xx | ?xx | *xx
   * @param permission pemission string
   */
  private _checkAuthStatus(permission: string) {
    if (permission && permission.length > 0) {
      let auth = permission[0];
      switch (auth) {
        case '!':
          if (!this._userService.isLoggedIn) {
            return false;
          }
          break;
        case '?':
          if (this._userService.isLoggedIn) {
            return false;
          }
          break;
        case '*':
          return true;
      }
    }

    return true;
  }
  /**
   * checks roles section in permission string
   * sample: xr(role1,role2)xx
   * @param permission pemission string
   */
  private _checkRoleStatus(permission: string) {
    if (permission && permission.length > 0) {
      let regex = new RegExp('r\\([^\\)]*\\)');
      let matches = regex.exec(permission);
      if (matches && matches.length) {
        if (this._userService.isLoggedIn) {
          for (let matchIndex = 0; matchIndex < matches.length; matchIndex++) {
            let match = matches[matchIndex];
            if (match && match.length > 3) {
              let subMatchData = match.substr(2, match.length - 3);
              let roles = subMatchData.split(',');
              if (roles) {
                for (let index = 0; index < roles.length; index++) {
                  let role = roles[index].trim();
                  if (this._userService.data.roles.has(role)) {
                    return true;
                  }
                }
              }
            }
          }
        }
        return false;
      }
    }
    return true;
  }
  /**
   * checks claims section in permission string
   * sample: xc(claim1,claim2)xx
   * @param permission pemission string
   */
  private _checkClaimStatus(permission: string) {
    if (permission && permission.length > 0) {
      let regex = new RegExp('c\\([^\\)]*\\)');
      let matches = regex.exec(permission);
      if (matches && matches.length) {
        if (this._userService.isLoggedIn) {
          for (let matchIndex = 0; matchIndex < matches.length; matchIndex++) {
            let match = matches[matchIndex];
            if (match && match.length > 3) {
              let subMatchData = match.substr(2, match.length - 3);
              let claims = subMatchData.split(',');
              if (claims) {
                for (let index = 0; index < claims.length; index++) {
                  let claim = claims[index].trim();
                  if (this._userService.data.claims.has(claim)) {
                    return true;
                  }
                }
              }
            }
          }
        }
        return false;
      }
    }
    return true;
  }

  /**
   * returns true when permission string passes check against surrent auth info
   * @param permission pemission string
   */
  public check(permission: string): boolean {
    // console.log(permission);
    let result = this._checkAuthStatus(permission) && this._checkRoleStatus(permission) && this._checkClaimStatus(permission);
    // console.log('Checking permission ', permission, ' result is ', result);
    return result;
  }
}
