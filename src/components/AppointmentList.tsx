import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { appointmentAPI, Appointment } from '../services/api';
import './AppointmentList.css';

const AppointmentList: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const data = await appointmentAPI.getAll();
      setAppointments(data);
    } catch (error) {
      console.error('Error loading appointments:', error);
      alert('Error al cargar citas. Asegúrese de que el servidor backend esté ejecutándose.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, title: string) => {
    if (window.confirm(`¿Está seguro de que desea eliminar la cita "${title}"?`)) {
      try {
        await appointmentAPI.delete(id);
        setAppointments(appointments.filter(apt => apt.id !== id));
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

  const filterAppointments = (appointments: Appointment[]) => {
    const now = new Date();
    
    switch (filter) {
      case 'upcoming':
        return appointments.filter(apt => new Date(apt.appointment_date) >= now);
      case 'past':
        return appointments.filter(apt => new Date(apt.appointment_date) < now);
      default:
        return appointments;
    }
  };

  const filteredAppointments = filterAppointments(appointments);

  if (loading) {
    return <div className="loading">Cargando citas...</div>;
  }

  return (
    <div className="appointment-list">
      <div className="page-header">
        <h1>Citas</h1>
        <Link to="/appointments/new" className="btn btn-primary">
          + Agendar Cita
        </Link>
      </div>

      <div className="filter-bar">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          Todas ({appointments.length})
        </button>
        <button
          className={`filter-btn ${filter === 'upcoming' ? 'active' : ''}`}
          onClick={() => setFilter('upcoming')}
        >
          Próximas ({appointments.filter(apt => new Date(apt.appointment_date) >= new Date()).length})
        </button>
        <button
          className={`filter-btn ${filter === 'past' ? 'active' : ''}`}
          onClick={() => setFilter('past')}
        >
          Pasadas ({appointments.filter(apt => new Date(apt.appointment_date) < new Date()).length})
        </button>
      </div>

      {filteredAppointments.length === 0 ? (
        <div className="empty-state">
          <p>
            {filter === 'all'
              ? 'Aún no hay citas agendadas.'
              : filter === 'upcoming'
              ? 'No hay citas próximas.'
              : 'No hay citas pasadas.'}
          </p>
        </div>
      ) : (
        <div className="appointments-table-container">
          <table className="appointments-table">
            <thead>
              <tr>
                <th>Fecha y Hora</th>
                <th>Título</th>
                <th>Cliente</th>
                <th>Tipo de Cita</th>
                <th>Estado</th>
                <th>Duración</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td className="date-cell">
                    {formatDate(appointment.appointment_date)}
                  </td>
                  <td>
                    <strong>{appointment.title}</strong>
                    {appointment.description && (
                      <div className="appointment-description-preview">
                        {appointment.description.substring(0, 60)}
                        {appointment.description.length > 60 ? '...' : ''}
                      </div>
                    )}
                  </td>
                  <td>
                    <Link to={`/clients/${appointment.client_id}`} className="client-link">
                      {appointment.client_name}
                    </Link>
                  </td>
                  <td>{appointment.location || '-'}</td>
                  <td>
                    <span className={`status-badge status-${appointment.status}`}>
                      {appointment.status}
                    </span>
                  </td>
                  <td>{appointment.duration} min</td>
                  <td className="actions-cell">
                    <Link
                      to={`/appointments/${appointment.id}/edit`}
                      className="btn btn-secondary btn-sm"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => handleDelete(appointment.id!, appointment.title)}
                      className="btn btn-danger btn-sm"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AppointmentList;

// Made with Bob
