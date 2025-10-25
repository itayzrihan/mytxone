# 🚀 SSH Tunnel Setup Complete

## What Was Added

### ✅ New Files Created

1. **`start-tunnels.ps1`** - PowerShell script to start SSH tunnels
   - Starts PostgreSQL tunnel (localhost:53332 → 85.215.209.220:53332)
   - Starts Redis tunnel (localhost:6189 → 85.215.209.220:6189)
   - Color-coded output with status messages
   - Logs saved to `tunnel-53332.log`, `tunnel-6189.log`, etc.

2. **`stop-tunnels.ps1`** - PowerShell script to stop SSH tunnels
   - Gracefully stops both tunnels
   - Kills SSH processes by port identifier
   - Safe error handling

3. **`scripts/start-dev-with-tunnels.mjs`** - Node.js orchestrator script
   - Automatically starts tunnels before dev server
   - Waits for tunnel establishment (2 second delay)
   - Manages both processes together
   - Cleans up tunnels on exit

4. **`SSH_TUNNEL_SETUP.md`** - Comprehensive documentation
   - Full architecture overview
   - Detailed setup instructions
   - Troubleshooting guide
   - Environment variable reference
   - Security considerations

5. **`TUNNEL_QUICKSTART.md`** - Quick reference guide
   - Two-line setup instructions
   - Command reference
   - Common issues & solutions

6. **`.env.tunnel.example`** - Environment configuration template
   - Database URL template
   - Redis URL template
   - SSH tunnel configuration reference

### ✅ Updated Files

**`package.json`** - Added new npm scripts:
```json
"dev": "node scripts/start-dev-with-tunnels.mjs",     // NEW: Auto tunnels
"dev:no-tunnels": "next dev --turbo",                 // NEW: Dev only
"tunnels:start": "powershell -ExecutionPolicy Bypass -File start-tunnels.ps1",
"tunnels:stop": "powershell -ExecutionPolicy Bypass -File stop-tunnels.ps1"
```

---

## Quick Start

### For First Time Setup

```powershell
# 1. Test SSH connection
ssh -p 36936 itay@ssh.mytx.co -N

# 2. Start dev (tunnels automatically managed)
npm run dev
```

### Daily Usage

```powershell
# Simply run (includes tunnel setup)
npm run dev
```

---

## How It Works

```
┌─────────────────────────────────────────────────────────┐
│ npm run dev                                             │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ start-dev-with-      │
        │ tunnels.mjs starts   │
        └──────────┬───────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
        ▼                     ▼
    ┌────────────┐    ┌──────────────┐
    │ PostgreSQL │    │    Redis     │
    │   Tunnel   │    │    Tunnel    │
    │ :53332      │    │   :6189      │
    └────────────┘    └──────────────┘
        │                     │
        └──────────┬──────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │  Next.js Dev Server  │
        │  (after 2s delay)    │
        └──────────────────────┘
```

---

## Available Commands

| Command | Use Case | Tunnel Status |
|---------|----------|---------------|
| `npm run dev` | **Normal development** (RECOMMENDED) | Auto-managed ✅ |
| `npm run dev:no-tunnels` | Dev server only (use with manual tunnels) | Manual ⚙️ |
| `npm run tunnels:start` | Start tunnels manually | Started ✅ |
| `npm run tunnels:stop` | Stop tunnels manually | Stopped ❌ |

---

## Tunnel Configuration

```
SSH Server:      ssh.mytx.co:36936 (user: itay)
Remote Host:     85.215.209.220

PostgreSQL:      localhost:53332 ◄─► 85.215.209.220:53332
Redis:           localhost:6189 ◄─► 85.215.209.220:6189
```

All traffic is encrypted through SSH tunnel.

---

## Environment Setup

Your `.env.local` should have:

```bash
DATABASE_URL="postgresql://user:password@localhost:53332/mytxone"
REDIS_URL="redis://localhost:6189"
UPSTASH_REDIS_REST_URL="redis://localhost:6189"
```

See `.env.tunnel.example` for reference.

---

## Troubleshooting

### SSH Connection Issues
- Test: `ssh -p 36936 itay@ssh.mytx.co -N`
- Verify SSH key: `ssh-add -l`
- Load key if needed: `ssh-add ~/.ssh/id_rsa`

### Port Already in Use
```powershell
Get-Process ssh | Stop-Process -Force
```

### Check Tunnel Status
```powershell
# Check PostgreSQL tunnel
netstat -ano | findstr :53332

# Check Redis tunnel
netstat -ano | findstr :6189
```

### View Tunnel Logs
- PostgreSQL: `tunnel-53332.log` / `tunnel-53332-error.log`
- Redis: `tunnel-6189.log` / `tunnel-6189-error.log`

---

## Documentation Reference

- **Quick Start**: `TUNNEL_QUICKSTART.md`
- **Full Setup**: `SSH_TUNNEL_SETUP.md`
- **Environment**: `.env.tunnel.example`

---

## Next Steps

1. ✅ Run `npm run dev` to start development
2. ✅ Tunnels will automatically establish connection
3. ✅ Next.js dev server will start
4. ✅ Check logs if there are any issues

**That's it!** Your setup is complete. 🎉
