# 📋 Guía para Hacer Público tu Proyecto

## Paso 1: Verificar que todo funciona localmente ✅

Ya completado - el servidor funciona correctamente.

## Paso 2: Crear cuenta en GitHub

1. Ve a [github.com](https://github.com)
2. Clic en "Sign up" (Registrarse)
3. Completa el registro con tu email

## Paso 3: Crear repositorio en GitHub

1. Inicia sesión en GitHub
2. Clic en el botón "+" (arriba derecha) → "New repository"
3. Configuración:
   - **Repository name**: `visualizador-musical`
   - **Description**: "Visualizador Musical Web - Proyecto Programación 2"
   - **Public** (seleccionar público)
   - ❌ NO marcar "Add a README file" (ya lo tenemos)
4. Clic en "Create repository"

## Paso 4: Subir tu código a GitHub

Abre PowerShell en la carpeta del proyecto y ejecuta:

```powershell
# Inicializar Git
git init

# Agregar todos los archivos
git add .

# Hacer commit
git commit -m "Initial commit - Visualizador Musical Web"

# Renombrar rama principal
git branch -M main

# Conectar con GitHub (REEMPLAZA con tu URL)
git remote add origin https://github.com/TU_USUARIO/visualizador-musical.git

# Subir código
git push -u origin main
```

**Si Git pide usuario/contraseña:**
- Usa tu email de GitHub
- Contraseña: Genera un "Personal Access Token" en GitHub Settings → Developer settings → Personal access tokens

## Paso 5: Desplegar en Render.com (GRATIS)

### A. Crear cuenta en Render

1. Ve a [render.com](https://render.com)
2. Clic en "Get Started" o "Sign Up"
3. Regístrate con GitHub (recomendado) o email

### B. Crear Web Service

1. En Render Dashboard, clic en "New +" → "Web Service"
2. Clic en "Connect account" para conectar GitHub
3. Autoriza a Render acceder a tus repositorios
4. Busca `visualizador-musical` en la lista
5. Clic en "Connect"

### C. Configurar el servicio

**Configuración básica:**
- **Name**: `visualizador-musical` (puedes cambiarlo)
- **Region**: Oregon (US West) - el más cercano
- **Branch**: `main`
- **Root Directory**: (dejar vacío)
- **Environment**: `Node`
- **Build Command**: `npm run install-server`
- **Start Command**: `npm start`

**Plan:**
- Selecciona: **Free** (gratis)
  - 750 horas/mes
  - Se duerme después de 15 min de inactividad
  - Despierta automáticamente al acceder

**Variables de entorno:**
- No necesitas agregar ninguna por ahora

### D. Desplegar

1. Clic en "Create Web Service"
2. Render comenzará a:
   - 📥 Clonar tu repositorio
   - 📦 Instalar dependencias (`npm run install-server`)
   - 🚀 Iniciar servidor (`npm start`)
3. Espera 3-5 minutos (primera vez puede tardar más)

### E. Obtener tu URL pública

Cuando termine el despliegue:
- Verás: ✅ "Live" (en verde)
- Tu URL será algo como: `https://visualizador-musical.onrender.com`
- **¡Esa es tu URL pública!**

## Paso 6: Compartir tu proyecto 🎉

Tu proyecto estará disponible en:
- **Landing Page**: `https://TU-APP.onrender.com`
- **Visualizador**: `https://TU-APP.onrender.com/home`

Puedes compartir estos enlaces con:
- ✅ Profesores
- ✅ Compañeros
- ✅ Amigos
- ✅ En tu CV / Portfolio

## 🔄 Actualizaciones futuras

Cada vez que hagas cambios:

```powershell
git add .
git commit -m "Descripción de los cambios"
git push
```

Render detectará automáticamente los cambios y **redesplegarán tu sitio** en unos minutos.

## ⚠️ Notas Importantes

1. **El plan gratuito de Render:**
   - Se duerme después de 15 minutos sin uso
   - La primera carga después de dormir tarda ~30 segundos
   - Perfecto para proyectos académicos y demos

2. **YouTube:**
   - Funcionará en producción
   - Puede que algunos videos estén bloqueados por región

3. **Archivos de audio:**
   - Los 8 demos están incluidos
   - Los usuarios pueden subir sus propios MP3/WAV

## 🆘 Si algo sale mal

**Error en Build:**
- Verifica que `package.json` esté en la raíz
- Revisa los logs en Render

**Error 404:**
- Verifica que `index.html` y `home.html` estén en la ubicación correcta

**YouTube no funciona:**
- Verifica que el servidor esté corriendo (debe estar en "Live" en Render)
- Revisa los logs en Render → "Logs"

## 📞 Soporte

- **GitHub Issues**: Crea un issue en tu repositorio
- **Render Support**: [render.com/docs](https://render.com/docs)

---

¡Éxito con tu proyecto! 🎵✨
