# Guía: Conexión SSH entre Antigravity y GitHub Codespaces

Este documento resume los comandos exactos utilizados para conectar el entorno local (Windows/Antigravity) con el entorno remoto (Codespaces).

## Ubicación del Archivo
Este archivo se encuentra en el **Módulo 2** del curso.

## Paso 1: Autenticación y Permisos (PowerShell Local)
Fue necesario refrescar las credenciales para dar permiso de acceso a "codespaces".
```powershell
gh auth refresh -h github.com -s codespace
```

## Paso 2: Obtener datos de conexión (PowerShell Local)
Seleccionamos el entorno activo (Available) para obtener el bloque de configuración SSH.
```powershell
gh cs ssh --config
```

## Paso 3: Configurar SSH en Windows
Editamos el archivo de configuración en `C:\Users\USUARIO\.ssh\config`.
**Puntos clave:**
1. Se aseguró que el archivo no tuviera extensión `.txt`.
2. Se agregaron comillas a las rutas con espacios (ej: "Program Files").

```text
Host cs.legendary-space-doodle
    User codespace
    ProxyCommand "C:\Program Files\GitHub CLI\gh.exe" cs ssh -c legendary-space-doodle...
    IdentityFile "C:\Users\TALIGENT\.ssh/codespaces.auto"
```

## Paso 4: Conexión desde Antigravity
1. Abrir la paleta de comandos (`F1` o `Ctrl+Shift+P`).
2. Ejecutar: `Remote-SSH: Connect to Host...`
3. Seleccionar el host configurado (`cs.legendary-space-doodle`).

## Paso 5: Verificación
Una vez conectado, la terminal muestra:
`@calabres -> ~ $`
