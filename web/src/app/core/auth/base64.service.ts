import { Injectable } from '@angular/core';

@Injectable()
export class RefactorxBase64Service {

  constructor() { }

  decode(str: string): string {
    let output = str.replace(/-/g, '+').replace(/_/g, '/');
    switch (output.length % 4) {
      case 0:
        break;
      case 2:
        output += '==';
        break;
      case 3: output += '=';
        break;
      default:
        throw new Error('Illegal base64url string!');
    }

    return typeof window === 'undefined' ? this.b64DecodeUnicode(output, true) : this.b64DecodeUnicode(output, false);
  }

  b64DecodeUnicode(str: string, win: boolean) {
    if (win) {
      return decodeURIComponent(window.atob(str).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
    } else {
      return decodeURIComponent(atob(str).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
    }
  }
}
