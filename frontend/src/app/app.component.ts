import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  template: `
  <mat-toolbar class="topbar">
    <div class="brand">
      <span class="logo">EH</span>
      <div class="brand-text">
        <div class="title">EventHub</div>
        <div class="subtitle">Eventi premium, gestione intelligente.</div>
      </div>
    </div>
    <span class="spacer"></span>
    <nav>
      <a mat-button routerLink="/" routerLinkActive="active-link" [routerLinkActiveOptions]="{ exact: true }">Home</a>
      <a mat-button routerLink="/my/registrations" *ngIf="auth.isLoggedIn()" routerLinkActive="active-link">I miei biglietti</a>
      <a mat-button routerLink="/my/profile" *ngIf="auth.isLoggedIn()" routerLinkActive="active-link">Profilo</a>
      <a mat-button routerLink="/organizer" *ngIf="auth.isOrganizer()" routerLinkActive="active-link">Organizzatore</a>
      <a mat-button routerLink="/admin" *ngIf="auth.isAdmin()" routerLinkActive="active-link">Admin</a>
      <button mat-stroked-button color="accent" *ngIf="!auth.isLoggedIn()" routerLink="/login">Login</button>
      <button mat-flat-button color="accent" *ngIf="!auth.isLoggedIn()" routerLink="/register">Registrati</button>
      <button mat-button *ngIf="auth.isLoggedIn()" (click)="logout()">Esci</button>
    </nav>
  </mat-toolbar>
  <main class="app-shell">
    <div class="page-container"><div class="hero-ambient" aria-hidden="true"></div><router-outlet></router-outlet></div>
  </main>
  `,
  styles:[`.topbar{display:flex;align-items:center;padding:0 28px;min-height:72px;} .brand{display:flex;align-items:center;gap:14px;font-weight:600;} .logo{width:46px;height:46px;background:rgba(255,255,255,0.18);border-radius:16px;display:flex;align-items:center;justify-content:center;font-size:1.05rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;} .brand-text .title{font-size:1rem;line-height:1.2;} .brand-text .subtitle{font-size:0.82rem;opacity:0.78;} .spacer{flex:1 1 auto;} nav{display:flex;align-items:center;flex-wrap:wrap;gap:10px;} a[mat-button]{color:rgba(255,255,255,0.88);} .active-link{color:#ffeb3b;} .app-shell{padding:30px 0 42px;min-height:calc(100vh - 72px);} .page-container{max-width:1180px;margin:auto;}`]
})
export class AppComponent implements OnInit {
  constructor(public auth: AuthService, private router: Router) {}
  ngOnInit() { this.auth.loadSession(); }
  logout() { this.auth.logout(); this.router.navigate(['/login']); }
}
