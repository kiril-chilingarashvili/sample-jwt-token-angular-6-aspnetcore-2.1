import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { RefactorxUserService } from 'app/core';

@Component({
  template: ''
})
export class RefactorxLogoutComponent {
  constructor(
    userService: RefactorxUserService,
    router: Router) {
      userService.logout();
      router.navigate(['/']);
  }
}
