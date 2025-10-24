import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminSecret, setAdminSecret] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(name, email, password, adminSecret);
      setSuccess('Account created. Please login');
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-card rounded-md shadow">
      <h2 className="text-xl font-bold mb-4">Create Account</h2>
      {error && <div className="text-sm text-red-500 mb-2">{error}</div>}
      {success && <div className="text-sm text-green-600 mb-2">{success}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm">Full name</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} type="text" />
        </div>
        <div>
          <label className="text-sm">Email</label>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
        </div>
        <div>
          <label className="text-sm">Password</label>
          <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
        </div>
        <div>
          <label className="text-sm">Admin secret (only if creating admin)</label>
          <Input value={adminSecret} onChange={(e) => setAdminSecret(e.target.value)} type="password" />
        </div>
        <div className="flex items-center justify-between">
          <Button type="submit">Create account</Button>
          <Button variant="ghost" onClick={() => navigate('/login')}>Already have account</Button>
        </div>
      </form>
    </div>
  );
};

export default Register;
