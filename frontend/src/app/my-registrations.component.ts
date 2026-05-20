import { Component, OnInit } from '@angular/core';
import { ApiService } from './api.service';

@Component({
  selector: 'app-my-registrations',
  template: `
  <mat-card>
    <h2>I miei biglietti</h2>
    <ng-container *ngIf="tickets?.length; else none">
      <mat-list>
        <mat-list-item *ngFor="let item of tickets">
          <div class="item-details">
            <div><strong>{{ item.event.title }}</strong></div>
            <div>{{ item.event.start_datetime | date:'medium' }}</div>
            <div *ngIf="item.ticket?.qr_base64"><img [src]="item.ticket.qr_base64" alt="qr" class="qr" /></div>
          </div>
        </mat-list-item>
      </mat-list>
    </ng-container>
    <ng-template #none><p>Nessun biglietto disponibile.</p></ng-template>
  </mat-card>
  `,
  styles:[`.item-details{display:flex;flex-direction:column;gap:8px;} .qr{max-width:180px;border:1px solid #ccc;padding:8px;margin-top:8px;}`]
})
export class MyRegistrationsComponent implements OnInit {
  tickets: any[] = [];
  constructor(private api: ApiService) {}
  ngOnInit(){ this.api.myRegistrations().subscribe((res:any)=> this.tickets = res || []); }
}
