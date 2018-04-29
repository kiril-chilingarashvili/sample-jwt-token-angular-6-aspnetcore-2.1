import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Injectable()
export class RefactorxAppTitleService {

    constructor(private _title: Title) { }

    public setTitle(title: string) {
        this._title.setTitle(title);
    }
}
