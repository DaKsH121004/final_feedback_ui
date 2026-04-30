// import React, { useState } from "react";
// import { Card } from "primereact/card";
// import { Button } from "primereact/button";
// import { Avatar } from "primereact/avatar";
// import { Tag } from "primereact/tag";
// import { InputSwitch } from "primereact/inputswitch";
// import { motion } from "motion/react";
// import { Link } from "react-router-dom";
// import { useGetDashboardQuery, useGetFormStatusQuery } from "../services/api";
// import FormToggle from "../components/FormToggle";
// import { Dialog } from "primereact/dialog";

// const DashboardPage = () => {
//   const { data: formStatus, isLoading: statusLoading } =
//     useGetFormStatusQuery();
//   const { data: dashboardData, isLoading } = useGetDashboardQuery();
//   // const [toggleForm] = useToggleFormStatusMutation();
//   const [visible, setVisible] = useState(false);

//   const stats = [
//     {
//       title: "Total Feedbacks",
//       value: dashboardData?.totalFeedback || 0,
//       icon: "pi-comments",
//       color: "indigo",
//     },
//     {
//       title: "Avg. Rating",
//       value: (dashboardData?.averageRating || 0).toFixed(2),
//       icon: "pi-star",
//       color: "emerald",
//     },
//     {
//       title: "Faculty Members",
//       value: dashboardData?.totalFaculty || 0,
//       icon: "pi-users",
//       color: "orange",
//     },
//   ];

//   const topFaculty = dashboardData?.faculties || [];

//   if (isLoading) {
//     return <p className="text-center mt-10">Loading dashboard...</p>;
//   }

//   return (
//     <div className="max-w-7xl mx-auto">
//       <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
//         <div>
//           <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
//             System Overview
//           </h1>
//           <p className="text-slate-500 font-medium">
//             Welcome back! Here's the latest summary of faculty feedback.
//           </p>
//         </div>
//         <div className="flex gap-3">
//           {/* Form Control Toggle */}
//           <Button
//             label="Form Control"
//             icon="pi pi-cog"
//             className="p-button-secondary rounded-xl font-bold"
//             onClick={() => setVisible(true)}
//           />
//           {/* <FormToggle /> */}

//           <Link to="/create-form">
//             <Button
//               label="New Feedback"
//               icon="pi pi-plus"
//               className="p-button-primary rounded-xl font-bold px-6 shadow-lg shadow-indigo-100"
//             />
//           </Link>
//         </div>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">
//         {stats?.map((stat, idx) => (
//           <motion.div
//             key={idx}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: idx * 0.1 }}
//           >
//             <Card className="shadow-sm hover:shadow-xl transition-all duration-300 rounded-3xl border-none overflow-hidden group">
//               <div className="flex justify-between items-start mb-4">
//                 <div
//                   className={`w-12 h-12 rounded-2xl bg-${stat.color}-50 flex items-center justify-center text-${stat.color}-600 group-hover:bg-${stat.color}-600 group-hover:text-white transition-colors duration-500`}
//                 >
//                   <i className={`pi ${stat.icon} text-xl`} />
//                 </div>
//               </div>
//               <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">
//                 {stat.title}
//               </p>
//               <p className="text-3xl font-black text-slate-900 tracking-tight">
//                 {stat.value}
//               </p>
//             </Card>
//           </motion.div>
//         ))}
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {/* Recent Activity */}
//         <div className="lg:col-span-2">
//           <Card
//             title="Top Feedback Entities"
//             className="shadow-sm rounded-3xl border-none h-full"
//           >
//             <div className="flex flex-col gap-4 mt-4">
//               {topFaculty?.map((item, idx) => (
//                 <div
//                   key={idx}
//                   className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-colors group"
//                 >
//                   <div className="flex items-center gap-4">
//                     <Avatar
//                       label={item?.faculty?.charAt(0)}
//                       shape="circle"
//                       className="bg-white text-indigo-600 font-bold shadow-sm"
//                     />
//                     <div>
//                       <p className="text-sm font-bold text-slate-900">
//                         {item.facultyName}
//                       </p>

