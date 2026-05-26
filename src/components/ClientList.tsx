import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { clientAPI, Client } from '../services/api';
import './ClientList.css';

const ClientList: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const data = await clientAPI.getAll();
      setClients(data);
    } catch (error) {
      console.error('Error loading clients:', error);
      alert('Error al cargar clientes. Asegúrese de que el servidor backend esté ejecutándose.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (window.confirm(`¿Está seguro de que desea eliminar a ${name}? Esto también eliminará todas las citas asociadas.`)) {
      try {
        await clientAPI.delete(id);
        setClients(clients.filter(client => client.id !== id));
        alert('Cliente eliminado exitosamente');
      } catch (error) {
        console.error('Error deleting client:', error);
        alert('Error al eliminar cliente');
      }
    }
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (client.phone && client.phone.includes(searchTerm))
  );

  if (loading) {
    return <div className="loading">Cargando clientes...</div>;
  }

  return (
    <div className="client-list">
      <div className="page-header">
        <h1>Clientes</h1>
        <Link to="/clients/new" className="btn btn-primary">
          + Agregar Nuevo Cliente
        </Link>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar clientes por nombre, email o teléfono..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {filteredClients.length === 0 ? (
        <div className="empty-state">
          <p>
            {searchTerm
              ? 'No se encontraron clientes que coincidan con su búsqueda.'
              : 'Aún no hay clientes. Agregue su primer cliente para comenzar.'}
          </p>
        </div>
      ) : (
        <div className="clients-grid">
          {filteredClients.map((client) => (
            <div key={client.id} className="client-card">
              <div className="client-card-header">
                <h3>{client.name}</h3>
              </div>
              <div className="client-card-body">
                {client.email && (
                  <p>
                    <strong>📧 Email:</strong> {client.email}
                  </p>
                )}
                {client.phone && (
                  <p>
                    <strong>📱 Teléfono:</strong> {client.phone}
                  </p>
                )}
                {client.address && (
                  <p>
                    <strong>📍 Dirección:</strong> {client.address}
                  </p>
                )}
                {client.description && (
                  <p className="client-description">
                    <strong>Descripción:</strong> {client.description.substring(0, 100)}
                    {client.description.length > 100 ? '...' : ''}
                  </p>
                )}
              </div>
              <div className="client-card-actions">
                <Link to={`/clients/${client.id}`} className="btn btn-secondary">
                  Ver Detalles
                </Link>
                <Link to={`/clients/${client.id}/edit`} className="btn btn-secondary">
                  Editar
                </Link>
                <button
                  onClick={() => handleDelete(client.id!, client.name)}
                  className="btn btn-danger"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientList;

// Made with Bob
