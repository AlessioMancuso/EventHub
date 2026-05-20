# Backend (Flask)

Setup rapido:

1. Creare e attivare un virtualenv

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```


2. Copiare `.env.example` in `.env` e modificare se necessario

3. Creare il database e le migrazioni (usare `FLASK_APP=backend.manage:app` se si esegue dalla root del repository):

```bash
export FLASK_APP=backend.manage:app
export FLASK_CONFIG=dev
flask db init   # solo la prima volta
flask db migrate -m "init"
flask db upgrade
```

4. Avviare l'app in sviluppo:

```bash
python -m backend.manage
```

L'API sarà disponibile su `http://localhost:5000` e Swagger UI su `/swagger/` (Flask-RESTX).

Docker-compose rapido (dev):

```bash
docker-compose up --build
```

Questo avvierà PostgreSQL, Keycloak (in modalità dev) e il backend.
Modifica le variabili d'ambiente in `docker-compose.yml` se necessario.

Nota: l'invio email è simulato con un task in background (threading). Per produzione configurare un server SMTP o Celery.

L'API sarà disponibile su `http://localhost:5000` e Swagger UI su `/swagger/` (Flask-RESTX).
