# 🔄 Automatic Tunnel Detection & Launch

## What's New

The `npm run dev` command now includes **automatic tunnel detection and launch**. If tunnels aren't running, the script will automatically:

1. ✅ Detect missing tunnels
2. ✅ Launch tunnels in a separate window
3. ✅ Wait up to 50 seconds for initialization
4. ✅ Show countdown timer
5. ✅ Start dev server once ready (or continue if timeout)

---

## How It Works

### Start Development
```powershell
npm run dev
```

### Script Flow

```
1. Check if PostgreSQL tunnel (53332) is running
   │
   ├─ YES → Skip to dev server
   │
   └─ NO → Launch tunnels + wait 50 seconds

2. Check if Redis tunnel (6189) is running
   │
   ├─ YES → Skip to dev server
   │
   └─ NO → Launch tunnels + wait 50 seconds

3. Start Next.js dev server
```

---

## Console Output Examples

### All Tunnels Already Running
```
🌐 Starting SSH tunnels and dev server...

🔍 Checking for existing tunnels...
✅ PostgreSQL tunnel is running on port 53332
✅ Redis tunnel is running on port 6189
✅ All tunnels already active! Proceeding with dev server...

🚀 Starting Next.js dev server...

- ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

### Tunnels Need to Be Started
```
🌐 Starting SSH tunnels and dev server...

🔍 Checking for existing tunnels...
⚠️  PostgreSQL tunnel not detected on port 53332
⚠️  Redis tunnel not detected on port 6189

📡 Starting SSH tunnels in separate window...
⏳ Waiting up to 50 seconds for tunnel initialization...

⏳ Waiting for tunnel on port 53332... 48s remaining
⏳ Waiting for tunnel on port 6189... 47s remaining

[After tunnels connect]

✅ All tunnels initialized successfully!

🚀 Starting Next.js dev server...

- ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

### Timeout (Tunnels Not Ready in 50 Seconds)
```
🌐 Starting SSH tunnels and dev server...

🔍 Checking for existing tunnels...
⚠️  PostgreSQL tunnel not detected on port 53332
⚠️  Redis tunnel not detected on port 6189

📡 Starting SSH tunnels in separate window...
⏳ Waiting up to 50 seconds for tunnel initialization...

⏳ Waiting for tunnel on port 53332... 30s remaining
⏳ Waiting for tunnel on port 6189... 30s remaining

[At 50 second mark]

⚠️  Tunnel startup timeout reached
⚠️  PostgreSQL tunnel did not start within 50 seconds
⏳ Continuing anyway... Tunnels may still initialize

🚀 Starting Next.js dev server...
```

---

## Features

### ✅ Automatic Detection
- Checks both PostgreSQL (53332) and Redis (6189)
- Uses `netstat` command for port checking
- Fast, non-intrusive checking

### ✅ Smart Launching
- Only launches tunnels if needed
- Opens tunnels in separate window
- Separate from dev server process
- Doesn't interfere with existing tunnels

### ✅ Countdown Timer
- Shows remaining time (updates every 500ms)
- Counts down from 50 seconds
- Clears line for clean output
- Shows elapsed time

### ✅ Graceful Timeout
- 50-second wait period
- Continues even if timeout
- Informs user of any issues
- Allows manual intervention

### ✅ User-Friendly Output
- Color-coded status messages
- Clear progress indicators
- Tells you what's happening at each step
- Helpful emoji indicators

---

## Technical Details

### Functions Added

#### `isTunnelRunning(port)`
```javascript
// Checks if tunnel is listening on a port
// Returns: true/false
// Uses: netstat -ano | findstr :port
```

#### `waitForTunnelWithRetry(port, maxWaitTime)`
```javascript
// Waits for tunnel to be available
// Returns: Promise<boolean>
// Max wait: 50000ms (50 seconds)
// Check interval: 500ms
```

### Implementation
- **Async/Await**: Uses IIFE for async operations
- **Non-blocking**: Spawns tunnel process separately
- **Polling**: Checks port availability every 500ms
- **Timeout**: Max 50-second wait period

---

## Behavior Scenarios

