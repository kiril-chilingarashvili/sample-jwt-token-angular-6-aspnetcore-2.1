import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { routing, appRoutingProviders } from './app.routing';
import { RefactorxAppComponent } from './app.component';
import { RefactorxNotFoundComponent } from './not-found.component';
import { RefactorxAppTitleService } from './app-title.service';

// app module components
import { RefactorxCoreModule } from 'app/core';
import {
  RefactorxDashboardComponent,
  RefactorxLoginComponent,
  RefactorxLogoutComponent,
} from './app-shell';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    RouterModule,

    routing,

    RefactorxCoreModule.forRoot(),
  ],
  declarations: [
    RefactorxAppComponent,
    RefactorxNotFoundComponent,

    RefactorxDashboardComponent,
    RefactorxLoginComponent,
    RefactorxLogoutComponent
  ],
  providers: [
    appRoutingProviders,
    RefactorxAppTitleService,
  ],
  bootstrap: [RefactorxAppComponent]
})
export class RefactorxAppModule {
  constructor() {
  }
}
