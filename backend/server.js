const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cron = require('node-cron');
const pool = require('./database');
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
app.get('/api/clients', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM clients ORDER BY created_at DESC');
    res.json({ clients: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single client by ID
app.get('/api/clients/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM clients WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Client not found' });
      return;
    }
    res.json({ client: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new client
app.post('/api/clients', async (req, res) => {
  const { name, email, phone, address, description, tasks } = req.body;
  
  if (!name) {
    res.status(400).json({ error: 'Name is required' });
    return;
  }

  try {
    const result = await pool.query(
      `INSERT INTO clients (name, email, phone, address, description, tasks) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, email, phone, address, description, tasks]
    );
    
    res.json({
      message: 'Client created successfully',
      client: result.rows[0]
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update client
app.put('/api/clients/:id', async (req, res) => {
  const { name, email, phone, address, description, tasks } = req.body;
  
  try {
    const result = await pool.query(
      `UPDATE clients 
       SET name = $1, email = $2, phone = $3, address = $4, description = $5, tasks = $6, updated_at = CURRENT_TIMESTAMP
       WHERE id = $7 RETURNING *`,
      [name, email, phone, address, description, tasks, req.params.id]
    );
    
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Client not found' });
      return;
    }
    res.json({ message: 'Client updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete client
app.delete('/api/clients/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM clients WHERE id = $1 RETURNING *', [req.params.id]);
    
    if (result.rows.length === 0) {
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
app.get('/api/appointments', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT a.*, c.name as client_name, c.email as client_email, c.phone as client_phone
      FROM appointments a
      LEFT JOIN clients c ON a.client_id = c.id
      ORDER BY a.appointment_date ASC
    `);
    res.json({ appointments: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get upcoming appointments (next 7 days) - MUST BE BEFORE /:id route
app.get('/api/appointments/upcoming', async (req, res) => {
  const now = new Date().toISOString();
  const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  
  try {
    const result = await pool.query(`
      SELECT a.*, c.name as client_name, c.email as client_email, c.phone as client_phone
      FROM appointments a
      LEFT JOIN clients c ON a.client_id = c.id
      WHERE a.appointment_date BETWEEN $1 AND $2
      ORDER BY a.appointment_date ASC
    `, [now, nextWeek]);
    
    res.json({ appointments: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get appointments for a specific client
app.get('/api/clients/:id/appointments', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM appointments WHERE client_id = $1 ORDER BY appointment_date ASC',
      [req.params.id]
    );
    res.json({ appointments: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single appointment
app.get('/api/appointments/:id', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT a.*, c.name as client_name, c.email as client_email, c.phone as client_phone
      FROM appointments a
      LEFT JOIN clients c ON a.client_id = c.id
      WHERE a.id = $1
    `, [req.params.id]);
    
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Appointment not found' });
      return;
    }
    res.json({ appointment: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new appointment
app.post('/api/appointments', async (req, res) => {
  const { client_id, title, description, appointment_date, duration, location, status } = req.body;
  
  if (!client_id || !title || !appointment_date) {
    res.status(400).json({ error: 'Client ID, title, and appointment date are required' });
    return;
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const appointmentResult = await client.query(
      `INSERT INTO appointments (client_id, title, description, appointment_date, duration, location, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [client_id, title, description, appointment_date, duration || 60, location, status || 'scheduled']
    );
    
    // Create reminder (24 hours before appointment)
    const appointmentTime = new Date(appointment_date);
    const reminderTime = new Date(appointmentTime.getTime() - 24 * 60 * 60 * 1000);
    
    await client.query(
      'INSERT INTO reminders (appointment_id, reminder_time) VALUES ($1, $2)',
      [appointmentResult.rows[0].id, reminderTime.toISOString()]
    );
    
    await client.query('COMMIT');

    res.json({
      message: 'Appointment created successfully',
      appointment: appointmentResult.rows[0]
    });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

// Update appointment
app.put('/api/appointments/:id', async (req, res) => {
  const { client_id, title, description, appointment_date, duration, location, status } = req.body;
  
  try {
    const result = await pool.query(
      `UPDATE appointments 
       SET client_id = $1, title = $2, description = $3, appointment_date = $4, duration = $5, location = $6, status = $7, updated_at = CURRENT_TIMESTAMP
       WHERE id = $8 RETURNING *`,
      [client_id, title, description, appointment_date, duration, location, status, req.params.id]
    );
    
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Appointment not found' });
      return;
    }
    res.json({ message: 'Appointment updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete appointment
app.delete('/api/appointments/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM appointments WHERE id = $1 RETURNING *', [req.params.id]);
    
    if (result.rows.length === 0) {
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
    const result = await pool.query(`
      SELECT r.*, a.*, c.name as client_name, c.email as client_email, c.phone as client_phone, c.address
      FROM reminders r
      JOIN appointments a ON r.appointment_id = a.id
      JOIN clients c ON a.client_id = c.id
      WHERE r.sent = FALSE AND r.reminder_time <= $1
    `, [now]);
    
    for (const reminder of result.rows) {
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
      await pool.query('UPDATE reminders SET sent = TRUE WHERE id = $1', [reminder.id]);
      
      // Mark appointment reminder as sent
      await pool.query('UPDATE appointments SET reminder_sent = TRUE WHERE id = $1', [reminder.appointment_id]);
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

// ==================== STATISTICS ENDPOINTS ====================

// Get dashboard statistics
app.get('/api/stats', async (req, res) => {
  try {
    const now = new Date().toISOString();
    
    const totalClientsResult = await pool.query('SELECT COUNT(*) as count FROM clients');
    const totalAppointmentsResult = await pool.query('SELECT COUNT(*) as count FROM appointments');
    const upcomingAppointmentsResult = await pool.query('SELECT COUNT(*) as count FROM appointments WHERE appointment_date >= $1', [now]);
    const todayAppointmentsResult = await pool.query('SELECT COUNT(*) as count FROM appointments WHERE DATE(appointment_date) = DATE($1)', [now]);
    
    res.json({
      totalClients: parseInt(totalClientsResult.rows[0].count),
      totalAppointments: parseInt(totalAppointmentsResult.rows[0].count),
      upcomingAppointments: parseInt(upcomingAppointmentsResult.rows[0].count),
      todayAppointments: parseInt(todayAppointmentsResult.rows[0].count)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running with PostgreSQL' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('Using PostgreSQL database');
});

// Made with Bob