//                       {/* <p className="text-xs text-slate-500">
//                         {item.departments
//                           ?.map((d) => d?.departmentName)
//                           .join(", ") || "No Department"}
//                       </p> */}
//                     </div>
//                   </div>
//                   <div className="text-right">
//                     <div className="flex items-center gap-1 mb-1 justify-end">
//                       {[...Array(5)].map((_, i) => (
//                         <i
//                           key={i}
//                           className={`pi pi-star-fill text-[10px] ${i < Math.round(item.averageRating || 0) ? "text-amber-400" : "text-slate-200"}`}
//                         />
//                       ))}
//                     </div>
//                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
//                       {item.time}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//             <Link to="/analytics">
//               <Button
//                 label="View Detailed Analytics"
//                 className="p-button-text p-button-sm w-full mt-6 font-bold"
//               />
//             </Link>
//           </Card>
//         </div>

//         {/* Quick Actions / Info */}
//         <div className="flex flex-col gap-6">
//           <Card className="shadow-sm rounded-3xl border-none bg-indigo-600 text-white overflow-hidden relative">
//             <div className="relative z-10">
//               <h3 className="text-xl font-bold mb-2">Ready to analyze?</h3>
//               <p className="text-indigo-100 text-sm mb-6 opacity-80">
//                 Upload your latest feedback data to generate comprehensive
//                 reports and insights.
//               </p>
//               <Link to="/analytics">
//                 <Button
//                   label="Go to Analytics"
//                   icon="pi pi-arrow-right"
//                   iconPos="right"
//                   className="p-button-secondary w-full rounded-xl font-bold py-3"
//                 />
//               </Link>
//             </div>
//             <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-white/10 rounded-full blur-2xl" />
//           </Card>

//           {/* <Card
//             title="System Status"
//             className="shadow-sm rounded-3xl border-none"
//           >
//             <div className="flex flex-col gap-4 mt-2">
//               <div className="flex items-center justify-between">
//                 <span className="text-sm font-medium text-slate-600">
//                   Database Sync
//                 </span>
//                 <Tag value="Active" severity="success" className="rounded-lg" />
//               </div>
//               <div className="flex items-center justify-between">
//                 <span className="text-sm font-medium text-slate-600">
//                   Last Backup
//                 </span>
//                 <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
//                   2h ago
//                 </span>
//               </div>
//               <div className="flex items-center justify-between">
//                 <span className="text-sm font-medium text-slate-600">
//                   Active Users
//                 </span>
//                 <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
//                   12 Online
//                 </span>
//               </div>
//             </div>
//           </Card> */}
//         </div>
//       </div>
//       <Dialog
//         header="Feedback Form Control"
//         visible={visible}
//         onHide={() => setVisible(false)}
//         className="rounded-2xl w-[400px]"
//       >
//         <div className="flex flex-col gap-4">
//           <div className="flex flex-col items-center justify-between p-4 bg-slate-50 rounded-xl gap-3">
//             <div>
//               <p className="text-sm font-bold text-slate-800">
//                 Enable Feedback Form
//               </p>
//               <p className="text-xs text-slate-500">
//                 Toggle to allow students to submit feedback
//               </p>
//             </div>

//             {/* Your existing toggle component */}
//             <FormToggle />
//           </div>
//         </div>
//       </Dialog>
//     </div>
//   );
// };

// export default DashboardPage;



import React, { useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";
import { InputSwitch } from "primereact/inputswitch";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { useGetDashboardQuery, useGetFormStatusQuery } from "../services/api";
import FormToggle from "../components/FormToggle";
import { Dialog } from "primereact/dialog";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  RadialBarChart,
  RadialBar,
} from "recharts";

