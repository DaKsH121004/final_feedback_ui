// import { useState } from 'react';
// import { FileUpload } from 'primereact/fileupload';
// import { Message } from 'primereact/message';
// import { 
//   BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
//   PieChart, Pie, Cell, AreaChart, Area
// } from 'recharts';
// import * as XLSX from 'xlsx';
// import { motion, AnimatePresence } from 'motion/react';
// import { 
//   Users, Star, Award, AlertCircle, TrendingUp, 
//   School, BookOpen, Building2, Calendar, 
//   ChevronRight, Download, FileSpreadsheet, Info
// } from 'lucide-react';
// import { clsx } from 'clsx';
// import { twMerge } from 'tailwind-merge';

// // Utility for Tailwind class merging
// function cn(...inputs) {
//   return twMerge(clsx(inputs));
// }

// const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

// export default function App() {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const onUpload = (e) => {
//     const file = e.files[0];
//     const reader = new FileReader();
//     setLoading(true);
//     setError('');

//     reader.onload = (evt) => {
//       try {
//         const bstr = evt.target.result;
//         const wb = XLSX.read(bstr, { type: 'binary' });
//         const wsname = wb.SheetNames[0];
//         const ws = wb.Sheets[wsname];
//         const jsonData = XLSX.utils.sheet_to_json(ws);
        
//         if (jsonData.length === 0) {
//           setError('The uploaded file is empty.');
//           setData(null);
//         } else {
//           processData(jsonData);
//         }
//       } catch (err) {
//         setError('Failed to parse Excel file. Please ensure it is a valid .xlsx or .xls file.');
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     reader.readAsBinaryString(file);
//   };

//   const processData = (jsonData) => {
//     const schoolCounts = {};
//     const facultyStats = {};
//     const courseStats = {};
//     const deptStats = {};
//     const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
//     const timeline = {};
//     const qTotals = { Q1: 0, Q2: 0, Q3: 0, Q4: 0, Q5: 0 };

//     let totalRating = 0;

//     jsonData.forEach(item => {
//       // Normalize keys based on common variations or the image provided
//       const q1 = Number(item.Q1 || item.q1) || 0;
//       const q2 = Number(item.Q2 || item.q2) || 0;
//       const q3 = Number(item.Q3 || item.q3) || 0;
//       const q4 = Number(item.Q4 || item.q4) || 0;
//       const q5 = Number(item.Q5 || item.q5) || 0;

//       qTotals.Q1 += q1;
//       qTotals.Q2 += q2;
//       qTotals.Q3 += q3;
//       qTotals.Q4 += q4;
//       qTotals.Q5 += q5;

//       const avg = Number(item.AvgRating) || (q1 + q2 + q3 + q4 + q5) / 5;
//       totalRating += avg;

//       // Rating Distribution
//       const rounded = Math.max(1, Math.min(5, Math.round(avg)));
//       ratingDistribution[rounded]++;

//       // School
//       const school = item.School || 'Unknown';
//       schoolCounts[school] = (schoolCounts[school] || 0) + 1;

//       // Faculty
//       const faculty = item.Faculty || 'Unknown';
//       if (!facultyStats[faculty]) facultyStats[faculty] = { total: 0, count: 0 };
//       facultyStats[faculty].total += avg;
//       facultyStats[faculty].count++;

//       // Course
//       const course = item.Course || 'Unknown';
//       if (!courseStats[course]) courseStats[course] = { total: 0, count: 0 };
//       courseStats[course].total += avg;
//       courseStats[course].count++;

//       // Department
//       const dept = item.Departme || item.Department || 'Unknown';
//       if (!deptStats[dept]) deptStats[dept] = { total: 0, count: 0 };
//       deptStats[dept].total += avg;
//       deptStats[dept].count++;

//       // Timeline
//       const rawDate = item.Date || item.date;
//       const date = rawDate ? new Date(rawDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Unknown';
//       timeline[date] = (timeline[date] || 0) + 1;
//     });

//     const facultyPerformance = Object.entries(facultyStats).map(([name, val]) => ({
//       name,
//       rating: Number((val.total / val.count).toFixed(2)),
//       responses: val.count
//     })).sort((a, b) => b.rating - a.rating);

//     const questionAverages = Object.entries(qTotals).map(([name, total]) => ({
//       name,
//       average: Number((total / jsonData.length).toFixed(2))
//     }));

//     const weakestQuestion = [...questionAverages].sort((a, b) => a.average - b.average)[0];

//     const processed = {
//       totalFeedbacks: jsonData.length,
//       overallAvg: Number((totalRating / jsonData.length).toFixed(2)),
//       bestFaculty: facultyPerformance[0] || { name: 'N/A', rating: 0 },
//       worstFaculty: facultyPerformance[facultyPerformance.length - 1] || { name: 'N/A', rating: 0 },
//       schoolDistribution: Object.entries(schoolCounts).map(([name, value]) => ({ name, value })),
//       ratingDistribution: Object.entries(ratingDistribution).map(([rating, count]) => ({ rating: `${rating}★`, count })),
//       facultyPerformance,
//       departmentPerformance: Object.entries(deptStats).map(([name, val]) => ({
//         name,
//         rating: Number((val.total / val.count).toFixed(2))
//       })),
//       coursePerformance: Object.entries(courseStats).map(([name, val]) => ({
//         name,
//         rating: Number((val.total / val.count).toFixed(2))
//       })),
//       questionAverages,
//       timeline: Object.entries(timeline).map(([date, count]) => ({ date, count })),
//       weakestQuestion
//     };

//     setData(processed);
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
//           <motion.div 
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//           >
//             <div className="flex items-center gap-2 mb-2">
//               <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
//                 <TrendingUp className="text-white w-5 h-5" />
//               </div>
//               <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Analytics Dashboard</span>
//             </div>
//             <h1 className="text-4xl font-black text-slate-900 tracking-tight">InsightFlow</h1>
//             <p className="text-slate-500 font-medium mt-1">Transforming student feedback into actionable educational insights.</p>
//           </motion.div>

//           <motion.div 
//             initial={{ opacity: 0, scale: 0.95 }}
//             animate={{ opacity: 1, scale: 1 }}
//             className="flex items-center gap-3"
//           >
//             <FileUpload 
//               mode="basic" 
//               name="feedback" 
//               accept=".xlsx,.xls" 
//               maxFileSize={5000000} 
//               onSelect={onUpload} 
//               auto 
//               chooseLabel="Upload Feedback Excel"
//               className="p-button-primary shadow-lg shadow-indigo-100 rounded-xl font-bold px-6 py-3"
//             />
//           </motion.div>
//         </header>

//         <AnimatePresence mode="wait">
//           {error && (
//             <motion.div 
//               initial={{ opacity: 0, height: 0 }}
//               animate={{ opacity: 1, height: 'auto' }}
//               exit={{ opacity: 0, height: 0 }}
//               className="mb-8"
//             >
//               <Message severity="error" text={error} className="w-full rounded-2xl border-none shadow-sm" />
//             </motion.div>
//           )}

