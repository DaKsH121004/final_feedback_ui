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
import { Divider } from 'primereact/divider';
import { setCredentials } from '../store/authSlice';
import { motion } from 'motion/react';
import { useLoginMutation } from '../services/api';

const LoginPage = () => {
  const [email, setEmail] = useState('');   // ✅ changed
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation(); // ✅ RTK Query

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await login({
        email,      // ✅ FIXED
        password,
      }).unwrap();

      // ✅ Save user + token
      dispatch(setCredentials({
        user: res.user,
        token: res.token
      }));

      // ✅ Save token for API calls
      localStorage.setItem('token', res.token);

      navigate('/');

    } catch (err) {
      console.error(err);
      setError(err?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 relative overflow-hidden">

      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-100 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-100 rounded-full blur-3xl opacity-50" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-[450px] z-10"
      >
        <Card className="shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[2rem] border-none overflow-hidden bg-white/80 backdrop-blur-md">
          <div className="p-4">
            
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl shadow-lg mb-4">
                <i className="pi pi-shield text-white text-3xl" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900">Faculty Feedback system</h1>
              <p className="text-slate-500 mt-2">Login to continue</p>
            </div>

            <form onSubmit={handleLogin} className="flex flex-col gap-5">

              {error && (
                <Message severity="error" text={error} />
              )}

              {/* ✅ EMAIL FIELD */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-700">Email</label>
                <InputText
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>

              {/* ✅ PASSWORD FIELD */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-700">Password</label>
                <Password
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  feedback={false}
                  toggleMask
                  required
                />
              </div>

              {/* ✅ BUTTON */}
              <Button
                label={isLoading ? "Authenticating..." : "Sign In"}
                loading={isLoading}
                type="submit"
                className="mt-2"
              />

              <Divider align="center">
                <span className="text-xs text-slate-400">OR</span>
              </Divider>

            </form>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginPage;