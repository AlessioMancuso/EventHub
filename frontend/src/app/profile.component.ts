import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-profile',
  template: `
  <mat-card>
    <h2>Profilo</h2>
    <form [formGroup]="profileForm" (ngSubmit)="updateProfile()">
      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Email</mat-label>
        <input matInput formControlName="email" type="email">
      </mat-form-field>
      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Nome</mat-label>
        <input matInput formControlName="name" type="text">
      </mat-form-field>
      <button mat-raised-button color="primary" type="submit">Salva profilo</button>
    </form>

    <h3>Cambia password</h3>
    <form [formGroup]="passwordForm" (ngSubmit)="changePassword()">
      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Password corrente</mat-label>
        <input matInput formControlName="old_password" type="password" required>
      </mat-form-field>
      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Nuova password</mat-label>
        <input matInput formControlName="new_password" type="password" required>
      </mat-form-field>
      <button mat-raised-button color="accent" type="submit" [disabled]="passwordForm.invalid">Cambia password</button>
    </form>
  </mat-card>
  `,
  styles:[`.full-width{width:100%;}`]
})
export class ProfileComponent implements OnInit {
  profileForm = this.fb.group({ email: ['', [Validators.required, Validators.email]], name: [''] });
  passwordForm = this.fb.group({ old_password: ['', Validators.required], new_password: ['', Validators.required] });

  constructor(private fb: FormBuilder, private api: ApiService, private auth: AuthService, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.api.me().subscribe((user:any) => {
      this.profileForm.patchValue({ email: user.email, name: user.name });
    });
  }

  updateProfile() {
    if (this.profileForm.invalid) {
      return;
    }
    this.api.updateProfile(this.profileForm.value).subscribe({
      next: () => this.snackBar.open('Profilo aggiornato', 'Chiudi', { duration: 2000 }),
      error: err => this.snackBar.open(err.error?.message || 'Errore aggiornamento', 'Chiudi', { duration: 3000 })
    });
  }

  changePassword() {
    if (this.passwordForm.invalid) {
      return;
    }
    this.api.changePassword(this.passwordForm.value).subscribe({
      next: () => {
        this.snackBar.open('Password cambiata', 'Chiudi', { duration: 2000 });
        this.passwordForm.reset();
      },
      error: err => this.snackBar.open(err.error?.message || 'Errore password', 'Chiudi', { duration: 3000 })
    });
  }
}
