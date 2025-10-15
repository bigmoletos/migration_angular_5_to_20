# Script de rafraîchissement du PATH pour Angular CLI
# Auteur: Assistant IA
# Date: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

param(
    [switch]$AddNodeJS = $true,
    [switch]$AddAngularCLI = $true,
    [switch]$Quiet = $false
)

function Write-Info {
    param($Message)
    if (-not $Quiet) {
        Write-Host $Message
    }
}

function Refresh-Path {
    Write-Info "Rafraîchissement du PATH pour Angular CLI..."

    # Récupérer les PATH système
    $userPath = [Environment]::GetEnvironmentVariable('PATH', 'User')
    $machinePath = [Environment]::GetEnvironmentVariable('PATH', 'Machine')

    # Reconstruire le PATH complet
    $env:PATH = $userPath + ';' + $machinePath

    Write-Info "PATH combiné: $($env:PATH.Length) caractères"

    # Ajouter Node.js si demandé
    if ($AddNodeJS) {
        $nodejsPath = "C:\Program Files\nodejs"
        if (Test-Path $nodejsPath) {
            if ($env:PATH -notlike "*$nodejsPath*") {
                $env:PATH = $env:PATH + ";" + $nodejsPath
                Write-Info "Node.js ajouté: $nodejsPath"
            } else {
                Write-Info "Node.js déjà présent"
            }
        } else {
            Write-Info "ATTENTION: Node.js non trouvé dans $nodejsPath"
        }
    }

    # Ajouter le dossier npm global si demandé
    if ($AddAngularCLI) {
        try {
            $npmGlobalPath = npm config get prefix 2>$null
            if ($npmGlobalPath -and (Test-Path $npmGlobalPath)) {
                if ($env:PATH -notlike "*$npmGlobalPath*") {
                    $env:PATH = $env:PATH + ";" + $npmGlobalPath
                    Write-Info "Dossier npm global ajouté: $npmGlobalPath"
                } else {
                    Write-Info "Dossier npm global déjà présent"
                }
            } else {
                Write-Info "ATTENTION: Dossier npm global non trouvé"
            }
        } catch {
            Write-Info "ATTENTION: Impossible de récupérer le dossier npm global"
        }
    }
}

function Test-Tools {
    Write-Info "=== TEST DES OUTILS ==="

    # Test Node.js
    try {
        $nodeVersion = node --version 2>$null
        if ($nodeVersion) {
            Write-Info "Node.js: $nodeVersion ✓"
        } else {
            Write-Info "Node.js: Non accessible ✗"
        }
    } catch {
        Write-Info "Node.js: Erreur ✗"
    }

    # Test npm
    try {
        $npmVersion = npm --version 2>$null
        if ($npmVersion) {
            Write-Info "npm: $npmVersion ✓"
        } else {
            Write-Info "npm: Non accessible ✗"
        }
    } catch {
        Write-Info "npm: Erreur ✗"
    }

    # Test Angular CLI
    try {
        $ngVersion = ng version 2>$null
        if ($ngVersion) {
            Write-Info "Angular CLI: Disponible ✓"
        } else {
            Write-Info "Angular CLI: Non accessible ✗"
        }
    } catch {
        Write-Info "Angular CLI: Erreur ✗"
    }
}

function Install-AngularCLI {
    Write-Info "=== INSTALLATION D'ANGULAR CLI ==="

    try {
        Write-Info "Installation d'Angular CLI en cours..."
        npm install -g @angular/cli 2>$null

        # Rafraîchir le PATH après installation
        $npmGlobalPath = npm config get prefix 2>$null
        if ($npmGlobalPath -and (Test-Path $npmGlobalPath)) {
            if ($env:PATH -notlike "*$npmGlobalPath*") {
                $env:PATH = $env:PATH + ";" + $npmGlobalPath
                Write-Info "Dossier npm global ajouté après installation"
            }
        }

        Write-Info "Angular CLI installé avec succès"
        return $true
    } catch {
        Write-Info "ERREUR: Impossible d'installer Angular CLI - $($_.Exception.Message)"
        return $false
    }
}

# Exécution principale
try {
    if (-not $Quiet) {
        Write-Host "=== RAFRAÎCHISSEMENT DU PATH POUR ANGULAR ===" -ForegroundColor Green
    }

    # Rafraîchir le PATH
    Refresh-Path

    # Tester les outils
    Test-Tools

    # Vérifier Angular CLI
    $angularWorking = $false
    try {
        $ngVersion = ng version 2>$null
        if ($ngVersion) {
            $angularWorking = $true
            Write-Info "Angular CLI: Fonctionnel ✓"
        }
    } catch {
        Write-Info "Angular CLI: Non fonctionnel ✗"
    }

    # Installer Angular CLI si nécessaire
    if (-not $angularWorking -and $AddAngularCLI) {
        Write-Info "Angular CLI non trouvé - Installation..."
        $installSuccess = Install-AngularCLI

        if ($installSuccess) {
            # Tester à nouveau après installation
            try {
                $ngVersion = ng version 2>$null
                if ($ngVersion) {
                    $angularWorking = $true
                    Write-Info "Angular CLI: Installé et fonctionnel ✓"
                }
            } catch {
                Write-Info "Angular CLI: Installation échouée ✗"
            }
        }
    }

    if (-not $Quiet) {
        Write-Host "=== RÉSUMÉ ===" -ForegroundColor Cyan
        Write-Host "PATH: $($env:PATH.Length) caractères"
        Write-Host "Node.js: $(if (Get-Command node -ErrorAction SilentlyContinue) { 'FONCTIONNEL' } else { 'NON FONCTIONNEL' })"
        Write-Host "Angular CLI: $(if ($angularWorking) { 'FONCTIONNEL' } else { 'NON FONCTIONNEL' })"
    }

    if ($angularWorking) {
        Write-Host "SUCCÈS: Angular CLI est maintenant accessible" -ForegroundColor Green
        return 0
    } else {
        Write-Host "ERREUR: Angular CLI n'est pas accessible" -ForegroundColor Red
        return 1
    }

} catch {
    Write-Host "ERREUR: $($_.Exception.Message)" -ForegroundColor Red
    return 1
}

if (-not $Quiet) {
    Write-Host "Rafraîchissement terminé" -ForegroundColor Green
}
