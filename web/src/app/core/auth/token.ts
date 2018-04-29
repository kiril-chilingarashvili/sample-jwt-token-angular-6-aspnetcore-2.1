export class RefactorxToken {
  id: string = null;
  username: string = null;
  fullName: string = null;
  roles = new Set<string>();
  claims = new Set<string>();

  valid = false;

  public get language(): string {
    return 'en';
  }

  constructor(header: any, payload: any) {
      if (header && payload && header.typ === 'JWT' && payload.sub) {
          this.valid = true;
          this.id = payload.sub;
          this.username = payload.sub;
          this.fullName = payload.FullName;
          // TODO: populate roles and claims
      }
  }
}
