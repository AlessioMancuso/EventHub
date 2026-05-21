import { Component, OnInit } from '@angular/core';
import { ApiService } from './api.service';

@Component({
  selector: 'app-home',
  template: `
  <section class="hero-card">
    <div class="hero-copy">
      <div class="eyebrow">Soluzioni evento enterprise</div>
      <h1>EventHub trasforma eventi in esperienze raffinate.</h1>
      <p>Gestisci registrazioni, ticket e comunicazioni con un’interfaccia professionale pensata per organizzatori esigenti.</p>
      <div class="hero-actions">
        <button mat-flat-button color="accent" routerLink="/login">Inizia ora</button>
        <button mat-stroked-button color="accent" (click)="search()">Cerca eventi</button>
      </div>
    </div>
    <div class="hero-badge">
      <div>
        <strong>{{ events?.length || 0 }}</strong>
        <span>eventi live</span>
      </div>
      <div>
        <strong>Disponibilità 24/7</strong>
        <span>performance affidabile</span>
      </div>
      <div>
        <strong>Supporto VIP</strong>
        <span>strumenti su misura</span>
      </div>
    </div>
  </section>

  <mat-card class="search-panel">
    <div class="search-panel-inner">
      <div>
        <h2>Ricerca strategica</h2>
        <p>Trova il tuo evento ideale con filtri rapidi, preview immediate e risultati ordinati per priorità.</p>
      </div>
      <div class="search-field">
        <mat-form-field appearance="fill" class="fill">
          <mat-label>Cerca</mat-label>
          <input matInput [(ngModel)]="query" placeholder="Titolo, città, organizzatore">
        </mat-form-field>
        <button mat-flat-button color="accent" (click)="search()">Cerca</button>
      </div>
    </div>
  </mat-card>

  <div class="hero-details">
    <mat-card class="pillar-card">
      <span class="pillar-label">Sicurezza</span>
      <p>Controllo accessi, autenticazione e workflow ticket senza compromessi.</p>
    </mat-card>
    <mat-card class="pillar-card">
      <span class="pillar-label">Efficienza</span>
      <p>Dashboard snella con insight immediati e aggiornamenti in tempo reale.</p>
    </mat-card>
    <mat-card class="pillar-card">
      <span class="pillar-label">Eleganza</span>
      <p>Design coerente, dettagli raffinati e un’esperienza utente curata nei minimi dettagli.</p>
    </mat-card>
  </div>

  <div *ngIf="events?.length; else none" class="events-grid">
    <mat-card *ngFor="let e of events" class="event-card">
      <div class="cover-wrapper" *ngIf="e.cover_image_url">
        <img [src]="e.cover_image_url" alt="cover" class="cover" />
      </div>
      <mat-card-content>
        <div class="event-meta">
          <div>
            <h2>{{ e.title }}</h2>
            <p>{{ e.city }} • {{ e.start_datetime | date:'mediumDate' }}</p>
          </div>
          <span class="category">{{ e.category || 'Generale' }}</span>
        </div>
        <p>{{ e.description }}</p>
      </mat-card-content>
      <mat-card-actions>
        <button mat-stroked-button color="accent" [routerLink]="['/events', e.id]">Dettagli</button>
      </mat-card-actions>
    </mat-card>
  </div>

  <ng-template #none>
    <mat-card class="empty-state">
      <h3>Nessun evento trovato</h3>
      <p>Modifica i criteri per scoprire nuovi eventi e opportunità.</p>
    </mat-card>
  </ng-template>
  `,
  styles:[`.hero-card{display:flex;flex-wrap:wrap;gap:28px;padding:38px;align-items:center;background:linear-gradient(135deg,rgba(10,15,35,0.96),rgba(15,22,52,0.98));border:1px solid rgba(255,255,255,0.07);border-radius:28px;box-shadow:0 30px 90px rgba(0,0,0,0.23);margin-bottom:28px;position:relative;overflow:hidden;} .hero-copy{flex:1;min-width:300px;z-index:1;} .eyebrow{display:inline-flex;padding:8px 14px;margin-bottom:18px;background:rgba(92,124,250,0.14);color:var(--accent);border-radius:999px;font-size:.86rem;text-transform:uppercase;letter-spacing:.12em;} .hero-copy h1{margin:0 0 20px;font-size:3.1rem;line-height:1.03;font-weight:800;color:#f8fbff;} .hero-copy p{max-width:660px;margin:0 0 28px;color:var(--text-muted);font-size:1rem;line-height:1.7;} .hero-actions{display:flex;flex-wrap:wrap;gap:14px;} .hero-badge{display:grid;grid-template-columns:repeat(3,minmax(180px,1fr));gap:14px;min-width:280px;}
.hero-badge div{background:rgba(255,255,255,0.04);padding:22px 20px;border-radius:20px;border:1px solid rgba(255,255,255,0.08);text-align:center;backdrop-filter:blur(8px);} .hero-badge strong{display:block;font-size:1.25rem;margin-bottom:8px;color:#f8fbff;} .hero-badge span{opacity:.82;font-size:.9rem;color:var(--text-muted);} .search-panel{padding:28px 26px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:24px;box-shadow:0 20px 50px rgba(0,0,0,0.22);margin-bottom:26px;} .search-panel-inner{display:flex;justify-content:space-between;align-items:center;gap:20px;flex-wrap:wrap;} .search-panel-inner h2{margin:0 0 8px;font-size:1.35rem;color:#f8fbff;} .search-panel-inner p{margin:0;color:var(--text-muted);max-width:520px;} .search-field{display:flex;flex:1;gap:14px;align-items:center;flex-wrap:wrap;} .fill{flex:1;min-width:280px;} .hero-details{display:grid;grid-template-columns:repeat(3,minmax(220px,1fr));gap:18px;margin-bottom:28px;} .pillar-card{padding:24px;border-radius:22px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.06);} .pillar-label{display:inline-flex;padding:6px 10px;margin-bottom:16px;font-size:.78rem;font-weight:700;text-transform:uppercase;letter-spacing:.12em;background:rgba(92,124,250,0.14);color:var(--accent);border-radius:999px;} .pillar-card p{margin:0;color:var(--text-muted);line-height:1.75;} .events-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:22px;} .event-card{overflow:hidden;display:flex;flex-direction:column;justify-content:space-between;} .cover-wrapper{overflow:hidden;border-radius:20px 20px 0 0;} .cover{width:100%;height:220px;object-fit:cover;} .event-meta{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:14px;} .event-meta h2{margin:0;font-size:1.35rem;color:#f8fbff;} .event-meta p{margin:8px 0 0;color:var(--text-muted);} .category{font-size:.82rem;background:rgba(92,124,250,0.14);color:var(--accent);padding:9px 14px;border-radius:999px;} .event-card mat-card-actions{padding:0 0 20px 0;} .empty-state{padding:42px;text-align:center;color:var(--text-muted);} .empty-state h3{margin:0 0 12px;color:#f8fbff;} @media(max-width:960px){.hero-card{flex-direction:column;}.hero-badge{grid-template-columns:1fr;}.search-panel-inner{flex-direction:column;align-items:stretch;}.hero-details{grid-template-columns:1fr;}}
`]
})
export class HomeComponent implements OnInit {
  events: any[] = [];
  query = '';
  constructor(private api: ApiService) {}
  ngOnInit() { this.loadEvents(); }
  loadEvents() { this.api.listEvents().subscribe((res:any)=> this.events = res || []); }
  search() { this.api.listEvents({ q: this.query }).subscribe((res:any)=> this.events = res || []); }
}
