# Guía Completa: Configurar WhatsApp con Twilio

## Paso 1: Crear Cuenta en Twilio ✅ (Ya estás aquí)

1. Haz clic en **"Create New Account"** (botón azul)
2. Completa el formulario:
   - **Account Name:** Lex Legal Flores
   - **Product:** Messaging
   - **Use Case:** Notifications & Alerts
3. Haz clic en "Continue"

---

## Paso 2: Verificar tu Número de Teléfono

1. Twilio te pedirá verificar tu número de teléfono
2. Ingresa tu número: **+506 7233 2253**
3. Recibirás un código por SMS
4. Ingresa el código para verificar

---

## Paso 3: Obtener tus Credenciales

Después de crear la cuenta, verás el **Dashboard**:

1. Busca en la parte superior:
   - **Account SID** (empieza con AC...)
   - **Auth Token** (haz clic en "Show" para verlo)

2. **COPIA ESTOS VALORES** - Los necesitarás después

Ejemplo:
```
Account SID: AC1234567890abcdef1234567890abcd
Auth Token: 1234567890abcdef1234567890abcdef
```

---

## Paso 4: Configurar WhatsApp Sandbox

### 4.1 Ir a WhatsApp Sandbox

1. En el menú izquierdo, busca **"Messaging"**
2. Haz clic en **"Try it out"**
3. Selecciona **"Send a WhatsApp message"**

### 4.2 Unirse al Sandbox

Verás una pantalla con:
- Un número de WhatsApp de Twilio (ej: **+1 415 523 8886**)
- Un código único (ej: **join abc-def**)

### 4.3 Enviar el Código desde WhatsApp

1. Abre WhatsApp en tu teléfono
2. Crea un nuevo chat con el número: **+1 415 523 8886**
3. Envía exactamente el mensaje que te muestra (ej: **join abc-def**)
4. Recibirás un mensaje de confirmación de Twilio

**IMPORTANTE:** Guarda este número de Twilio, lo necesitarás.

---

## Paso 5: Configurar en tu Aplicación

### 5.1 Editar el archivo `.env`

Abre el archivo `lawyer-client-manager/backend/.env` y completa:

```env
# WhatsApp Configuration (Twilio)
TWILIO_ACCOUNT_SID=AC1234567890abcdef1234567890abcd
TWILIO_AUTH_TOKEN=1234567890abcdef1234567890abcdef
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
TWILIO_WHATSAPP_TO=+50672332253
```

**Reemplaza:**
- `AC1234...` con tu Account SID real
- `1234567...` con tu Auth Token real
- `+14155238886` con el número de Twilio que te dieron
- `+50672332253` ya está correcto (tu número)

### 5.2 Formato Importante

- **TWILIO_WHATSAPP_FROM:** Debe incluir `whatsapp:` antes del número
- **TWILIO_WHATSAPP_TO:** Solo el número con código de país (+506)

---

## Paso 6: Configurar en Render (Producción)

1. Ve a https://dashboard.render.com
2. Selecciona tu servicio "lex-legal-flores"
3. Ve a **"Environment"** en el menú izquierdo
4. Agrega las mismas variables:

```
TWILIO_ACCOUNT_SID = AC1234567890abcdef1234567890abcd
TWILIO_AUTH_TOKEN = 1234567890abcdef1234567890abcdef
TWILIO_WHATSAPP_FROM = whatsapp:+14155238886
TWILIO_WHATSAPP_TO = +50672332253
```

5. Haz clic en **"Save Changes"**
6. Render reiniciará automáticamente el servicio

---

## Paso 7: Probar las Notificaciones

### 7.1 Reiniciar el Servidor Local (si está corriendo)

```bash
cd lawyer-client-manager/backend
# Detén el servidor (Ctrl+C)
node server.js
```

Deberías ver:
```
✅ WhatsApp notifications configured
```

### 7.2 Crear una Cita de Prueba

1. Ve a tu aplicación
2. Crea una cita para **mañana a cualquier hora**
3. Espera 15 minutos (el sistema verifica cada 15 minutos)
4. O crea una cita para **dentro de 24 horas exactas**

### 7.3 Verificar que Funciona

Recibirás un mensaje de WhatsApp como este:

```
🔔 *Recordatorio de Cita - Lex Legal Flores*

📅 *Consulta Inicial*

👤 *Cliente:* Juan Pérez
📧 *Email:* juan@example.com
📱 *Teléfono:* +506 1234 5678

🕐 *Fecha y Hora:* lunes, 28 de mayo de 2026, 10:00
⏱️ *Duración:* 60 minutos
📍 *Tipo de Cita:* Presencial

⏰ Esta cita está programada para dentro de 24 horas.
```

---

## Solución de Problemas

### ❌ "WhatsApp notifications not configured"

**Causa:** Las credenciales no están en el `.env`

**Solución:**
1. Verifica que el archivo `.env` tenga las 3 variables de Twilio
2. Reinicia el servidor

### ❌ "Error sending WhatsApp: 21608"

**Causa:** No te has unido al sandbox

**Solución:**
1. Abre WhatsApp
2. Envía el código de unión al número de Twilio
3. Espera la confirmación

### ❌ "Error sending WhatsApp: 21211"

**Causa:** Número de teléfono inválido

**Solución:**
1. Verifica que `TWILIO_WHATSAPP_FROM` tenga el formato: `whatsapp:+14155238886`
2. Verifica que `TWILIO_WHATSAPP_TO` tenga el formato: `+50672332253`

### ❌ No recibo mensajes

**Posibles causas:**
1. El sandbox expira después de 3 días de inactividad
   - **Solución:** Envía el código de unión nuevamente
2. El número no está verificado
   - **Solución:** Verifica tu número en Twilio
3. La cita no está dentro de las próximas 24 horas
   - **Solución:** Crea una cita para mañana

---

## Costos de Twilio

### Cuenta de Prueba (Trial)
- ✅ **Gratis** para desarrollo
- ✅ Incluye crédito inicial ($15 USD)
- ⚠️ Solo puedes enviar a números verificados
- ⚠️ Los mensajes incluyen "Sent from your Twilio trial account"

### Cuenta de Producción
- 💰 **$0.005 USD** por mensaje de WhatsApp (~5 colones)
- 💰 Sin mensajes de "trial account"
- 💰 Puedes enviar a cualquier número

### Recomendación
Usa la cuenta de prueba hasta que estés seguro de que todo funciona correctamente.

---

## Resumen de Pasos

1. ✅ Crear cuenta en Twilio
2. ✅ Verificar tu número de teléfono
3. ✅ Copiar Account SID y Auth Token
4. ✅ Unirse al WhatsApp Sandbox
5. ✅ Configurar variables en `.env`
6. ✅ Configurar variables en Render
7. ✅ Probar con una cita de prueba

---

## Siguiente Paso: Configurar Email

Una vez que WhatsApp funcione, configura también el email siguiendo la guía en:
`CONFIGURACION_NOTIFICACIONES.md`

---

**¿Necesitas ayuda?** Revisa los logs del servidor para ver mensajes de error específicos.

**Made with Bob** 🤖