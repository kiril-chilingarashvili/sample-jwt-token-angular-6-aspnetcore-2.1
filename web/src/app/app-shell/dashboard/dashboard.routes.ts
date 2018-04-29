import { Route } from '@angular/router';

import { RefactorxPermissionGuard } from 'app/core';

import {
  RefactorxDashboardComponent
} from './';

export const dashboardRoute: Route = {
  path: 'dashboard',
  data: {
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
};
