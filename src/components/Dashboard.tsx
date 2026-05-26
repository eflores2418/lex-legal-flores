import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { statsAPI, appointmentAPI, Stats, Appointment } from '../services/api';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    totalClients: 0,
    totalAppointments: 0,
    upcomingAppointments: 0,
    todayAppointments: 0,
  });
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      console.log('Loading dashboard data...');
      
      const statsData = await statsAPI.get();
      console.log('Stats loaded:', statsData);
      setStats(statsData);
      
      const appointmentsData = await appointmentAPI.getUpcoming();
      console.log('Upcoming appointments loaded:', appointmentsData);
      setUpcomingAppointments(appointmentsData);
      
    } catch (error: any) {
      console.error('Error loading dashboard data:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url
      });
      alert(`Error al cargar los datos del panel: ${error.message}\n\nAsegúrese de que el servidor backend esté ejecutándose.`);
    } finally {
      setLoading(false);
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
    return <div className="loading">Cargando panel principal...</div>;
  }

  return (
    <div className="dashboard">
      <h1>Panel Principal</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>Total de Clientes</h3>
            <p className="stat-number">{stats.totalClients}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <h3>Total de Citas</h3>
            <p className="stat-number">{stats.totalAppointments}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏰</div>
          <div className="stat-content">
            <h3>Citas de Hoy</h3>
            <p className="stat-number">{stats.todayAppointments}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📆</div>
          <div className="stat-content">
            <h3>Próximas (7 días)</h3>
            <p className="stat-number">{stats.upcomingAppointments}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-section">
        <div className="section-header">
          <h2>Próximas Citas</h2>
          <Link to="/appointments/new" className="btn btn-primary">
            + Nueva Cita
          </Link>
        </div>

        {upcomingAppointments.length === 0 ? (
          <p className="empty-message">No hay citas próximas en los próximos 7 días.</p>
        ) : (
          <div className="appointments-list">
            {upcomingAppointments.map((appointment) => (
              <div key={appointment.id} className="appointment-card">
                <div className="appointment-header">
                  <h3>{appointment.title}</h3>
                  <span className={`status-badge status-${appointment.status}`}>
                    {appointment.status}
                  </span>
                </div>
                <div className="appointment-details">
                  <p>
                    <strong>Cliente:</strong> {appointment.client_name}
                  </p>
                  <p>
                    <strong>Fecha:</strong> {formatDate(appointment.appointment_date)}
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
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="quick-actions">
        <h2>Acciones Rápidas</h2>
        <div className="action-buttons">
          <Link to="/clients/new" className="action-btn">
            <span className="action-icon">👤</span>
            <span>Agregar Nuevo Cliente</span>
          </Link>
          <Link to="/appointments/new" className="action-btn">
            <span className="action-icon">📅</span>
            <span>Agendar Cita</span>
          </Link>
          <Link to="/clients" className="action-btn">
            <span className="action-icon">📋</span>
            <span>Ver Todos los Clientes</span>
          </Link>
          <Link to="/appointments" className="action-btn">
            <span className="action-icon">🗓️</span>
            <span>Ver Todas las Citas</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

// Made with Bob
