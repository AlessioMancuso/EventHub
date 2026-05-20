import os
import json
from backend.app import create_app
from backend.extensions import db
from backend.models import Event


def setup_app():
    os.environ['DATABASE_URL'] = 'sqlite:///:memory:'
    app = create_app('dev')
    with app.app_context():
        db.create_all()
    return app


def test_register_flow():
    app = setup_app()
    client = app.test_client()

    # register user
    resp = client.post('/api/auth/register', json={'email': 'u@example.com', 'password': 'pass'})
    assert resp.status_code == 201
    data = resp.get_json()
    access = data['access_token']

    # create event directly
    with app.app_context():
        ev = Event(title='Test', description='desc', capacity=2)
        db.session.add(ev)
        db.session.commit()
        eid = ev.id

    # register to event
    resp2 = client.post(f'/api/registrations/events/{eid}/register', headers={'Authorization': f'Bearer {access}'})
    assert resp2.status_code == 201
    jr = resp2.get_json()
    assert 'qr_base64' in jr

    # list my registrations
    resp3 = client.get('/api/registrations/users/me/registrations', headers={'Authorization': f'Bearer {access}'})
    assert resp3.status_code == 200
    lst = resp3.get_json()
    assert len(lst) == 1
