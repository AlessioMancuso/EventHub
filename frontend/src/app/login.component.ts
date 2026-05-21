import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { KeycloakService } from './keycloak.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  template: `
  <div class="auth-shell">
    <mat-card class="auth-card">
      <div class="auth-header">
        <div>
          <h1>Accedi a EventHub</h1>
          <p>Gestisci eventi, biglietti e profilo con un’interfaccia moderna e semplice.</p>
        </div>
      </div>
      <form [formGroup]="form" (ngSubmit)="submit()">
        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Email</mat-label>
          <input matInput formControlName="email" type="email" required>
        </mat-form-field>
        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Password</mat-label>
          <input matInput formControlName="password" type="password" required>
        </mat-form-field>
        <button mat-flat-button color="primary" class="auth-button" type="submit" [disabled]="form.invalid">Entra</button>
      </form>
      <div class="divider">oppure</div>
      <button mat-stroked-button color="accent" class="auth-button" (click)="loginWithKeycloak()">Accedi con Keycloak</button>
      <div class="auth-footer">
        <span>Non hai un account?</span>
        <button mat-button color="primary" routerLink="/register">Registrati</button>
      </div>
    </mat-card>
  </div>
  `,
  styles:[`.auth-shell{display:flex;justify-content:center;padding:36px 16px 24px;} .auth-card{width:100%;max-width:500px;padding:36px 34px;box-shadow:0 35px 90px rgba(15,23,42,.12);border:1px solid rgba(13,71,161,.08);} .auth-header h1{margin:0 0 10px;font-size:2.4rem;color:#0d47a1;} .auth-header p{margin:0 0 28px;color:rgba(15,23,42,.72);line-height:1.7;} .full-width{width:100%;} .auth-button{width:100%;margin-top:14px;min-height:52px;} .divider{margin:28px 0 18px;text-align:center;color:rgba(15,23,42,0.55);position:relative;font-size:.95rem;} .divider::before,.divider::after{content:'';position:absolute;top:50%;width:35%;height:1px;background:rgba(15,23,42,0.12);} .divider::before{left:0;} .divider::after{right:0;} .auth-footer{display:flex;justify-content:center;align-items:center;gap:10px;margin-top:20px;color:rgba(15,23,42,.7);} .auth-footer button{padding:0;min-width:auto;}`]
})
export class LoginComponent implements OnInit {
  form = this.fb.group({ email: ['', [Validators.required, Validators.email]], password: ['', Validators.required] });

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private auth: AuthService,
    private router: Router,
    private keycloak: KeycloakService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.tryCompleteKeycloakLogin();
  }

  private async tryCompleteKeycloakLogin() {
    try {
      const authenticated = await this.keycloak.init();
      if (authenticated) {
        const token = this.keycloak.getToken();
        if (token) {
          this.api.keycloak(token).subscribe({
            next: (res:any) => {
              this.auth.setSession(res);
              this.snackBar.open('Accesso Keycloak riuscito', 'Chiudi', { duration: 2000 });
              this.router.navigate(['/']);
            },
            error: err => {
              this.snackBar.open(err.error?.message || 'Errore login Keycloak', 'Chiudi', { duration: 4000 });
            }
          });
        }
      }
    } catch (error:any) {
      console.warn('Keycloak init failed', error);
    }
  }

  submit() {
    if (this.form.invalid) {
      return;
    }
    this.api.login(this.form.value).subscribe({
      next: (res:any) => {
        this.auth.setSession(res);
        this.snackBar.open('Accesso riuscito', 'Chiudi', { duration: 2000 });
        this.router.navigate(['/']);
      },
      error: err => {
        this.snackBar.open(err.error?.message || 'Errore login', 'Chiudi', { duration: 3000 });
      }
    });
  }

  async loginWithKeycloak() {
    try {
      const authenticated = await this.keycloak.init();
      if (!authenticated) {
        await this.keycloak.login();
        return;
      }
      const token = this.keycloak.getToken();
      if (!token) {
        this.snackBar.open('Token Keycloak non disponibile', 'Chiudi', { duration: 3000 });
        return;
      }
      this.api.keycloak(token).subscribe({
        next: (res:any) => {
          this.auth.setSession(res);
          this.snackBar.open('Accesso Keycloak riuscito', 'Chiudi', { duration: 2000 });
          this.router.navigate(['/']);
        },
        error: err => {
          this.snackBar.open(err.error?.message || 'Errore login Keycloak', 'Chiudi', { duration: 4000 });
        }
      });
    } catch (error:any) {
      this.snackBar.open(error?.message || 'Errore Keycloak', 'Chiudi', { duration: 4000 });
    }
  }
}
