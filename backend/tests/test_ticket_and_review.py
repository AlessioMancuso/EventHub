import os
from datetime import datetime, timedelta
from backend.app import create_app
from backend.extensions import db
from backend.models import Event, Registration


def setup_app():
    os.environ['DATABASE_URL'] = 'sqlite:///:memory:'
    app = create_app('dev')
    with app.app_context():
        db.create_all()
    return app


def test_ticket_download_and_review():
    app = setup_app()
    client = app.test_client()

    # register user
    resp = client.post('/api/auth/register', json={'email': 'v@example.com', 'password': 'pass'})
    assert resp.status_code == 201
    access = resp.get_json()['access_token']

    # create past event
    with app.app_context():
        past = Event(title='Past Event', description='done', capacity=10, start_datetime=datetime.utcnow()-timedelta(days=2), end_datetime=datetime.utcnow()-timedelta(days=1))
        future = Event(title='Future Event', description='soon', capacity=10, start_datetime=datetime.utcnow()+timedelta(days=1), end_datetime=datetime.utcnow()+timedelta(days=2))
        db.session.add_all([past, future])
        db.session.commit()
        peid = past.id
        feid = future.id

    # register to past event
    r = client.post(f'/api/registrations/events/{peid}/register', headers={'Authorization': f'Bearer {access}'})
    assert r.status_code == 201
    ticket_id = r.get_json()['ticket_id']

    # download ticket
    d = client.get(f'/api/registrations/tickets/{ticket_id}/download', headers={'Authorization': f'Bearer {access}'})
    assert d.status_code == 200
    assert d.headers.get('Content-Type') == 'image/png'

    # post review for past event (should succeed)
    rv = client.post(f'/api/reviews/events/{peid}', json={'rating': 5, 'comment': 'Great'}, headers={'Authorization': f'Bearer {access}'})
    assert rv.status_code == 201

    # post review for future event (should fail)
    rv2 = client.post(f'/api/reviews/events/{feid}', json={'rating': 4, 'comment': 'Too early'}, headers={'Authorization': f'Bearer {access}'})
    assert rv2.status_code == 400
