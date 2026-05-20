import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import Keycloak from 'keycloak-js';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private user$ = new BehaviorSubject<any>(null);
  private keycloak: Keycloak | null = null;

  init(keycloakConfig: any) {
    this.keycloak = new Keycloak(keycloakConfig);
    return this.keycloak.init({ onLoad: 'check-sso', pkceMethod: 'S256' }).then(authenticated => {
      if (authenticated) {
        this.user$.next(this.keycloak?.tokenParsed || null);
      }
      return authenticated;
    });
  }

  getToken() { return this.keycloak?.token; }
  isLoggedIn() { return !!this.keycloak?.authenticated; }
}
