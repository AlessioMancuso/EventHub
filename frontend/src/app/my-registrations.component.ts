import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-my-registrations',
  template: `
    <h2>Le mie iscrizioni</h2>
    <div *ngIf="regs?.length; else none">
      <div *ngFor="let r of regs" style="border:1px solid #ddd;padding:8px;margin:8px 0;">
        <div><strong>{{r.event.title}}</strong> - {{r.event.start_datetime}}</div>
        <div *ngIf="r.ticket && r.ticket.qr_base64">
          <img [src]="'data:image/png;base64,' + r.ticket.qr_base64" alt="QR" style="max-width:200px;" />
        </div>
      </div>
    </div>
    <ng-template #none><p>Nessuna iscrizione trovata.</p></ng-template>
  `
})
export class MyRegistrationsComponent implements OnInit{
  regs: any[] = [];
  constructor(private http: HttpClient){}
  ngOnInit(){
    this.http.get('/api/registrations/users/me/registrations').subscribe((res:any)=> this.regs = res || []);
  }
}
