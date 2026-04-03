#!/bin/bash
# CaribCompare daily tweet reminder — runs at 9am GMT
# Sends today's morning tweet via Telegram for Romes to paste

SCHEDULE="$HOME/Projects/caribcompare/scripts/tweet-schedule.json"
TODAY=$(date +%Y-%m-%d)
BOT_TOKEN="7505703348:AAFbHRGJJluRJF9W0hUzJUgBlkGJU7dKUBo"
CHAT_ID="5926127908"

# Get today's morning tweet
TWEET=$(python3 -c "
import json, sys
with open('$SCHEDULE') as f:
    data = json.load(f)
tweets = [t for t in data['tweets'] if t['date'] == '$TODAY' and t.get('time') != 'evening']
if tweets:
    t = tweets[0]
    print(t['label'] + '|||' + t['text'])
else:
    print('NONE')
" 2>/dev/null)

if [ "$TWEET" = "NONE" ] || [ -z "$TWEET" ]; then
    # No scheduled tweet today
    MSG="🐦 *CaribCompare Twitter*

No scheduled tweet for today ($TODAY).

Check twitter-launch-week.md for upcoming content."
else
    LABEL=$(echo "$TWEET" | cut -d'|||' -f1)
    TEXT=$(echo "$TWEET" | cut -d'|||' -f2)
    
    MSG="🐦 *CaribCompare — Today's Tweet* ($LABEL)

Copy and paste this into Twitter:

\`\`\`
$TEXT
\`\`\`

👉 twitter.com/CaribCompare"
fi

# Send via Telegram
curl -s -X POST "https://api.telegram.org/bot${BOT_TOKEN}/sendMessage" \
    -d chat_id="$CHAT_ID" \
    -d parse_mode="Markdown" \
    -d text="$MSG" > /dev/null

echo "Tweet reminder sent for $TODAY"
