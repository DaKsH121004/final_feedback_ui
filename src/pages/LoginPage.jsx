// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import { Card } from 'primereact/card';
// import { InputText } from 'primereact/inputtext';
// import { Password } from 'primereact/password';
// import { Button } from 'primereact/button';
// import { Message } from 'primereact/message';
// import { Divider } from 'primereact/divider';
// import { setCredentials } from '../store/authSlice';
// import { motion } from 'motion/react';

// const LoginPage = () => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');

//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const [login, { isLoading }] = useLoginMutation();

// const handleLogin = async (e) => {
//   e.preventDefault();
//   setError('');

//   try {
//     const res = await login({
//       email: username,   
//       password,
//     }).unwrap();

//     dispatch(setCredentials({
//       user: res.user,
//       token: res.token
//     }));

//     localStorage.setItem('token', res.token);

//     navigate('/');

//   } catch (err) {
//     console.error(err);
//     setError(err?.data?.message || 'Login failed');
//   }
// };

//   return (
//     <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 relative overflow-hidden">
//       {/* Decorative background elements */}
//       <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-100 rounded-full blur-3xl opacity-50" />
//       <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-100 rounded-full blur-3xl opacity-50" />

//       <motion.div
//         initial={{ opacity: 0, y: 30 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6, ease: "easeOut" }}
//         className="w-full max-w-[450px] z-10"
//       >
//         <Card className="shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[2rem] border-none overflow-hidden bg-white/80 backdrop-blur-md">
//           <div className="p-4">
//             <div className="text-center mb-8">
//               <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200 mb-4 transform -rotate-6">
//                 <i className="pi pi-shield text-white text-3xl" />
//               </div>
//               <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Secure Portal</h1>
//               <p className="text-slate-500 mt-2 font-medium">Please enter your details to continue</p>
//             </div>

//             <form onSubmit={handleLogin} className="flex flex-col gap-5">
//               {error && (
//                 <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
//                   <Message severity="error" text={error} className="w-full rounded-xl border-none shadow-sm" />
//                 </motion.div>
//               )}
              
//               <div className="flex flex-col gap-2">
//                 <label className="text-sm font-bold text-slate-700 ml-1">Username</label>
//                 <div className="p-inputgroup flex-1">
//                   <span className="p-inputgroup-addon bg-slate-50 border-slate-200 rounded-l-xl">
//                     <i className="pi pi-user text-slate-400" />
//                   </span>
//                   <InputText
//                     value={username}
//                     onChange={(e) => setUsername(e.target.value)}
//                     placeholder="admin"
//                     className="border-slate-200 focus:border-indigo-500 rounded-r-xl py-3"
//                     required
//                   />
//                 </div>
//               </div>

//               <div className="flex flex-col gap-2">
//                 <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
//                 <div className="p-inputgroup flex-1">
//                   <span className="p-inputgroup-addon bg-slate-50 border-slate-200 rounded-l-xl">
//                     <i className="pi pi-lock text-slate-400" />
//                   </span>
//                   <Password
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     placeholder="password"
//                     // toggleMask
//                     feedback={false}
//                     className="w-full"
//                     inputClassName="border-slate-200 focus:border-indigo-500 rounded-r-xl py-3 w-full"
//                     required
//                   />
//                 </div>
//               </div>

//               <div className="flex items-center justify-between px-1">
//                 <div className="flex items-center gap-2">
//                   <input type="checkbox" id="remember" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
//                   <label htmlFor="remember" className="text-xs font-semibold text-slate-600 cursor-pointer">Remember me</label>
//                 </div>
//                 <span className="text-xs font-bold text-indigo-600 hover:text-indigo-700 cursor-pointer">Forgot Password?</span>
//               </div>

//               <Button
//                 label={loading ? "Authenticating..." : "Sign In"}
//                 icon={!loading && "pi pi-arrow-right"}
//                 iconPos="right"
//                 loading={loading}
//                 className="p-button-primary mt-2 rounded-xl py-4 shadow-lg shadow-indigo-100 font-bold text-lg transition-all active:scale-95"
//                 type="submit"
//               />
              
//               <Divider align="center" className="my-2">
//                 <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Or continue with</span>
//               </Divider>

//               <div className="flex gap-4">
//                 <Button icon="pi pi-google" className="p-button-outlined p-button-secondary flex-1 rounded-xl border-slate-200 hover:bg-slate-50" />
//                 <Button icon="pi pi-github" className="p-button-outlined p-button-secondary flex-1 rounded-xl border-slate-200 hover:bg-slate-50" />
//               </div>
//             </form>
//           </div>
//         </Card>
//       </motion.div>
//     </div>
//   );
// };

