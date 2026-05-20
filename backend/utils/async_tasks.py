import threading
import time


def send_email_async(to: str, subject: str, body: str):
    """Semplice invio email asincrono simulato usando threading.
    In produzione sostituire con Celery/SMTP reale.
    """
    def _worker():
        try:
            # Simulazione invio email (qui si potrebbe usare smtplib)
            print(f"[email] Sending to {to}: {subject}")
            time.sleep(1)
            print(f"[email] Sent to {to}")
        except Exception as e:
            print(f"[email] Error sending to {to}: {e}")

    t = threading.Thread(target=_worker, daemon=True)
    t.start()
