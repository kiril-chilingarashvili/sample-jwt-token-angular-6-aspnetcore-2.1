import { Routes, RouterModule } from '@angular/router';

import { RefactorxPermissionGuard, RefactorxRedirectComponent } from 'app/core';
import { RefactorxNotFoundComponent } from './not-found.component';
import { RefactorxDashboardComponent, RefactorxLoginComponent, RefactorxLogoutComponent } from './app-shell';

export const appRoutes: Routes = [
  {
    path: 'login',
    component: RefactorxLoginComponent,
    canActivate: [RefactorxPermissionGuard],
    data: {
      permission: '?'
    }
  },
  {
    path: 'logout',
    component: RefactorxLogoutComponent,
    canActivate: [RefactorxPermissionGuard],
    data: {
      permission: '!'
    }
  },
  {
    path: 'dashboard',
    data: {
      breadcrumbs: true,
      title: 'dashboard',
      permission: '!'
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: RefactorxDashboardComponent,
        canActivate: [RefactorxPermissionGuard],
        data: {
          permission: '!'
        },
      },
    ]
  },
  {
    path: '',
    pathMatch: 'full',
    component: RefactorxRedirectComponent,
    data: {
      redirectTo: [
        { permission: '?', target: 'login' },
        { target: 'dashboard' }
      ]
    }
  },
  {
    path: '**',
    component: RefactorxNotFoundComponent
  }
];

export const appRoutingProviders: any[] = [

];

export const routing = RouterModule.forRoot(appRoutes);