// export default LoginPage;


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
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
      setError(err?.data?.message || 'Authentication failed. Please verify your credentials.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-black font-sans">
      {/* Cinematic Background Layer */}
      <motion.div 
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.6 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute inset-0 z-0"
      >
        <img 
          src="file:///Users/dakshkumar/.gemini/antigravity/brain/d184b8fe-3854-45e3-87a2-a40b519b795a/mru_campus_abstract_1777571003820.png" 
          alt="Campus Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-black via-black/40 to-transparent" />
      </motion.div>

      {/* Floating Particles/Glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#701515]/30 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#C5A028]/10 rounded-full blur-[120px] animate-pulse delay-700" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        className="w-full max-w-[480px] z-10 relative"
      >
        <Card className="shadow-2xl rounded-[2.5rem] border border-white/10 overflow-hidden bg-black/40 backdrop-blur-2xl p-2">
          <div className="p-4 md:p-8">
            
            {/* Institutional Branding Section */}
            <div className="text-center mb-10">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="inline-block mb-6"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-[#701515] to-[#4a0d0d] rounded-3xl flex items-center justify-center shadow-2xl shadow-[#701515]/50 border border-white/10 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                  <i className="pi pi-shield text-white text-4xl" />
                </div>
              </motion.div>
              
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.4em] mb-1">Manav Rachna University</span>
                <h1 className="text-4xl font-serif font-black text-white tracking-tighter">Academic Portal</h1>
                <p className="text-slate-400 text-sm font-medium mt-2 opacity-80 uppercase tracking-widest text-[10px]">Secure Identity Verification</p>
              </div>
            </div>

            <form onSubmit={handleLogin} className="flex flex-col gap-6">
              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <Message 
                      severity="error" 
                      content={(
                        <div className="flex items-center gap-2 p-1">
                          <i className="pi pi-exclamation-circle text-xs" />
                          <span className="text-[10px] font-bold uppercase tracking-tight">{error}</span>
                        </div>
                      )}
                      className="w-full rounded-2xl border-none shadow-lg bg-red-500/10 text-red-400 border border-red-500/20" 
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-6">
                {/* Email Field */}
                <div className="flex flex-col gap-2.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Institutional Email</label>
                  <div className="relative group">
                    <i className="pi pi-envelope absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-amber-500 transition-colors z-10" />
                    <InputText
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. dean.engg@mru.edu.in"
                      className="w-full rounded-2xl border-white/5 bg-white/5 p-5 pl-14 focus:ring-4 focus:ring-[#701515]/20 transition-all text-white font-medium placeholder:text-slate-600 border-2 focus:border-[#701515]/50"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="flex flex-col gap-2.5">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Security Credential</label>
                    <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest cursor-pointer hover:text-white transition-colors">Recovery?</span>
                  </div>
                  <div className="relative group">
                    <i className="pi pi-lock absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-amber-500 transition-colors z-10" />
                    <Password
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      feedback={false}
                      toggleMask
                      placeholder="••••••••"
                      className="w-full"
                      inputClassName="w-full rounded-2xl border-white/5 bg-white/5 p-5 pl-14 focus:ring-4 focus:ring-[#701515]/20 transition-all text-white font-medium placeholder:text-slate-600 border-2 focus:border-[#701515]/50"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex flex-col gap-4">
                <Button
                  label={isLoading ? "AUTHENTICATING..." : "AUTHORIZE ACCESS"}
                  icon={!isLoading && "pi pi-shield"}
                  loading={isLoading}
                  type="submit"
                  className="rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] h-16 shadow-2xl border-none transition-all duration-300 hover:scale-[1.02] active:scale-98 relative overflow-hidden group"
                  style={{ background: 'linear-gradient(135deg, #701515 0%, #4a0d0d 100%)', color: '#fff' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/20 to-amber-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </Button>
                
                <p className="text-center text-[9px] font-black text-slate-600 uppercase tracking-[0.3em]">
                  Academic Year 2024-25 • Session Management
                </p>
              </div>
            </form>
          </div>
        </Card>
        
        {/* Subtle Footer */}
        <div className="mt-8 text-center">
          <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">
            Manav Rachna Educational Institutions • <span className="text-amber-500/50">NAAC A+ Accredited</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;