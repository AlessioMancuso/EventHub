import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  template: `
  <mat-card>
    <h2>Registrazione</h2>
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
      <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">Registrati</button>
      <button mat-button color="accent" routerLink="/login" type="button">Hai già un account?</button>
    </form>
  </mat-card>
  `,
  styles:[`.full-width{width:100%;}`]
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
