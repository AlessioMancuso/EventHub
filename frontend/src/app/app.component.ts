import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  template: `
  <mat-toolbar class="topbar">
    <div class="brand">
      <div class="logo">EH</div>
      <div class="brand-text">
        <div class="title">EventHub</div>
        <div class="subtitle">Piattaforma eventi professionale</div>
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
    <div class="hero-ambient" aria-hidden="true"></div>
    <div class="page-container"><router-outlet></router-outlet></div>
  </main>
  `,
  styles:[`.topbar{display:flex;align-items:center;padding:0 24px;min-height:76px;} .brand{display:flex;align-items:center;gap:14px;} .logo{width:48px;height:48px;border-radius:16px;background:rgba(92,124,250,0.16);display:flex;align-items:center;justify-content:center;font-size:0.95rem;font-weight:700;color:#f5f7ff;letter-spacing:0.14em;text-transform:uppercase;} .brand-text .title{font-size:1rem;font-weight:700;line-height:1.1;} .brand-text .subtitle{font-size:0.82rem;opacity:0.72;color:rgba(245,247,255,0.78);} .spacer{flex:1 1 auto;} nav{display:flex;align-items:center;gap:10px;flex-wrap:wrap;} a[mat-button]{color:rgba(255,255,255,0.88);} .active-link{color:var(--accent) !important;} button.mat-flat-button, button.mat-stroked-button{height:38px;} .app-shell{position:relative;min-height:calc(100vh - 76px);} .page-container{position:relative;z-index:1;}`]
})
export class AppComponent implements OnInit {
  constructor(public auth: AuthService, private router: Router) {}
  ngOnInit() { this.auth.loadSession(); }
  logout() { this.auth.logout(); this.router.navigate(['/login']); }
}