//           {!data && !loading && (
//             <motion.div 
//               key="empty"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, scale: 0.95 }}
//               className="bg-white border border-slate-200 rounded-[2.5rem] p-12 md:p-24 flex flex-col items-center justify-center text-center shadow-sm"
//             >
//               <div className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center mb-8 relative">
//                 <FileSpreadsheet className="w-12 h-12 text-slate-300" />
//                 <div className="absolute -bottom-1 -right-1 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
//                   <Download className="w-5 h-5 text-indigo-500" />
//                 </div>
//               </div>
//               <h2 className="text-2xl font-bold text-slate-800 mb-3">Ready to analyze?</h2>
//               <p className="text-slate-500 max-w-md leading-relaxed">
//                 Upload your student feedback Excel sheet to generate real-time visualizations, performance metrics, and key educational insights.
//               </p>
//               <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl">
//                 {['School Distribution', 'Faculty Ranking', 'Trend Analysis', 'Question Metrics'].map((feat) => (
//                   <div key={feat} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
//                     {feat}
//                   </div>
//                 ))}
//               </div>
//             </motion.div>
//           )}

//           {loading && (
//             <motion.div 
//               key="loading"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               className="py-32 flex flex-col items-center justify-center"
//             >
//               <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-6" />
//               <p className="text-slate-500 font-bold tracking-tight">Processing educational data...</p>
//             </motion.div>
//           )}

//           {data && (
//             <motion.div 
//               key="dashboard"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               className="space-y-8"
//             >
//               {/* KPI Section */}
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//                 <KPICard 
//                   title="Total Feedbacks" 
//                   value={data.totalFeedbacks} 
//                   icon={<Users className="w-6 h-6 text-indigo-600" />}
//                   trend="+12% from last sem"
//                   color="indigo"
//                 />
//                 <KPICard 
//                   title="Overall Average" 
//                   value={`${data.overallAvg}/5.0`} 
//                   icon={<Star className="w-6 h-6 text-amber-500" />}
//                   trend="High Satisfaction"
//                   color="amber"
//                 />
//                 <KPICard 
//                   title="Top Faculty" 
//                   value={data.bestFaculty.name} 
//                   subtitle={`${data.bestFaculty.rating} rating`}
//                   icon={<Award className="w-6 h-6 text-emerald-500" />}
//                   color="emerald"
//                 />
//                 <KPICard 
//                   title="Weakest Area" 
//                   value={data.weakestQuestion.name} 
//                   subtitle={`${data.weakestQuestion.average} avg`}
//                   icon={<AlertCircle className="w-6 h-6 text-rose-500" />}
//                   color="rose"
//                 />
//               </div>

//               {/* Main Charts Grid */}
//               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//                 {/* School Distribution */}
//                 <ChartCard title="School Distribution" icon={<School className="w-5 h-5" />}>
//                   <div className="h-[300px]">
//                     <ResponsiveContainer width="100%" height="100%">
//                       <PieChart>
//                         <Pie
//                           data={data.schoolDistribution}
//                           cx="50%"
//                           cy="50%"
//                           innerRadius={60}
//                           outerRadius={80}
//                           paddingAngle={8}
//                           dataKey="value"
//                         >
//                           {data.schoolDistribution.map((_, index) => (
//                             <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
//                           ))}
//                         </Pie>
//                         <Tooltip 
//                           contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
//                         />
//                         <Legend verticalAlign="bottom" iconType="circle" />
//                       </PieChart>
//                     </ResponsiveContainer>
//                   </div>
//                 </ChartCard>

//                 {/* Rating Distribution */}
//                 <ChartCard title="Rating Distribution" icon={<Star className="w-5 h-5" />}>
//                   <div className="h-[300px]">
//                     <ResponsiveContainer width="100%" height="100%">
//                       <BarChart data={data.ratingDistribution}>
//                         <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
//                         <XAxis dataKey="rating" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} />
//                         <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} />
//                         <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
//                         <Bar dataKey="count" fill="#6366f1" radius={[8, 8, 0, 0]} barSize={30} />
//                       </BarChart>
//                     </ResponsiveContainer>
//                   </div>
//                 </ChartCard>

//                 {/* Question Analysis */}
//                 <ChartCard title="Question Performance" icon={<BookOpen className="w-5 h-5" />}>
//                   <div className="h-[300px]">
//                     <ResponsiveContainer width="100%" height="100%">
//                       <BarChart data={data.questionAverages}>
//                         <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
//                         <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} />
//                         <YAxis domain={[0, 5]} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} />
//                         <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
//                         <Bar dataKey="average" fill="#10b981" radius={[8, 8, 0, 0]} barSize={30} />
//                       </BarChart>
//                     </ResponsiveContainer>
//                   </div>
//                 </ChartCard>
//               </div>

//               {/* Secondary Charts Grid */}
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                 {/* Faculty Performance */}
//                 <ChartCard title="Faculty Performance Ranking" icon={<Award className="w-5 h-5" />}>
//                   <div className="h-[400px]">
//                     <ResponsiveContainer width="100%" height="100%">
//                       <BarChart data={data.facultyPerformance.slice(0, 10)} layout="vertical">
//                         <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
//                         <XAxis type="number" domain={[0, 5]} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} />
//                         <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={120} tick={{ fill: '#475569', fontSize: 11, fontWeight: 600 }} />
//                         <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
//                         <Bar dataKey="rating" fill="#6366f1" radius={[0, 8, 8, 0]} barSize={20} />
//                       </BarChart>
//                     </ResponsiveContainer>
//                   </div>
//                 </ChartCard>

//                 {/* Timeline Analysis */}
//                 <ChartCard title="Feedback Volume Timeline" icon={<Calendar className="w-5 h-5" />}>
//                   <div className="h-[400px]">
//                     <ResponsiveContainer width="100%" height="100%">
//                       <AreaChart data={data.timeline}>
//                         <defs>
//                           <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
//                             <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
//                             <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
//                           </linearGradient>
//                         </defs>
//                         <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
//                         <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }} />
//                         <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }} />
//                         <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
//                         <Area type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
//                       </AreaChart>
//                     </ResponsiveContainer>
//                   </div>
//                 </ChartCard>
//               </div>

//               {/* Insights Panel */}
//               <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
//                 <div className="lg:col-span-3">
//                   <ChartCard title="Departmental Performance" icon={<Building2 className="w-5 h-5" />}>
//                     <div className="h-[300px]">
//                       <ResponsiveContainer width="100%" height="100%">
//                         <BarChart data={data.departmentPerformance}>
//                           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
//                           <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }} />
//                           <YAxis domain={[0, 5]} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }} />
//                           <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
//                           <Bar dataKey="rating" fill="#f59e0b" radius={[8, 8, 0, 0]} barSize={40} />
//                         </BarChart>
//                       </ResponsiveContainer>
//                     </div>
//                   </ChartCard>
//                 </div>

