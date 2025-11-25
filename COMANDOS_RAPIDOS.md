#  Comandos Rápidos

## Para ejecutar localmente:
```powershell
cd "c:\Program Files\Ampps\www\VisualizadorMusical\landing page"
npm start
```
Luego abrir: http://localhost:3001

---

## Para subir a GitHub (primera vez):
```powershell
cd "c:\Program Files\Ampps\www\VisualizadorMusical\landing page"
git init
git add .
git commit -m "Initial commit - Visualizador Musical Web"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/visualizador-musical.git
git push -u origin main
```

---

## Para actualizar cambios en GitHub:
```powershell
cd "c:\Program Files\Ampps\www\VisualizadorMusical\landing page"
git add .
git commit -m "Descripción de los cambios"
git push
```

---

## URLs importantes:
- **GitHub**: https://github.com
- **Render**: https://render.com
- **Tu proyecto (después de desplegar)**: https://TU-APP.onrender.com

---

## Configuración en Render:
- Build Command: `npm run install-server`
- Start Command: `npm start`
- Plan: Free
