import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  template: `
  <div class="auth-shell">
    <mat-card class="auth-card">
      <div class="auth-header">
        <div>
          <h1>Inizia con EventHub</h1>
          <p>Crea il tuo account per gestire gli eventi in modo smart e professionale.</p>
        </div>
      </div>
      <form [formGroup]="form" (ngSubmit)="submit()">
        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Email</mat-label>
          <input matInput formControlName="email" type="email" required>
        </mat-form-field>
        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Nome</mat-label>
          <input matInput formControlName="name" type="text">
        </mat-form-field>
        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Password</mat-label>
          <input matInput formControlName="password" type="password" required>
        </mat-form-field>
        <button mat-flat-button color="primary" class="auth-button" type="submit" [disabled]="form.invalid">Crea account</button>
      </form>
      <div class="auth-footer">
        <span>Hai già un account?</span>
        <button mat-button color="primary" routerLink="/login">Accedi</button>
      </div>
    </mat-card>
  </div>
  `,
  styles:[`.auth-shell{display:flex;justify-content:center;padding:36px 16px 24px;} .auth-card{width:100%;max-width:500px;padding:36px 34px;box-shadow:0 35px 90px rgba(15,23,42,.12);border:1px solid rgba(13,71,161,.08);} .auth-header h1{margin:0 0 10px;font-size:2.4rem;color:#0d47a1;} .auth-header p{margin:0 0 28px;color:rgba(15,23,42,.72);line-height:1.7;} .full-width{width:100%;} .auth-button{width:100%;margin-top:14px;min-height:52px;} .auth-footer{display:flex;justify-content:center;align-items:center;gap:10px;margin-top:20px;color:rgba(15,23,42,.7);} .auth-footer button{padding:0;min-width:auto;}`]
})
export class RegisterComponent {
  form = this.fb.group({ email: ['', [Validators.required, Validators.email]], name: [''], password: ['', Validators.required] });

  constructor(private fb: FormBuilder, private api: ApiService, private auth: AuthService, private router: Router, private snackBar: MatSnackBar) {}

  submit() {
    if (this.form.invalid) {
      return;
    }
    this.api.register(this.form.value).subscribe({
      next: (res:any) => {
        this.auth.setSession(res);
        this.snackBar.open('Registrazione completata', 'Chiudi', { duration: 2000 });
        this.router.navigate(['/']);
      },
      error: err => {
        this.snackBar.open(err.error?.message || 'Errore registrazione', 'Chiudi', { duration: 3000 });
      }
    });
  }
}
