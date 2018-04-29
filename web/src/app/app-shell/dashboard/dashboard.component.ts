import { Component } from '@angular/core';
import { RefactorxApiService } from 'app/core';

@Component({
  selector: 'refactorx-dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss']
})

export class RefactorxDashboardComponent {
  private _result: any;
  public get $result(): any {
    return this._result;
  }
  constructor(private _apiService: RefactorxApiService) {
  }
  public async $request() {
    this._result = await this._apiService.get('api/secured');
    console.log('this._result', this._result);
  }
}
