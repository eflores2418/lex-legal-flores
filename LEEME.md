# Gestor de Clientes para Bufete Legal

Un sistema completo de gestión de clientes y citas diseñado específicamente para bufetes legales. Esta aplicación ayuda a los abogados a gestionar sus clientes, agendar citas, rastrear detalles de casos y recibir recordatorios automáticos.

## Características

### Gestión de Clientes
- ✅ Agregar, ver, editar y eliminar clientes
- ✅ Almacenar información de contacto del cliente (nombre, email, teléfono, dirección)
- ✅ Agregar descripciones detalladas de casos para cada cliente
- ✅ Rastrear tareas y cosas por hacer para cada cliente
- ✅ Buscar clientes por nombre, email o teléfono
- ✅ Ver todas las citas de un cliente específico

### Agendamiento de Citas
- ✅ Agendar citas con clientes
- ✅ Establecer fecha, hora, duración y ubicación de la cita
- ✅ Agregar descripciones y notas de citas
- ✅ Rastrear estado de citas (agendada, confirmada, completada, cancelada, reagendada)
- ✅ Ver todas las citas en formato de tabla
- ✅ Filtrar citas (todas, próximas, pasadas)
- ✅ Editar y eliminar citas

### Sistema de Recordatorios
- ✅ Recordatorios automáticos 24 horas antes de las citas
- ✅ Verificación de recordatorios cada 15 minutos
- ✅ Notificaciones en consola para citas próximas
- ✅ Rastreo de recordatorios enviados

### Panel Principal
- ✅ Estadísticas generales (total de clientes, citas, citas próximas, citas de hoy)
- ✅ Vista rápida de citas próximas (próximos 7 días)
- ✅ Botones de acción rápida para tareas comunes

## Stack Tecnológico

### Backend
- **Node.js** - Entorno de ejecución
- **Express** - Framework web
- **SQLite3** - Base de datos
- **node-cron** - Tareas programadas para recordatorios
- **CORS** - Compartir recursos de origen cruzado

### Frontend
- **React** - Framework de UI
- **TypeScript** - Seguridad de tipos
- **React Router** - Navegación
- **Axios** - Cliente HTTP

## Instalación

### Requisitos Previos
- Node.js (v14 o superior)
- npm o yarn

### Instrucciones de Configuración

1. **Clonar o navegar al directorio del proyecto:**
   ```bash
   cd lawyer-client-manager
   ```

2. **Instalar dependencias del backend:**
   ```bash
   cd backend
   npm install
   ```

3. **Instalar dependencias del frontend:**
   ```bash
   cd ..
   npm install
   ```

## Ejecutar la Aplicación

Necesita ejecutar tanto el servidor backend como el frontend:

### 1. Iniciar el Servidor Backend

```bash
cd backend
npm start
```

El servidor backend se iniciará en `http://localhost:5000`

La base de datos se creará automáticamente en la primera ejecución.

### 2. Iniciar el Servidor de Desarrollo Frontend

En una nueva ventana de terminal:

```bash
cd lawyer-client-manager
npm start
```

El frontend se iniciará en `http://localhost:3000` y se abrirá automáticamente en su navegador.

## Guía de Uso

### Agregar un Cliente

1. Haga clic en "Clientes" en el menú de navegación
2. Haga clic en el botón "+ Agregar Nuevo Cliente"
3. Complete la información del cliente:
   - Nombre (requerido)
   - Email, teléfono, dirección (opcional)
   - Descripción del caso
   - Tareas/cosas por hacer
4. Haga clic en "Crear Cliente"

### Ver Detalles del Cliente

1. Vaya a la página de Clientes
2. Haga clic en "Ver Detalles" en cualquier tarjeta de cliente
3. Verá:
   - Información de contacto completa
   - Descripción del caso
   - Lista de tareas
   - Todas las citas para este cliente

### Agendar una Cita

1. Haga clic en "Citas" en el menú de navegación
2. Haga clic en el botón "+ Agendar Cita"
3. Complete los detalles de la cita:
   - Seleccione un cliente (requerido)
   - Título (requerido)
   - Fecha y hora (requerido)
   - Duración (predeterminado: 60 minutos)
   - Ubicación
   - Estado
   - Descripción/notas
4. Haga clic en "Agendar Cita"

**Nota:** Se creará automáticamente un recordatorio para 24 horas antes de la cita.

### Gestionar Citas

