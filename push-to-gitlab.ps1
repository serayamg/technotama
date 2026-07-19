# PowerShell Script to easily push RTI Neo codebase to GitLab

Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "     RTI Neo - GitLab Push Configuration" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

# 1. Ask for GitLab Repository URL
$gitlabUrl = Read-Host "Masukkan URL Repository GitLab Anda (Contoh: https://gitlab.com/username/rti-neo.git)"

if ([string]::IsNullOrWhiteSpace($gitlabUrl)) {
    Write-Host "Error: URL tidak boleh kosong!" -ForegroundColor Red
    Exit
}

# 2. Check if git remote 'origin' already exists
$existingRemote = git remote get-url origin 2>$null

if ($existingRemote) {
    Write-Host "Remote 'origin' sudah ada: $existingRemote" -ForegroundColor Yellow
    $choice = Read-Host "Apakah Anda ingin mengganti remote 'origin' dengan URL GitLab baru ini? (y/n)"
    if ($choice.ToLower() -eq 'y') {
        git remote set-url origin $gitlabUrl
        Write-Host "Berhasil mengganti remote URL 'origin' ke: $gitlabUrl" -ForegroundColor Green
    } else {
        Write-Host "Menambahkan remote baru dengan nama 'gitlab'..." -ForegroundColor Yellow
        git remote add gitlab $gitlabUrl
        $remoteName = "gitlab"
    }
} else {
    git remote add origin $gitlabUrl
    Write-Host "Berhasil menambahkan remote 'origin' dengan URL: $gitlabUrl" -ForegroundColor Green
    $remoteName = "origin"
}

if (-not $remoteName) {
    $remoteName = "origin"
}

# 3. Ensure we are on 'main' branch
Write-Host "Mengatur branch utama ke 'main'..." -ForegroundColor Gray
git branch -M main

# 4. Push code to GitLab
Write-Host "Memulai proses push file ke GitLab..." -ForegroundColor Gray
Write-Host "Anda mungkin akan diminta memasukkan username/password GitLab atau Personal Access Token (PAT)." -ForegroundColor Yellow

git push -u $remoteName main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "=============================================" -ForegroundColor Green
    Write-Host " SUCCESS: Kode berhasil disimpan di GitLab!" -ForegroundColor Green
    Write-Host "=============================================" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "=============================================" -ForegroundColor Red
    Write-Host " ERROR: Gagal melakukan push ke GitLab." -ForegroundColor Red
    Write-Host " Silakan periksa koneksi, hak akses, atau PAT Anda." -ForegroundColor Red
    Write-Host "=============================================" -ForegroundColor Red
}
