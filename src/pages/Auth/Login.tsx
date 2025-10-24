import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      // After login, if admin go to admin, else user dashboard
      const token = localStorage.getItem('token');
      // get profile from api is already set in context; redirect based on stored user
      navigate('/user');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-card rounded-md shadow">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      {error && <div className="text-sm text-red-500 mb-2">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm">Email</label>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
        </div>
        <div>
          <label className="text-sm">Password</label>
          <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
        </div>
        <div className="flex items-center justify-between">
          <Button type="submit">Login</Button>
          <Button variant="ghost" onClick={() => navigate('/register')}>Create account</Button>
        </div>
      </form>
    </div>
  );
};

export default Login;
