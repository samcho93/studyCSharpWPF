# 브라우저 C# 실행 엔진 빌드: tools/runner (Blazor WebAssembly + Roslyn + WpfShim) 를 publish 하고
# runtime/cs/_framework 에 gzip 압축본으로 배치한다 (GitHub Pages 에서 그대로 제공).
#   powershell -ExecutionPolicy Bypass -File tools/build-runtime.ps1 [-SkipPublish]
param([switch]$SkipPublish)
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$runner = Join-Path $root 'tools\runner'
$pub = Join-Path $runner 'publish'
if (-not $SkipPublish) {
  Write-Host "== dotnet publish =="
  Push-Location $runner
  try { dotnet publish -c Release -o $pub --nologo -p:ContinuousIntegrationBuild=true; if ($LASTEXITCODE -ne 0) { throw "publish failed ($LASTEXITCODE)" } }
  finally { Pop-Location }
}
$src = Join-Path $pub 'wwwroot\_framework'
if (-not (Test-Path $src)) { throw "publish output missing: $src" }
$dst = Join-Path $root 'runtime\cs\_framework'
if (Test-Path $dst) { Remove-Item -Recurse -Force $dst }
New-Item -ItemType Directory -Force $dst | Out-Null
$raw = @('dotnet.js', 'blazor.boot.json', 'dotnet.boot.js')
$total = 0; $totalGz = 0; $files = @()
foreach ($f in Get-ChildItem $src -File) {
  $name = $f.Name
  if ($name -like '*.br' -or $name -like '*.gz') { continue }
  if ($name -like 'blazor.webassembly.js*') { continue }
  $total += $f.Length
  if (($raw -contains $name) -or ($name -like '*.js')) {
    Copy-Item $f.FullName (Join-Path $dst $name)
    $files += @{ name = $name; size = $f.Length; gz = $false }
    $totalGz += $f.Length
    continue
  }
  $in = [System.IO.File]::OpenRead($f.FullName)
  $outPath = Join-Path $dst ($name + '.gz')
  $out = [System.IO.File]::Create($outPath)
  $gz = New-Object System.IO.Compression.GZipStream($out, [System.IO.Compression.CompressionLevel]::Optimal)
  $in.CopyTo($gz); $gz.Dispose(); $out.Dispose(); $in.Dispose()
  $gzLen = (Get-Item $outPath).Length
  $totalGz += $gzLen
  $files += @{ name = $name; size = $f.Length; gz = $true; gzSize = $gzLen }
}
$manifest = @{ built = (Get-Date -Format 'yyyy-MM-ddTHH:mm:ss'); total = $total; totalGz = $totalGz; files = $files }
$manifest | ConvertTo-Json -Depth 4 -Compress | Set-Content -Encoding utf8 (Join-Path $root 'runtime\cs\manifest.json')
Write-Host ("== done: {0} files, {1:N1} MB raw, {2:N1} MB gz ==" -f $files.Count, ($total / 1MB), ($totalGz / 1MB))
