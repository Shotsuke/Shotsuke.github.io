$ErrorActionPreference = 'Stop'
$null = Get-Command gh -ErrorAction Stop
$destination = Join-Path $env:LOCALAPPDATA 'ShotsukePresence'
New-Item -ItemType Directory -Force $destination | Out-Null
Copy-Item (Join-Path $PSScriptRoot 'report-windows.ps1') $destination -Force
$configPath = Join-Path $destination 'config.json'
if (!(Test-Path $configPath)) {
  $config = Get-Content -Raw -Encoding UTF8 (Join-Path $PSScriptRoot 'config.example.json') | ConvertFrom-Json
  $config.device = 'windows'
  $config | ConvertTo-Json -Depth 4 | Set-Content -Encoding UTF8 $configPath
}
$script = Join-Path $destination 'report-windows.ps1'
$arguments = '-NoProfile -NonInteractive -WindowStyle Hidden -File "' + $script + '"'
$action = New-ScheduledTaskAction -Execute 'powershell.exe' -Argument $arguments
$triggers = @((New-ScheduledTaskTrigger -AtLogOn), (New-ScheduledTaskTrigger -Once -At (Get-Date).AddMinutes(1) -RepetitionInterval (New-TimeSpan -Minutes 10)))
$principal = New-ScheduledTaskPrincipal -UserId ([System.Security.Principal.WindowsIdentity]::GetCurrent().Name) -LogonType Interactive -RunLevel Limited
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -ExecutionTimeLimit (New-TimeSpan -Minutes 2) -MultipleInstances IgnoreNew
Register-ScheduledTask -TaskName 'ShotsukePresence' -Action $action -Trigger $triggers -Principal $principal -Settings $settings -Force | Out-Null
Write-Output "Windows reporter installed. Configuration: $configPath"
