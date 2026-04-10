@echo off
setlocal

set "KEY=C:\Users\ankit\.ssh\blixamo_bot"
set "RHOST=bot@204.168.203.255"

if "%~1"=="" (
  ssh -i "%KEY%" -o IdentitiesOnly=yes -o StrictHostKeyChecking=no %RHOST%
) else (
  ssh -i "%KEY%" -o IdentitiesOnly=yes -o StrictHostKeyChecking=no %RHOST% %*
)
