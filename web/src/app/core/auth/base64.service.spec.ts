import { TestBed, inject } from '@angular/core/testing';

import { RefactorxBase64Service } from './base64.service';

describe('Base64Service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RefactorxBase64Service]
    });
  });

  it('should be created', inject([RefactorxBase64Service], (service: RefactorxBase64Service) => {
    expect(service).toBeTruthy();
  }));
});