- **Ver todas las citas:** Vaya a la página de Citas
- **Filtrar citas:** Use los botones de filtro (Todas, Próximas, Pasadas)
- **Editar cita:** Haga clic en el botón "Editar" en cualquier cita
- **Eliminar cita:** Haga clic en el botón "Eliminar" y confirme

### Vista General del Panel

El panel principal proporciona:
- Tarjetas de estadísticas mostrando totales
- Lista de citas próximas (próximos 7 días)
- Botones de acción rápida para tareas comunes

## Esquema de Base de Datos

### Tabla Clients (Clientes)
- `id` - Clave primaria
- `name` - Nombre del cliente (requerido)
- `email` - Dirección de email
- `phone` - Número de teléfono
- `address` - Dirección física
- `description` - Descripción del caso
- `tasks` - Tareas/cosas por hacer
- `created_at` - Marca de tiempo de creación
- `updated_at` - Marca de tiempo de última actualización

### Tabla Appointments (Citas)
- `id` - Clave primaria
- `client_id` - Clave foránea a clientes
- `title` - Título de la cita (requerido)
- `description` - Notas de la cita
- `appointment_date` - Fecha y hora (requerido)
- `duration` - Duración en minutos
- `location` - Ubicación de la reunión
- `status` - Estado (agendada, confirmada, completada, cancelada, reagendada)
- `reminder_sent` - Si se envió el recordatorio
- `created_at` - Marca de tiempo de creación
- `updated_at` - Marca de tiempo de última actualización

### Tabla Reminders (Recordatorios)
- `id` - Clave primaria
- `appointment_id` - Clave foránea a citas
- `reminder_time` - Cuándo enviar el recordatorio
- `sent` - Si se envió el recordatorio
- `created_at` - Marca de tiempo de creación

## Endpoints de la API

### Clientes
- `GET /api/clients` - Obtener todos los clientes
- `GET /api/clients/:id` - Obtener un cliente
- `POST /api/clients` - Crear nuevo cliente
- `PUT /api/clients/:id` - Actualizar cliente
- `DELETE /api/clients/:id` - Eliminar cliente

### Citas
- `GET /api/appointments` - Obtener todas las citas
- `GET /api/appointments/:id` - Obtener una cita
- `GET /api/clients/:id/appointments` - Obtener citas de un cliente
- `GET /api/appointments/upcoming` - Obtener citas próximas (próximos 7 días)
- `POST /api/appointments` - Crear nueva cita
- `PUT /api/appointments/:id` - Actualizar cita
- `DELETE /api/appointments/:id` - Eliminar cita

### Estadísticas
- `GET /api/stats` - Obtener estadísticas del panel

## Sistema de Recordatorios

El sistema de recordatorios se ejecuta automáticamente en segundo plano:

- Verifica citas próximas cada 15 minutos
- Envía recordatorios 24 horas antes de las citas
- Registra notificaciones de recordatorios en la consola
- Marca los recordatorios como enviados para evitar duplicados

Para ver los recordatorios en acción:
1. Agende una cita para mañana
2. Revise la consola del backend después de 15 minutos
3. Verá una notificación de recordatorio

## Personalización

### Cambiar el Tiempo de Recordatorio

Edite `backend/server.js` y modifique la lógica de creación de recordatorios:

```javascript
// Cambiar de 24 horas a 2 horas antes
const reminderTime = new Date(appointmentTime.getTime() - 2 * 60 * 60 * 1000);
```

### Cambiar la Frecuencia de Verificación de Recordatorios

Edite el horario cron en `backend/server.js`:

```javascript
// Verificar cada 5 minutos en lugar de 15
cron.schedule('*/5 * * * *', () => {
  checkReminders();
});
```

## Solución de Problemas

### El backend no inicia
- Asegúrese de que el puerto 5000 no esté en uso
- Verifique que todas las dependencias estén instaladas: `npm install`

### El frontend no puede conectarse al backend
- Verifique que el backend esté ejecutándose en el puerto 5000
- Revise la API_BASE_URL en `src/services/api.ts`

### Errores de base de datos
- Elimine `backend/lawyer_clients.db` y reinicie el backend para recrear la base de datos

## Mejoras Futuras

Características potenciales para agregar:
- Notificaciones por email para recordatorios
- Gestión de documentos para clientes
- Vista de calendario para citas
- Exportar datos de clientes/citas a PDF
- Autenticación de usuarios y soporte multi-usuario
- Integración de facturación
- Seguimiento de estado de casos
- Seguimiento de fechas de tribunal

## Licencia

Este proyecto fue creado para uso personal.

## Soporte

Para problemas o preguntas, consulte la documentación o revise los comentarios del código.