import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';

const roles = ['judge', 'court_clerk', 'police_clerk', 'advocate'];

const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'advocate',
    department: ''
  });

  const submit = async (e) => {
    e.preventDefault();
    const { data } = await api.post('/auth/register', form);
    login(data);
    navigate('/dashboard');
  };

  return (
    <form className="card" onSubmit={submit}>
      <h2>Create account</h2>
      <input
        placeholder="Full name"
        value={form.fullName}
        onChange={(e) => setForm({ ...form, fullName: e.target.value })}
        required
      />
      <input
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        required
      />
      <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
        {roles.map((role) => (
          <option key={role} value={role}>
            {role}
          </option>
        ))}
      </select>
      <input
        placeholder="Department"
        value={form.department}
        onChange={(e) => setForm({ ...form, department: e.target.value })}
      />
      <button type="submit">Register</button>
    </form>
  );
};

export default RegisterPage;
