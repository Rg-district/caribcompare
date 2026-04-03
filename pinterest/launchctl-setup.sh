#!/bin/bash
# CaribCompare Pinterest Scheduler — macOS LaunchAgent setup
# Installs two daily posting jobs: 9am and 6pm London time

PLIST_DIR="$HOME/Library/LaunchAgents"
PYTHON="/usr/bin/python3"
SCRIPT_DIR="/Users/dopaminedistrict/Projects/caribcompare/pinterest"

mkdir -p "$PLIST_DIR"

# Morning job — 9:00 AM
cat > "$PLIST_DIR/com.caribcompare.pinterest.morning.plist" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.caribcompare.pinterest.morning</string>
    <key>ProgramArguments</key>
    <array>
        <string>$PYTHON</string>
        <string>$SCRIPT_DIR/scheduler.py</string>
        <string>post</string>
    </array>
    <key>EnvironmentVariables</key>
    <dict>
        <key>PINTEREST_ACCESS_TOKEN</key>
        <string>REPLACE_WITH_TOKEN</string>
        <key>PINTEREST_BOARD_ID</key>
        <string>REPLACE_WITH_BOARD_ID</string>
    </dict>
    <key>StartCalendarInterval</key>
    <dict>
        <key>Hour</key>
        <integer>9</integer>
        <key>Minute</key>
        <integer>0</integer>
    </dict>
    <key>StandardOutPath</key>
    <string>$SCRIPT_DIR/data/cron.log</string>
    <key>StandardErrorPath</key>
    <string>$SCRIPT_DIR/data/cron.log</string>
    <key>RunAtLoad</key>
    <false/>
</dict>
</plist>
EOF

# Evening job — 6:00 PM
cat > "$PLIST_DIR/com.caribcompare.pinterest.evening.plist" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.caribcompare.pinterest.evening</string>
    <key>ProgramArguments</key>
    <array>
        <string>$PYTHON</string>
        <string>$SCRIPT_DIR/scheduler.py</string>
        <string>post</string>
    </array>
    <key>EnvironmentVariables</key>
    <dict>
        <key>PINTEREST_ACCESS_TOKEN</key>
        <string>REPLACE_WITH_TOKEN</string>
        <key>PINTEREST_BOARD_ID</key>
        <string>REPLACE_WITH_BOARD_ID</string>
    </dict>
    <key>StartCalendarInterval</key>
    <dict>
        <key>Hour</key>
        <integer>18</integer>
        <key>Minute</key>
        <integer>0</integer>
    </dict>
    <key>StandardOutPath</key>
    <string>$SCRIPT_DIR/data/cron.log</string>
    <key>StandardErrorPath</key>
    <string>$SCRIPT_DIR/data/cron.log</string>
    <key>RunAtLoad</key>
    <false/>
</dict>
</plist>
EOF

echo "✅ Plist files created. Now update the tokens in the plist files, then load:"
echo ""
echo "  Edit: $PLIST_DIR/com.caribcompare.pinterest.morning.plist"
echo "  Edit: $PLIST_DIR/com.caribcompare.pinterest.evening.plist"
echo "  Replace REPLACE_WITH_TOKEN and REPLACE_WITH_BOARD_ID"
echo ""
echo "Then load:"
echo "  launchctl load $PLIST_DIR/com.caribcompare.pinterest.morning.plist"
echo "  launchctl load $PLIST_DIR/com.caribcompare.pinterest.evening.plist"
