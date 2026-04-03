"""
CaribCompare Pinterest Scheduler
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Posts 2 pins/day (9am and 6pm London time) from pins-queue.json
via Pinterest API v5.

Env vars required:
  PINTEREST_ACCESS_TOKEN  — OAuth2 access token
  PINTEREST_BOARD_ID      — Target board ID

Run: python3 scheduler.py post
"""
import os, sys, json, requests
from datetime import datetime, date
import pytz

LONDON_TZ = pytz.timezone("Europe/London")
ACCESS_TOKEN = os.environ.get("PINTEREST_ACCESS_TOKEN", "")
BOARD_ID = os.environ.get("PINTEREST_BOARD_ID", "")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
QUEUE_FILE = os.path.join(BASE_DIR, "pins-queue.json")
POSTED_FILE = os.path.join(BASE_DIR, "data", "posted.json")
LOCK_DIR = os.path.join(BASE_DIR, "data")

PINTEREST_API = "https://api.pinterest.com/v5"


def get_posted_ids() -> set:
    if not os.path.exists(POSTED_FILE):
        return set()
    with open(POSTED_FILE) as f:
        data = json.load(f)
    return {p["id"] for p in data}


def save_posted(pin_id: str, pin_title: str):
    os.makedirs(os.path.dirname(POSTED_FILE), exist_ok=True)
    existing = []
    if os.path.exists(POSTED_FILE):
        with open(POSTED_FILE) as f:
            existing = json.load(f)
    existing.append({
        "id": pin_id,
        "title": pin_title,
        "posted_at": datetime.now(LONDON_TZ).isoformat()
    })
    with open(POSTED_FILE, "w") as f:
        json.dump(existing, f, indent=2)


def get_lock_path(slot: str) -> str:
    today = date.today().isoformat()
    return os.path.join(LOCK_DIR, f"posted_{today}_{slot}.lock")


def already_posted_slot(slot: str) -> bool:
    return os.path.exists(get_lock_path(slot))


def mark_slot_posted(slot: str):
    os.makedirs(LOCK_DIR, exist_ok=True)
    with open(get_lock_path(slot), "w") as f:
        f.write(datetime.now().isoformat())


def get_current_slot() -> str:
    """Returns 'morning' (9am) or 'evening' (6pm) based on current London time."""
    now = datetime.now(LONDON_TZ)
    hour = now.hour
    if 9 <= hour < 18:
        return "morning"
    elif hour >= 18:
        return "evening"
    return None


def post_pin(pin: dict) -> bool:
    if not ACCESS_TOKEN:
        print("❌ PINTEREST_ACCESS_TOKEN not set")
        return False
    if not BOARD_ID:
        print("❌ PINTEREST_BOARD_ID not set")
        return False

    payload = {
        "board_id": BOARD_ID,
        "title": pin["title"],
        "description": pin["description"],
        "link": pin["link"],
        "media_source": {
            "source_type": "image_url",
            "url": pin["image_url"]
        }
    }

    headers = {
        "Authorization": f"Bearer {ACCESS_TOKEN}",
        "Content-Type": "application/json"
    }

    r = requests.post(f"{PINTEREST_API}/pins", headers=headers, json=payload, timeout=15)
    if r.status_code == 201:
        data = r.json()
        print(f"✅ Posted: {pin['title']} (pin id: {data.get('id')})")
        return True
    else:
        print(f"❌ Pinterest API error {r.status_code}: {r.text[:200]}")
        return False


def run_post():
    slot = get_current_slot()
    if not slot:
        print("Outside posting window (9am-9pm). Exiting.")
        sys.exit(0)

    if already_posted_slot(slot):
        print(f"⚠️  Already posted {slot} slot today. Skipping.")
        sys.exit(0)

    with open(QUEUE_FILE) as f:
        queue = json.load(f)

    posted_ids = get_posted_ids()
    unposted = [p for p in queue if not p.get("posted") and p["id"] not in posted_ids]

    if not unposted:
        print("✅ All pins posted — queue exhausted. Add more to pins-queue.json.")
        sys.exit(0)

    pin = unposted[0]
    success = post_pin(pin)
    if success:
        save_posted(pin["id"], pin["title"])
        mark_slot_posted(slot)


def run_status():
    with open(QUEUE_FILE) as f:
        queue = json.load(f)
    posted_ids = get_posted_ids()
    unposted = [p for p in queue if p["id"] not in posted_ids]
    print(f"Total pins: {len(queue)}")
    print(f"Posted: {len(posted_ids)}")
    print(f"Remaining: {len(unposted)}")
    print(f"Days of content left: {len(unposted) // 2}")


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "post"
    if cmd == "post":
        run_post()
    elif cmd == "status":
        run_status()
    else:
        print(f"Unknown command: {cmd}. Use: post | status")
