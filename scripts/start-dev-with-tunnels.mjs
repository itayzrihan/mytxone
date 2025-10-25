import { spawn, execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = dirname(__dirname);
const tunnelScript = path.join(rootDir, 'start-tunnels.ps1');

// Function to check if tunnel is running
function isTunnelRunning(port) {
  try {
    const output = execSync(`netstat -ano | findstr :${port}`, {
      encoding: 'utf-8',
      stdio: 'pipe'
    });
    return output && output.trim().length > 0;
  } catch {
    return false;
  }
}

// Function to wait for tunnel with timeout
function waitForTunnelWithRetry(port, maxWaitTime = 50000) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const checkInterval = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const remainingSeconds = Math.ceil((maxWaitTime - elapsedTime) / 1000);

      if (isTunnelRunning(port)) {
        clearInterval(checkInterval);
        resolve(true);
        return;
      }

      if (elapsedTime >= maxWaitTime) {
        clearInterval(checkInterval);
        resolve(false);
        return;
      }

      process.stdout.write(`\r⏳ Waiting for tunnel on port ${port}... ${remainingSeconds}s remaining`);
    }, 500);
  });
}

console.log('🌐 Starting SSH tunnels and dev server...\n');

// Main async function
(async () => {
  // Check if tunnels are already running
  console.log('🔍 Checking for existing tunnels...');
  const postgresRunning = isTunnelRunning(53332);
  const redisRunning = isTunnelRunning(6189);

  if (postgresRunning && redisRunning) {
    console.log('✅ PostgreSQL tunnel is running on port 53332');
    console.log('✅ Redis tunnel is running on port 6189');
    console.log('✅ All tunnels already active! Proceeding with dev server...\n');
  } else {
    if (!postgresRunning) {
      console.log('⚠️  PostgreSQL tunnel not detected on port 53332');
    }
    if (!redisRunning) {
      console.log('⚠️  Redis tunnel not detected on port 6189');
    }

    console.log('\n📡 Starting SSH tunnels in separate window...');
    console.log('⏳ Waiting up to 50 seconds for tunnel initialization...\n');

    // Launch tunnel script in separate window
    spawn('powershell', [
      '-ExecutionPolicy', 'Bypass',
      '-File', tunnelScript
    ], {
      stdio: 'inherit',
      cwd: rootDir
    });

    // Wait for tunnels to be ready
    const tunnelsReady = await Promise.all([
      waitForTunnelWithRetry(53332),
      waitForTunnelWithRetry(6189)
    ]);

    if (!tunnelsReady[0] || !tunnelsReady[1]) {
      console.log('\n⚠️  Tunnel startup timeout reached');
      if (!tunnelsReady[0]) console.log('⚠️  PostgreSQL tunnel did not start within 50 seconds');
      if (!tunnelsReady[1]) console.log('⚠️  Redis tunnel did not start within 50 seconds');
      console.log('⏳ Continuing anyway... Tunnels may still initialize\n');
    } else {
      console.log('\n✅ All tunnels initialized successfully!\n');
    }
  }

  // Start Next.js dev server
  console.log('🚀 Starting Next.js dev server...\n');

  const devProcess = spawn('cmd', ['/c', 'npm run dev:no-tunnels'], {
    stdio: 'inherit',
    cwd: rootDir,
    shell: true
  });

  // Handle termination
  process.on('SIGINT', () => {
    console.log('\n\n🛑 Shutting down...');
    devProcess.kill('SIGINT');
    process.exit(0);
  });

  devProcess.on('error', (err) => {
    console.error('❌ Failed to start dev server:', err);
    process.exit(1);
  });

  devProcess.on('exit', (code) => {
    console.log(`\n🛑 Dev server exited with code ${code}`);
    process.exit(code || 0);
  });
})();
