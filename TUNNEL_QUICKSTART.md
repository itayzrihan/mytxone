# 🌐 SSH Tunnel Quick Start

## Two Ways to Run Dev

### ✅ Recommended: Automatic Tunnels (Simplest)
```powershell
npm run dev
```
**What happens:**
- ✅ SSH tunnels start automatically (PostgreSQL 53332 + Redis 6189)
- ✅ Next.js dev server starts
- ✅ Tunnels stop when you exit

### Alternative: Manual Tunnels (More Control)
```powershell
# Terminal 1: Start tunnels
npm run tunnels:start

# Terminal 2: Start dev server
npm run dev:no-tunnels

# When done:
npm run tunnels:stop
```

---

## Useful Commands

| Command | What it does |
|---------|------------|
| `npm run dev` | Start tunnels + dev server together |
| `npm run dev:no-tunnels` | Start dev server only (need manual tunnels) |
| `npm run tunnels:start` | Start SSH tunnels in background |
| `npm run tunnels:stop` | Stop all SSH tunnels |

---

## Tunnel Details

**PostgreSQL**: localhost:53332 → 85.215.209.220:53332  
**Redis**: localhost:6189 → 85.215.209.220:6189  
**SSH Server**: ssh.mytx.co:36936 (user: itay)

---

## Troubleshooting

### Tunnels won't connect?
```powershell
# Test SSH access first
ssh -p 36936 itay@ssh.mytx.co -N
```

### Port already in use?
```powershell
# Kill existing SSH processes
Get-Process ssh | Stop-Process -Force
```

### Check if tunnels are running?
```powershell
netstat -ano | findstr :53332
netstat -ano | findstr :6189
```

---

## First Time Setup

1. **Test SSH connection**:
   ```powershell
   ssh -p 36936 itay@ssh.mytx.co -N
   ```
   (Press Ctrl+C to disconnect)

2. **Verify SSH key is loaded**:
   ```powershell
   ssh-add -l
   ```

3. **Start dev with tunnels**:
   ```powershell
   npm run dev
   ```

---

**Full Documentation**: See `SSH_TUNNEL_SETUP.md` for complete setup guide

For issues, check tunnel logs:
- `tunnel-53332.log` (PostgreSQL)
- `tunnel-6189.log` (Redis)
