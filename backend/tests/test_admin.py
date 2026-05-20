import os
from backend.app import create_app
from backend.extensions import db
from backend.models import User, Review


def setup_app():
    os.environ['DATABASE_URL'] = 'sqlite:///:memory:'
    app = create_app('dev')
    with app.app_context():
        db.create_all()
    return app


def test_admin_user_management():
    app = setup_app()
    client = app.test_client()

    # create admin user
    resp = client.post('/api/auth/register', json={'email': 'a@example.com', 'password': 'pass'})
    assert resp.status_code == 201
    admin_token = resp.get_json()['access_token']

    # promote the created user to admin directly in DB
    with app.app_context():
        u = User.query.filter_by(email='a@example.com').first()
        u.role = 'admin'
        db.session.commit()

    # create normal user
    resp2 = client.post('/api/auth/register', json={'email': 'u2@example.com', 'password': 'pass'})
    assert resp2.status_code == 201
    with app.app_context():
        u2 = User.query.filter_by(email='u2@example.com').first()
        uid = u2.id

    # ban user
    r = client.post(f'/api/admin/users/{uid}/ban', headers={'Authorization': f'Bearer {admin_token}'})
    assert r.status_code == 200
    with app.app_context():
        assert User.query.get(uid).banned is True

    # promote user
    r2 = client.post(f'/api/admin/users/{uid}/promote', headers={'Authorization': f'Bearer {admin_token}'})
    assert r2.status_code == 200
    with app.app_context():
        assert User.query.get(uid).role == 'organizer'


def test_admin_review_moderation():
    app = setup_app()
    client = app.test_client()
    # create admin
    resp = client.post('/api/auth/register', json={'email': 'adm@example.com', 'password': 'pass'})
    token = resp.get_json()['access_token']
    with app.app_context():
        u = User.query.filter_by(email='adm@example.com').first(); u.role='admin'; db.session.commit()

    # create a review that is flagged
    with app.app_context():
        r = Review(user_id=1, event_id=1, rating=1, comment='bad', flagged=True)
        db.session.add(r); db.session.commit(); rid = r.id

    # get flagged
    g = client.get('/api/admin/reviews/flagged', headers={'Authorization': f'Bearer {token}'})
    assert g.status_code == 200
    assert any(x['id'] == rid for x in g.get_json())

    # approve review
    a = client.post(f'/api/admin/reviews/{rid}/approve', headers={'Authorization': f'Bearer {token}'})
    assert a.status_code == 200
