# EventHub

Piattaforma full-stack per la gestione eventi con backend Flask, frontend Angular e database PostgreSQL.

## Setup rapido

1. Copia l'esempio di ambiente:

```bash
cp .env.example .env
```

2. Avvia i servizi con Docker Compose:

```bash
docker-compose up --build
```

3. Apri le applicazioni:

- Backend: http://localhost:5000
- Frontend: http://localhost:4200
- Swagger API: http://localhost:5000/swagger/

## Struttura

- `backend/`: Flask REST API e modelli SQLAlchemy
- `frontend/`: applicazione Angular con routing, guard, JWT e Material UI
- `docker-compose.yml`: backend, database, frontend e Keycloak

## Keycloak locale
- Keycloak è esposto su `http://localhost:8080`
- Usa le credenziali `admin` / `admin` per entrare nella Console di amministrazione
- Configura un client con ID `eventhub-client`, redirect URI `http://localhost:4200/*` e web origin `http://localhost:4200`
- Il backend federerà il token Keycloak con l’endpoint `POST /api/auth/keycloak`

## Note

- Il backend usa JWT con refresh token e validazione di ruolo.
- Il frontend utilizza servizi e guard per proteggere le rotte autenticate.
- Le immagini di copertina vengono caricate e servite da `/uploads/`.
