# Quick Start Guide

## Getting Started in 3 Steps

### Step 1: Start the Backend Server

Open a terminal and run:

```bash
cd lawyer-client-manager/backend
npm start
```

You should see:
```
Server is running on port 5000
API available at http://localhost:5000/api
Connected to the SQLite database.
```

**Keep this terminal window open!**

### Step 2: Start the Frontend

Open a **NEW** terminal window and run:

```bash
cd lawyer-client-manager
npm start
```

The application will automatically open in your browser at `http://localhost:3000`

### Step 3: Start Using the Application

1. **Add Your First Client:**
   - Click "Clients" in the navigation
   - Click "+ Add New Client"
   - Fill in the client information
   - Click "Create Client"

2. **Schedule an Appointment:**
   - Click "Appointments" in the navigation
   - Click "+ Schedule Appointment"
   - Select the client you just created
   - Fill in appointment details
   - Click "Schedule Appointment"

3. **View Dashboard:**
   - Click "Dashboard" to see your overview
   - View statistics and upcoming appointments

## Important Notes

- **Both servers must be running** for the application to work
- The backend runs on port 5000
- The frontend runs on port 3000
- Data is stored in `backend/lawyer_clients.db`
- Reminders are checked every 15 minutes automatically

## Stopping the Application

1. In the frontend terminal: Press `Ctrl+C`
2. In the backend terminal: Press `Ctrl+C`

## Need Help?

See the full [README.md](README.md) for detailed documentation.