import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { clientAPI, Client } from '../services/api';
import './ClientForm.css';

const ClientForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState<Client>({
    name: '',
    email: '',
    phone: '',
    address: '',
    description: '',
    tasks: '',
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditMode);

  useEffect(() => {
    if (isEditMode && id) {
      loadClient(parseInt(id));
    }
  }, [id, isEditMode]);

  const loadClient = async (clientId: number) => {
    try {
      const data = await clientAPI.getById(clientId);
      setFormData(data);
    } catch (error) {
      console.error('Error loading client:', error);
      alert('Error al cargar datos del cliente');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('El nombre del cliente es requerido');
      return;
    }

    setLoading(true);
    try {
      if (isEditMode && id) {
        await clientAPI.update(parseInt(id), formData);
        alert('Cliente actualizado exitosamente');
        navigate(`/clients/${id}`);
      } else {
        const newClient = await clientAPI.create(formData);
        alert('Cliente creado exitosamente');
        navigate(`/clients/${newClient.id}`);
      }
    } catch (error) {
      console.error('Error saving client:', error);
      alert('Error al guardar cliente');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <div className="loading">Cargando datos del cliente...</div>;
  }

  return (
    <div className="client-form-container">
      <div className="page-header">
        <div>
          <Link to={isEditMode ? `/clients/${id}` : '/clients'} className="back-link">
            ← Volver
          </Link>
          <h1>{isEditMode ? 'Editar Cliente' : 'Agregar Nuevo Cliente'}</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="client-form">
        <div className="form-section">
          <h2>Información Básica</h2>
          
          <div className="form-group">
            <label htmlFor="name">
              Nombre del Cliente <span className="required">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Ingrese el nombre completo del cliente"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="client@example.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Teléfono</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="address">Dirección</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Dirección, ciudad, provincia, código postal"
            />
          </div>
        </div>

        <div className="form-section">
          <h2>Información del Caso</h2>
          
          <div className="form-group">
            <label htmlFor="description">Descripción / Detalles del Caso</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={6}
              placeholder="Breve descripción del caso, asunto legal o situación del cliente..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="tasks">Tareas / Cosas por Hacer</label>
            <textarea
              id="tasks"
              name="tasks"
              value={formData.tasks}
              onChange={handleChange}
              rows={8}
              placeholder="Lista de tareas, acciones o cosas que deben hacerse para este cliente..."
            />
            <small className="form-help">
              Puede usar este campo para rastrear tareas pendientes, documentos necesarios, plazos, etc.
            </small>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate(isEditMode ? `/clients/${id}` : '/clients')}
            className="btn btn-secondary"
            disabled={loading}
          >
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Guardando...' : isEditMode ? 'Actualizar Cliente' : 'Crear Cliente'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClientForm;

// Made with Bob
