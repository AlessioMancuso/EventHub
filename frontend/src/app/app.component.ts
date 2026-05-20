import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  template: `
  <mat-toolbar color="primary">
    <span>EventHub</span>
    <span class="spacer"></span>
    <a mat-button routerLink="/">Home</a>
    <a mat-button routerLink="/my/registrations" *ngIf="auth.isLoggedIn()">I miei biglietti</a>
    <a mat-button routerLink="/my/profile" *ngIf="auth.isLoggedIn()">Profilo</a>
    <a mat-button routerLink="/organizer" *ngIf="auth.isOrganizer()">Organizzatore</a>
    <a mat-button routerLink="/admin" *ngIf="auth.isAdmin()">Admin</a>
    <button mat-button *ngIf="!auth.isLoggedIn()" routerLink="/login">Login</button>
    <button mat-button *ngIf="!auth.isLoggedIn()" routerLink="/register">Registrati</button>
    <button mat-button *ngIf="auth.isLoggedIn()" (click)="logout()">Logout</button>
  </mat-toolbar>
  <main class="content"><router-outlet></router-outlet></main>
  `,
  styles:[`.spacer{flex:1 1 auto;} .content{padding:16px;}`]
})
export class AppComponent implements OnInit {
  constructor(public auth: AuthService, private router: Router) {}
  ngOnInit() { this.auth.loadSession(); }
  logout() { this.auth.logout(); this.router.navigate(['/login']); }
}
