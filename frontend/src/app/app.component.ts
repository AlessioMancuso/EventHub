import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  template: `
  <header style="background:#3f51b5;color:white;padding:12px;display:flex;justify-content:space-between;align-items:center;">
    <div>EventHub</div>
    <div>
      <button *ngIf="!logged" (click)="login()">Login</button>
      <button *ngIf="logged" (click)="logout()">Logout</button>
    </div>
  </header>
  <main style="padding:16px"><router-outlet></router-outlet></main>
  `
})
export class AppComponent implements OnInit{
  logged = false;
  constructor(private auth: AuthService) {}
  ngOnInit(){
    const cfg = (window as any)['KEYCLOAK_CONFIG'] || null;
    if (cfg) {
      this.auth.init(cfg).then(ok => this.logged = !!ok);
    }
  }
  login(){ this.auth.login(); }
  logout(){ this.auth.logout(); this.logged = false; }
}
