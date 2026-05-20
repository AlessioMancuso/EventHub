import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const DEFAULT_API = (window as any).API_BASE_URL || 'http://localhost:5000/api';

@Injectable({ providedIn: 'root' })
export class ApiService {
  base = DEFAULT_API;
  constructor(private http: HttpClient) {}

  login(payload: any) { return this.http.post(`${this.base}/auth/login`, payload); }
  register(payload: any) { return this.http.post(`${this.base}/auth/register`, payload); }
  me() { return this.http.get(`${this.base}/auth/me`); }
  updateProfile(payload: any) { return this.http.put(`${this.base}/auth/me`, payload); }
  changePassword(payload: any) { return this.http.put(`${this.base}/auth/me/password`, payload); }
  listEvents(params?: any) { return this.http.get(`${this.base}/events`, { params }); }
  getEvent(id: number) { return this.http.get(`${this.base}/events/${id}`); }
  registerEvent(eventId: number) { return this.http.post(`${this.base}/registrations/events/${eventId}/register`, {}); }
  unregisterEvent(eventId: number) { return this.http.delete(`${this.base}/registrations/events/${eventId}/register`); }
  myRegistrations() { return this.http.get(`${this.base}/registrations/users/me/registrations`); }
  getReviews(eventId: number) { return this.http.get(`${this.base}/reviews/events/${eventId}`); }
  postReview(eventId: number, payload: any) { return this.http.post(`${this.base}/reviews/events/${eventId}`, payload); }
  flagReview(reviewId: number) { return this.http.post(`${this.base}/reviews/${reviewId}/flag`, {}); }
  organizerDashboard() { return this.http.get(`${this.base}/organizer/dashboard`); }
  exportRegistrants(eventId: number) { return this.http.get(`${this.base}/organizer/events/${eventId}/export`, { responseType: 'text' }); }
  adminUsers() { return this.http.get(`${this.base}/admin/users`); }
  banUser(userId: number) { return this.http.post(`${this.base}/admin/users/${userId}/ban`, {}); }
  promoteUser(userId: number) { return this.http.post(`${this.base}/admin/users/${userId}/promote`, {}); }
  flaggedReviews() { return this.http.get(`${this.base}/admin/reviews/flagged`); }
  approveReview(reviewId: number) { return this.http.post(`${this.base}/admin/reviews/${reviewId}/approve`, {}); }
  deleteReview(reviewId: number) { return this.http.delete(`${this.base}/admin/reviews/${reviewId}`); }
}
