import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { appointmentAPI, clientAPI, Appointment, Client } from '../services/api';
import './AppointmentForm.css';

const AppointmentForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const preselectedClientId = searchParams.get('clientId');

  const [clients, setClients] = useState<Client[]>([]);
  const [formData, setFormData] = useState<Appointment>({
    client_id: preselectedClientId ? parseInt(preselectedClientId) : 0,
    title: '',
    description: '',
    appointment_date: '',
    duration: 60,
    location: '',
    status: 'scheduled',
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    loadInitialData();
  }, [id, isEditMode]);

  const loadInitialData = async () => {
    try {
      const clientsData = await clientAPI.getAll();
      setClients(clientsData);

      if (isEditMode && id) {
        const appointmentData = await appointmentAPI.getById(parseInt(id));
        // Format the date for datetime-local input
        const date = new Date(appointmentData.appointment_date);
        const formattedDate = date.toISOString().slice(0, 16);
        setFormData({
          ...appointmentData,
          appointment_date: formattedDate,
        });
      }
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Error al cargar datos');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'client_id' || name === 'duration' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.client_id) {
      alert('Por favor seleccione un cliente');
      return;
    }

    if (!formData.title.trim()) {
      alert('El título de la cita es requerido');
      return;
    }

    if (!formData.appointment_date) {
      alert('La fecha y hora de la cita son requeridas');
      return;
    }

    setLoading(true);
    try {
      // Convert datetime-local format to ISO string
      const appointmentData = {
        ...formData,
        appointment_date: new Date(formData.appointment_date).toISOString(),
      };

      if (isEditMode && id) {
        await appointmentAPI.update(parseInt(id), appointmentData);
        alert('Cita actualizada exitosamente');
      } else {
        await appointmentAPI.create(appointmentData);
        alert('Cita agendada exitosamente');
      }
      navigate('/appointments');
    } catch (error) {
      console.error('Error saving appointment:', error);
      alert('Error al guardar cita');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="appointment-form-container">
      <div className="page-header">
        <div>
          <Link to="/appointments" className="back-link">
            ← Volver a Citas
          </Link>
          <h1>{isEditMode ? 'Editar Cita' : 'Agendar Nueva Cita'}</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="appointment-form">
        <div className="form-section">
          <h2>Detalles de la Cita</h2>

          <div className="form-group">
            <label htmlFor="client_id">
              Cliente <span className="required">*</span>
            </label>
            <select
              id="client_id"
              name="client_id"
              value={formData.client_id}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione un cliente</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
            {clients.length === 0 && (
              <small className="form-help">
                No se encontraron clientes. <Link to="/clients/new">Agregue un cliente primero</Link>
              </small>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="title">
              Título <span className="required">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="ej., Consulta Inicial, Audiencia, Revisión de Documentos"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="appointment_date">
                Fecha y Hora <span className="required">*</span>
              </label>
              <input
                type="datetime-local"
                id="appointment_date"
                name="appointment_date"
                value={formData.appointment_date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="duration">Duración (minutos)</label>
              <input
                type="number"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                min="15"
                step="15"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="location">Ubicación</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Oficina, Tribunal, Videollamada, etc."
            />
          </div>

          <div className="form-group">
            <label htmlFor="status">Estado</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="scheduled">Agendada</option>
              <option value="confirmed">Confirmada</option>
              <option value="completed">Completada</option>
              <option value="cancelled">Cancelada</option>
              <option value="rescheduled">Reagendada</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="description">Descripción / Notas</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={6}
              placeholder="Notas adicionales, puntos de agenda o información importante sobre esta cita..."
            />
          </div>
        </div>

        <div className="reminder-info">
          <p>
            <strong>📧 Recordatorio:</strong> Se enviará un recordatorio automáticamente 24 horas antes de la
            hora de la cita.
          </p>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/appointments')}
            className="btn btn-secondary"
            disabled={loading}
          >
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading
              ? 'Guardando...'
              : isEditMode
              ? 'Actualizar Cita'
              : 'Agendar Cita'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AppointmentForm;

// Made with Bob
