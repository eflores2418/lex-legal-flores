# Guía de Despliegue - Lex Legal Flores

Esta guía te ayudará a poner la aplicación en línea **GRATIS** para que tus padres puedan acceder desde cualquier computadora o teléfono.

## 📱 Características

- ✅ **100% Gratis** - Sin costo mensual
- ✅ **Acceso desde cualquier dispositivo** - Computadora, tablet, teléfono
- ✅ **Responsive** - Se adapta automáticamente al tamaño de pantalla
- ✅ **Siempre disponible** - 24/7 en línea
- ✅ **Base de datos persistente** - Los datos no se pierden

## 🚀 Opción Recomendada: Render + Vercel

### Parte 1: Preparar el Código

#### 1.1 Crear cuenta en GitHub (si no tienes)

1. Ve a https://github.com
2. Haz clic en "Sign up"
3. Completa el registro

#### 1.2 Subir el código a GitHub

```bash
cd /Users/eduardofloresruiz/Desktop/App/lawyer-client-manager

# Inicializar git
git init

# Agregar archivos
git add .

# Hacer commit
git commit -m "Initial commit - Lex Legal Flores"

# Crear repositorio en GitHub y seguir las instrucciones
```

O usa GitHub Desktop (más fácil):
1. Descarga GitHub Desktop: https://desktop.github.com
2. Abre la aplicación
3. File → Add Local Repository
4. Selecciona la carpeta `lawyer-client-manager`
5. Publish repository

### Parte 2: Desplegar el Backend (Render.com)

#### 2.1 Crear cuenta en Render

1. Ve a https://render.com
2. Haz clic en "Get Started"
3. Regístrate con GitHub (más fácil)

#### 2.2 Crear Web Service

1. En el dashboard, haz clic en "New +"
2. Selecciona "Web Service"
3. Conecta tu repositorio de GitHub
4. Configura:
   - **Name:** `lex-legal-backend`
   - **Region:** Oregon (US West)
   - **Branch:** main
   - **Root Directory:** `backend`
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Instance Type:** Free

#### 2.3 Agregar Variables de Entorno

En la sección "Environment":

```
PORT=5000
NOTIFICATION_EMAIL=notitramites22@gmail.com
WHATSAPP_TO=whatsapp:+50672898780
```

Si ya configuraste email y WhatsApp, agrega también:
```
EMAIL_USER=tu-email@gmail.com
EMAIL_PASS=tu-contraseña-de-aplicacion
TWILIO_ACCOUNT_SID=tu-account-sid
TWILIO_AUTH_TOKEN=tu-auth-token
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
```

#### 2.4 Desplegar

1. Haz clic en "Create Web Service"
2. Espera 5-10 minutos mientras se despliega
3. Copia la URL que te dan (ej: `https://lex-legal-backend.onrender.com`)

### Parte 3: Desplegar el Frontend (Vercel)

#### 3.1 Actualizar la URL del API

Edita `src/services/api.ts`:

```typescript
const API_BASE_URL = 'https://lex-legal-backend.onrender.com/api';
```

Reemplaza con tu URL de Render.

#### 3.2 Hacer commit de los cambios

```bash
git add .
git commit -m "Update API URL for production"
git push
```

#### 3.3 Crear cuenta en Vercel

1. Ve a https://vercel.com
2. Haz clic en "Sign Up"
3. Regístrate con GitHub

#### 3.4 Importar Proyecto

1. En el dashboard, haz clic en "Add New..." → "Project"
2. Selecciona tu repositorio
3. Configura:
   - **Framework Preset:** Create React App
   - **Root Directory:** `./` (raíz)
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`

4. Haz clic en "Deploy"
5. Espera 2-3 minutos

#### 3.5 Obtener la URL

Vercel te dará una URL como:
```
https://lex-legal-flores.vercel.app
```

¡Esa es tu aplicación en línea! 🎉

## 📱 Hacer la App "Instalable" en el Teléfono

### En iPhone/iPad:

1. Abre Safari
2. Ve a tu URL de Vercel
3. Toca el botón de compartir (cuadrado con flecha)
4. Selecciona "Agregar a pantalla de inicio"
5. Dale un nombre: "Lex Legal Flores"
6. ¡Listo! Ahora aparece como una app

### En Android:

1. Abre Chrome
2. Ve a tu URL de Vercel
3. Toca el menú (3 puntos)
4. Selecciona "Agregar a pantalla de inicio"
5. Dale un nombre: "Lex Legal Flores"
6. ¡Listo! Ahora aparece como una app

## 🔄 Actualizar la Aplicación

Cuando hagas cambios:

```bash
cd /Users/eduardofloresruiz/Desktop/App/lawyer-client-manager

# Hacer cambios en el código...

# Guardar cambios
git add .
git commit -m "Descripción de los cambios"
git push

# Vercel y Render se actualizarán automáticamente
```

## 💾 Base de Datos

Render incluye almacenamiento persistente gratis:
- Los datos se guardan automáticamente
- No se pierden al reiniciar
- Backup automático

## 🎨 Responsive Design

La aplicación ya está optimizada para móviles:
- ✅ Menú adaptable
- ✅ Formularios táctiles
- ✅ Botones grandes para tocar
- ✅ Texto legible en pantallas pequeñas

## 📊 Limitaciones del Plan Gratuito

**Render (Backend):**
- ✅ 750 horas/mes (suficiente para uso personal)
- ⚠️ Se "duerme" después de 15 minutos sin uso
- ⚠️ Primera carga puede tardar 30 segundos
- ✅ 100 GB de ancho de banda/mes

**Vercel (Frontend):**
- ✅ Ilimitado para proyectos personales
- ✅ Siempre rápido
- ✅ 100 GB de ancho de banda/mes

## 🔐 Seguridad

Para agregar autenticación (opcional):
1. Considera usar Clerk.com (gratis hasta 5000 usuarios)
2. O implementa autenticación básica con JWT

## 🆘 Solución de Problemas

### Backend se duerme

**Solución:** Usa un servicio de "ping" gratuito:
1. Ve a https://uptimerobot.com
2. Crea una cuenta gratis
3. Agrega tu URL de Render
4. Configura ping cada 5 minutos

### Error de CORS

Si ves errores de CORS, verifica que el backend tenga:
```javascript
app.use(cors());
```

### Base de datos no persiste

Asegúrate de que Render tenga el disco persistente activado:
1. Ve a tu servicio en Render
2. Settings → Disk
3. Verifica que esté habilitado

## 📞 Compartir con tus Padres

Envíales:
1. **URL de la aplicación:** `https://lex-legal-flores.vercel.app`
2. **Instrucciones para instalar en el teléfono** (ver arriba)
3. **Usuario/contraseña** (si agregaste autenticación)

## 💡 Mejoras Futuras

- [ ] Agregar autenticación de usuarios
- [ ] Backup automático a Google Drive
- [ ] Notificaciones push en el teléfono
- [ ] Modo offline
- [ ] Exportar reportes en PDF

## 🎓 Recursos Adicionales

- **Render Docs:** https://render.com/docs
- **Vercel Docs:** https://vercel.com/docs
- **GitHub Docs:** https://docs.github.com

---

¿Necesitas ayuda? Revisa los logs en:
- **Render:** Dashboard → Tu servicio → Logs
- **Vercel:** Dashboard → Tu proyecto → Deployments → Ver logs