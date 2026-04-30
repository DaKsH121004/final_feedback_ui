import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { Divider } from 'primereact/divider';
import { setCredentials } from '../store/authSlice';
import { motion, AnimatePresence } from 'motion/react';
import { useLoginMutation } from '../services/api';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ user: res.user, token: res.token }));
      localStorage.setItem('token', res.token);
      navigate('/');
    } catch (err) {
      setError(err?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex font-sans bg-white">
      {/* Left side - Image & Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80" 
            alt="University Campus" 
            className="w-full h-full object-cover opacity-40 mix-blend-overlay"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#4a0d0d] via-[#701515]/80 to-transparent z-10" />
        
        <div className="relative z-20 flex flex-col justify-end p-16 text-white h-full">
          <div className="mb-8">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 border border-white/30 shadow-lg">
               <i className="pi pi-book text-3xl" />
            </div>
            <h2 className="text-5xl font-bold mb-4 tracking-tight">Manav Rachna University</h2>
            <p className="text-lg text-white/80 max-w-lg leading-relaxed">
              Welcome to the Faculty Feedback System. Your insights are essential in maintaining our commitment to academic excellence.
            </p>
          </div>
          
          <div className="flex gap-4 items-center mt-4">
             <div className="flex -space-x-4">
                <img className="w-10 h-10 rounded-full border-2 border-[#701515]" src="https://ui-avatars.com/api/?name=S+K&background=fff&color=701515" alt="Student" />
                <img className="w-10 h-10 rounded-full border-2 border-[#701515]" src="https://ui-avatars.com/api/?name=A+R&background=fff&color=701515" alt="Student" />
                <img className="w-10 h-10 rounded-full border-2 border-[#701515]" src="https://ui-avatars.com/api/?name=M+P&background=fff&color=701515" alt="Student" />
             </div>
             <div className="text-sm font-medium text-white/90">
               Join <span className="font-bold">2000+</span> students shaping our future.
             </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-[#f8fafc] relative">
        <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-[#701515]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-[#C5A028]/5 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md z-10"
        >
            <div className="mb-10">
              <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-2">Welcome Back</h1>
              <p className="text-slate-500 font-medium">Log in to the Faculty Feedback System</p>
            </div>

            <form onSubmit={handleLogin} className="flex flex-col gap-6">
              
              <AnimatePresence>
                {error && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                    <Message severity="error" text={error} className="w-full rounded-xl border-none shadow-sm" />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Institutional Email</label>
                <div className="relative">
                  <i className="pi pi-envelope absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10" />
                  <InputText
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full rounded-xl border-slate-200 bg-white p-4 focus:ring-4 focus:ring-[#701515]/10 transition-all text-slate-800 font-medium border-2 focus:border-[#701515] shadow-sm"
                    style={{ paddingLeft: '3rem' }}
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
                <div className="relative">
                  <i className="pi pi-lock absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10" />
                  <Password
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    feedback={false}
                    toggleMask
                    placeholder="Enter your password"
                    className="w-full"
                    inputClassName="w-full rounded-xl border-slate-200 bg-white p-4 focus:ring-4 focus:ring-[#701515]/10 transition-all text-slate-800 font-medium border-2 focus:border-[#701515] shadow-sm"
                    inputStyle={{ paddingLeft: '3rem' }}
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="remember" className="w-4 h-4 rounded border-slate-300 text-[#701515] focus:ring-[#701515] accent-[#701515]" />
                  <label htmlFor="remember" className="text-sm font-medium text-slate-600 cursor-pointer select-none">Remember me</label>
                </div>
                <a href="#" className="text-sm font-bold text-[#701515] hover:text-[#4a0d0d] transition-colors">Forgot password?</a>
              </div>

              <Button
                label={isLoading ? "Authenticating..." : "Sign In"}
                loading={isLoading}
                type="submit"
                className="mt-2 rounded-xl font-bold text-lg h-14 shadow-lg shadow-[#701515]/20 border-none transition-all duration-300 hover:shadow-xl hover:shadow-[#701515]/30 hover:-translate-y-0.5 active:translate-y-0"
                style={{ background: 'linear-gradient(135deg, #701515 0%, #4a0d0d 100%)', color: '#fff' }}
              />

              <div className="mt-6 text-center">
                <p className="text-sm text-slate-500 font-medium">
                  Having trouble logging in? <a href="#" className="text-[#701515] font-bold hover:underline">Contact IT Support</a>
                </p>
              </div>

            </form>
            
            <div className="mt-16 text-center text-xs text-slate-400 font-medium">
              &copy; {new Date().getFullYear()} Manav Rachna University. All rights reserved.
            </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;