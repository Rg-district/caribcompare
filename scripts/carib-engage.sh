#!/bin/bash
# CaribCompare background engagement — runs daily
# Likes and reposts relevant Caribbean travel content

LOG="$HOME/Projects/caribcompare/scripts/engage.log"
DATE=$(date '+%Y-%m-%d %H:%M')

echo "[$DATE] Starting engagement run..." >> "$LOG"

# Search for and like Caribbean travel content
QUERIES=(
    "Caribbean flights 2026"
    "Caribbean travel tips"
    "Barbados travel"
    "Jamaica tourism"
    "Trinidad Carnival"
    "Caribbean diaspora"
    "Crop Over 2026"
    "Caribbean holiday"
)

LIKED=0
LIMIT=5  # max actions per query to stay within free tier

for QUERY in "${QUERIES[@]}"; do
    # Search for recent posts
    RESULTS=$(xurl --app caribcompare --auth oauth1 search "$QUERY" -n 3 2>/dev/null)
    
    if [ $? -eq 0 ]; then
        # Extract IDs and like them
        IDS=$(echo "$RESULTS" | python3 -c "
import json, sys
try:
    data = json.load(sys.stdin)
    posts = data.get('data', [])
    for p in posts[:2]:
        print(p.get('id',''))
except:
    pass
" 2>/dev/null)
        
        while IFS= read -r POST_ID; do
            if [ -n "$POST_ID" ]; then
                xurl --app caribcompare --auth oauth1 like "$POST_ID" > /dev/null 2>&1
                if [ $? -eq 0 ]; then
                    LIKED=$((LIKED + 1))
                    sleep 2  # rate limit buffer
                fi
            fi
        done <<< "$IDS"
    fi
    
    sleep 3
done

echo "[$DATE] Engagement complete. Liked: $LIKED posts" >> "$LOG"