//                 <div className="space-y-6">
//                   <div className="bg-indigo-600 rounded-[2rem] p-8 text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
//                     <div className="relative z-10">
//                       <div className="flex items-center gap-2 mb-6">
//                         <Info className="w-5 h-5 text-indigo-200" />
//                         <span className="text-xs font-bold uppercase tracking-widest text-indigo-200">Key Insights</span>
//                       </div>
//                       <div className="space-y-6">
//                         <div>
//                           <p className="text-xs font-bold text-indigo-200 uppercase mb-1">Top Performer</p>
//                           <p className="text-xl font-bold">{data.bestFaculty.name}</p>
//                         </div>
//                         <div>
//                           <p className="text-xs font-bold text-indigo-200 uppercase mb-1">Action Required</p>
//                           <p className="text-xl font-bold">{data.weakestQuestion.name}</p>
//                           <p className="text-sm text-indigo-100 mt-1 opacity-80">Lowest average score detected.</p>
//                         </div>
//                         <button className="w-full bg-white/10 hover:bg-white/20 transition-colors rounded-xl py-3 text-sm font-bold flex items-center justify-center gap-2">
//                           View Full Report <ChevronRight className="w-4 h-4" />
//                         </button>
//                       </div>
//                     </div>
//                     {/* Decorative circles */}
//                     <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
//                     <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-400/20 rounded-full blur-3xl" />
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* Footer */}
//         <footer className="mt-20 py-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-400 text-sm font-medium">
//           <div className="flex items-center gap-2">
//             <div className="w-6 h-6 bg-slate-200 rounded-md flex items-center justify-center">
//               <TrendingUp className="w-3 h-3 text-slate-400" />
//             </div>
//             <span>InsightFlow Analytics ©️ 2026</span>
//           </div>
//           <div className="flex items-center gap-6">
//             <a href="#" className="hover:text-indigo-600 transition-colors">Documentation</a>
//             <a href="#" className="hover:text-indigo-600 transition-colors">Privacy Policy</a>
//             <a href="#" className="hover:text-indigo-600 transition-colors">Support</a>
//           </div>
//         </footer>
//       </div>
//     </div>
//   );
// }

// function KPICard({ title, value, icon, trend, subtitle, color }) {
//   const colorMap = {
//     indigo: 'bg-indigo-50 text-indigo-600',
//     amber: 'bg-amber-50 text-amber-600',
//     emerald: 'bg-emerald-50 text-emerald-600',
//     rose: 'bg-rose-50 text-rose-600',
//   };

//   return (
//     <motion.div 
//       whileHover={{ y: -5 }}
//       className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm"
//     >
//       <div className="flex items-start justify-between mb-4">
//         <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", colorMap[color])}>
//           {icon}
//         </div>
//         {trend && (
//           <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">
//             {trend}
//           </span>
//         )}
//       </div>
//       <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{title}</h3>
//       <div className="flex items-baseline gap-2">
//         <p className="text-2xl font-black text-slate-900 tracking-tight">{value}</p>
//         {subtitle && <p className="text-xs font-bold text-slate-400">{subtitle}</p>}
//       </div>
//     </motion.div>
//   );
// }

// function ChartCard({ title, icon, children }) {
//   return (
//     <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
//       <div className="p-8 pb-0 flex items-center gap-3">
//         <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
//           {icon}
//         </div>
//         <h3 className="text-lg font-bold text-slate-800 tracking-tight">{title}</h3>
//       </div>
//       <div className="p-8 pt-6 flex-grow">
//         {children}
//       </div>
//     </div>
//   );
// }


import { useState, useMemo } from 'react';
import { FileUpload } from 'primereact/fileupload';
import { Message } from 'primereact/message';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, ScatterChart, Scatter, ZAxis, ErrorBar
} from 'recharts';
import * as XLSX from 'xlsx';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users, Star, Award, AlertCircle, TrendingUp, TrendingDown,
  School, BookOpen, Building2, Calendar, Activity,
  ChevronRight, Download, FileSpreadsheet, Info, BarChart2,
  AlertTriangle, CheckCircle, Target, Layers, Zap
} from 'lucide-react';

// ─── Color palette ───────────────────────────────────────────────────────────
const PALETTE = ['#6366f1','#10b981','#f59e0b','#ef4444','#8b5cf6','#ec4899','#06b6d4','#84cc16','#f97316'];
const RADAR_COLORS = ['#6366f1','#10b981','#f59e0b','#ef4444','#8b5cf6'];
const QUESTION_LABELS = {
  Q1: 'Teaching clarity',
  Q2: 'Subject knowledge',
  Q3: 'Student engagement',
  Q4: 'Punctuality',
  Q5: 'Overall effectiveness',
};

// ─── Stat utilities ───────────────────────────────────────────────────────────
const mean = arr => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
const variance = arr => {
  if (arr.length < 2) return 0;
  const m = mean(arr);
  return arr.reduce((a, b) => a + (b - m) ** 2, 0) / (arr.length - 1);
};
const stdDev = arr => Math.sqrt(variance(arr));
const median = arr => {
  if (!arr.length) return 0;
  const s = [...arr].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};
const percentile = (arr, p) => {
  const s = [...arr].sort((a, b) => a - b);
  const idx = (p / 100) * (s.length - 1);
  const lo = Math.floor(idx), hi = Math.ceil(idx);
  return s[lo] + (s[hi] - s[lo]) * (idx - lo);
};
const cv = arr => { const m = mean(arr); return m ? (stdDev(arr) / m) * 100 : 0; };

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n, d = 2) => Number(n).toFixed(d);
const ratingColor = r => r >= 4.2 ? '#10b981' : r >= 3.5 ? '#6366f1' : r >= 2.8 ? '#f59e0b' : '#ef4444';
const ratingLabel = r => r >= 4.2 ? 'Excellent' : r >= 3.5 ? 'Good' : r >= 2.8 ? 'Average' : 'Needs Review';
const reliabilityLabel = s => s < 0.4 ? 'High' : s < 0.8 ? 'Moderate' : 'Low';
const reliabilityColor = s => s < 0.4 ? '#10b981' : s < 0.8 ? '#f59e0b' : '#ef4444';

