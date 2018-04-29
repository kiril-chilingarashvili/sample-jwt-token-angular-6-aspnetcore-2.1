import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { RefactorxApiService } from './api';
import { RefactorxPermissionGuard, RefactorxPermissionDirective } from './auth';
import {
  RefactorxBase64Service, RefactorxJwtTokenService, RefactorxPermissionService,
  RefactorxUserTokenStoreService, RefactorxUserService
} from './auth';
import { RefactorxStorageService } from './common';
import { RefactorxRedirectComponent } from './routing';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule
  ],
  declarations: [
    RefactorxRedirectComponent,

    RefactorxPermissionDirective,
  ],
  exports: [
    RefactorxRedirectComponent,

    RefactorxPermissionDirective,
  ],
  entryComponents: [
  ],
  providers: [
  ]
})
export class RefactorxCoreModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: RefactorxCoreModule,
      // list here app wide singletons
      providers: [
        // singleton services
        RefactorxApiService,
        RefactorxBase64Service,
        RefactorxJwtTokenService,
        RefactorxPermissionService,
        RefactorxUserTokenStoreService,
        RefactorxUserService,

        RefactorxStorageService,

        // guards
        RefactorxPermissionGuard
      ],
    };
  }
}
