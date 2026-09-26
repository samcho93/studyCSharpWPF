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
  # 이전 publish 결과를 지운다 — 지문이 붙은 옛 파일(CsRunner.xxxx.dll 등)이 쌓여 함께 배포되지 않도록
  if (Test-Path $pub) { Remove-Item -Recurse -Force $pub }
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
# publish 폴더에는 예전 빌드의 지문(fingerprint) 파일이 남아 있을 수 있다 → 이번 blazor.boot.json 이 쓰는 것만 배포한다
$boot = Get-Content (Join-Path $src 'blazor.boot.json') -Raw | ConvertFrom-Json
$used = @{}
if ($boot.resources.fingerprinting) { foreach ($p in $boot.resources.fingerprinting.PSObject.Properties) { $used[$p.Name] = $true } }
$fingerprinted = '^.+\.[0-9a-z]{10}\.(dll|wasm|dat|js)$'
$total = 0; $totalGz = 0; $files = @(); $skipped = 0
foreach ($f in Get-ChildItem $src -File) {
  $name = $f.Name
  if ($name -like '*.br' -or $name -like '*.gz') { continue }
  if ($name -like 'blazor.webassembly.js*') { continue }
  if (($name -match $fingerprinted) -and ($used.Count -gt 0) -and (-not $used.ContainsKey($name))) { $skipped++; continue }
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
Write-Host ("== done: {0} files, {1:N1} MB raw, {2:N1} MB gz (옛 빌드 파일 {3}개 제외) ==" -f $files.Count, ($total / 1MB), ($totalGz / 1MB), $skipped)
