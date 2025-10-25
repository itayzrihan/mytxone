# 🔒 SSH Tunnel Integration for mytx.one

## 📋 Files Added

### Core Tunnel Scripts
- ✅ `start-tunnels.ps1` - Starts SSH tunnels for PostgreSQL (53332) & Redis (6189)
- ✅ `stop-tunnels.ps1` - Stops SSH tunnels
- ✅ `scripts/start-dev-with-tunnels.mjs` - Orchestrates tunnel startup + dev server

### Documentation
- ✅ `TUNNEL_SETUP_COMPLETE.md` - **START HERE** - Setup summary
- ✅ `TUNNEL_QUICKSTART.md` - Quick reference (2 lines to start)
- ✅ `SSH_TUNNEL_SETUP.md` - Complete technical documentation
- ✅ `.env.tunnel.example` - Environment configuration template

### Updated Configuration
- ✅ `package.json` - Added 4 new npm scripts for tunnel management

---

## 🚀 Usage

### Simplest Way (Recommended)
```powershell
npm run dev
```
✅ Automatically starts tunnels + dev server  
✅ Cleans up on exit

### Manual Tunnel Management
```powershell
# Terminal 1: Start tunnels
npm run tunnels:start

# Terminal 2: Start dev
npm run dev:no-tunnels

# When done:
npm run tunnels:stop
```

---

## 🔌 Tunnel Configuration

| Service | Local | Remote | SSH Server |
|---------|-------|--------|-----------|
| PostgreSQL | localhost:53332 | 85.215.209.220:53332 | ssh.mytx.co:36936 |
| Redis | localhost:6189 | 85.215.209.220:6189 | ssh.mytx.co:36936 |

---

## 📖 Next Steps

1. **Read Quick Start**: See `TUNNEL_QUICKSTART.md`
2. **Full Documentation**: See `SSH_TUNNEL_SETUP.md`
3. **Run Dev**: `npm run dev`

---

## 🆘 Quick Troubleshooting

```powershell
# Test SSH access
ssh -p 36936 itay@ssh.mytx.co -N

# Verify tunnels running
netstat -ano | findstr :53332
netstat -ano | findstr :6189

# Kill stuck SSH processes
Get-Process ssh | Stop-Process -Force
```

**Full troubleshooting**: See `SSH_TUNNEL_SETUP.md`

---

## 🔐 Environment Variables

Add to `.env.local`:
```
DATABASE_URL="postgresql://user:password@localhost:53332/mytxone"
REDIS_URL="redis://localhost:6189"
UPSTASH_REDIS_REST_URL="redis://localhost:6189"
```

See `.env.tunnel.example` for details.

---

**Setup Complete!** 🎉 You're ready to develop with secure SSH tunnels.
