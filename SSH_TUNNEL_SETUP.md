# SSH Tunnel Configuration for mytx.one Development

## Overview

This project uses SSH tunnels to securely access remote PostgreSQL and Redis services during development. The tunnels establish secure connections from your local machine to the remote server.

## Architecture

```
Local Machine                    SSH Server                  Remote Services
├── localhost:53332 ─────SSH──→ 85.215.209.220:53332 ─→ PostgreSQL (53332)
└── localhost:6189 ─────SSH──→ 85.215.209.220:6189 ─→ Redis (6189)
```

## SSH Server Details

- **Host**: ssh.mytx.co
- **Port**: 36936
- **User**: itay
- **Remote IP**: 85.215.209.220

## Local Port Mapping

| Service    | Local Port | Remote Host          | Remote Port | Purpose              |
|-----------|-----------|---------------------|------------|----------------------|
| PostgreSQL | 53332      | 85.215.209.220     | 53332       | Database access      |
| Redis      | 6189      | 85.215.209.220     | 6189       | Cache & rate limiting|

## Setup Instructions

### Prerequisites

1. **SSH Access**: Ensure you have SSH access configured to `ssh.mytx.co`
2. **SSH Key**: Make sure your SSH key is added to your system (usually `~/.ssh/id_rsa`)
3. **SSH Agent**: SSH agent should be running with your key loaded

### Test SSH Connection

```powershell
ssh -p 36936 itay@ssh.mytx.co -N
```

If this command connects without errors, your SSH setup is correct. Press `Ctrl+C` to disconnect.

### Usage

#### Option 1: Automatic Tunnel Management (Recommended)

Start the dev server with automatic tunnel management:

```powershell
npm run dev
```

This will:
1. ✅ Start SSH tunnels for PostgreSQL (53332) and Redis (6189)
2. ✅ Wait 2 seconds for tunnels to establish
3. ✅ Start the Next.js dev server
4. ✅ Manage all processes together
5. ✅ Clean up tunnels when dev server exits

#### Option 2: Manual Tunnel Management

Start tunnels separately:

```powershell
npm run tunnels:start
```

In another terminal, start the dev server:

```powershell
npm run dev:no-tunnels
```

When done, stop the tunnels:

```powershell
npm run tunnels:stop
```

## Scripts Reference

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start tunnels + dev server (recommended) |
| `npm run dev:no-tunnels` | Start dev server only (requires manual tunnels) |
| `npm run tunnels:start` | Manually start SSH tunnels |
| `npm run tunnels:stop` | Manually stop SSH tunnels |

## Troubleshooting

### SSH Connection Refused

**Error**: `ssh: connect to host ssh.mytx.co port 36936: Connection refused`

**Solution**:
- Verify the SSH host and port are correct
- Check if SSH server is running and accessible
- Ensure firewall isn't blocking port 36936

### Permission Denied

**Error**: `Permission denied (publickey)`

**Solution**:
- Verify SSH key is loaded: `ssh-add -l`
- Add your key if needed: `ssh-add ~/.ssh/id_rsa`
- Ensure key permissions are correct: `chmod 600 ~/.ssh/id_rsa`

### Database Connection Failed

**Error**: `Error: connect ECONNREFUSED 127.0.0.1:53332`

**Solution**:
1. Verify tunnels are running:
   ```powershell
   netstat -ano | findstr :53332
   ```
2. Check tunnel logs:
   - PostgreSQL: `tunnel-53332.log`
   - Redis: `tunnel-6189.log`
3. Restart tunnels:
   ```powershell
   npm run tunnels:stop
   npm run tunnels:start
   ```

### Tunnels Already Running on Ports

**Error**: `Address already in use`

**Solution**:
```powershell
# Kill existing SSH processes
Get-Process ssh | Stop-Process -Force

# Or find specific process
Get-Process | Where-Object {$_.CommandLine -like "*ssh*"}
```

## Environment Variables

Ensure these are set in your `.env.local`:

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:53332/mytxone"

# Redis (for rate limiting)
REDIS_URL="redis://localhost:6189"
UPSTASH_REDIS_REST_URL="redis://localhost:6189"
```

## Logs

Tunnel logs are saved to the project root:

- `tunnel-53332.log` - PostgreSQL tunnel output
- `tunnel-53332-error.log` - PostgreSQL tunnel errors
- `tunnel-6189.log` - Redis tunnel output
- `tunnel-6189-error.log` - Redis tunnel errors

## Performance Notes

- SSH tunnels add minimal latency (~5-10ms)
- Suitable for development and testing
- Not recommended for production use

## Security Considerations

- ✅ All connections are encrypted via SSH
- ✅ SSH key-based authentication required
- ✅ Tunnels only accessible locally (127.0.0.1)
- ⚠️ Never commit SSH keys to version control
- ⚠️ Keep SSH credentials secure

## Advanced Configuration

### Custom Tunnel Ports

To use different local ports, modify `start-tunnels.ps1`:

```powershell
# Change from
ssh -L 53332:85.215.209.220:53332 ...

# To (example: port 5433)
ssh -L 5433:85.215.209.220:53332 ...
```

Then update `DATABASE_URL` accordingly.

### Persistent Tunnels

For long-running tunnels that don't restart:

```powershell
npm run tunnels:start
# This will keep running in background
```

The tunnels will stay active until you run `npm run tunnels:stop`.

## References

- [SSH Port Forwarding](https://www.ssh.com/ssh/tunneling/local)
- [SSH Config Documentation](https://linux.die.net/man/5/ssh_config)
- [PostgreSQL Remote Access](https://www.postgresql.org/docs/current/auth-pg-hba-conf.html)
- [Redis Security](https://redis.io/topics/security)
