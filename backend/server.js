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
  const sql = 'SELECT * FROM clients ORDER BY created_at DESC';
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ clients: rows });
  });
});

// Get single client by ID
app.get('/api/clients/:id', (req, res) => {
  const sql = 'SELECT * FROM clients WHERE id = ?';
  db.get(sql, [req.params.id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Client not found' });
      return;
    }
    res.json({ client: row });
  });
});

// Create new client
app.post('/api/clients', (req, res) => {
  const { name, email, phone, address, description, tasks } = req.body;
  
  if (!name) {
    res.status(400).json({ error: 'Name is required' });
    return;
  }

  const sql = `INSERT INTO clients (name, email, phone, address, description, tasks) 
               VALUES (?, ?, ?, ?, ?, ?)`;
  const params = [name, email, phone, address, description, tasks];

  db.run(sql, params, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: 'Client created successfully',
      client: { id: this.lastID, name, email, phone, address, description, tasks }
    });
  });
});

// Update client
app.put('/api/clients/:id', (req, res) => {
  const { name, email, phone, address, description, tasks } = req.body;
  const sql = `UPDATE clients 
               SET name = ?, email = ?, phone = ?, address = ?, description = ?, tasks = ?, updated_at = CURRENT_TIMESTAMP
               WHERE id = ?`;
  const params = [name, email, phone, address, description, tasks, req.params.id];

  db.run(sql, params, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Client not found' });
      return;
    }
    res.json({ message: 'Client updated successfully' });
  });
});

// Delete client
app.delete('/api/clients/:id', (req, res) => {
  const sql = 'DELETE FROM clients WHERE id = ?';
  db.run(sql, [req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Client not found' });
      return;
    }
    res.json({ message: 'Client deleted successfully' });
  });
});

// ==================== APPOINTMENT ENDPOINTS ====================

// Get all appointments
app.get('/api/appointments', (req, res) => {
  const sql = `SELECT a.*, c.name as client_name, c.email as client_email, c.phone as client_phone
               FROM appointments a
               LEFT JOIN clients c ON a.client_id = c.id
               ORDER BY a.appointment_date ASC`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ appointments: rows });
  });
});

// Get appointments for a specific client
app.get('/api/clients/:id/appointments', (req, res) => {
  const sql = `SELECT * FROM appointments WHERE client_id = ? ORDER BY appointment_date ASC`;
  db.all(sql, [req.params.id], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ appointments: rows });
  });
});

// Get single appointment
app.get('/api/appointments/:id', (req, res) => {
  const sql = `SELECT a.*, c.name as client_name, c.email as client_email, c.phone as client_phone
               FROM appointments a
               LEFT JOIN clients c ON a.client_id = c.id
               WHERE a.id = ?`;
  db.get(sql, [req.params.id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Appointment not found' });
      return;
    }
    res.json({ appointment: row });
  });
});

// Create new appointment
app.post('/api/appointments', (req, res) => {
  const { client_id, title, description, appointment_date, duration, location, status } = req.body;
  
  if (!client_id || !title || !appointment_date) {
    res.status(400).json({ error: 'Client ID, title, and appointment date are required' });
    return;
  }

  const sql = `INSERT INTO appointments (client_id, title, description, appointment_date, duration, location, status) 
               VALUES (?, ?, ?, ?, ?, ?, ?)`;
  const params = [client_id, title, description, appointment_date, duration || 60, location, status || 'scheduled'];

  db.run(sql, params, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    // Create reminder (24 hours before appointment)
    const appointmentTime = new Date(appointment_date);
    const reminderTime = new Date(appointmentTime.getTime() - 24 * 60 * 60 * 1000);
    
    const reminderSql = 'INSERT INTO reminders (appointment_id, reminder_time) VALUES (?, ?)';
    db.run(reminderSql, [this.lastID, reminderTime.toISOString()], (err) => {
      if (err) {
        console.error('Error creating reminder:', err.message);
      }
    });

    res.json({
      message: 'Appointment created successfully',
      appointment: { id: this.lastID, client_id, title, description, appointment_date, duration, location, status }
    });
  });
});

// Update appointment
app.put('/api/appointments/:id', (req, res) => {
  const { client_id, title, description, appointment_date, duration, location, status } = req.body;
  const sql = `UPDATE appointments 
               SET client_id = ?, title = ?, description = ?, appointment_date = ?, duration = ?, location = ?, status = ?, updated_at = CURRENT_TIMESTAMP
               WHERE id = ?`;
  const params = [client_id, title, description, appointment_date, duration, location, status, req.params.id];

  db.run(sql, params, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Appointment not found' });
      return;
    }
    res.json({ message: 'Appointment updated successfully' });
  });
});

// Delete appointment
app.delete('/api/appointments/:id', (req, res) => {
  const sql = 'DELETE FROM appointments WHERE id = ?';
  db.run(sql, [req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Appointment not found' });
      return;
    }
    res.json({ message: 'Appointment deleted successfully' });
  });
});

// ==================== REMINDER SYSTEM ====================

// Check for upcoming appointments and send reminders
function checkReminders() {
  const now = new Date().toISOString();
  const sql = `SELECT r.*, a.*, c.name as client_name, c.email as client_email, c.phone as client_phone, c.address
               FROM reminders r
               JOIN appointments a ON r.appointment_id = a.id
               JOIN clients c ON a.client_id = c.id
               WHERE r.sent = 0 AND r.reminder_time <= ?`;
  
  db.all(sql, [now], async (err, rows) => {
    if (err) {
      console.error('Error checking reminders:', err.message);
      return;
    }
    
    for (const reminder of rows) {
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
      db.run('UPDATE reminders SET sent = 1 WHERE id = ?', [reminder.id], (err) => {
        if (err) {
          console.error('Error updating reminder:', err.message);
        }
      });
      
      // Mark appointment reminder as sent
      db.run('UPDATE appointments SET reminder_sent = 1 WHERE id = ?', [reminder.appointment_id], (err) => {
        if (err) {
          console.error('Error updating appointment:', err.message);
        }
      });
    }
  });
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
  
  const sql = `SELECT a.*, c.name as client_name, c.email as client_email, c.phone as client_phone
               FROM appointments a
               LEFT JOIN clients c ON a.client_id = c.id
               WHERE a.appointment_date BETWEEN ? AND ?
               ORDER BY a.appointment_date ASC`;
  
  db.all(sql, [now, nextWeek], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ appointments: rows });
  });
});

// ==================== STATISTICS ENDPOINTS ====================

// Get dashboard statistics
app.get('/api/stats', (req, res) => {
  const stats = {};
  
  // Total clients
  db.get('SELECT COUNT(*) as count FROM clients', [], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    stats.totalClients = row.count;
    
    // Total appointments
    db.get('SELECT COUNT(*) as count FROM appointments', [], (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      stats.totalAppointments = row.count;
      
      // Upcoming appointments (next 7 days)
      const now = new Date().toISOString();
      const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
      db.get('SELECT COUNT(*) as count FROM appointments WHERE appointment_date BETWEEN ? AND ?', 
        [now, nextWeek], (err, row) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        stats.upcomingAppointments = row.count;
        
        // Today's appointments
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        db.get('SELECT COUNT(*) as count FROM appointments WHERE appointment_date BETWEEN ? AND ?',
          [today.toISOString(), tomorrow.toISOString()], (err, row) => {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }
          stats.todayAppointments = row.count;
          res.json(stats);
        });
      });
    });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});

// Made with Bob
