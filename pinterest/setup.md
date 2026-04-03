# Pinterest API Setup Guide — CaribCompare

## Step 1: Create a Pinterest Business Account

1. Go to https://business.pinterest.com
2. Sign up or convert your existing account to a Business account
3. Fill in business details: name "CaribCompare", website "caribcompare.com"

## Step 2: Apply for Pinterest API Access

1. Go to https://developers.pinterest.com
2. Click "My Apps" → "Create App"
3. App name: CaribCompare
4. App description: "Automated content posting for CaribCompare, a Caribbean finance comparison platform"
5. Website: https://caribcompare.com
6. Submit for review

**Timeline:** Approval typically takes 3-7 business days. You'll receive an email when approved.

## Step 3: Get Your Access Token

Once approved:
1. Go to https://developers.pinterest.com/apps/
2. Open your CaribCompare app
3. Click "Generate Access Token"
4. Select scopes: `pins:read`, `pins:write`, `boards:read`, `boards:write`
5. Copy the access token

## Step 4: Get Your Board ID

1. Log into Pinterest
2. Create a board called "Caribbean Finance Tips" (or similar)
3. Open the board in a browser
4. The URL will be: `https://www.pinterest.com/USERNAME/caribbean-finance-tips/`
5. To get the board ID, use the API:
   ```
   curl -H "Authorization: Bearer YOUR_TOKEN" https://api.pinterest.com/v5/boards
   ```
   Find your board in the response and copy the `id` field.

## Step 5: Configure Environment Variables

Add to your shell profile (`~/.zshrc` or `~/.bash_profile`):
```bash
export PINTEREST_ACCESS_TOKEN="your_token_here"
export PINTEREST_BOARD_ID="your_board_id_here"
```

Then reload: `source ~/.zshrc`

## Step 6: Install Launchctl (macOS scheduler)

```bash
cd /Users/dopaminedistrict/Projects/caribcompare/pinterest
chmod +x launchctl-setup.sh
./launchctl-setup.sh
```

This installs two daily jobs: 9am and 6pm posting.

## Step 7: Test

```bash
cd /Users/dopaminedistrict/Projects/caribcompare/pinterest
python3 scheduler.py status
```

Then do a test post:
```bash
PINTEREST_ACCESS_TOKEN=your_token PINTEREST_BOARD_ID=your_board python3 scheduler.py post
```

## Update pins-queue.json with Your Board ID

Once you have your board ID, replace `REPLACE_WITH_BOARD_ID` in `pins-queue.json`:
```bash
sed -i '' 's/REPLACE_WITH_BOARD_ID/YOUR_ACTUAL_BOARD_ID/g' pins-queue.json
```

## Notes

- The scheduler posts 2 pins/day (9am + 6pm London time)
- 30 pins pre-loaded = 15 days of content
- Add more pins to pins-queue.json any time
- Pinterest favours accounts that post consistently — don't skip days
- Use vertical images (2:3 ratio, 1000x1500px) for best performance
