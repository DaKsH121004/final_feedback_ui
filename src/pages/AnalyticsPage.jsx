import { useState } from 'react';
import { FileUpload } from 'primereact/fileupload';
import { Message } from 'primereact/message';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import * as XLSX from 'xlsx';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, Star, Award, AlertCircle, TrendingUp, 
  School, BookOpen, Building2, Calendar, 
  ChevronRight, Download, FileSpreadsheet, Info
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for Tailwind class merging
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onUpload = (e) => {
    const file = e.files[0];
    const reader = new FileReader();
    setLoading(true);
    setError('');

    reader.onload = (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const jsonData = XLSX.utils.sheet_to_json(ws);
        
        if (jsonData.length === 0) {
          setError('The uploaded file is empty.');
          setData(null);
        } else {
          processData(jsonData);
        }
      } catch (err) {
        setError('Failed to parse Excel file. Please ensure it is a valid .xlsx or .xls file.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    reader.readAsBinaryString(file);
  };

  const processData = (jsonData) => {
    const schoolCounts = {};
    const facultyStats = {};
    const courseStats = {};
    const deptStats = {};
    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    const timeline = {};
    const qTotals = { Q1: 0, Q2: 0, Q3: 0, Q4: 0, Q5: 0 };

    let totalRating = 0;

    jsonData.forEach(item => {
      // Normalize keys based on common variations or the image provided
      const q1 = Number(item.Q1 || item.q1) || 0;
      const q2 = Number(item.Q2 || item.q2) || 0;
      const q3 = Number(item.Q3 || item.q3) || 0;
      const q4 = Number(item.Q4 || item.q4) || 0;
      const q5 = Number(item.Q5 || item.q5) || 0;

      qTotals.Q1 += q1;
      qTotals.Q2 += q2;
      qTotals.Q3 += q3;
      qTotals.Q4 += q4;
      qTotals.Q5 += q5;

      const avg = Number(item.AvgRating) || (q1 + q2 + q3 + q4 + q5) / 5;
      totalRating += avg;

      // Rating Distribution
      const rounded = Math.max(1, Math.min(5, Math.round(avg)));
      ratingDistribution[rounded]++;

      // School
      const school = item.School || 'Unknown';
      schoolCounts[school] = (schoolCounts[school] || 0) + 1;

      // Faculty
      const faculty = item.Faculty || 'Unknown';
      if (!facultyStats[faculty]) facultyStats[faculty] = { total: 0, count: 0 };
      facultyStats[faculty].total += avg;
      facultyStats[faculty].count++;

      // Course
      const course = item.Course || 'Unknown';
      if (!courseStats[course]) courseStats[course] = { total: 0, count: 0 };
      courseStats[course].total += avg;
      courseStats[course].count++;

      // Department
      const dept = item.Departme || item.Department || 'Unknown';
      if (!deptStats[dept]) deptStats[dept] = { total: 0, count: 0 };
      deptStats[dept].total += avg;
      deptStats[dept].count++;

      // Timeline
      const rawDate = item.Date || item.date;
      const date = rawDate ? new Date(rawDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Unknown';
      timeline[date] = (timeline[date] || 0) + 1;
    });

    const facultyPerformance = Object.entries(facultyStats).map(([name, val]) => ({
      name,
      rating: Number((val.total / val.count).toFixed(2)),
      responses: val.count
    })).sort((a, b) => b.rating - a.rating);

    const questionAverages = Object.entries(qTotals).map(([name, total]) => ({
      name,
      average: Number((total / jsonData.length).toFixed(2))
    }));

    const weakestQuestion = [...questionAverages].sort((a, b) => a.average - b.average)[0];

    const processed = {
      totalFeedbacks: jsonData.length,
      overallAvg: Number((totalRating / jsonData.length).toFixed(2)),
      bestFaculty: facultyPerformance[0] || { name: 'N/A', rating: 0 },
      worstFaculty: facultyPerformance[facultyPerformance.length - 1] || { name: 'N/A', rating: 0 },
      schoolDistribution: Object.entries(schoolCounts).map(([name, value]) => ({ name, value })),
      ratingDistribution: Object.entries(ratingDistribution).map(([rating, count]) => ({ rating: `${rating}★`, count })),
      facultyPerformance,
      departmentPerformance: Object.entries(deptStats).map(([name, val]) => ({
        name,
        rating: Number((val.total / val.count).toFixed(2))
      })),
      coursePerformance: Object.entries(courseStats).map(([name, val]) => ({
        name,
        rating: Number((val.total / val.count).toFixed(2))
      })),
      questionAverages,
      timeline: Object.entries(timeline).map(([date, count]) => ({ date, count })),
      weakestQuestion
    };

    setData(processed);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="text-white w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Analytics Dashboard</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">InsightFlow</h1>
            <p className="text-slate-500 font-medium mt-1">Transforming student feedback into actionable educational insights.</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-3"
          >
            <FileUpload 
              mode="basic" 
              name="feedback" 
              accept=".xlsx,.xls" 
              maxFileSize={5000000} 
              onSelect={onUpload} 
              auto 
              chooseLabel="Upload Feedback Excel"
              className="p-button-primary shadow-lg shadow-indigo-100 rounded-xl font-bold px-6 py-3"
            />
          </motion.div>
        </header>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8"
            >
              <Message severity="error" text={error} className="w-full rounded-2xl border-none shadow-sm" />
            </motion.div>
          )}

          {!data && !loading && (
            <motion.div 
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-slate-200 rounded-[2.5rem] p-12 md:p-24 flex flex-col items-center justify-center text-center shadow-sm"
            >
              <div className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center mb-8 relative">
                <FileSpreadsheet className="w-12 h-12 text-slate-300" />
                <div className="absolute -bottom-1 -right-1 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
                  <Download className="w-5 h-5 text-indigo-500" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-3">Ready to analyze?</h2>
              <p className="text-slate-500 max-w-md leading-relaxed">
                Upload your student feedback Excel sheet to generate real-time visualizations, performance metrics, and key educational insights.
              </p>
              <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl">
                {['School Distribution', 'Faculty Ranking', 'Trend Analysis', 'Question Metrics'].map((feat) => (
                  <div key={feat} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {feat}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {loading && (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-32 flex flex-col items-center justify-center"
            >
              <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-6" />
              <p className="text-slate-500 font-bold tracking-tight">Processing educational data...</p>
            </motion.div>
          )}

          {data && (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              {/* KPI Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard 
                  title="Total Feedbacks" 
                  value={data.totalFeedbacks} 
                  icon={<Users className="w-6 h-6 text-indigo-600" />}
                  trend="+12% from last sem"
                  color="indigo"
                />
                <KPICard 
                  title="Overall Average" 
                  value={`${data.overallAvg}/5.0`} 
                  icon={<Star className="w-6 h-6 text-amber-500" />}
                  trend="High Satisfaction"
                  color="amber"
                />
                <KPICard 
                  title="Top Faculty" 
                  value={data.bestFaculty.name} 
                  subtitle={`${data.bestFaculty.rating} rating`}
                  icon={<Award className="w-6 h-6 text-emerald-500" />}
                  color="emerald"
                />
                <KPICard 
                  title="Weakest Area" 
                  value={data.weakestQuestion.name} 
                  subtitle={`${data.weakestQuestion.average} avg`}
                  icon={<AlertCircle className="w-6 h-6 text-rose-500" />}
                  color="rose"
                />
              </div>

              {/* Main Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* School Distribution */}
                <ChartCard title="School Distribution" icon={<School className="w-5 h-5" />}>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={data.schoolDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={8}
                          dataKey="value"
                        >
                          {data.schoolDistribution.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        />
                        <Legend verticalAlign="bottom" iconType="circle" />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </ChartCard>

                {/* Rating Distribution */}
                <ChartCard title="Rating Distribution" icon={<Star className="w-5 h-5" />}>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.ratingDistribution}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="rating" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} />
                        <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                        <Bar dataKey="count" fill="#6366f1" radius={[8, 8, 0, 0]} barSize={30} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </ChartCard>

                {/* Question Analysis */}
                <ChartCard title="Question Performance" icon={<BookOpen className="w-5 h-5" />}>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.questionAverages}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} />
                        <YAxis domain={[0, 5]} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} />
                        <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                        <Bar dataKey="average" fill="#10b981" radius={[8, 8, 0, 0]} barSize={30} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </ChartCard>
              </div>

              {/* Secondary Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Faculty Performance */}
                <ChartCard title="Faculty Performance Ranking" icon={<Award className="w-5 h-5" />}>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.facultyPerformance.slice(0, 10)} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                        <XAxis type="number" domain={[0, 5]} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} />
                        <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={120} tick={{ fill: '#475569', fontSize: 11, fontWeight: 600 }} />
                        <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                        <Bar dataKey="rating" fill="#6366f1" radius={[0, 8, 8, 0]} barSize={20} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </ChartCard>

                {/* Timeline Analysis */}
                <ChartCard title="Feedback Volume Timeline" icon={<Calendar className="w-5 h-5" />}>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={data.timeline}>
                        <defs>
                          <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }} />
                        <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                        <Area type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </ChartCard>
              </div>

              {/* Insights Panel */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-3">
                  <ChartCard title="Departmental Performance" icon={<Building2 className="w-5 h-5" />}>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data.departmentPerformance}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }} />
                          <YAxis domain={[0, 5]} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }} />
                          <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                          <Bar dataKey="rating" fill="#f59e0b" radius={[8, 8, 0, 0]} barSize={40} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </ChartCard>
                </div>

                <div className="space-y-6">
                  <div className="bg-indigo-600 rounded-[2rem] p-8 text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-6">
                        <Info className="w-5 h-5 text-indigo-200" />
                        <span className="text-xs font-bold uppercase tracking-widest text-indigo-200">Key Insights</span>
                      </div>
                      <div className="space-y-6">
                        <div>
                          <p className="text-xs font-bold text-indigo-200 uppercase mb-1">Top Performer</p>
                          <p className="text-xl font-bold">{data.bestFaculty.name}</p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-indigo-200 uppercase mb-1">Action Required</p>
                          <p className="text-xl font-bold">{data.weakestQuestion.name}</p>
                          <p className="text-sm text-indigo-100 mt-1 opacity-80">Lowest average score detected.</p>
                        </div>
                        <button className="w-full bg-white/10 hover:bg-white/20 transition-colors rounded-xl py-3 text-sm font-bold flex items-center justify-center gap-2">
                          View Full Report <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    {/* Decorative circles */}
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-400/20 rounded-full blur-3xl" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <footer className="mt-20 py-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-400 text-sm font-medium">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-slate-200 rounded-md flex items-center justify-center">
              <TrendingUp className="w-3 h-3 text-slate-400" />
            </div>
            <span>InsightFlow Analytics ©️ 2026</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-indigo-600 transition-colors">Documentation</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Support</a>
          </div>
        </footer>
      </div>
    </div>
  );
}

function KPICard({ title, value, icon, trend, subtitle, color }) {
  const colorMap = {
    indigo: 'bg-indigo-50 text-indigo-600',
    amber: 'bg-amber-50 text-amber-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    rose: 'bg-rose-50 text-rose-600',
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", colorMap[color])}>
          {icon}
        </div>
        {trend && (
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">
            {trend}
          </span>
        )}
      </div>
      <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{title}</h3>
      <div className="flex items-baseline gap-2">
        <p className="text-2xl font-black text-slate-900 tracking-tight">{value}</p>
        {subtitle && <p className="text-xs font-bold text-slate-400">{subtitle}</p>}
      </div>
    </motion.div>
  );
}

function ChartCard({ title, icon, children }) {
  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      <div className="p-8 pb-0 flex items-center gap-3">
        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
          {icon}
        </div>
        <h3 className="text-lg font-bold text-slate-800 tracking-tight">{title}</h3>
      </div>
      <div className="p-8 pt-6 flex-grow">
        {children}
      </div>
    </div>
  );
}