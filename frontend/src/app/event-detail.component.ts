import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from './api.service';

@Component({
  selector: 'app-event-detail',
  template: `
  <div *ngIf="event">
    <h2>{{event.title}}</h2>
    <div>{{event.description}}</div>
  </div>
  `
})
export class EventDetailComponent implements OnInit{
  event: any = null;
  constructor(private route: ActivatedRoute, private api: ApiService){}
  ngOnInit(){
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.api.getEvent(id).subscribe((res:any)=> this.event = res);
  }
}
