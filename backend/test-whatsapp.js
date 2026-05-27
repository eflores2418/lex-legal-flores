const { sendWhatsAppNotification } = require('./notifications');
require('dotenv').config();

// Datos de prueba
const testAppointment = {
  id: 1,
  title: 'Consulta de Prueba',
  description: 'Esta es una prueba del sistema de notificaciones de WhatsApp',
  appointment_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Mañana
  duration: 60,
  location: 'Virtual',
  status: 'scheduled'
};

const testClient = {
  name: 'Cliente de Prueba',
  email: 'prueba@example.com',
  phone: '+506 7233 2253',
  address: 'San José, Costa Rica'
};

console.log('🧪 Probando notificación de WhatsApp...\n');
console.log('📋 Configuración:');
console.log(`   Account SID: ${process.env.TWILIO_ACCOUNT_SID ? '✅ Configurado' : '❌ No configurado'}`);
console.log(`   Auth Token: ${process.env.TWILIO_AUTH_TOKEN ? '✅ Configurado' : '❌ No configurado'}`);
console.log(`   WhatsApp From: ${process.env.TWILIO_WHATSAPP_FROM || '❌ No configurado'}`);
console.log(`   WhatsApp To: ${process.env.TWILIO_WHATSAPP_TO || '❌ No configurado'}`);
console.log('\n');

sendWhatsAppNotification(testAppointment, testClient)
  .then(result => {
    if (result.success) {
      console.log('\n✅ ¡Éxito! Mensaje de WhatsApp enviado correctamente.');
      console.log('   Revisa tu WhatsApp en el número: +506 7233 2253');
    } else {
      console.log('\n❌ Error al enviar WhatsApp:', result.message);
      console.log('\n💡 Posibles soluciones:');
      console.log('   1. Verifica que te hayas unido al sandbox de WhatsApp');
      console.log('   2. Abre WhatsApp y envía el código de unión al número de Twilio');
      console.log('   3. Verifica que las credenciales sean correctas');
    }
    process.exit(result.success ? 0 : 1);
  })
  .catch(error => {
    console.error('\n❌ Error inesperado:', error.message);
    console.error('\n💡 Revisa que:');
    console.error('   1. Las credenciales de Twilio sean correctas');
    console.error('   2. El número de WhatsApp tenga el formato correcto');
    console.error('   3. Tengas conexión a internet');
    process.exit(1);
  });

// Made with Bob