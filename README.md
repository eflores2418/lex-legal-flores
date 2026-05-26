# Law Office Client Manager

A comprehensive client and appointment management system designed specifically for law offices. This application helps lawyers manage their clients, schedule appointments, track case details, and receive automatic reminders.

## Features

### Client Management
- ✅ Add, view, edit, and delete clients
- ✅ Store client contact information (name, email, phone, address)
- ✅ Add detailed case descriptions for each client
- ✅ Track tasks and things to do for each client
- ✅ Search clients by name, email, or phone
- ✅ View all appointments for a specific client

### Appointment Scheduling
- ✅ Schedule appointments with clients
- ✅ Set appointment date, time, duration, and location
- ✅ Add appointment descriptions and notes
- ✅ Track appointment status (scheduled, confirmed, completed, cancelled, rescheduled)
- ✅ View all appointments in a table format
- ✅ Filter appointments (all, upcoming, past)
- ✅ Edit and delete appointments

### Reminder System
- ✅ Automatic reminders 24 hours before appointments
- ✅ Reminder check runs every 15 minutes
- ✅ Console notifications for upcoming appointments
- ✅ Track which reminders have been sent

### Dashboard
- ✅ Overview statistics (total clients, appointments, upcoming appointments, today's appointments)
- ✅ Quick view of upcoming appointments (next 7 days)
- ✅ Quick action buttons for common tasks

## Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **SQLite3** - Database
- **node-cron** - Scheduled tasks for reminders
- **CORS** - Cross-origin resource sharing

### Frontend
- **React** - UI framework
- **TypeScript** - Type safety
- **React Router** - Navigation
- **Axios** - HTTP client

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setup Instructions

1. **Clone or navigate to the project directory:**
   ```bash
   cd lawyer-client-manager
   ```

2. **Install backend dependencies:**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies:**
   ```bash
   cd ..
   npm install
   ```

## Running the Application

You need to run both the backend and frontend servers:

### 1. Start the Backend Server

```bash
cd backend
npm start
```

The backend server will start on `http://localhost:5000`

The database will be automatically created on first run.

### 2. Start the Frontend Development Server

In a new terminal window:

```bash
cd lawyer-client-manager
npm start
```

The frontend will start on `http://localhost:3000` and automatically open in your browser.

## Usage Guide

### Adding a Client

1. Click "Clients" in the navigation menu
2. Click "+ Add New Client" button
3. Fill in the client information:
   - Name (required)
   - Email, phone, address (optional)
   - Case description
   - Tasks/things to do
4. Click "Create Client"

### Viewing Client Details

1. Go to the Clients page
2. Click "View Details" on any client card
3. You'll see:
   - Full contact information
   - Case description
   - Tasks list
   - All appointments for this client

### Scheduling an Appointment

1. Click "Appointments" in the navigation menu
2. Click "+ Schedule Appointment" button
3. Fill in the appointment details:
   - Select a client (required)
   - Title (required)
   - Date and time (required)
   - Duration (default: 60 minutes)
   - Location
   - Status
   - Description/notes
4. Click "Schedule Appointment"

**Note:** A reminder will be automatically created for 24 hours before the appointment.

### Managing Appointments

- **View all appointments:** Go to Appointments page
- **Filter appointments:** Use the filter buttons (All, Upcoming, Past)
- **Edit appointment:** Click "Edit" button on any appointment
- **Delete appointment:** Click "Delete" button and confirm

### Dashboard Overview

The dashboard provides:
- Statistics cards showing totals
- List of upcoming appointments (next 7 days)
- Quick action buttons for common tasks

## Database Schema

### Clients Table
- `id` - Primary key
- `name` - Client name (required)
- `email` - Email address
- `phone` - Phone number
- `address` - Physical address
- `description` - Case description
- `tasks` - Tasks/things to do
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

### Appointments Table
- `id` - Primary key
- `client_id` - Foreign key to clients
- `title` - Appointment title (required)
- `description` - Appointment notes
- `appointment_date` - Date and time (required)
- `duration` - Duration in minutes
- `location` - Meeting location
- `status` - Status (scheduled, confirmed, completed, cancelled, rescheduled)
- `reminder_sent` - Whether reminder was sent
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

### Reminders Table
- `id` - Primary key
- `appointment_id` - Foreign key to appointments
- `reminder_time` - When to send reminder
- `sent` - Whether reminder was sent
- `created_at` - Creation timestamp

## API Endpoints

### Clients
- `GET /api/clients` - Get all clients
- `GET /api/clients/:id` - Get single client
- `POST /api/clients` - Create new client
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client

### Appointments
- `GET /api/appointments` - Get all appointments
- `GET /api/appointments/:id` - Get single appointment
- `GET /api/clients/:id/appointments` - Get appointments for a client
- `GET /api/appointments/upcoming` - Get upcoming appointments (next 7 days)
- `POST /api/appointments` - Create new appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Delete appointment

### Statistics
- `GET /api/stats` - Get dashboard statistics

## Reminder System

The reminder system runs automatically in the background:

- Checks for upcoming appointments every 15 minutes
- Sends reminders 24 hours before appointments
- Logs reminder notifications to the console
- Marks reminders as sent to avoid duplicates

To see reminders in action:
1. Schedule an appointment for tomorrow
2. Check the backend console after 15 minutes
3. You'll see a reminder notification

## Customization

### Changing Reminder Time

Edit `backend/server.js` and modify the reminder creation logic:

```javascript
// Change from 24 hours to 2 hours before
const reminderTime = new Date(appointmentTime.getTime() - 2 * 60 * 60 * 1000);
```

### Changing Reminder Check Frequency

Edit the cron schedule in `backend/server.js`:

```javascript
// Check every 5 minutes instead of 15
cron.schedule('*/5 * * * *', () => {
  checkReminders();
});
```

## Troubleshooting

### Backend won't start
- Make sure port 5000 is not in use
- Check that all dependencies are installed: `npm install`

### Frontend can't connect to backend
- Verify backend is running on port 5000
- Check the API_BASE_URL in `src/services/api.ts`

### Database errors
- Delete `backend/lawyer_clients.db` and restart the backend to recreate the database

## Future Enhancements

Potential features to add:
- Email notifications for reminders
- Document management for clients
- Calendar view for appointments
- Export client/appointment data to PDF
- User authentication and multi-user support
- Billing and invoicing integration
- Case status tracking
- Court date tracking

## License

This project is created for personal use.

## Support

For issues or questions, please refer to the documentation or check the code comments.
