# Frontend EventHub

Applicazione Angular per le funzioni utente, organizer e admin di EventHub.

## Installazione

```bash
cd frontend
npm install
```

## Avvio locale

```bash
npm start
```

L'applicazione sarà disponibile su `http://localhost:4200`.

## Note

- Il frontend usa JWT per l'autenticazione e invia il token con un interceptor HTTP.
- Le rotte `my`, `organizer` e `admin` sono caricate in lazy loading.
- Il backend è previsto su `http://localhost:5000/api`.
