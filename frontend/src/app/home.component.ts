import { Component, OnInit } from '@angular/core';
import { ApiService } from './api.service';

@Component({
  selector: 'app-home',
  template: `
  <h1>Prossimi eventi</h1>
  <div *ngIf="events?.length; else none">
    <div *ngFor="let e of events" style="border:1px solid #ddd;padding:8px;margin:8px 0;">
      <a [routerLink]="['/events', e.id]">{{e.title}}</a>
      <div>{{e.start_datetime}}</div>
    </div>
  </div>
  <ng-template #none><p>Nessun evento trovato.</p></ng-template>
  `
})
export class HomeComponent implements OnInit{
  events: any[] = [];
  constructor(private api: ApiService){}
  ngOnInit(){ this.api.listEvents().subscribe((res:any)=> this.events = res || []); }
}
