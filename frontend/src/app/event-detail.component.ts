import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from './api.service';
import { HttpClient } from '@angular/common/http';


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
  rating = 5;
  comment = '';
  message = '';
  constructor(private route: ActivatedRoute, private api: ApiService, private http: HttpClient){}
  ngOnInit(){
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.api.getEvent(id).subscribe((res:any)=> this.event = res);
  }
  submitReview(){
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.http.post(`/api/reviews/events/${id}`, { rating: this.rating, comment: this.comment }).subscribe({
      next: (r:any)=> { this.message = 'Recensione inviata'; this.comment = ''; },
      error: (e)=> { this.message = e?.error?.message || 'Errore invio recensione'; }
    });
  }
}
