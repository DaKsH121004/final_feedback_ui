import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { logout } from '../store/authSlice';
import { useGetFeedbackDataQuery } from '../services/api';
import { motion, AnimatePresence } from 'motion/react';
import * as XLSX from 'xlsx';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user } = useSelector((state) => state.auth);
  const { data: feedbackData } = useGetFeedbackDataQuery();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleDownloadReport = () => {
    // If no data from API, use some mock data for demonstration
    const dataToExport = feedbackData || [
      {
        'Submitted At': new Date().toISOString(),
        'School Name': 'School of Engineering',
        'Department': 'Computer Science',
        'Semester': '4th',
        'Class-Section': 'CSE-A',
        'Name of Faculty': 'Dr. Sachin Lakra',
        'Course Name': 'Computer Science',
        'Q1': 5, 'Q2': 4, 'Q3': 5, 'Q4': 4, 'Q5': 5,
        'Comments': 'Excellent teaching'
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Feedback Report");
    
    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, `Feedback_Report_${new Date().toLocaleDateString()}.xlsx`);
  };

  const menuItems = [
    { label: 'Dashboard', icon: 'pi pi-home', path: '/' },
    { label: 'Analytics', icon: 'pi pi-chart-bar', path: '/analytics' },
    { label: 'Feedbacks', icon: 'pi pi-comments', path: '/feedbacks' },
    
    { label: 'Schools', icon: 'pi pi-building', path: '/schools' },
    { label: 'Departments', icon: 'pi pi-briefcase', path: '/departments' },
    { label: 'Faculty', icon: 'pi pi-users', path: '/faculty' },
    { label: 'Courses', icon: 'pi pi-book', path: '/courses' },
    { label: 'Course Assign', icon: 'pi pi-link', path: '/assignment' },
  ];

  return (
    <div className="h-screen bg-slate-100 flex overflow-hidden font-sans">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? '280px' : '80px' }}
        className="flex flex-col z-30 shadow-2xl relative"
        style={{ background: 'var(--mru-maroon-dark)' }}
      >
        <div className="h-24 flex items-center px-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-lg p-1">
               {/* MRU Placeholder Logo Icon */}
               <i className="pi pi-university text-2xl" style={{ color: 'var(--mru-maroon)' }} />
            </div>
            {sidebarOpen && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col"
              >
                <span className="text-sm font-black text-white tracking-widest leading-none uppercase">Manav Rachna</span>
                <span className="text-[10px] font-bold text-amber-500 tracking-[0.15em] mt-1 uppercase">University</span>
              </motion.div>
            )}
          </div>
        </div>

        <nav className="flex-1 py-6 px-3 flex flex-col gap-1.5 overflow-y-auto overflow-x-hidden custom-scrollbar">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group relative ${
                  isActive 
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-lg' 
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                <i className={`${item.icon} text-lg shrink-0 ${isActive ? 'text-amber-400' : 'group-hover:scale-110 transition-transform'}`} />
                {sidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`whitespace-nowrap text-sm ${isActive ? 'font-black tracking-tight' : 'font-semibold'}`}
                  >
                    {item.label}
                  </motion.span>
                )}
                {isActive && sidebarOpen && (
                  <motion.div 
                    layoutId="active-pill"
                    className="absolute right-2 w-1 h-4 bg-amber-500 rounded-full"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 bg-black/20">
          <Button
            icon={`pi ${sidebarOpen ? 'pi-angle-left' : 'pi-angle-right'}`}
            className="p-button-text p-button-secondary w-full rounded-xl text-white/40 hover:text-white hover:bg-white/10"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          />
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 relative h-full">
        {/* MRU Branding Header Strip */}
        <div className="h-4 bg-amber-500 w-full shrink-0 shadow-sm" />
        
        {/* Header */}
        <header className="h-24 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-6">
            <div className="hidden lg:flex flex-col border-r border-slate-200 pr-6">
              <h1 className="text-xl font-serif font-black text-slate-800 leading-none">Manav Rachna University</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">Aravalli Hills, Faridabad · NAAC A+ Accredited</p>
            </div>
            <div className="flex flex-col">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                {menuItems.find(i => i.path === location.pathname)?.label || 'Page'}
                <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full border border-emerald-100 font-bold uppercase tracking-widest">Live</span>
              </h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Academic Admin Portal · Session 2026</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 border-l border-slate-200 pl-6 cursor-pointer group" onClick={() => {
              if (window.confirm("Security Alert: You are about to terminate the current administrative session. Do you wish to proceed with Logout?")) {
                handleLogout();
              }
            }}>
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-slate-900 group-hover:text-red-800 transition-colors leading-none mb-1">{user?.fullName || user?.name || 'Administrator'}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{user?.role?.replace('SUPERADMIN', 'SYSTEM ADMIN')}</p>
              </div>
              <Avatar 
                label={(user?.fullName || user?.name || 'A').charAt(0)} 
                shape="circle" 
                className="bg-slate-100 text-slate-700 font-bold border-2 border-white shadow-md w-12 h-12" 
                style={{ background: 'linear-gradient(135deg, #701515 0%, #4a0d0d 100%)', color: '#fff' }}
              />
            </div>
          </div>
        </header>

        {/* Gold Accent Bar */}
        <div className="h-1 w-full bg-gradient-to-r from-amber-500 via-amber-200 to-amber-500 opacity-50 shrink-0" />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10 bg-slate-100/50 scroll-smooth">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.01 }}
              transition={{ duration: 0.2 }}
              className="max-w-[1600px] mx-auto"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
        
        {/* Footer Accent */}
        <footer className="h-10 bg-white border-t border-slate-200 flex items-center justify-center gap-4 px-8 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">
          <span>Academic Excellence</span>
          <div className="w-1 h-1 rounded-full bg-amber-500"></div>
          <span>Student Feedback Portal</span>
          <div className="w-1 h-1 rounded-full bg-amber-500"></div>
          <span>Manav Rachna © 2026</span>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
