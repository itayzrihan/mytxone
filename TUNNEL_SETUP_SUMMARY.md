# SSH Tunnel Setup - Complete Summary

## ✅ Implementation Complete

Your mytx.one development environment now has automatic SSH tunnel management integrated with your dev server.

---

## 📦 Files Created

### 1. **Tunnel Management Scripts**

#### `start-tunnels.ps1`
- PowerShell script to start SSH tunnels
- Creates 2 tunnels: PostgreSQL (53332) + Redis (6189)
- Color-coded output with status messages
- Saves logs: `tunnel-53332.log`, `tunnel-6189.log`

#### `stop-tunnels.ps1`
- PowerShell script to stop SSH tunnels
- Gracefully terminates SSH processes
- Safe error handling

#### `scripts/start-dev-with-tunnels.mjs`
- Node.js orchestrator script
- Automatically starts tunnels before dev server
- 2-second delay for tunnel establishment
- Manages both processes together
- Clean shutdown handling

### 2. **Documentation**

#### `TUNNEL_QUICKSTART.md` ⭐ START HERE
- 2-line quick start guide
- Command reference
- Common troubleshooting
- Best for: Getting started quickly (2 min read)

#### `SSH_TUNNEL_README.md`
- Overview of tunnel setup
- File listing
- Quick commands
- Next steps
- Best for: Understanding what was added (5 min read)

#### `TUNNEL_SETUP_COMPLETE.md`
- Detailed setup summary
- How it works diagram
- Environment variables
- Troubleshooting guide
- Best for: Understanding the complete picture (10 min read)

#### `SSH_TUNNEL_SETUP.md`
- Comprehensive technical documentation
- Architecture overview
- Prerequisites
- Setup instructions
- Troubleshooting with solutions
- Performance notes
- Security considerations
- Best for: Deep dive & advanced configuration (20+ min read)

#### `TUNNEL_SETUP_VISUAL.txt`
- ASCII art visual guide
- Workflow diagram
- Quick reference
- All info in one place
- Best for: Visual learners

#### `.env.tunnel.example`
- Environment variable template
- Database URL format
- Redis URL format
- Configuration reference

### 3. **Configuration Updates**

#### `package.json` - 4 new npm scripts:
```json
"dev": "node scripts/start-dev-with-tunnels.mjs"
"dev:no-tunnels": "next dev --turbo"
"tunnels:start": "powershell -ExecutionPolicy Bypass -File start-tunnels.ps1"
"tunnels:stop": "powershell -ExecutionPolicy Bypass -File stop-tunnels.ps1"
```

---

## 🚀 Quick Start

### Most Recommended: Automatic (1 line)
```powershell
npm run dev
```

### Alternative: Manual Management (3 commands)
```powershell
npm run tunnels:start
npm run dev:no-tunnels
npm run tunnels:stop  # When done
```

---

## 🔌 Tunnel Details

```
Your Machine              SSH Server              Remote Services
localhost:53332 ───────► ssh.mytx.co:36936 ────► 85.215.209.220:53332 (PostgreSQL)
localhost:6189 ───────► ssh.mytx.co:36936 ────► 85.215.209.220:6189 (Redis)
                           User: itay
```

---

## 🔐 Required Environment Variables

Add to your `.env.local`:

```bash
# Database (PostgreSQL via tunnel)
DATABASE_URL="postgresql://user:password@localhost:53332/mytxone"

# Redis (Cache & rate limiting via tunnel)
REDIS_URL="redis://localhost:6189"
UPSTASH_REDIS_REST_URL="redis://localhost:6189"
```

See `.env.tunnel.example` for full reference.

---

## 📋 Available Commands

| Command | Purpose | Auto Tunnels |
|---------|---------|--------------|
| `npm run dev` | Start with auto tunnels (RECOMMENDED) | ✅ Yes |
| `npm run dev:no-tunnels` | Dev server only | ❌ No |
| `npm run tunnels:start` | Start tunnels manually | ✅ Yes |
| `npm run tunnels:stop` | Stop tunnels manually | ✅ Yes |

