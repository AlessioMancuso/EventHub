import { Component, OnInit } from '@angular/core';
import { ApiService } from './api.service';

@Component({
  selector: 'app-home',
  template: `
  <div class="search-panel">
    <mat-form-field appearance="fill" class="fill">
      <mat-label>Ricerca</mat-label>
      <input matInput [(ngModel)]="query" placeholder="Titolo o descrizione">
    </mat-form-field>
    <button mat-raised-button color="primary" (click)="search()">Cerca</button>
  </div>
  <div *ngIf="events?.length; else none">
    <mat-card *ngFor="let e of events" class="event-card">
      <img *ngIf="e.cover_image_url" [src]="e.cover_image_url" alt="cover" class="cover" />
      <mat-card-title>{{ e.title }}</mat-card-title>
      <mat-card-subtitle>{{ e.city }} - {{ e.start_datetime | date:'medium' }}</mat-card-subtitle>
      <mat-card-content>
        <p>{{ e.description }}</p>
      </mat-card-content>
      <mat-card-actions>
        <button mat-button color="primary" [routerLink]="['/events', e.id]">Dettagli</button>
      </mat-card-actions>
    </mat-card>
  </div>
  <ng-template #none><p>Nessun evento trovato.</p></ng-template>
  `,
  styles:[`.event-card{margin-bottom:16px;} .cover{width:100%;max-height:200px;object-fit:cover;} .search-panel{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:16px;} .fill{flex:1;min-width:250px;}`]
})
export class HomeComponent implements OnInit {
  events: any[] = [];
  query = '';
  constructor(private api: ApiService) {}
  ngOnInit() { this.loadEvents(); }
  loadEvents() { this.api.listEvents().subscribe((res:any)=> this.events = res || []); }
  search() { this.api.listEvents({ q: this.query }).subscribe((res:any)=> this.events = res || []); }
}
