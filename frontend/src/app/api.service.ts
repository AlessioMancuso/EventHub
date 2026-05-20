import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ApiService {
  base = '/api';
  constructor(private http: HttpClient) {}

  listEvents(params?: any) { return this.http.get(`${this.base}/events`, { params }); }
  getEvent(id: number) { return this.http.get(`${this.base}/events/${id}`); }
}
