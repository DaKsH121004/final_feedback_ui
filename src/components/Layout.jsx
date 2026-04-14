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
    { label: 'Feedbacks', icon: 'pi pi-chart-bar', path: '/feedbacks' },
    
    { label: 'Schools', icon: 'pi pi-building', path: '/schools' },
    { label: 'Departments', icon: 'pi pi-briefcase', path: '/departments' },
    { label: 'Faculty', icon: 'pi pi-users', path: '/faculty' },
    { label: 'Courses', icon: 'pi pi-book', path: '/courses' },
  ];

  return (
    <div className="h-screen bg-slate-50 flex overflow-hidden font-sans">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? '280px' : '80px' }}
        className="bg-slate-900 flex flex-col z-30 shadow-2xl relative"
      >
        <div className="h-20 flex items-center px-6 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/20">
              <i className="pi pi-shield text-white text-xl" />
            </div>
            {sidebarOpen && (
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xl font-black text-white tracking-tight whitespace-nowrap"
              >
                 Faculty Feedback
              </motion.span>
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
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group relative ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <i className={`${item.icon} text-lg shrink-0 ${isActive ? 'text-white' : 'group-hover:scale-110 transition-transform'}`} />
                {sidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="whitespace-nowrap font-semibold text-sm"
                  >
                    {item.label}
                  </motion.span>
                )}
                {isActive && sidebarOpen && (
                  <motion.div 
                    layoutId="active-pill"
                    className="absolute right-2 w-1.5 h-1.5 bg-white rounded-full"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
          <Button
            icon={`pi ${sidebarOpen ? 'pi-angle-left' : 'pi-angle-right'}`}
            className="p-button-text p-button-secondary w-full rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          />
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 relative h-full">
        {/* Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                {menuItems.find(i => i.path === location.pathname)?.label || 'Page'}
              </h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Management Console</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 cursor-pointer group p-1.5 pr-4 rounded-full hover:bg-slate-50 transition-colors" onClick={handleLogout}>
              <Avatar 
                label={user?.name?.charAt(0)} 
                shape="circle" 
                className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold border-2 border-white shadow-lg" 
              />
              <div className="text-left hidden sm:block">
                <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-none mb-1">{user?.name}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{user?.role}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-8 bg-slate-50/50 scroll-smooth">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="max-w-7xl mx-auto"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default Layout;
