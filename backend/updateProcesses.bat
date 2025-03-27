@echo off
tasklist /FO CSV > processes.txt
powershell -Command "& {Import-Csv processes.txt | ConvertTo-Json | Set-Content -Path processes.json}"
