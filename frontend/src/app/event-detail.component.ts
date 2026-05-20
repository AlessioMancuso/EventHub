import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-event-detail',
  template: `
  <mat-card *ngIf="event">
    <img *ngIf="event.cover_image_url" [src]="event.cover_image_url" alt="cover" class="cover" />
    <mat-card-title>{{ event.title }}</mat-card-title>
    <mat-card-subtitle>{{ event.city }} - {{ event.start_datetime | date:'medium' }}</mat-card-subtitle>
    <mat-card-content>
      <p>{{ event.description }}</p>
      <p><strong>Luogo:</strong> {{ event.venue }}</p>
      <p><strong>Prezzo:</strong> €{{ event.price_cents / 100 }}</p>
      <p><strong>Posti:</strong> {{ event.capacity }}</p>
    </mat-card-content>
    <mat-card-actions>
      <button mat-raised-button color="primary" (click)="register()" *ngIf="auth.isLoggedIn() && !registered">Iscriviti</button>
      <button mat-button color="warn" (click)="unregister()" *ngIf="auth.isLoggedIn() && registered">Disiscriviti</button>
    </mat-card-actions>
  </mat-card>

  <mat-card *ngIf="auth.isLoggedIn()">
    <h3>Recensioni</h3>
    <div *ngFor="let r of reviews" class="review">
      <strong>{{r.rating}}/5</strong> - {{ r.comment }}
    </div>
    <form #reviewForm="ngForm" (ngSubmit)="submitReview()">
      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Rating</mat-label>
        <mat-select [(ngModel)]="rating" name="rating" required>
          <mat-option *ngFor="let n of [1,2,3,4,5]" [value]="n">{{n}}</mat-option>
        </mat-select>
      </mat-form-field>
      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Commento</mat-label>
        <textarea matInput [(ngModel)]="comment" name="comment"></textarea>
      </mat-form-field>
      <button mat-raised-button color="accent" type="submit" [disabled]="reviewForm.invalid">Invia recensione</button>
    </form>
  </mat-card>

  <p *ngIf="message" class="message">{{message}}</p>
  `,
  styles:[`.cover{width:100%;max-height:240px;object-fit:cover;margin-bottom:16px;} .full-width{width:100%;} .review{padding:8px 0;border-bottom:1px solid #eee;} .message{margin-top:16px;color:green;}`]
})
export class EventDetailComponent implements OnInit{
  event: any = null;
  reviews: any[] = [];
  rating = 5;
  comment = '';
  message = '';
  registered = false;

  constructor(private route: ActivatedRoute, private api: ApiService, public auth: AuthService){}

  ngOnInit(){
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.api.getEvent(id).subscribe((res:any)=> {
      this.event = res;
    });
    this.loadReviews();
    this.loadRegistrations();
  }

  loadReviews() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.api.getReviews(id).subscribe((res:any)=> this.reviews = res || []);
  }

  loadRegistrations() {
    if (!this.auth.isLoggedIn()) {
      return;
    }
    this.api.myRegistrations().subscribe((res:any)=> {
      const id = Number(this.route.snapshot.paramMap.get('id'));
      this.registered = res.some((r:any)=> r.event?.id === id);
    });
  }

  register() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.api.registerEvent(id).subscribe({
      next: () => {
        this.message = 'Iscrizione confermata';
        this.registered = true;
      },
      error: err => this.message = err.error?.message || 'Errore iscrizione'
    });
  }

  unregister() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.api.unregisterEvent(id).subscribe({
      next: () => {
        this.message = 'Iscrizione rimossa';
        this.registered = false;
      },
      error: err => this.message = err.error?.message || 'Errore disiscrizione'
    });
  }

  submitReview() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.api.postReview(id, { rating: this.rating, comment: this.comment }).subscribe({
      next: () => {
        this.message = 'Recensione inviata';
        this.comment = '';
        this.loadReviews();
      },
      error: err => this.message = err.error?.message || 'Errore recensione'
    });
  }
}