### Scenario 1: First Run (No Tunnels)
```
✅ Script detects tunnels aren't running
✅ Automatically launches tunnel script
✅ Shows 50-second countdown
✅ Waits for both ports to become available
✅ Starts dev server when ready
```

### Scenario 2: Tunnels Already Running
```
✅ Script checks and finds tunnels active
✅ Skips tunnel launch
✅ Immediately starts dev server
✅ Fast startup (no waiting)
```

### Scenario 3: SSH Connection Issues
```
✅ Script launches tunnels
⚠️ Tunnels don't connect within 50 seconds
✅ Script continues anyway (manual intervention possible)
✅ Dev server starts (you can manually start tunnels)
```

### Scenario 4: Partial Tunnels
```
✅ PostgreSQL tunnel is running
⚠️ Redis tunnel not running
✅ Script only waits for Redis
✅ Continues when both are ready
```

---

## Configuration

### Wait Time
To change from 50 seconds, edit the function call:
```javascript
// Current: 50000ms = 50 seconds
waitForTunnelWithRetry(port, 50000)

// To change to 30 seconds:
waitForTunnelWithRetry(port, 30000)
```

### Check Interval
To change how often it checks (default 500ms):
```javascript
// In waitForTunnelWithRetry function:
}, 500);  // Change 500 to desired milliseconds
```

---

## Troubleshooting

### "Connection refused" during wait
**Cause**: SSH keys not loaded or server unreachable
**Solution**: 
```powershell
ssh-add -l
ssh-add ~/.ssh/id_rsa
```

### Script exits after 50 seconds
**Cause**: Tunnels didn't initialize in time
**Solution**:
1. Check SSH connection: `ssh -p 36936 itay@ssh.mytx.co -N`
2. Check logs: `cat tunnel-*.log`
3. Manually run: `npm run tunnels:start`

### Dev server won't start
**Cause**: Database not accessible (tunnels actually not connected)
**Solution**:
1. Verify tunnels: `netstat -ano | findstr :53332`
2. Check logs in separate window
3. Restart: `npm run tunnels:stop && npm run dev`

### Some ports stuck from old session
**Solution**:
```powershell
Get-Process ssh | Stop-Process -Force
npm run dev
```

---

## Comparison

### Before (Manual)
```
1. Open Terminal 1
2. npm run tunnels:start
3. Wait and monitor console
4. Open Terminal 2
5. npm run dev:no-tunnels
6. ...development...
7. Close Terminal 1
8. Close Terminal 2
```

### After (Automatic)
```
1. npm run dev
2. ...development...
3. Ctrl+C to stop
```

**Time saved**: ~3-5 minutes per session ⏱️

---

## What Didn't Change

- ✅ `npm run dev:no-tunnels` still available (manual only)
- ✅ `npm run tunnels:start` still available (manual)
- ✅ `npm run tunnels:stop` still available
- ✅ All existing functionality preserved
- ✅ Backward compatible

---

## Quick Reference

```powershell
# Start dev (automatic tunnels)
npm run dev

# View tunnel status (in separate window)
netstat -ano | findstr :53332    # PostgreSQL
netstat -ano | findstr :6189    # Redis

# Manual tunnel control
npm run tunnels:start
npm run tunnels:stop
npm run dev:no-tunnels

# Troubleshoot
cat tunnel-53332.log
cat tunnel-6189.log
cat tunnel-53332-error.log
cat tunnel-6189-error.log
```

---

## Files Modified

- **`scripts/start-dev-with-tunnels.mjs`** - Enhanced with:
  - `isTunnelRunning(port)` function
  - `waitForTunnelWithRetry(port, maxWaitTime)` function
  - Async tunnel detection logic
  - 50-second countdown timer
  - Smart tunnel launching

---

## Next Steps

Just run it!
```powershell
npm run dev
```

The script will handle the rest automatically. 🚀

---

## Notes

- The tunnel detection happens **before** dev server starts
- Tunnel window stays open (separate from dev server)
- Both tunnels must be available for dev to start smoothly
- Timeout continues anyway (allows manual fixes)
- All tunnels are SSH-encrypted and local-only

---

**Status**: ✅ Enhanced & Ready  
**Version**: 2.0 (Auto Detect & Launch)  
**Wait Time**: 50 seconds (configurable)
