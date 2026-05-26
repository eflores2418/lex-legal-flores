const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cron = require('node-cron');
const db = require('./database');
const { sendAllNotifications } = require('./notifications');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ==================== CLIENT ENDPOINTS ====================

// Get all clients
app.get('/api/clients', (req, res) => {
  try {
    const clients = db.prepare('SELECT * FROM clients ORDER BY created_at DESC').all();
    res.json({ clients });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single client by ID
app.get('/api/clients/:id', (req, res) => {
  try {
    const client = db.prepare('SELECT * FROM clients WHERE id = ?').get(req.params.id);
    if (!client) {
      res.status(404).json({ error: 'Client not found' });
      return;
    }
    res.json({ client });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new client
app.post('/api/clients', (req, res) => {
  const { name, email, phone, address, description, tasks } = req.body;
  
  if (!name) {
    res.status(400).json({ error: 'Name is required' });
    return;
  }

  try {
    const stmt = db.prepare(`INSERT INTO clients (name, email, phone, address, description, tasks) 
                             VALUES (?, ?, ?, ?, ?, ?)`);
    const result = stmt.run(name, email, phone, address, description, tasks);
    
    res.json({
      message: 'Client created successfully',
      client: { id: result.lastInsertRowid, name, email, phone, address, description, tasks }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update client
app.put('/api/clients/:id', (req, res) => {
  const { name, email, phone, address, description, tasks } = req.body;
  
  try {
    const stmt = db.prepare(`UPDATE clients 
                             SET name = ?, email = ?, phone = ?, address = ?, description = ?, tasks = ?, updated_at = CURRENT_TIMESTAMP
                             WHERE id = ?`);
    const result = stmt.run(name, email, phone, address, description, tasks, req.params.id);
    
    if (result.changes === 0) {
      res.status(404).json({ error: 'Client not found' });
      return;
    }
    res.json({ message: 'Client updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete client
app.delete('/api/clients/:id', (req, res) => {
  try {
    const stmt = db.prepare('DELETE FROM clients WHERE id = ?');
    const result = stmt.run(req.params.id);
    
    if (result.changes === 0) {
      res.status(404).json({ error: 'Client not found' });
      return;
    }
    res.json({ message: 'Client deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== APPOINTMENT ENDPOINTS ====================

// Get all appointments
app.get('/api/appointments', (req, res) => {
  try {
    const appointments = db.prepare(`SELECT a.*, c.name as client_name, c.email as client_email, c.phone as client_phone
                                     FROM appointments a
                                     LEFT JOIN clients c ON a.client_id = c.id
                                     ORDER BY a.appointment_date ASC`).all();
    res.json({ appointments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get appointments for a specific client
app.get('/api/clients/:id/appointments', (req, res) => {
  try {
    const appointments = db.prepare(`SELECT * FROM appointments WHERE client_id = ? ORDER BY appointment_date ASC`).all(req.params.id);
    res.json({ appointments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single appointment
app.get('/api/appointments/:id', (req, res) => {
  try {
    const appointment = db.prepare(`SELECT a.*, c.name as client_name, c.email as client_email, c.phone as client_phone
                                    FROM appointments a
                                    LEFT JOIN clients c ON a.client_id = c.id
                                    WHERE a.id = ?`).get(req.params.id);
    if (!appointment) {
      res.status(404).json({ error: 'Appointment not found' });
      return;
    }
    res.json({ appointment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new appointment
app.post('/api/appointments', (req, res) => {
  const { client_id, title, description, appointment_date, duration, location, status } = req.body;
  
  if (!client_id || !title || !appointment_date) {
    res.status(400).json({ error: 'Client ID, title, and appointment date are required' });
    return;
  }

  try {
    const stmt = db.prepare(`INSERT INTO appointments (client_id, title, description, appointment_date, duration, location, status) 
                             VALUES (?, ?, ?, ?, ?, ?, ?)`);
    const result = stmt.run(client_id, title, description, appointment_date, duration || 60, location, status || 'scheduled');
    
    // Create reminder (24 hours before appointment)
    const appointmentTime = new Date(appointment_date);
    const reminderTime = new Date(appointmentTime.getTime() - 24 * 60 * 60 * 1000);
    
    const reminderStmt = db.prepare('INSERT INTO reminders (appointment_id, reminder_time) VALUES (?, ?)');
    reminderStmt.run(result.lastInsertRowid, reminderTime.toISOString());

    res.json({
      message: 'Appointment created successfully',
      appointment: { id: result.lastInsertRowid, client_id, title, description, appointment_date, duration, location, status }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update appointment
app.put('/api/appointments/:id', (req, res) => {
  const { client_id, title, description, appointment_date, duration, location, status } = req.body;
  
  try {
    const stmt = db.prepare(`UPDATE appointments 
                             SET client_id = ?, title = ?, description = ?, appointment_date = ?, duration = ?, location = ?, status = ?, updated_at = CURRENT_TIMESTAMP
                             WHERE id = ?`);
    const result = stmt.run(client_id, title, description, appointment_date, duration, location, status, req.params.id);
    
    if (result.changes === 0) {
      res.status(404).json({ error: 'Appointment not found' });
      return;
    }
    res.json({ message: 'Appointment updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete appointment
app.delete('/api/appointments/:id', (req, res) => {
  try {
    const stmt = db.prepare('DELETE FROM appointments WHERE id = ?');
    const result = stmt.run(req.params.id);
    
    if (result.changes === 0) {
      res.status(404).json({ error: 'Appointment not found' });
      return;
    }
    res.json({ message: 'Appointment deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== REMINDER SYSTEM ====================

// Check for upcoming appointments and send reminders
async function checkReminders() {
  const now = new Date().toISOString();
  
  try {
    const reminders = db.prepare(`SELECT r.*, a.*, c.name as client_name, c.email as client_email, c.phone as client_phone, c.address
                                   FROM reminders r
                                   JOIN appointments a ON r.appointment_id = a.id
                                   JOIN clients c ON a.client_id = c.id
                                   WHERE r.sent = 0 AND r.reminder_time <= ?`).all(now);
    
    for (const reminder of reminders) {
      console.log(`\n🔔 REMINDER: Appointment "${reminder.title}" with ${reminder.client_name} on ${reminder.appointment_date}`);
      
      // Preparar datos de la cita y cliente
      const appointment = {
        id: reminder.appointment_id,
        title: reminder.title,
        description: reminder.description,
        appointment_date: reminder.appointment_date,
        duration: reminder.duration,
        location: reminder.location,
        status: reminder.status
      };
      
      const client = {
        name: reminder.client_name,
        email: reminder.client_email,
        phone: reminder.client_phone,
        address: reminder.address
      };
      
      // Enviar notificaciones por email y WhatsApp
      try {
        await sendAllNotifications(appointment, client);
      } catch (error) {
        console.error('Error sending notifications:', error.message);
      }
      
      // Mark reminder as sent
      db.prepare('UPDATE reminders SET sent = 1 WHERE id = ?').run(reminder.id);
      
      // Mark appointment reminder as sent
      db.prepare('UPDATE appointments SET reminder_sent = 1 WHERE id = ?').run(reminder.appointment_id);
    }
  } catch (err) {
    console.error('Error checking reminders:', err.message);
  }
}

// Run reminder check every 15 minutes
cron.schedule('*/15 * * * *', () => {
  console.log('Checking for reminders...');
  checkReminders();
});

// Get upcoming appointments (next 7 days)
app.get('/api/appointments/upcoming', (req, res) => {
  const now = new Date().toISOString();
  const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  
  try {
    const appointments = db.prepare(`SELECT a.*, c.name as client_name, c.email as client_email, c.phone as client_phone
                                     FROM appointments a
                                     LEFT JOIN clients c ON a.client_id = c.id
                                     WHERE a.appointment_date BETWEEN ? AND ?
                                     ORDER BY a.appointment_date ASC`).all(now, nextWeek);
    res.json({ appointments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== STATISTICS ENDPOINTS ====================

// Get dashboard statistics
app.get('/api/stats', (req, res) => {
  try {
    const totalClients = db.prepare('SELECT COUNT(*) as count FROM clients').get().count;
    const totalAppointments = db.prepare('SELECT COUNT(*) as count FROM appointments').get().count;
    const upcomingAppointments = db.prepare('SELECT COUNT(*) as count FROM appointments WHERE appointment_date > ? AND status = "scheduled"').get(new Date().toISOString()).count;
    const completedAppointments = db.prepare('SELECT COUNT(*) as count FROM appointments WHERE status = "completed"').get().count;
    
    res.json({
      totalClients,
      totalAppointments,
      upcomingAppointments,
      completedAppointments
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Made with Bob