import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin-panel',
  template: `
  <mat-card>
    <h2>Admin</h2>
    <h3>Utenti</h3>
    <table class="full-width admin-table">
      <thead>
        <tr><th>Email</th><th>Ruolo</th><th>Bannato</th><th>Azioni</th></tr>
      </thead>
      <tbody>
        <tr *ngFor="let u of users">
          <td>{{u.email}}</td>
          <td>{{u.role}}</td>
          <td>{{u.banned ? 'Sì' : 'No'}}</td>
          <td>
            <button mat-button color="warn" (click)="ban(u.id)" [disabled]="u.banned">Ban</button>
            <button mat-button color="primary" (click)="promote(u.id)" [disabled]="u.role==='organizer' || u.role==='admin'">Promuovi</button>
          </td>
        </tr>
      </tbody>
    </table>

    <h3>Recensioni segnalate</h3>
    <mat-list>
      <mat-list-item *ngFor="let review of flaggedReviews">
        <div>
          <div><strong>Evento:</strong> {{review.event_id}}</div>
          <div>{{review.comment}}</div>
        </div>
        <div>
          <button mat-button color="primary" (click)="approve(review.id)">Approva</button>
          <button mat-button color="warn" (click)="remove(review.id)">Elimina</button>
        </div>
      </mat-list-item>
    </mat-list>
  </mat-card>
  `,
  styles:[".full-width{width:100%;margin-bottom:16px;}mat-list-item{display:flex;justify-content:space-between;align-items:center;}" ]
})
export class AdminPanelComponent implements OnInit {
  users: any[] = [];
  flaggedReviews: any[] = [];

  constructor(private api: ApiService, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.loadUsers();
    this.loadFlagged();
  }

  loadUsers() { this.api.adminUsers().subscribe((list:any)=> this.users = list); }
  loadFlagged() { this.api.flaggedReviews().subscribe((list:any)=> this.flaggedReviews = list); }

  ban(userId:number) { this.api.banUser(userId).subscribe({ next: () => { this.snackBar.open('Utente bannato', 'Chiudi', { duration: 2000 }); this.loadUsers(); } }); }
  promote(userId:number) { this.api.promoteUser(userId).subscribe({ next: () => { this.snackBar.open('Utente promosso', 'Chiudi', { duration: 2000 }); this.loadUsers(); } }); }
  approve(reviewId:number) { this.api.approveReview(reviewId).subscribe({ next: () => { this.snackBar.open('Recensione approvata', 'Chiudi', { duration: 2000 }); this.loadFlagged(); } }); }
  remove(reviewId:number) { this.api.deleteReview(reviewId).subscribe({ next: () => { this.snackBar.open('Recensione eliminata', 'Chiudi', { duration: 2000 }); this.loadFlagged(); } }); }
}