// ── Custom Tooltip ──────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-100 shadow-xl rounded-2xl px-4 py-3">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">
          {label}
        </p>
        {payload.map((p, i) => (
          <p key={i} className="text-sm font-bold" style={{ color: p.color }}>
            {p.name}: <span className="text-slate-800">{p.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// ── Stat Card ───────────────────────────────────────────────────────────────
const StatCard = ({ stat, idx }) => {
  const colorMap = {
    maroon: {
      bg: "bg-red-50",
      text: "text-[#701515]",
      hoverBg: "group-hover:bg-[#701515]",
      hoverText: "group-hover:text-white",
      iconBg: "bg-[#701515]/10",
    },
    gold: {
      bg: "bg-amber-50",
      text: "text-[#c5a028]",
      hoverBg: "group-hover:bg-[#c5a028]",
      hoverText: "group-hover:text-white",
      iconBg: "bg-[#c5a028]/10",
    },
    slate: {
      bg: "bg-slate-50",
      text: "text-slate-600",
      hoverBg: "group-hover:bg-slate-700",
      hoverText: "group-hover:text-white",
      iconBg: "bg-slate-200",
    },
  };
  
  // Map incoming colors to MRU theme
  const themeColor = stat.color === 'indigo' ? 'maroon' : (stat.color === 'emerald' ? 'gold' : 'slate');
  const c = colorMap[themeColor];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.1, type: "spring", stiffness: 120 }}
    >
      <Card className="shadow-sm hover:shadow-2xl transition-all duration-500 rounded-[2rem] border-none overflow-hidden group cursor-default bg-white relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700 opacity-50" />
        
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div
              className={`w-14 h-14 rounded-2xl ${c.iconBg} ${c.text} ${c.hoverBg} ${c.hoverText} flex items-center justify-center transition-all duration-500 shadow-inner`}
            >
              <i className={`pi ${stat.icon} text-2xl`} />
            </div>
            {stat.change && (
              <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 uppercase tracking-widest">
                {stat.change}
              </span>
            )}
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">
            {stat.title}
          </p>
          <p className="text-4xl font-black text-slate-900 tracking-tighter">
            {stat.value}
          </p>
        </div>
      </Card>
    </motion.div>
  );
};

// ── Section Header ──────────────────────────────────────────────────────────
const SectionHeader = ({ title, subtitle }) => (
  <div className="mb-8">
    <h2 className="text-xl font-serif font-black text-slate-900 tracking-tight flex items-center gap-3">
      <div className="w-1 h-6 bg-[#701515] rounded-full"></div>
      {title}
    </h2>
    {subtitle && <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-2 ml-4">{subtitle}</p>}
  </div>
);

// ── Main Component ──────────────────────────────────────────────────────────
const DashboardPage = () => {
  const { data: formStatus, isLoading: statusLoading } = useGetFormStatusQuery();
  const { data: dashboardData, isLoading } = useGetDashboardQuery();
  const [visible, setVisible] = useState(false);

  const stats = [
    {
      title: "Total Feedback",
      value: dashboardData?.totalFeedback || 0,
      icon: "pi-comments",
      color: "indigo",
      change: "+12%",
    },
    {
      title: "Academic Quality",
      value: (dashboardData?.averageRating || 0).toFixed(2),
      icon: "pi-star-fill",
      color: "emerald",
      change: "+0.3",
    },
    {
      title: "Faculty Cadre",
      value: dashboardData?.totalFaculty || 0,
      icon: "pi-users",
      color: "orange",
    },
    {
      title: "Curriculum Scope",
      value: dashboardData?.totalCourses || 0,
      icon: "pi-book",
      color: "indigo",
    },
    {
      title: "Divisions",
      value: dashboardData?.totalDepartments || 0,
      icon: "pi-building",
      color: "emerald",
    },
  ];

  const topFaculty = dashboardData?.faculties || [];
  const departmentPerformance = dashboardData?.departmentPerformance || [];
  const facultyTrend = dashboardData?.ratingTrend || [];
  const feedbackVolume = dashboardData?.feedbackVolume || [];

  const topFacultyChart = topFaculty.slice(0, 5).map((f) => ({
    name: f.facultyName?.split(" ").slice(-1)[0] || f.facultyName,
    fullName: f.facultyName,
    rating: parseFloat((f.averageRating || 0).toFixed(2)),
  }));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <i className="pi pi-spin pi-spinner text-5xl text-[#701515]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <i className="pi pi-university text-xs text-[#701515]" />
            </div>
          </div>
          <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-xs">Authenticating Dashboard Data…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-full space-y-12 pb-12">
      {/* ── Welcome Section ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
        <div>
          <div className="flex items-center gap-3 mb-3">
             <span className="bg-red-50 text-[#701515] text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest border border-red-100">Official Admin Portal</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-black text-slate-900 tracking-tighter mb-3">
            Academic Performance <span className="text-[#701515]">Analytics</span>
          </h1>
          <p className="text-slate-500 font-medium text-lg opacity-80 max-w-2xl">
            Monitoring the pulse of educational excellence at Manav Rachna University through real-time student insights.
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          <Button
            label="System Configuration"
            icon="pi pi-sliders-h"
            className="p-button-text p-button-secondary rounded-2xl font-black text-xs uppercase tracking-widest px-6 py-4 hover:bg-slate-50 transition-all border border-slate-200"
            onClick={() => setVisible(true)}
          />
          <Link to="/create-form">
            <Button
              label="Initiate Feedback"
              icon="pi pi-plus-circle"
              className="rounded-2xl font-black text-xs uppercase tracking-widest px-8 py-4 shadow-xl shadow-red-900/20 border-none transition-transform hover:scale-105 active:scale-95"
              style={{ background: 'linear-gradient(135deg, #701515 0%, #4a0d0d 100%)', color: '#fff' }}
            />
          </Link>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {stats.map((stat, idx) => (
          <StatCard key={idx} stat={stat} idx={idx} />
        ))}
      </div>

      {/* ── Analytics Grid ── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        
        {/* Left Column: Visual Analytics */}
        <div className="xl:col-span-8 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Dept Performance */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <Card className="shadow-sm rounded-[2.5rem] border-none p-4">
                <SectionHeader title="Divisional Quality" subtitle="Departmental rating distribution" />
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={departmentPerformance} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="mruMaroon" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#701515" stopOpacity={1} />
                        <stop offset="100%" stopColor="#4a0d0d" stopOpacity={0.8} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="label" tick={{ fontSize: 10, fontWeight: 800, fill: "#64748b" }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 5]} ticks={[0, 1, 2, 3, 4, 5]} tick={{ fontSize: 10, fontWeight: 700, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f8fafc" }} />
                    <Bar dataKey="value" fill="url(#mruMaroon)" radius={[10, 10, 0, 0]} barSize={32} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </motion.div>

            {/* Rating Trend */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
              <Card className="shadow-sm rounded-[2.5rem] border-none p-4">
                <SectionHeader title="Academic Trajectory" subtitle="Longitudinal rating progression" />
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={facultyTrend} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="label" tick={{ fontSize: 10, fontWeight: 800, fill: "#64748b" }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 5]} ticks={[0, 1, 2, 3, 4, 5]} tick={{ fontSize: 10, fontWeight: 700, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="value" stroke="#c5a028" strokeWidth={4} dot={{ r: 6, fill: "#701515", strokeWidth: 3, stroke: "#fff" }} activeDot={{ r: 8, strokeWidth: 0 }} />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </motion.div>
          </div>

          {/* Feedback Volume */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <Card className="shadow-sm rounded-[2.5rem] border-none p-6">
              <SectionHeader title="Submission Velocity" subtitle="Response volume across divisions" />
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={feedbackVolume} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="mruGold" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#c5a028" stopOpacity={1} />
                      <stop offset="100%" stopColor="#e5b80b" stopOpacity={0.6} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 10, fontWeight: 800, fill: "#64748b" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fontWeight: 700, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" fill="url(#mruGold)" radius={[10, 10, 0, 0]} barSize={60} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        </div>

        {/* Right Column: Faculty Honors */}
        <div className="xl:col-span-4 space-y-10">
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 }}>
            <Card className="shadow-2xl rounded-[2.5rem] border-none p-8 bg-white relative overflow-hidden h-full">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                 <i className="pi pi-star text-9xl text-[#c5a028]" />
              </div>
              
              <SectionHeader title="Excellence Registry" subtitle="Elite faculty performance" />
              
              <div className="space-y-6 mt-10">
                {topFaculty.slice(0, 5).map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-5 bg-slate-50/50 rounded-2xl border border-slate-100 group hover:bg-white hover:shadow-xl hover:border-[#c5a028]/30 transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Avatar label={item?.facultyName?.charAt(0)} shape="circle" className="bg-white text-[#701515] font-black shadow-md w-12 h-12 border-2 border-white" />
                        {idx === 0 && <div className="absolute -top-1 -right-1 bg-[#c5a028] text-white w-5 h-5 rounded-full flex items-center justify-center border-2 border-white"><i className="pi pi-bookmark-fill text-[8px]" /></div>}
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-800 leading-tight">{item.facultyName}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">MRU Faculty Member</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 mb-1 justify-end">
                        <span className="text-sm font-black text-slate-700 mr-2">{(item.averageRating || 0).toFixed(1)}</span>
                        <i className="pi pi-star-fill text-[12px] text-[#c5a028]" />
                      </div>
                      <div className="flex gap-0.5">
                         {[...Array(5)].map((_, i) => (
                           <div key={i} className={`h-1 w-3 rounded-full ${i < Math.round(item.averageRating || 0) ? 'bg-[#c5a028]' : 'bg-slate-200'}`} />
                         ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Link to="/analytics" className="block mt-10">
                <Button label="Audit Performance Matrix" icon="pi pi-external-link" className="p-button-text p-button-sm w-full font-black text-xs uppercase tracking-widest text-[#701515] hover:bg-red-50 py-4 rounded-xl" />
              </Link>
            </Card>
          </motion.div>
          
          <Card className="shadow-sm rounded-[2.5rem] border-none bg-gradient-to-br from-[#701515] to-[#4a0d0d] text-white p-8 overflow-hidden relative group">
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6 backdrop-blur-md border border-white/10">
                <i className="pi pi-info-circle text-xl" />
              </div>
              <h3 className="text-2xl font-serif font-black mb-3">System Integrity</h3>
              <p className="text-red-100/70 text-sm font-medium leading-relaxed mb-8">
                All data points are verified against institutional academic standards for Session 2026.
              </p>
              <Button label="Generate Report" icon="pi pi-file-pdf" className="p-button-secondary w-full rounded-2xl font-black text-xs uppercase tracking-widest py-4 bg-white text-[#701515] border-none shadow-lg" />
            </div>
          </Card>
        </div>
      </div>

      {/* ── Form Control Dialog ── */}
      <Dialog
        header={
          <div className="flex items-center gap-3 py-2">
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center"><i className="pi pi-cog text-[#701515]" /></div>
            <div className="flex flex-col">
              <span className="text-xl font-black text-slate-900 leading-none">System Control</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Feedback Portal Status</span>
            </div>
          </div>
        }
        visible={visible}
        onHide={() => setVisible(false)}
        className="rounded-[2.5rem] w-[450px] overflow-hidden"
        maskClassName="backdrop-blur-md bg-slate-900/20"
      >
        <div className="p-2">
          <div className="flex flex-col items-center gap-6 p-8 bg-slate-50/50 rounded-[2rem] border border-slate-100">
            <div className="text-center">
              <p className="text-lg font-black text-slate-800 mb-2">Live Portal Intake</p>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Toggle to authorize the commencement of student feedback for the current academic cycle.
              </p>
            </div>
            <FormToggle />
            <div className="w-full h-px bg-slate-200 my-2" />
            <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
               <i className="pi pi-shield text-emerald-500" />
               Security Protocols Active
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default DashboardPage;

