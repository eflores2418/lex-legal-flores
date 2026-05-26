import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Dashboard from './components/Dashboard';
import ClientList from './components/ClientList';
import ClientDetails from './components/ClientDetails';
import ClientForm from './components/ClientForm';
import AppointmentList from './components/AppointmentList';
import AppointmentForm from './components/AppointmentForm';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="nav-container">
            <div className="nav-brand">
              <img src="/logo-lex-legal.png" alt="Lex Legal Flores" className="nav-logo" />
              <h1 className="nav-title">Gestor Interno Lex Legal Flores</h1>
            </div>
            <ul className="nav-links">
              <li><Link to="/">Panel Principal</Link></li>
              <li><Link to="/clients">Clientes</Link></li>
              <li><Link to="/appointments">Citas</Link></li>
            </ul>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/clients" element={<ClientList />} />
            <Route path="/clients/new" element={<ClientForm />} />
            <Route path="/clients/:id" element={<ClientDetails />} />
            <Route path="/clients/:id/edit" element={<ClientForm />} />
            <Route path="/appointments" element={<AppointmentList />} />
            <Route path="/appointments/new" element={<AppointmentForm />} />
            <Route path="/appointments/:id/edit" element={<AppointmentForm />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

// Made with Bob
