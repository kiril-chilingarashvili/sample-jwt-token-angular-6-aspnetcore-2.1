import { Injectable } from '@angular/core';

export class RefactorxStorage<T> {
  private _data: T;
  public get data(): T {
    return this._data;
  }
  constructor(
    private _storageService: RefactorxStorageService,
    private _key: string,
    private _default: T) {
    this._load();
  }
  private _load() {
    let str = this._storageService.getItem(this._key);
    if (str) {
      this._data = JSON.parse(str);
    } else {
      this._data = this._default;
    }
  }
  public save() {
    this._storageService.setItem(this._key, JSON.stringify(this._data));
  }
}

@Injectable()
export class RefactorxStorageService {

  constructor() { }
  public storage<T>(key: string, defaultState: T = <T>{}): RefactorxStorage<T> {
    return new RefactorxStorage<T>(this, key, defaultState);
  }
  public setItem(key: string, data: string): void {
    localStorage.setItem(key, data);
  }
  public getItem(key: string): any {
    return localStorage.getItem(key);
  }
  public removeItem(key: string): any {
    return localStorage.removeItem(key);
  }
  public clean() {
    let excludedKeys = {
      username: ''
    };
    for (let i = localStorage.length - 1; i >= 0; i--) {
      let key = localStorage.key(i);
      if (excludedKeys[key]) {
        continue;
      }
      localStorage.removeItem(key);
    }
  }
}
