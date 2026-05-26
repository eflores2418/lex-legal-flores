const nodemailer = require('nodemailer');
require('dotenv').config();

// Configuración de email
let emailTransporter = null;

// Inicializar transporter de email si las credenciales están configuradas
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  emailTransporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
  console.log('✅ Email notifications configured');
} else {
  console.log('⚠️  Email notifications not configured. Set EMAIL_USER and EMAIL_PASS in .env file');
}

// Configuración de Twilio para WhatsApp
let twilioClient = null;

if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  const twilio = require('twilio');
  twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  console.log('✅ WhatsApp notifications configured');
} else {
  console.log('⚠️  WhatsApp notifications not configured. Set TWILIO credentials in .env file');
}

// Enviar notificación por email
async function sendEmailNotification(appointment, client) {
  if (!emailTransporter) {
    console.log('📧 Email notification skipped (not configured)');
    return { success: false, message: 'Email not configured' };
  }

  const appointmentDate = new Date(appointment.appointment_date);
  const formattedDate = appointmentDate.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.NOTIFICATION_EMAIL || 'notitramites22@gmail.com',
    subject: `🔔 Recordatorio: Cita con ${client.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="margin: 0;">⚖️ Lex Legal Flores</h1>
          <p style="margin: 10px 0 0 0;">Recordatorio de Cita</p>
        </div>
        
        <div style="padding: 30px; background-color: #f9f9f9;">
          <h2 style="color: #1a1a2e; margin-top: 0;">📅 ${appointment.title}</h2>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 10px 0;"><strong>👤 Cliente:</strong> ${client.name}</p>
            <p style="margin: 10px 0;"><strong>📧 Email:</strong> ${client.email || 'No especificado'}</p>
            <p style="margin: 10px 0;"><strong>📱 Teléfono:</strong> ${client.phone || 'No especificado'}</p>
            <p style="margin: 10px 0;"><strong>🕐 Fecha y Hora:</strong> ${formattedDate}</p>
            <p style="margin: 10px 0;"><strong>⏱️ Duración:</strong> ${appointment.duration} minutos</p>
            ${appointment.location ? `<p style="margin: 10px 0;"><strong>📍 Ubicación:</strong> ${appointment.location}</p>` : ''}
          </div>
          
          ${appointment.description ? `
            <div style="background: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107;">
              <p style="margin: 0;"><strong>📝 Notas:</strong></p>
              <p style="margin: 10px 0 0 0;">${appointment.description}</p>
            </div>
          ` : ''}
          
          <div style="margin-top: 30px; padding: 15px; background: #d1ecf1; border-radius: 8px; border-left: 4px solid #0c5460;">
            <p style="margin: 0; color: #0c5460;">
              <strong>⏰ Esta cita está programada para dentro de 24 horas.</strong>
            </p>
          </div>
        </div>
        
        <div style="padding: 20px; text-align: center; background-color: #f0f0f0; border-radius: 0 0 10px 10px;">
          <p style="margin: 0; color: #666; font-size: 12px;">
            Este es un recordatorio automático del Gestor Interno Lex Legal Flores
          </p>
        </div>
      </div>
    `
  };

  try {
    await emailTransporter.sendMail(mailOptions);
    console.log(`📧 Email sent to ${mailOptions.to} for appointment: ${appointment.title}`);
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    return { success: false, message: error.message };
  }
}

// Enviar notificación por WhatsApp
async function sendWhatsAppNotification(appointment, client) {
  if (!twilioClient) {
    console.log('📱 WhatsApp notification skipped (not configured)');
    return { success: false, message: 'WhatsApp not configured' };
  }

  const appointmentDate = new Date(appointment.appointment_date);
  const formattedDate = appointmentDate.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const message = `
🔔 *Recordatorio de Cita - Lex Legal Flores*

📅 *${appointment.title}*

👤 *Cliente:* ${client.name}
📧 *Email:* ${client.email || 'No especificado'}
📱 *Teléfono:* ${client.phone || 'No especificado'}

🕐 *Fecha y Hora:* ${formattedDate}
⏱️ *Duración:* ${appointment.duration} minutos
${appointment.location ? `📍 *Ubicación:* ${appointment.location}` : ''}

${appointment.description ? `📝 *Notas:* ${appointment.description}` : ''}

⏰ Esta cita está programada para dentro de 24 horas.
  `.trim();

  try {
    const whatsappTo = process.env.WHATSAPP_TO || 'whatsapp:+50672898780';
    const whatsappFrom = process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886';
    
    await twilioClient.messages.create({
      body: message,
      from: whatsappFrom,
      to: whatsappTo
    });
    
    console.log(`📱 WhatsApp sent to ${whatsappTo} for appointment: ${appointment.title}`);
    return { success: true, message: 'WhatsApp sent successfully' };
  } catch (error) {
    console.error('❌ Error sending WhatsApp:', error.message);
    return { success: false, message: error.message };
  }
}

// Enviar todas las notificaciones
async function sendAllNotifications(appointment, client) {
  console.log(`\n🔔 Sending notifications for appointment: ${appointment.title}`);
  
  const results = {
    email: await sendEmailNotification(appointment, client),
    whatsapp: await sendWhatsAppNotification(appointment, client)
  };
  
  return results;
}

module.exports = {
  sendEmailNotification,
  sendWhatsAppNotification,
  sendAllNotifications
};

// Made with Bob