// ─── Main component ───────────────────────────────────────────────────────────
export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  const onUpload = (e) => {
    const file = e.files[0];
    const reader = new FileReader();
    setLoading(true);
    setError('');
    reader.onload = (evt) => {
      try {
        const wb = XLSX.read(evt.target.result, { type: 'binary' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(ws);
        if (!jsonData.length) { setError('The uploaded file is empty.'); setData(null); }
        else processData(jsonData);
      } catch (err) {
        setError('Failed to parse Excel file. Please ensure it is a valid .xlsx or .xls file.');
      } finally { setLoading(false); }
    };
    reader.readAsBinaryString(file);
  };

  const processData = (rows) => {
    // Normalize rows
    const norm = rows.map(r => ({
      school: r.School || 'Unknown',
      dept: r.Department || r.Departme || 'Unknown',
      semester: r.Semester || '',
      section: r.Section || '',
      faculty: (r.Faculty || 'Unknown').trim(),
      course: r.Course || 'Unknown',
      q1: Number(r.Q1 || r.q1) || 0,
      q2: Number(r.Q2 || r.q2) || 0,
      q3: Number(r.Q3 || r.q3) || 0,
      q4: Number(r.Q4 || r.q4) || 0,
      q5: Number(r.Q5 || r.q5) || 0,
      avgRating: Number(r.AvgRating) || 0,
      remarks: r.Remarks || '',
      date: r.Date || '',
    })).map(r => ({
      ...r,
      avgRating: r.avgRating || mean([r.q1, r.q2, r.q3, r.q4, r.q5]),
    }));

    // ── Faculty stats ──
    const facultyNames = [...new Set(norm.map(r => r.faculty))];
    const facultyStats = facultyNames.map(name => {
      const fRows = norm.filter(r => r.faculty === name);
      const avgs = fRows.map(r => r.avgRating);
      const q1s = fRows.map(r => r.q1), q2s = fRows.map(r => r.q2);
      const q3s = fRows.map(r => r.q3), q4s = fRows.map(r => r.q4);
      const q5s = fRows.map(r => r.q5);
      const qMeans = [q1s, q2s, q3s, q4s, q5s].map(mean);
      const qStds = [q1s, q2s, q3s, q4s, q5s].map(stdDev);
      const sd = stdDev(avgs);
      const avg = mean(avgs);
      return {
        name,
        dept: fRows[0].dept,
        school: fRows[0].school,
        courses: [...new Set(fRows.map(r => r.course))],
        n: fRows.length,
        mean: avg,
        median: median(avgs),
        std: sd,
        cv: cv(avgs),
        min: Math.min(...avgs),
        max: Math.max(...avgs),
        range: Math.max(...avgs) - Math.min(...avgs),
        p25: percentile(avgs, 25),
        p75: percentile(avgs, 75),
        qMeans,
        qStds,
        avgs,
        remarks: fRows.map(r => r.remarks).filter(Boolean),
      };
    }).sort((a, b) => b.mean - a.mean);

    // ── Department stats ──
    const deptNames = [...new Set(norm.map(r => r.dept))];
    const deptStats = deptNames.map(dept => {
      const dRows = norm.filter(r => r.dept === dept);
      const avgs = dRows.map(r => r.avgRating);
      const qMeans = [1,2,3,4,5].map(i => mean(dRows.map(r => [r.q1,r.q2,r.q3,r.q4,r.q5][i-1])));
      return { dept, n: dRows.length, mean: mean(avgs), std: stdDev(avgs), qMeans,
        faculty: [...new Set(dRows.map(r => r.faculty))].length };
    });

    // ── School distribution ──
    const schoolCounts = {};
    norm.forEach(r => { schoolCounts[r.school] = (schoolCounts[r.school] || 0) + 1; });

    // ── Course stats ──
    const courseNames = [...new Set(norm.map(r => r.course))];
    const courseStats = courseNames.map(course => {
      const cRows = norm.filter(r => r.course === course);
      const avgs = cRows.map(r => r.avgRating);
      return { course, faculty: cRows[0].faculty, n: cRows.length, mean: mean(avgs), std: stdDev(avgs) };
    }).sort((a, b) => b.mean - a.mean);

    // ── Rating distribution ──
    const ratingDist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    norm.forEach(r => { const rounded = Math.max(1, Math.min(5, Math.round(r.avgRating))); ratingDist[rounded]++; });

    // ── Overall question averages ──
    const qAvgs = [1,2,3,4,5].map(i => ({
      name: `Q${i}`,
      label: QUESTION_LABELS[`Q${i}`],
      avg: mean(norm.map(r => [r.q1,r.q2,r.q3,r.q4,r.q5][i-1])),
      std: stdDev(norm.map(r => [r.q1,r.q2,r.q3,r.q4,r.q5][i-1])),
    }));

    // ── Timeline ──
    const timeline = {};
    norm.forEach(r => {
      if (r.date) {
        const d = r.date.split(',')[0].trim();
        timeline[d] = (timeline[d] || 0) + 1;
      }
    });

    // ── Top / bottom performers ──
    const topFaculty = facultyStats[0];
    const bottomFaculty = [...facultyStats].sort((a, b) => a.mean - b.mean)[0];
    const mostConsistent = [...facultyStats].filter(f => f.n >= 2).sort((a, b) => a.std - b.std)[0];
    const leastConsistent = [...facultyStats].filter(f => f.n >= 2).sort((a, b) => b.std - a.std)[0];
    const weakestQ = [...qAvgs].sort((a, b) => a.avg - b.avg)[0];
    const overallAvg = mean(norm.map(r => r.avgRating));

    setData({
      norm,
      total: norm.length,
      overallAvg,
      overallStd: stdDev(norm.map(r => r.avgRating)),
      facultyStats,
      deptStats,
      courseStats,
      schoolCounts: Object.entries(schoolCounts).map(([name, value]) => ({ name, value })),
      ratingDist: Object.entries(ratingDist).map(([r, c]) => ({ label: `${r}★`, count: c, rating: +r })),
      qAvgs,
      timeline: Object.entries(timeline).map(([date, count]) => ({ date, count })),
      topFaculty, bottomFaculty, mostConsistent, leastConsistent, weakestQ,
      needsAttention: facultyStats.filter(f => f.mean < 3.5),
      highVariance: [...facultyStats].filter(f => f.n >= 2).sort((a, b) => b.std - a.std),
    });
    setActiveTab('overview');
  };

  const TABS = [
    { id: 'overview', label: 'Overview', icon: <BarChart2 size={14} /> },
    { id: 'faculty', label: 'Faculty comparison', icon: <Users size={14} /> },
    { id: 'department', label: 'Departments', icon: <Building2 size={14} /> },
    // { id: 'attention', label: 'Needs attention', icon: <AlertTriangle size={14} /> },
    // { id: 'statistics', label: 'Statistics', icon: <Activity size={14} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-8">

        {/* ── Header ── */}
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                <Zap size={15} className="text-white" />
              </div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Faculty Feedback Intelligence</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">InsightFlow <span className="text-indigo-500"></span></h1>
            <p className="text-slate-500 mt-1 text-sm font-medium">Advanced analytics · Statistical depth · Actionable insights</p>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <FileUpload
              mode="basic" name="feedback" accept=".xlsx,.xls" maxFileSize={10000000}
              onSelect={onUpload} auto chooseLabel="Upload Feedback Excel"
              className="!rounded-2xl !font-bold"
            />
          </motion.div>
        </header>

        {/* ── Error ── */}
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-6">
              <Message severity="error" text={error} className="w-full rounded-2xl" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Empty state ── */}
        {!data && !loading && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-slate-200 rounded-3xl p-16 flex flex-col items-center text-center shadow-sm">
            <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
              <FileSpreadsheet size={36} className="text-indigo-300" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-3">Ready to analyze</h2>
            <p className="text-slate-400 max-w-md leading-relaxed text-sm">Upload your faculty feedback Excel sheet. InsightFlow Pro computes means, standard deviations, coefficient of variation, department comparisons, and flags faculty who need attention.</p>
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-xl">
              {['Faculty ranking', 'Dept comparison', 'Std deviation', 'Attention flags'].map(f => (
                <div key={f} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wide">{f}</div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Loading ── */}
        {loading && (
          <div className="py-32 flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4" />
            <p className="text-slate-400 font-medium text-sm">Crunching data…</p>
          </div>
        )}

        {/* ── Dashboard ── */}
        {data && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">

            {/* KPI strip */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { label: 'Total responses', value: data.total, sub: `${data.facultyStats.length} faculty`, icon: <Users size={18} className="text-indigo-500" />, bg: 'bg-indigo-50' },
                { label: 'Overall avg', value: `${fmt(data.overallAvg)}/5`, sub: `σ ${fmt(data.overallStd)}`, icon: <Star size={18} className="text-amber-500" />, bg: 'bg-amber-50' },
                { label: 'Top performer', value: data.topFaculty.name.split(' ').slice(-1)[0], sub: `${fmt(data.topFaculty.mean)} avg`, icon: <Award size={18} className="text-emerald-500" />, bg: 'bg-emerald-50' },
                //{ label: 'Needs attention', value: data.needsAttention.length, sub: data.needsAttention.length ? data.needsAttention[0].name.split(' ').slice(-1)[0] : 'None', icon: <AlertCircle size={18} className="text-rose-500" />, bg: 'bg-rose-50' },
                //{ label: 'Weakest area', value: data.weakestQ.name, sub: data.weakestQ.label, icon: <Target size={18} className="text-orange-500" />, bg: 'bg-orange-50' },
                //{ label: 'Most consistent', value: data.mostConsistent?.name.split(' ').slice(-1)[0] || '—', sub: data.mostConsistent ? `σ ${fmt(data.mostConsistent.std)}` : '', icon: <CheckCircle size={18} className="text-teal-500" />, bg: 'bg-teal-50' },
              ].map(k => (
                <div key={k.label} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
                  <div className={`w-9 h-9 ${k.bg} rounded-xl flex items-center justify-center mb-3`}>{k.icon}</div>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-1">{k.label}</p>
                  <p className="text-xl font-black text-slate-900 leading-tight truncate">{k.value}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{k.sub}</p>
                </div>
              ))}
            </div>

            {/* Tab bar */}
            <div className="bg-white border border-slate-200 rounded-2xl p-1.5 flex gap-1 shadow-sm overflow-x-auto">
              {TABS.map(t => (
                <button key={t.id} onClick={() => setActiveTab(t.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${activeTab === t.id ? 'bg-indigo-600 text-white shadow' : 'text-slate-500 hover:bg-slate-50'}`}>
                  {t.icon}{t.label}
                </button>
              ))}
            </div>

            {/* ── Tab: Overview ── */}
            {activeTab === 'overview' && <OverviewTab data={data} />}
            {activeTab === 'faculty' && <FacultyTab data={data} />}
            {activeTab === 'department' && <DepartmentTab data={data} />}
            {activeTab === 'attention' && <AttentionTab data={data} />}
            {activeTab === 'statistics' && <StatisticsTab data={data} />}

          </motion.div>
        )}

        {/* Footer */}
        <footer className="mt-16 py-6 border-t border-slate-200 flex items-center justify-between text-slate-400 text-xs font-medium">
          <span>InsightFlow  · Faculty Feedback Analytics © 2026</span>
          <span>Built for Manav Rachna university </span>
        </footer>
      </div>
    </div>
  );
}

// ─── Overview Tab ─────────────────────────────────────────────────────────────
function OverviewTab({ data }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Rating distribution" icon={<Star size={16} />}>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.ratingDist} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip contentStyle={ttStyle} />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {data.ratingDist.map((entry, i) => (
                  <Cell key={i} fill={entry.rating >= 4 ? '#10b981' : entry.rating === 3 ? '#6366f1' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="School distribution" icon={<School size={16} />}>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={data.schoolCounts} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={5} dataKey="value">
                {data.schoolCounts.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} stroke="none" />)}
              </Pie>
              <Tooltip contentStyle={ttStyle} formatter={(v, n) => [v, n]} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Question performance (overall)" icon={<BookOpen size={16} />}>
          <div className="space-y-3 pt-1">
            {data.qAvgs.map((q, i) => (
              <div key={q.name}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-600">{q.name} <span className="font-normal text-slate-400">— {q.label}</span></span>
                  <span className="font-bold" style={{ color: ratingColor(q.avg) }}>{fmt(q.avg)} <span className="font-normal text-slate-400">σ{fmt(q.std)}</span></span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${q.avg / 5 * 100}%`, background: ratingColor(q.avg) }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Course performance ranking" icon={<Layers size={16} />}>
          <div className="space-y-2.5 pt-1">
            {data.courseStats.slice(0, 6).map((c, i) => (
              <div key={c.course} className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-300 w-4">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-slate-700 truncate">{c.course}</div>
                  <div className="text-xs text-slate-400">{c.faculty} · {c.n} response{c.n > 1 ? 's' : ''}</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${c.mean / 5 * 100}%`, background: ratingColor(c.mean) }} />
                  </div>
                  <span className="text-xs font-bold w-8 text-right" style={{ color: ratingColor(c.mean) }}>{fmt(c.mean)}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Feedback timeline" icon={<Calendar size={16} />}>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={data.timeline}>
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip contentStyle={ttStyle} />
              <Area type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2.5} fill="url(#areaGrad)" dot={{ fill: '#6366f1', r: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}

// ─── Faculty Comparison Tab ───────────────────────────────────────────────────
function FacultyTab({ data }) {
  const [sortKey, setSortKey] = useState('mean');
  const sorted = useMemo(() => [...data.facultyStats].sort((a, b) => b[sortKey] - a[sortKey]), [data, sortKey]);

  const radarData = ['Q1', 'Q2', 'Q3', 'Q4', 'Q5'].map((q, i) => ({
    subject: QUESTION_LABELS[q],
    ...Object.fromEntries(data.facultyStats.map(f => [f.name.split(' ').pop(), +fmt(f.qMeans[i])])),
  }));

  return (
    <div className="space-y-6">
      {/* Faculty bar chart with std dev */}
      <Card title="Faculty overall rating · with standard deviation" icon={<Award size={16} />}>
        <div className="flex gap-2 mb-4 flex-wrap">
          {['mean', 'std', 'cv', 'n'].map(k => (
            <button key={k} onClick={() => setSortKey(k)}
              className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${sortKey === k ? 'bg-indigo-600 text-white border-indigo-600' : 'border-slate-200 text-slate-500 hover:border-indigo-300'}`}>
              Sort by {k === 'mean' ? 'Avg rating' : k === 'std' ? 'Std dev' : k === 'cv' ? 'Consistency' : 'Responses'}
            </button>
          ))}
        </div>
        <div className="space-y-4">
          {sorted.map((f, i) => {
            const color = PALETTE[data.facultyStats.findIndex(x => x.name === f.name) % PALETTE.length];
            return (
              <div key={f.name} className="bg-slate-50 rounded-2xl p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="font-bold text-slate-800 text-sm">{f.name}</span>
                    <span className="ml-2 text-xs text-slate-400">{f.dept.replace('Computer Science & Technology', 'CS&T')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge color={ratingColor(f.mean)}>{ratingLabel(f.mean)}</Badge>
                    <span className="text-xs text-slate-400">{f.n} response{f.n > 1 ? 's' : ''}</span>
                  </div>
                </div>
                {/* Q bars */}
                <div className="grid grid-cols-5 gap-2">
                  {['Q1', 'Q2', 'Q3', 'Q4', 'Q5'].map((q, qi) => (
                    <div key={q}>
                      <div className="h-16 bg-slate-200 rounded-lg overflow-hidden flex items-end">
                        <div className="w-full rounded-lg transition-all" style={{ height: `${f.qMeans[qi] / 5 * 100}%`, background: color }} />
                      </div>
                      <div className="text-center mt-1">
                        <div className="text-xs font-bold text-slate-700">{fmt(f.qMeans[qi], 1)}</div>
                        <div className="text-xs text-slate-400">{q}</div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Stats row */}
                <div className="mt-3 flex gap-4 text-xs text-slate-500 border-t border-slate-200 pt-3">
                  <span>Avg <b className="text-slate-700">{fmt(f.mean)}</b></span>
                  <span>Median <b className="text-slate-700">{fmt(f.median)}</b></span>
                  <span>σ <b style={{ color: reliabilityColor(f.std) }}>{fmt(f.std)}</b></span>
                  <span>CV <b className="text-slate-700">{fmt(f.cv)}%</b></span>
                  <span>Min <b className="text-slate-700">{fmt(f.min)}</b></span>
                  <span>Max <b className="text-slate-700">{fmt(f.max)}</b></span>
                  <span>Reliability <b style={{ color: reliabilityColor(f.std) }}>{reliabilityLabel(f.std)}</b></span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Radar chart */}
      <Card title="Faculty question radar — head-to-head comparison" icon={<Target size={16} />}>
        <ResponsiveContainer width="100%" height={340}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="#e2e8f0" />
            <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#64748b' }} />
            <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fontSize: 10, fill: '#94a3b8' }} />
            {data.facultyStats.map((f, i) => (
              <Radar key={f.name} name={f.name} dataKey={f.name.split(' ').pop()}
                stroke={RADAR_COLORS[i % RADAR_COLORS.length]}
                fill={RADAR_COLORS[i % RADAR_COLORS.length]} fillOpacity={0.08} strokeWidth={2} dot={true} />
            ))}
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
            <Tooltip contentStyle={ttStyle} />
          </RadarChart>
        </ResponsiveContainer>
      </Card>

      {/* Comparison table */}
      <Card title="Faculty comparison table" icon={<BarChart2 size={16} />}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-100">
                {['Faculty','Dept','n','Mean','Median','σ','CV%','Min','Max','Range','Q1','Q2','Q3','Q4','Q5','Status'].map(h => (
                  <th key={h} className="text-left py-2 px-2 font-semibold text-slate-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.facultyStats.map((f, i) => (
                <tr key={f.name} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="py-2.5 px-2 font-semibold text-slate-800 whitespace-nowrap">{f.name}</td>
                  <td className="py-2.5 px-2 text-slate-500">{f.dept.replace('Computer Science & Technology','CS&T')}</td>
                  <td className="py-2.5 px-2 text-slate-700">{f.n}</td>
                  <td className="py-2.5 px-2 font-bold" style={{ color: ratingColor(f.mean) }}>{fmt(f.mean)}</td>
                  <td className="py-2.5 px-2 text-slate-700">{fmt(f.median)}</td>
                  <td className="py-2.5 px-2" style={{ color: reliabilityColor(f.std) }}>σ{fmt(f.std)}</td>
                  <td className="py-2.5 px-2 text-slate-700">{f.n >= 2 ? fmt(f.cv) + '%' : '—'}</td>
                  <td className="py-2.5 px-2 text-slate-700">{fmt(f.min)}</td>
                  <td className="py-2.5 px-2 text-slate-700">{fmt(f.max)}</td>
                  <td className="py-2.5 px-2 text-slate-700">{fmt(f.range)}</td>
                  {f.qMeans.map((v, qi) => (
                    <td key={qi} className="py-2.5 px-2 font-semibold" style={{ color: ratingColor(v) }}>{fmt(v, 1)}</td>
                  ))}
                  <td className="py-2.5 px-2">
                    <Badge color={ratingColor(f.mean)}>{ratingLabel(f.mean)}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ─── Department Tab ───────────────────────────────────────────────────────────
function DepartmentTab({ data }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Department average rating" icon={<Building2 size={16} />}>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={data.deptStats.map(d => ({ ...d, dept: d.dept.replace('Computer Science & Technology', 'CS&T') }))} barSize={48}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="dept" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis domain={[0, 5]} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip contentStyle={ttStyle} />
              <Bar dataKey="mean" name="Avg rating" radius={[8, 8, 0, 0]}>
                {data.deptStats.map((_, i) => <Cell key={i} fill={PALETTE[i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Department Q1–Q5 breakdown" icon={<BookOpen size={16} />}>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart
              data={['Q1','Q2','Q3','Q4','Q5'].map((q, i) => ({
                q,
                label: QUESTION_LABELS[q],
                ...Object.fromEntries(data.deptStats.map(d => [d.dept.replace('Computer Science & Technology','CS&T'), +fmt(d.qMeans[i])])),
              }))}
              barSize={20}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="q" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis domain={[0, 5]} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip contentStyle={ttStyle} formatter={(v, n) => [v, n]} />
              <Legend iconType="square" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              {data.deptStats.map((d, i) => (
                <Bar key={d.dept} dataKey={d.dept.replace('Computer Science & Technology','CS&T')} fill={PALETTE[i]} radius={[4, 4, 0, 0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Faculty within each department */}
      {data.deptStats.map((dept, di) => {
        const deptFaculty = data.facultyStats.filter(f => f.dept === dept.dept);
        return (
          <Card key={dept.dept} title={`${dept.dept} — faculty ranked`} icon={<Users size={16} />}>
            <div className="flex gap-6 mb-4 text-xs text-slate-500 bg-slate-50 rounded-xl p-3">
              <span>Dept avg: <b className="text-slate-700">{fmt(dept.mean)}</b></span>
              <span>σ: <b>{fmt(dept.std)}</b></span>
              <span>Faculty: <b>{deptFaculty.length}</b></span>
              <span>Responses: <b>{dept.n}</b></span>
            </div>
            <div className="space-y-3">
              {deptFaculty.map((f, i) => (
                <div key={f.name} className="flex items-center gap-3 group">
                  <span className="text-xs font-black text-slate-300 w-4">{i + 1}</span>
                  <div style={{ width: 160 }} className="text-xs font-semibold text-slate-700 truncate">{f.name}</div>
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${f.mean / 5 * 100}%`, background: ratingColor(f.mean) }} />
                  </div>
                  <span className="text-xs font-bold w-8" style={{ color: ratingColor(f.mean) }}>{fmt(f.mean)}</span>
                  <span className="text-xs text-slate-400">σ{fmt(f.std)}</span>
                  <span className="text-xs text-slate-400">{f.n}×</span>
                  <Badge color={ratingColor(f.mean)}>{ratingLabel(f.mean)}</Badge>
                </div>
              ))}
            </div>
          </Card>
        );
      })}
    </div>
  );
}

// ─── Attention Tab ────────────────────────────────────────────────────────────
// function AttentionTab({ data }) {
//   const attentionFaculty = data.needsAttention.length > 0 ? data.needsAttention : data.facultyStats.slice(-2);

//   return (
//     <div className="space-y-6">
//       {/* Alert banner */}
//       {data.needsAttention.length > 0 && (
//         <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-start gap-3">
//           <AlertTriangle size={18} className="text-rose-500 mt-0.5 shrink-0" />
//           <div>
//             <p className="text-sm font-bold text-rose-700">{data.needsAttention.length} faculty member{data.needsAttention.length > 1 ? 's' : ''} below acceptable threshold (3.5 avg)</p>
//             <p className="text-xs text-rose-500 mt-0.5">These faculty require immediate review, mentoring, or additional support.</p>
//           </div>
//         </div>
//       )}

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Below threshold */}
//         <Card title="Below rating threshold (< 3.5)" icon={<AlertCircle size={16} />}>
//           {data.needsAttention.length === 0 ? (
//             <div className="flex flex-col items-center py-8 text-slate-400 text-sm">
//               <CheckCircle size={32} className="text-emerald-400 mb-3" />
//               All faculty are above 3.5 threshold
//             </div>
//           ) : (
//             <div className="space-y-3">
//               {data.needsAttention.map(f => {
//                 const weakQ = f.qMeans.map((v, i) => ({ q: `Q${i+1}`, label: QUESTION_LABELS[`Q${i+1}`], v })).sort((a, b) => a.v - b.v);
//                 return (
//                   <div key={f.name} className="bg-rose-50 border border-rose-100 rounded-2xl p-4">
//                     <div className="flex items-center justify-between mb-2">
//                       <span className="font-bold text-slate-800 text-sm">{f.name}</span>
//                       <Badge color="#ef4444">{fmt(f.mean)} avg</Badge>
//                     </div>
//                     <p className="text-xs text-slate-500 mb-3">{f.dept} · {f.n} response{f.n > 1 ? 's' : ''} · σ {fmt(f.std)}</p>
//                     <p className="text-xs font-semibold text-rose-600 mb-1">Weakest areas:</p>
//                     {weakQ.slice(0, 3).map(q => (
//                       <div key={q.q} className="flex items-center gap-2 mb-1">
//                         <span className="text-xs text-slate-400 w-6">{q.q}</span>
//                         <div className="flex-1 h-1.5 bg-rose-100 rounded-full overflow-hidden">
//                           <div className="h-full rounded-full" style={{ width: `${q.v / 5 * 100}%`, background: '#ef4444' }} />
//                         </div>
//                         <span className="text-xs font-bold text-rose-600">{fmt(q.v, 1)}</span>
//                         <span className="text-xs text-slate-400 truncate" style={{ maxWidth: 120 }}>{q.label}</span>
//                       </div>
//                     ))}
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </Card>

//         {/* High variance */}
//         <Card title="High variance faculty (inconsistent ratings)" icon={<Activity size={16} />}>
//           <div className="space-y-3">
//             {data.highVariance.map(f => {
//               const level = f.std < 0.4 ? 'Consistent' : f.std < 0.8 ? 'Moderate' : 'Inconsistent';
//               const lcolor = f.std < 0.4 ? '#10b981' : f.std < 0.8 ? '#f59e0b' : '#ef4444';
//               return (
//                 <div key={f.name} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
//                   <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black text-white shrink-0"
//                     style={{ background: lcolor }}>σ</div>
//                   <div className="flex-1 min-w-0">
//                     <div className="text-sm font-semibold text-slate-800 truncate">{f.name}</div>
//                     <div className="text-xs text-slate-400">σ {fmt(f.std)} · CV {fmt(f.cv)}% · {f.n} responses</div>
//                   </div>
//                   <div className="text-right">
//                     <Badge color={lcolor}>{level}</Badge>
//                     <div className="text-xs text-slate-400 mt-1">Range {fmt(f.range)}</div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </Card>
//       </div>

//       {/* Per-question breakdown for attention faculty */}
//       <Card title="Attention faculty — question-by-question breakdown" icon={<Target size={16} />}>
//         <ResponsiveContainer width="100%" height={280}>
//           <BarChart
//             data={['Q1','Q2','Q3','Q4','Q5'].map((q, i) => ({
//               q, label: QUESTION_LABELS[q],
//               ...Object.fromEntries(attentionFaculty.map(f => [f.name.split(' ').pop(), +fmt(f.qMeans[i])])),
//             }))}
//             barSize={22}
//           >
//             <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
//             <XAxis dataKey="q" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
//             <YAxis domain={[0, 5]} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
//             <Tooltip contentStyle={ttStyle} labelFormatter={(l, p) => p?.[0]?.payload?.label || l} />
//             <Legend iconType="square" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
//             {attentionFaculty.map((f, i) => (
//               <Bar key={f.name} dataKey={f.name.split(' ').pop()} fill={['#ef4444','#f59e0b','#8b5cf6'][i] || PALETTE[i]} radius={[4,4,0,0]} />
//             ))}
//           </BarChart>
//         </ResponsiveContainer>
//         <div className="mt-3 p-3 bg-amber-50 border border-amber-100 rounded-xl text-xs text-amber-700">
//           <b>Note:</b> Q5 (Overall effectiveness) consistently scores lowest across attention faculty. Consider targeted workshops or peer observation programs.
//         </div>
//       </Card>
//     </div>
//   );
// }

// ─── Statistics Tab ───────────────────────────────────────────────────────────
// function StatisticsTab({ data }) {
//   return (
//     <div className="space-y-6">
//       {/* Full stats table */}
//       <Card title="Complete statistical summary — all faculty" icon={<Activity size={16} />}>
//         <div className="overflow-x-auto">
//           <table className="w-full text-xs">
//             <thead>
//               <tr className="border-b border-slate-100">
//                 {['Faculty','n','Mean','Median','Std dev (σ)','Variance','CV%','Min','Max','Range','P25','P75','IQR','Reliability'].map(h => (
//                   <th key={h} className="text-left py-2 px-2 font-semibold text-slate-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {data.facultyStats.map(f => {
//                 const iqr = f.p75 - f.p25;
//                 return (
//                   <tr key={f.name} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
//                     <td className="py-2.5 px-2 font-semibold text-slate-800 whitespace-nowrap">{f.name}</td>
//                     <td className="py-2.5 px-2 text-slate-600">{f.n}</td>
//                     <td className="py-2.5 px-2 font-bold" style={{ color: ratingColor(f.mean) }}>{fmt(f.mean)}</td>
//                     <td className="py-2.5 px-2 text-slate-700">{fmt(f.median)}</td>
//                     <td className="py-2.5 px-2" style={{ color: reliabilityColor(f.std) }}>σ {fmt(f.std)}</td>
//                     <td className="py-2.5 px-2 text-slate-700">{fmt(variance(f.avgs))}</td>
//                     <td className="py-2.5 px-2 text-slate-700">{f.n >= 2 ? fmt(f.cv) + '%' : '—'}</td>
//                     <td className="py-2.5 px-2 text-slate-700">{fmt(f.min)}</td>
//                     <td className="py-2.5 px-2 text-slate-700">{fmt(f.max)}</td>
//                     <td className="py-2.5 px-2 text-slate-700">{fmt(f.range)}</td>
//                     <td className="py-2.5 px-2 text-slate-700">{f.n >= 2 ? fmt(f.p25) : '—'}</td>
//                     <td className="py-2.5 px-2 text-slate-700">{f.n >= 2 ? fmt(f.p75) : '—'}</td>
//                     <td className="py-2.5 px-2 text-slate-700">{f.n >= 2 ? fmt(iqr) : '—'}</td>
//                     <td className="py-2.5 px-2">
//                       <Badge color={reliabilityColor(f.std)}>{reliabilityLabel(f.std)}</Badge>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       </Card>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Mean vs std chart */}
//         <Card title="Mean vs std deviation — all faculty" icon={<BarChart2 size={16} />}>
//           <ResponsiveContainer width="100%" height={260}>
//             <BarChart data={data.facultyStats.map(f => ({
//               name: f.name.split(' ').pop(),
//               mean: +fmt(f.mean),
//               std: +fmt(f.std),
//             }))} barSize={20}>
//               <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
//               <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
//               <YAxis domain={[0, 5]} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
//               <Tooltip contentStyle={ttStyle} />
//               <Legend iconType="square" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
//               <Bar dataKey="mean" name="Mean rating" fill="#6366f1" radius={[4, 4, 0, 0]} />
//               <Bar dataKey="std" name="Std deviation" fill="#f59e0b" radius={[4, 4, 0, 0]} />
//             </BarChart>
//           </ResponsiveContainer>
//         </Card>

//         {/* Q-level std dev */}
//         <Card title="Question std deviation — which Q is most volatile?" icon={<TrendingUp size={16} />}>
//           <ResponsiveContainer width="100%" height={260}>
//             <BarChart data={data.qAvgs.map(q => ({ name: q.name, label: q.label, 'Avg': +fmt(q.avg), 'σ': +fmt(q.std) }))} barSize={22}>
//               <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
//               <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
//               <YAxis domain={[0, 5]} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
//               <Tooltip contentStyle={ttStyle} formatter={(v, n, p) => [v, n === 'Avg' ? `${p.payload.label}` : n]} />
//               <Legend iconType="square" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
//               <Bar dataKey="Avg" fill="#10b981" radius={[4, 4, 0, 0]} />
//               <Bar dataKey="σ" fill="#ef4444" radius={[4, 4, 0, 0]} />
//             </BarChart>
//           </ResponsiveContainer>
//           <div className="mt-3 text-xs text-slate-400 bg-slate-50 p-3 rounded-xl">
//             Higher σ = students rate this dimension very differently across faculty. Low σ = more universal agreement.
//           </div>
//         </Card>
//       </div>

//       Question stats per faculty
//       <Card title="Per-question statistics per faculty" icon={<Layers size={16} />}>
//         <div className="overflow-x-auto">
//           <table className="w-full text-xs">
//             <thead>
//               <tr className="border-b border-slate-100">
//                 <th className="text-left py-2 px-2 font-semibold text-slate-400 uppercase tracking-wide">Faculty</th>
//                 {['Q1','Q2','Q3','Q4','Q5'].map(q => (
//                   <th key={q} colSpan={2} className="text-center py-2 px-2 font-semibold text-slate-400 uppercase tracking-wide border-l border-slate-100">
//                     {q} <span className="font-normal normal-case">({QUESTION_LABELS[q]})</span>
//                   </th>
//                 ))}
//               </tr>
//               <tr className="border-b border-slate-100 bg-slate-50">
//                 <th className="py-1 px-2 text-slate-300"></th>
//                 {['Q1','Q2','Q3','Q4','Q5'].map(q => (
//                   <>
//                     <th key={q+'m'} className="text-center py-1 px-2 text-slate-400 font-medium border-l border-slate-100">Avg</th>
//                     <th key={q+'s'} className="text-center py-1 px-2 text-slate-400 font-medium">σ</th>
//                   </>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {data.facultyStats.map(f => (
//                 <tr key={f.name} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
//                   <td className="py-2.5 px-2 font-semibold text-slate-800 whitespace-nowrap">{f.name}</td>
//                   {f.qMeans.map((v, i) => (
//                     <>
//                       <td key={i+'m'} className="py-2.5 px-2 font-bold text-center border-l border-slate-100" style={{ color: ratingColor(v) }}>{fmt(v, 1)}</td>
//                       <td key={i+'s'} className="py-2.5 px-2 text-center text-slate-400">{f.n >= 2 ? fmt(f.qStds[i], 2) : '—'}</td>
//                     </>
//                   ))}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </Card>
//     </div>
//   );
// }

// ─── Shared UI components ─────────────────────────────────────────────────────
function Card({ title, icon, children }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 pt-5 pb-1 flex items-center gap-2 border-b border-slate-50">
        <span className="text-slate-400">{icon}</span>
        <h3 className="text-sm font-bold text-slate-700 tracking-tight">{title}</h3>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

function Badge({ color, children }) {
  const hex = color.startsWith('#') ? color : '#6366f1';
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-bold"
      style={{ background: hex + '18', color: hex }}>
      {children}
    </span>
  );
}

const ttStyle = {
  borderRadius: '12px', border: 'none',
  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
  fontSize: 12, fontWeight: 500,
};
