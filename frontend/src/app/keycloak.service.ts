import { Injectable } from '@angular/core';
import Keycloak, { KeycloakInstance } from 'keycloak-js';

const KEYCLOAK_CONFIG = {
  url: 'http://localhost:8080',
  realm: 'master',
  clientId: 'eventhub-client'
};

@Injectable({ providedIn: 'root' })
export class KeycloakService {
  private keycloak?: KeycloakInstance;

  init(): Promise<boolean> {
    if (!this.keycloak) {
      this.keycloak = new Keycloak(KEYCLOAK_CONFIG);
    }
    return this.keycloak.init({
      onLoad: 'check-sso',
      pkceMethod: 'S256',
      flow: 'standard'
    });
  }

  login(): Promise<void> {
    if (!this.keycloak) {
      return this.init().then((authenticated) => {
        if (!authenticated) {
          return this.keycloak?.login();
        }
      });
    }
    return this.keycloak.login();
  }

  logout(): Promise<void> {
    return this.keycloak?.logout() as Promise<void>;
  }

  getToken(): string | undefined {
    return this.keycloak?.token;
  }

  isAuthenticated(): boolean {
    return !!this.keycloak?.authenticated;
  }
}
