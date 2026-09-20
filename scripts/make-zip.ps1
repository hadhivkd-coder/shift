$source = "C:\Users\Shafeeq\.gemini\antigravity\scratch\shift"
$destZip = "C:\Users\Shafeeq\.gemini\antigravity\scratch\SHIFT-Blueprint-App.zip"

if (Test-Path $destZip) { Remove-Item $destZip -Force }

Write-Host "Creating clean zip package (excluding node_modules and .next)..."

$items = Get-ChildItem -Path $source | Where-Object { $_.Name -ne 'node_modules' -and $_.Name -ne '.next' }
Compress-Archive -Path $items.FullName -DestinationPath $destZip -CompressionLevel Optimal

$sizeMB = [math]::Round(((Get-Item $destZip).Length / 1MB), 2)
Write-Host "SUCCESS! Zip package created at:"
Write-Host "$destZip ($sizeMB MB)"