---

## 🔍 Verification

### Test SSH Connection
```powershell
ssh -p 36936 itay@ssh.mytx.co -N
# Press Ctrl+C to disconnect
```

### Check if Tunnels Are Running
```powershell
# PostgreSQL tunnel
netstat -ano | findstr :53332

# Redis tunnel
netstat -ano | findstr :6189
```

### View Tunnel Logs
```powershell
# PostgreSQL
cat tunnel-53332.log
cat tunnel-53332-error.log

# Redis
cat tunnel-6189.log
cat tunnel-6189-error.log
```

---

## 🎯 Workflow Example

```
1. Open PowerShell
2. cd d:\Ordered\DEV\mytx.one
3. npm run dev

   [Output shows:]
   🌐 Starting SSH tunnels and dev server...
   📡 Starting SSH tunnels...
   ✅ PostgreSQL tunnel started
   ✅ Redis tunnel started
   ✅ All tunnels started!
   
   [Wait 2 seconds...]
   
   ✅ Tunnels started, starting Next.js dev server...
   
   - ready - started server on 0.0.0.0:3000, url: http://localhost:3000

4. Open http://localhost:3000 in browser
5. Develop normally
6. Press Ctrl+C when done
   
   [Tunnels automatically stop]
   🛑 Shutting down...
   🛑 Dev server exited with code 0
```

---

## 🆘 Troubleshooting

### Issue: "Permission denied (publickey)"
**Solution:**
```powershell
# Check SSH key
ssh-add -l

# Add SSH key if needed
ssh-add ~/.ssh/id_rsa
```

### Issue: "Address already in use"
**Solution:**
```powershell
# Kill existing SSH processes
Get-Process ssh | Stop-Process -Force
```

### Issue: "Connection refused"
**Solution:**
- Verify SSH server is accessible
- Check firewall settings
- Ensure correct port (36936)

### Issue: "connect ECONNREFUSED 127.0.0.1:53332"
**Solution:**
1. Verify tunnels are running: `netstat -ano | findstr :53332`
2. Check logs: `cat tunnel-53332.log`
3. Restart tunnels: `npm run tunnels:stop && npm run tunnels:start`

---

## 📚 Documentation Navigation

**First time?** Start here in this order:
1. `TUNNEL_QUICKSTART.md` (2 min)
2. `SSH_TUNNEL_README.md` (5 min)
3. `TUNNEL_SETUP_COMPLETE.md` (10 min)

**Visual learner?**
- `TUNNEL_SETUP_VISUAL.txt` - ASCII diagrams and reference

**Need deep dive?**
- `SSH_TUNNEL_SETUP.md` - Complete technical reference

**Need config help?**
- `.env.tunnel.example` - Environment variable template

---

## ✨ Features

✅ **Automatic Management** - Tunnels start/stop with dev server  
✅ **SSH Encryption** - All traffic encrypted  
✅ **Color Output** - Easy to read console messages  
✅ **Detailed Logging** - Separate logs for each tunnel  
✅ **Error Handling** - Graceful shutdown and error messages  
✅ **Cross-Platform** - PowerShell + Node.js (works on Windows)  
✅ **No Dependencies** - Uses built-in tools  

---

## 🔐 Security Notes

✅ **Encrypted Connections** - All traffic through SSH tunnels  
✅ **Local Only** - Tunnels only accessible from localhost  
✅ **Key-Based Auth** - SSH key authentication required  
⚠️ **Keep Keys Safe** - Never commit SSH keys to git  
⚠️ **Dev Environment Only** - Not for production  

---

## 🎉 You're Ready!

Everything is set up. To start developing:

```powershell
npm run dev
```

Tunnels will automatically start, and you're ready to code! 🚀

---

**Questions?** See the comprehensive documentation files above.
