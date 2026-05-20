# Frontend (Angular) - Scaffold

Questo folder contiene uno scaffold minimale per l'app Angular. Per generare il progetto completo con CLI e avviare l'app, segui questi passaggi:

1. Installa Angular CLI (se non già presente):

```bash
npm install -g @angular/cli
```

2. Genera il progetto nella cartella `frontend` (da eseguire nella root del repository):

```bash
npx -p @angular/cli ng new frontend --directory frontend --routing --style=scss --skip-install
```

3. Copia i file presenti in `frontend/src/app` (services, guards, interceptor) sovrascrivendoli se richiesto.

4. Installa dipendenze e avvia:

```bash
cd frontend
npm install
ng serve
```

Il codice fornito è un punto di partenza con `AuthService`, `ApiService`, `JwtInterceptor` e `AuthGuard` per integrare Keycloak/OIDC e il backend Flask.
