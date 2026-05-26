import axios from 'axios';

const API_BASE_URL = 'https://lex-legal-flores.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Client interfaces
export interface Client {
  id?: number;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  description?: string;
  tasks?: string;
  created_at?: string;
  updated_at?: string;
}

// Appointment interfaces
export interface Appointment {
  id?: number;
  client_id: number;
  title: string;
  description?: string;
  appointment_date: string;
  duration?: number;
  location?: string;
  status?: string;
  reminder_sent?: number;
  client_name?: string;
  client_email?: string;
  client_phone?: string;
  created_at?: string;
  updated_at?: string;
}

// Statistics interface
export interface Stats {
  totalClients: number;
  totalAppointments: number;
  upcomingAppointments: number;
  todayAppointments: number;
}

// Client API calls
export const clientAPI = {
  getAll: async (): Promise<Client[]> => {
    const response = await api.get('/clients');
    return response.data.clients;
  },

  getById: async (id: number): Promise<Client> => {
    const response = await api.get(`/clients/${id}`);
    return response.data.client;
  },

  create: async (client: Client): Promise<Client> => {
    const response = await api.post('/clients', client);
    return response.data.client;
  },

  update: async (id: number, client: Client): Promise<void> => {
    await api.put(`/clients/${id}`, client);
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/clients/${id}`);
  },
};

// Appointment API calls
export const appointmentAPI = {
  getAll: async (): Promise<Appointment[]> => {
    const response = await api.get('/appointments');
    return response.data.appointments;
  },

  getById: async (id: number): Promise<Appointment> => {
    const response = await api.get(`/appointments/${id}`);
    return response.data.appointment;
  },

  getByClientId: async (clientId: number): Promise<Appointment[]> => {
    const response = await api.get(`/clients/${clientId}/appointments`);
    return response.data.appointments;
  },

  getUpcoming: async (): Promise<Appointment[]> => {
    const response = await api.get('/appointments/upcoming');
    return response.data.appointments;
  },

  create: async (appointment: Appointment): Promise<Appointment> => {
    const response = await api.post('/appointments', appointment);
    return response.data.appointment;
  },

  update: async (id: number, appointment: Appointment): Promise<void> => {
    await api.put(`/appointments/${id}`, appointment);
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/appointments/${id}`);
  },
};

// Statistics API calls
export const statsAPI = {
  get: async (): Promise<Stats> => {
    const response = await api.get('/stats');
    return response.data;
  },
};

export default api;

// Made with Bob
