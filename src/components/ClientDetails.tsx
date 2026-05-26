import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { clientAPI, appointmentAPI, Client, Appointment } from '../services/api';
import './ClientDetails.css';

const ClientDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [client, setClient] = useState<Client | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadClientData(parseInt(id));
    }
  }, [id]);

  const loadClientData = async (clientId: number) => {
    try {
      const [clientData, appointmentsData] = await Promise.all([
        clientAPI.getById(clientId),
        appointmentAPI.getByClientId(clientId),
      ]);
      setClient(clientData);
      setAppointments(appointmentsData);
    } catch (error) {
      console.error('Error loading client data:', error);
      alert('Error al cargar datos del cliente');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (client && window.confirm(`¿Está seguro de que desea eliminar a ${client.name}? Esto también eliminará todas las citas asociadas.`)) {
      try {
        await clientAPI.delete(client.id!);
        alert('Cliente eliminado exitosamente');
        navigate('/clients');
      } catch (error) {
        console.error('Error deleting client:', error);
        alert('Error al eliminar cliente');
      }
    }
  };

  const handleDeleteAppointment = async (appointmentId: number, title: string) => {
    if (window.confirm(`¿Está seguro de que desea eliminar la cita "${title}"?`)) {
      try {
        await appointmentAPI.delete(appointmentId);
        setAppointments(appointments.filter(apt => apt.id !== appointmentId));
        alert('Cita eliminada exitosamente');
      } catch (error) {
        console.error('Error deleting appointment:', error);
        alert('Error al eliminar cita');
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return <div className="loading">Cargando detalles del cliente...</div>;
  }

  if (!client) {
    return <div className="error">Cliente no encontrado</div>;
  }

  return (
    <div className="client-details">
      <div className="page-header">
        <div>
          <Link to="/clients" className="back-link">← Volver a Clientes</Link>
          <h1>{client.name}</h1>
        </div>
        <div className="header-actions">
          <Link to={`/clients/${client.id}/edit`} className="btn btn-secondary">
            Editar Cliente
          </Link>
          <button onClick={handleDelete} className="btn btn-danger">
            Eliminar Cliente
          </button>
        </div>
      </div>

      <div className="client-info-section">
        <h2>Información de Contacto</h2>
        <div className="info-grid">
          {client.email && (
            <div className="info-item">
              <strong>📧 Email:</strong>
              <a href={`mailto:${client.email}`}>{client.email}</a>
            </div>
          )}
          {client.phone && (
            <div className="info-item">
              <strong>📱 Teléfono:</strong>
              <a href={`tel:${client.phone}`}>{client.phone}</a>
            </div>
          )}
          {client.address && (
            <div className="info-item">
              <strong>📍 Dirección:</strong>
              <span>{client.address}</span>
            </div>
          )}
        </div>
      </div>

      {client.description && (
        <div className="client-info-section">
          <h2>Descripción</h2>
          <p className="description-text">{client.description}</p>
        </div>
      )}

      {client.tasks && (
        <div className="client-info-section">
          <h2>Tareas / Cosas por Hacer</h2>
          <div className="tasks-box">
            <pre>{client.tasks}</pre>
          </div>
        </div>
      )}

      <div className="appointments-section">
        <div className="section-header">
          <h2>Citas</h2>
          <Link
            to={`/appointments/new?clientId=${client.id}`}
            className="btn btn-primary"
          >
            + Agendar Cita
          </Link>
        </div>

        {appointments.length === 0 ? (
          <p className="empty-message">No hay citas agendadas para este cliente.</p>
        ) : (
          <div className="appointments-list">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="appointment-card">
                <div className="appointment-header">
                  <h3>{appointment.title}</h3>
                  <span className={`status-badge status-${appointment.status}`}>
                    {appointment.status}
                  </span>
                </div>
                <div className="appointment-details">
                  <p>
                    <strong>Fecha:</strong> {formatDate(appointment.appointment_date)}
                  </p>
                  <p>
                    <strong>Duración:</strong> {appointment.duration} minutos
                  </p>
                  {appointment.location && (
                    <p>
                      <strong>Ubicación:</strong> {appointment.location}
                    </p>
                  )}
                  {appointment.description && (
                    <p className="appointment-description">{appointment.description}</p>
                  )}
                </div>
                <div className="appointment-actions">
                  <Link
                    to={`/appointments/${appointment.id}/edit`}
                    className="btn btn-secondary btn-sm"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => handleDeleteAppointment(appointment.id!, appointment.title)}
                    className="btn btn-danger btn-sm"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientDetails;

// Made with Bob
