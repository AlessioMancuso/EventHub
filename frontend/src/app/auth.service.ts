import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private user$ = new BehaviorSubject<any>(null);
  private tokenKey = 'eventhub_access_token';
  private refreshKey = 'eventhub_refresh_token';

  loadSession() {
    const token = localStorage.getItem(this.tokenKey);
    const refresh = localStorage.getItem(this.refreshKey);
    if (token) {
      this.user$.next(this.decodeToken(token));
    }
    return !!token && !!refresh;
  }

  setSession(tokens: any) {
    localStorage.setItem(this.tokenKey, tokens.access_token);
    if (tokens.refresh_token) {
      localStorage.setItem(this.refreshKey, tokens.refresh_token);
    }
    this.user$.next(this.decodeToken(tokens.access_token));
  }

  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn() {
    return !!this.getToken();
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshKey);
    this.user$.next(null);
  }

  getUserRole() {
    return this.user$.value?.role || 'user';
  }

  isAdmin() {
    return this.getUserRole() === 'admin';
  }

  isOrganizer() {
    const role = this.getUserRole();
    return role === 'organizer' || role === 'admin';
  }

  getUserObservable() {
    return this.user$.asObservable();
  }

  private decodeToken(token: string) {
    try {
      const payload = token.split('.')[1];
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      const decoded = JSON.parse(decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')));
      return decoded;
    } catch {
      return null;
    }
  }
}
