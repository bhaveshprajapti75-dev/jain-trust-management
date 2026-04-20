import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, ChevronRight, ShieldCheck } from 'lucide-react';
import { useToast } from '../../components/ui/Toast';
import { authService } from '../../services/apiService';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { ROLES } from '../../config/roles';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const showToast = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please enter both email and password', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.login({ email, password });
      const role = response.normalizedRole || response.role;
      
      if (!role) {
        throw new Error('User role not found in response');
      }

      showToast('Welcome back! Login successful.', 'success');
      
      if (role === ROLES.SANGH_ADMIN) {
        console.log('Redirecting to Sangh Admin Dashboard (role:', role, ')');
        navigate('/sangh-admin');
      } else if (role === ROLES.SUPER_ADMIN) {
        console.log('Redirecting to Super Admin Dashboard (role:', role, ')');
        navigate('/');
      } else {
        console.warn('Unknown role, redirecting to home:', role);
        navigate('/');
      }
    } catch (error) {
      console.error('Login error:', {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        data: error.response?.data
      });
      
      let errorMsg = 'Invalid credentials. Please try again.';
      
      if (error.response?.status === 401) {
        errorMsg = 'Invalid email or password.';
      } else if (error.response?.status === 400) {
        errorMsg = error.response?.data?.message || error.response?.data?.error || errorMsg;
      } else if (error.message === 'No authentication token in response') {
        errorMsg = 'Server response is invalid. Contact administrator.';
      } else if (error.message.includes('Invalid role')) {
        errorMsg = error.message;
      }
      
      showToast(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 selection:bg-teal-100">
      <div className="w-full max-w-[440px] animate-in fade-in zoom-in-95 duration-700">
        
        {/* Logo & Brand */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-xl shadow-teal-500/20 mb-6 transform rotate-45">
            <ShieldCheck className="w-9 h-9 text-white transform -rotate-45" strokeWidth={1.5} />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Jain Sangh</h1>
          <p className="text-sm font-bold text-teal-600 uppercase tracking-[0.2em] mt-2">Management System</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-[32px] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] border border-slate-100 p-8 lg:p-10 relative overflow-hidden">
          {/* Subtle Decorative Gradient */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50/50 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-50/50 rounded-full -ml-16 -mb-16 blur-3xl pointer-events-none" />

          <form onSubmit={handleLogin} className="space-y-5">
            <Input
              label="Email Address"
              type="email"
              placeholder="name@company.com"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
              className="h-12 text-[15px]"
            />

            <div className="space-y-1.5">
              <div className="flex items-center justify-between px-1">
                <label className="text-[13px] font-medium text-slate-600">Password</label>
                <button type="button" className="text-[12px] font-bold text-teal-600 hover:text-emerald-600 transition-colors">
                  Forgot?
                </button>
              </div>
              <Input
                type="password"
                placeholder="Enter Password"
                icon={Lock}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 text-[15px]"
              />
            </div>

            <div className="flex items-center gap-2 px-1 py-1">
              <input 
                type="checkbox" 
                id="remember" 
                className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 focus:ring-offset-0" 
              />
              <label htmlFor="remember" className="text-[13px] font-medium text-slate-500 cursor-pointer select-none">
                Remember
              </label>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl font-bold text-[15px] shadow-lg shadow-teal-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              loading={loading}
              icon={ChevronRight}
            >Login
            </Button>
          </form>

          {/* <div className="mt-8 pt-6 border-t border-slate-50 text-center">
            <p className="text-[13px] font-medium text-slate-400">
              Don't have an account? {' '}
              <button className="text-teal-600 font-bold hover:underline decoration-2 underline-offset-4">
                Contact Administrator
              </button>
            </p>
          </div> */}
        </div>

        {/* Footer Info */}
        <p className="mt-8 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
          © 2026 Jain Sangh Management. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;