param([string]$ConfigPath = (Join-Path $PSScriptRoot 'config.json'), [switch]$DryRun)
$ErrorActionPreference = 'Stop'
[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new($false)
$config = Get-Content -Raw -Encoding UTF8 $ConfigPath | ConvertFrom-Json
if ($config.repository -ne 'Shotsuke/Shotsuke.github.io') { throw 'Unexpected repository' }
Add-Type @'
using System;
using System.Runtime.InteropServices;
public static class PresenceWindow {
  [DllImport("user32.dll")] public static extern IntPtr GetForegroundWindow();
  [DllImport("user32.dll")] public static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint processId);
  [StructLayout(LayoutKind.Sequential)] public struct LASTINPUTINFO { public uint size; public uint time; }
  [DllImport("user32.dll")] public static extern bool GetLastInputInfo(ref LASTINPUTINFO info);
  public static uint IdleSeconds() {
    var info = new LASTINPUTINFO(); info.size = (uint)Marshal.SizeOf(info);
    if (!GetLastInputInfo(ref info)) return uint.MaxValue;
    return unchecked((uint)Environment.TickCount - info.time) / 1000;
  }
}
'@
# Read only the owning process name. Never read MainWindowTitle or browser contents.
[uint32]$foregroundProcessId = 0
$window = [PresenceWindow]::GetForegroundWindow()
$null = [PresenceWindow]::GetWindowThreadProcessId($window, [ref]$foregroundProcessId)
$frontApp = if ($foregroundProcessId) { (Get-Process -Id $foregroundProcessId -ErrorAction SilentlyContinue).ProcessName } else { '' }
$activity = 'using'
if (!$frontApp -or [PresenceWindow]::IdleSeconds() -ge $config.idle_after_seconds -or
    $config.private_apps -contains $frontApp -or $frontApp -in @('LockApp','LogonUI')) {
  $activity = 'away'; $frontApp = ''
} elseif ($config.browser_apps -contains $frontApp) { $activity = 'browsing' }
elseif ($config.gaming_apps -contains $frontApp) { $activity = 'gaming' }
elseif ($config.working_apps -contains $frontApp) { $activity = 'working' }
$sample = @{ device='windows'; app=[string]$frontApp; activity=$activity; sampled_at=[DateTime]::UtcNow.ToString('yyyy-MM-ddTHH:mm:ssZ') }
if ($DryRun) { $sample | ConvertTo-Json; exit 0 }
$gh = (Get-Command gh -ErrorAction Stop).Source
$body = @{ event_type='computer-presence'; client_payload=$sample } | ConvertTo-Json -Depth 4 -Compress
$OutputEncoding = [System.Text.UTF8Encoding]::new($false)
$body | & $gh api "repos/$($config.repository)/dispatches" --method POST --input -
if ($LASTEXITCODE -ne 0) { throw 'GitHub report failed; check gh auth status and network.' }
Write-Output 'Presence snapshot submitted.'
