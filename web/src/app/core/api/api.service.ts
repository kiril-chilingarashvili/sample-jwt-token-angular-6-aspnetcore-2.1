import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, ResponseContentType } from '@angular/http';

import { Subject, Observable, empty, concat, throwError } from 'rxjs';
import { map, flatMap, catchError, finalize } from 'rxjs/operators';

import { RefactorxUserService } from 'app/core/auth/user.service';

export interface RefactorxApiOptions {
  blob?: boolean;
  noauth?: boolean;
}

@Injectable()
export class RefactorxApiService {

  // private variables
  private _refreshObservable: Observable<any>;
  private _loadingCount = 0;
  private _isLoading = false;
  private _loadingChangedSource = new Subject<any>();
  // public events
  loadingChanged = this._loadingChangedSource.asObservable();

  constructor(
    private _http: Http,
    private _userService: RefactorxUserService
  ) {
  }

  // private
  private _throwError(error: any): Observable<Response> {
    this._refreshObservable = null;
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return throwError(errMsg);
  }
  private _handleError(error: any, continuation: () => Observable<Response>): Observable<Response> {
    if (error &&
      error.status &&
      error.status.toString() === '401' &&
      error.headers.get('WWW-Authenticate') &&
      error.headers.get('WWW-Authenticate').startsWith('Bearer error="invalid_token"')) {
      let refreshToken = this._userService.refreshToken;
      if (refreshToken) {
        let observable = this._refreshObservable;
        if (!observable) {
          observable = this.refreshToken(refreshToken);
          this._refreshObservable = observable;
        }
        return observable.pipe(flatMap(() => {
          // console.log('refresh token responded ok with', result);
          this._refreshObservable = null;
          return continuation();
        }), catchError(this._throwError));
      }
    }
    return this._throwError(error);
  }
  private _options(options?: RefactorxApiOptions): RequestOptions {
    let headers: { [key: string]: any; } = {
      'Content-Type': 'application/json'
    };
    let auth = true;
    if (options && options.noauth) {
      auth = false;
    }
    let token = this._userService.token;
    if (token && auth) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    let opt = new RequestOptions({
      headers: new Headers(headers)
    });
    if (token && auth) {
      opt.withCredentials = true;
    }
    if (options) {
      if (options.blob) {
        opt.responseType = ResponseContentType.Blob;
      }
    }
    return opt;
  }
  private _fireLoadingChanged(isLoading: boolean) {
    if (this._isLoading !== isLoading) {
      this._isLoading = isLoading;
      this._loadingChangedSource.next({ isLoading: isLoading });
    }
  }
  private _increment() {
    this._loadingCount++;
    this._fireLoadingChanged(this._loadingCount !== 0);
    // console.log(`this._loadingCount: ${this._loadingCount}`);
  }
  private _decrement() {
    this._loadingCount--;
    this._fireLoadingChanged(this._loadingCount !== 0);
    // console.log(`this._loadingCount: ${this._loadingCount}`);
  }
  private _getApiUrl(): string {
      return '/api';
  }
  private _getLoginUrl(): string {
    return this._getApiUrl() + '/auth/login';
}
  public login(
    username: string,
    password: string): Observable<any> {
    return this._http.post(
      this._getLoginUrl(), {
        username: username,
        password: password
      },
      { headers: new Headers({ 'Content-Type': 'application/json' }) }
    ).pipe(
      map((res: Response) => {
        let result = res.json() || {};
        // console.log('login result received', result);
        this._userService.setToken(result.access_token);
        this._userService.setRefreshToken(result.refresh_token);
        return result;
      }),
      catchError(error =>
        this._throwError(error)
      ));
  }
  public refreshToken(refreshToken: string): Observable<any> {
    return this._http.post(
      this._getLoginUrl(), {
        refreshToken: refreshToken
      },
      { headers: new Headers({ 'Content-Type': 'application/json' }) }
    ).pipe(
      map((res: Response) => {
        let result = res.json() || {};

        // console.log('login result received', result);
        this._userService.setToken(result.access_token);
        this._userService.setRefreshToken(result.refresh_token);

        return result;
      }),
      catchError(error => {
        if (error &&
          error.status &&
          error.status.toString() === '401') {
          this._userService.logout();
        }
        return this._throwError(error);
      }
      ));
  }
  public baseApiUrl(): string {
    return '/';
  }
  public get<T>(url: string): Promise<T> {
    return this.getRaw(url)
      .toPromise()
      .then(res => {
        return res.json();
      });
  }
  public getRaw(url: string, options?: RefactorxApiOptions): Observable<Response> {
    let retry = () => this._http.get(url, this._options(options)).pipe(
      catchError(error =>
        this._throwError(error)
      ));
    let s1 = empty().pipe(finalize(() => {
      this._increment();
      // console.log('api get starting', url);
    }));
    let s2 = this._http.get(url, this._options(options)).pipe(
      catchError(error =>
        this._handleError(error, retry)
      ), finalize(() => {
        this._decrement();
        // console.log('api get done', url);
      }));
    return concat(s1, s2);
  }
  public post<T>(url: string, body: any): Promise<T> {
    return this.postRaw(url, body)
      .toPromise()
      .then(res => {
        return res.json();
      });
  }
  public postRaw(url: string, data: any, options?: RefactorxApiOptions): Observable<Response> {
    let body = JSON.stringify(data); // post stringified content

    let retry = () => this._http.post(url, body, this._options(options)).pipe(
      catchError(error =>
        this._throwError(error)
      ));
    return concat(
        empty().pipe(finalize(() => {
          this._increment();
          // console.log('api post starting', url);
        })),
        this._http.post(url, body, this._options(options)).pipe(
          catchError(error =>
            this._handleError(error, retry)
          ), finalize(() => {
            this._decrement();
            // console.log('api post done', url);
          })));
  }
  public request(
    request: () => Observable<any>,
    extractData: (response: any) => any,
    extractError: (error: any) => any): Observable<any> {
    let retry = () => request().pipe(
      map(extractData),
      catchError(error =>
        this._throwError(extractError(error))
      ));
    return concat(
      empty().pipe(finalize(() => {
        this._increment();
        // console.log('api request starting', name);
      })),
      request().pipe(
        map(extractData),
        catchError(error =>
          this._handleError(extractError(error), retry)
        ), finalize(() => {
          this._decrement();
          // console.log('api request done', name);
        })));
  }
}
