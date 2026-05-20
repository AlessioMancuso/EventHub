import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-organizer-dashboard',
  template: `
  <mat-card>
    <h2>Dashboard Organizzatore</h2>
    <div *ngIf="stats?.length; else none">
      <mat-list>
        <mat-list-item *ngFor="let item of stats">
          <div class="stat-row">
            <div><strong>{{item.title}}</strong></div>
            <div>Partecipanti: {{item.attendees}}</div>
            <div>Incassi stimati: €{{item.estimated_income | number:'1.2-2'}}</div>
            <div>Rating medio: {{item.avg_rating | number:'1.1-1'}}</div>
            <button mat-button color="primary" (click)="exportRegistrants(item.event_id)">Esporta iscritti</button>
          </div>
        </mat-list-item>
      </mat-list>
    </div>
    <ng-template #none><p>Nessun evento trovato.</p></ng-template>
  </mat-card>
  `,
  styles:[".stat-row{display:flex;flex-wrap:wrap;gap:12px;align-items:center;width:100%;}"]
})
export class OrganizerDashboardComponent implements OnInit {
  stats: any[] = [];

  constructor(private api: ApiService, private snackBar: MatSnackBar) {}

  ngOnInit() { this.api.organizerDashboard().subscribe((data:any)=> this.stats = data); }

  exportRegistrants(eventId:number) {
    this.api.exportRegistrants(eventId).subscribe({
      next: () => this.snackBar.open('Export avviato', 'Chiudi', { duration: 2000 }),
      error: err => this.snackBar.open(err.error?.message || 'Errore export', 'Chiudi', { duration: 3000 })
    });
  }
}
