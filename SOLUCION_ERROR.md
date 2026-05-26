# Solución al Error de Conexión

Si ves el mensaje "Error al cargar los datos del panel. Asegúrese de que el servidor backend esté ejecutándose", sigue estos pasos:

## Solución Rápida:

### 1. Limpia la Caché del Navegador
En tu navegador, presiona:
- **Mac:** `Cmd + Shift + R` o `Cmd + Option + R`
- **Windows:** `Ctrl + Shift + R` o `Ctrl + F5`

### 2. O Abre en Modo Incógnito
- **Chrome/Edge:** `Cmd + Shift + N` (Mac) o `Ctrl + Shift + N` (Windows)
- **Safari:** `Cmd + Shift + N`
- **Firefox:** `Cmd + Shift + P` (Mac) o `Ctrl + Shift + P` (Windows)

Luego ve a: http://localhost:3000

### 3. Verifica que Ambos Servidores Estén Corriendo

**Terminal 1 - Backend:**
```bash
cd lawyer-client-manager/backend
node server.js
```
Deberías ver:
```
Server is running on port 5000
API available at http://localhost:5000/api
Connected to the SQLite database.
```

**Terminal 2 - Frontend:**
```bash
cd lawyer-client-manager
npm start
```
Deberías ver:
```
Compiled successfully!
```

### 4. Si Aún No Funciona

Reinicia ambos servidores:

1. En cada terminal, presiona `Ctrl + C` para detener
2. Vuelve a ejecutar los comandos de arriba

## Verificación Manual

Puedes verificar que el backend funciona abriendo en tu navegador:
http://localhost:5000/api/stats

Deberías ver algo como:
```json
{"totalClients":0,"totalAppointments":0,"upcomingAppointments":0,"todayAppointments":0}
```

Si ves esto, el backend está funcionando correctamente y solo necesitas limpiar la caché del navegador.