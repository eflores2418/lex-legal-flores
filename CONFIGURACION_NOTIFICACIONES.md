# Configuración de Notificaciones por Email y WhatsApp

El sistema está configurado para enviar notificaciones automáticas a:
- **Email:** notitramites22@gmail.com
- **WhatsApp:** +506 7289-8780

## Estado Actual

✅ **Sistema de notificaciones instalado y listo**
⚠️ **Requiere configuración de credenciales para funcionar**

## Configuración de Email (Gmail)

### Paso 1: Crear Contraseña de Aplicación en Gmail

1. Ve a tu cuenta de Gmail: https://myaccount.google.com/
2. En el menú izquierdo, selecciona "Seguridad"
3. En "Cómo inicias sesión en Google", activa la "Verificación en dos pasos" (si no está activada)
4. Una vez activada, busca "Contraseñas de aplicaciones"
5. Selecciona "Correo" y "Otro (nombre personalizado)"
6. Escribe "Lex Legal Flores" y haz clic en "Generar"
7. Copia la contraseña de 16 caracteres que aparece

### Paso 2: Configurar en el Sistema

Edita el archivo `backend/.env` y agrega:

```env
EMAIL_USER=tu-email@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx
```

Reemplaza:
- `tu-email@gmail.com` con tu email de Gmail
- `xxxx xxxx xxxx xxxx` con la contraseña de aplicación que generaste

## Configuración de WhatsApp (Twilio)

### Paso 1: Crear Cuenta en Twilio

1. Ve a https://www.twilio.com/try-twilio
2. Regístrate con tu email
3. Verifica tu número de teléfono
4. En el dashboard, encontrarás:
   - **Account SID**
   - **Auth Token**

### Paso 2: Configurar WhatsApp Sandbox

1. En el dashboard de Twilio, ve a "Messaging" → "Try it out" → "Send a WhatsApp message"
2. Sigue las instrucciones para unirte al sandbox de WhatsApp
3. Envía el mensaje de código desde WhatsApp al número de Twilio
4. El número de WhatsApp de Twilio será algo como: `whatsapp:+14155238886`

### Paso 3: Configurar en el Sistema

Edita el archivo `backend/.env` y agrega:

```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=tu_auth_token_aqui
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
```

## Archivo .env Completo

Tu archivo `backend/.env` debería verse así:

```env
# Configuración de Email
EMAIL_USER=tu-email@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx
NOTIFICATION_EMAIL=notitramites22@gmail.com

# Configuración de WhatsApp
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=tu_auth_token_aqui
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
WHATSAPP_TO=whatsapp:+50672898780

# Puerto del servidor
PORT=5000
```

## Reiniciar el Servidor

Después de configurar las credenciales:

1. Detén el servidor backend (Ctrl+C en la terminal)
2. Vuelve a iniciarlo:
   ```bash
   cd lawyer-client-manager/backend
   node server.js
   ```

Deberías ver:
```
✅ Email notifications configured
✅ WhatsApp notifications configured
```

## Probar las Notificaciones

### Opción 1: Crear una Cita de Prueba

1. Crea una cita para mañana a cualquier hora
2. Espera 15 minutos (el sistema verifica cada 15 minutos)
3. Deberías recibir las notificaciones

### Opción 2: Crear una Cita para Dentro de 24 Horas

1. Crea una cita para exactamente dentro de 24 horas
2. El sistema enviará las notificaciones automáticamente

## Funcionamiento del Sistema

- ✅ Verifica citas cada 15 minutos
- ✅ Envía recordatorios 24 horas antes de cada cita
- ✅ Envía email a: notitramites22@gmail.com
- ✅ Envía WhatsApp a: +506 7289-8780
- ✅ Marca los recordatorios como enviados para evitar duplicados

## Solución de Problemas

### Email no se envía

1. Verifica que EMAIL_USER y EMAIL_PASS estén correctos
2. Asegúrate de usar una contraseña de aplicación, no tu contraseña normal
3. Verifica que la verificación en dos pasos esté activada en Gmail

### WhatsApp no se envía

1. Verifica que las credenciales de Twilio sean correctas
2. Asegúrate de haber completado el proceso de sandbox
3. Verifica que el número de WhatsApp esté en el formato correcto: `whatsapp:+50672898780`

### Ver logs en tiempo real

En la terminal del backend verás mensajes como:
```
🔔 Sending notifications for appointment: Consulta Inicial
📧 Email sent to notitramites22@gmail.com
📱 WhatsApp sent to whatsapp:+50672898780
```

## Costos

- **Email (Gmail):** Gratis
- **WhatsApp (Twilio):** 
  - Sandbox: Gratis para pruebas
  - Producción: Requiere cuenta de pago (~$0.005 por mensaje)

## Notas Importantes

- Las notificaciones se envían automáticamente 24 horas antes de cada cita
- Si no configuras las credenciales, el sistema funcionará pero no enviará notificaciones
- Los recordatorios solo se envían una vez por cita
- El sistema verifica cada 15 minutos si hay recordatorios pendientes