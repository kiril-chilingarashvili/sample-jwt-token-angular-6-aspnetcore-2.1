import { Injectable } from '@angular/core';

import { RefactorxBase64Service } from './base64.service';
import { RefactorxToken } from './token';

@Injectable()
export class RefactorxJwtTokenService {

    constructor(private _base64Service: RefactorxBase64Service) { }

    decryptJwt(token: string): RefactorxToken {
        if (token) {
            let index = token.indexOf('.');
            let headerData = '';
            let payloadData = '';
            if (index > 0) {
                headerData = token.substring(0, index);
                token = token.substring(index + 1);

                index = token.indexOf('.');
                if (index > 0) {
                    payloadData = token.substring(0, index);
                }
            }

            let decode = (input: any) => {
                if (input) {
                    input = input.replace('-', '+'); // 62nd char of encoding
                    input = input.replace('_', '/'); // 63rd char of encoding
                }
                return this._base64Service.decode(input);
            };
            if (headerData && payloadData) {
                while (headerData.length % 4) {
                    headerData += '=';
                }
                headerData = headerData.replace(/\-/g, '+');
                while (payloadData.length % 4) {
                    payloadData += '=';
                }

                payloadData = payloadData.replace(/\-/g, '+');
                let headerString = decode(headerData);
                let payloadString = decode(payloadData);
                if (headerString && payloadString) {
                    const result = new RefactorxToken(JSON.parse(headerString), JSON.parse(payloadString)); // decrypting token
                    return result;
                }
            }
        }
        return null;
    }
}
