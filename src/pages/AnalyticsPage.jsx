import React, { useState } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Message } from 'primereact/message';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import * as XLSX from 'xlsx';
import { motion } from 'motion/react';

const AnalyticsPage = () => {
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
    // Basic aggregation for analytics
    // We assume the Excel has columns matching our form fields
    const schoolCounts = {};
    const facultyRatings = {};
    const questionAverages = { q1: 0, q2: 0, q3: 0, q4: 0, q5: 0 };
    
    jsonData.forEach(item => {
      // School distribution
      const school = item['School Name'] || item['schoolName'] || 'Unknown';
      schoolCounts[school] = (schoolCounts[school] || 0) + 1;

      // Faculty ratings
      const faculty = item['Name of Faculty'] || item['facultyName'] || 'Unknown';
      const avgRating = (
        (Number(item['q1']) || 0) + 
        (Number(item['q2']) || 0) + 
        (Number(item['q3']) || 0) + 
        (Number(item['q4']) || 0) + 
        (Number(item['q5']) || 0)
      ) / 5;
      
      if (!facultyRatings[faculty]) {
        facultyRatings[faculty] = { name: faculty, total: 0, count: 0 };
      }
      facultyRatings[faculty].total += avgRating;
      facultyRatings[faculty].count += 1;

      // Question averages
      ['q1', 'q2', 'q3', 'q4', 'q5'].forEach(q => {
        questionAverages[q] += Number(item[q]) || 0;
      });
    });

    const processed = {
      schoolDistribution: Object.entries(schoolCounts).map(([name, value]) => ({ name, value })),
      facultyPerformance: Object.values(facultyRatings).map(f => ({
        name: f.name,
        rating: Number((f.total / f.count).toFixed(2))
      })).sort((a, b) => b.rating - a.rating).slice(0, 5),
      questionAverages: Object.entries(questionAverages).map(([key, total]) => ({
        name: key.toUpperCase(),
        average: Number((total / jsonData.length).toFixed(2))
      }))
    };

    setData(processed);
  };

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Feedback Analytics</h1>
        <p className="text-slate-500 font-medium">Upload your feedback Excel sheet to generate visual insights.</p>
      </div>

      <Card className="shadow-xl rounded-3xl border-none mb-10 overflow-hidden">
        <div className="p-6 bg-slate-50 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100">
              <i className="pi pi-file-excel text-white text-xl" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Data Import</h2>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Supports .xlsx, .xls</p>
            </div>
          </div>
          
          <FileUpload 
            mode="basic" 
            name="demo[]" 
            accept=".xlsx,.xls" 
            maxFileSize={1000000} 
            onSelect={onUpload} 
            auto 
            chooseLabel="Upload Excel"
            className="p-button-primary rounded-xl font-bold"
          />
        </div>

        {error && (
          <div className="p-6">
            <Message severity="error" text={error} className="w-full rounded-xl" />
          </div>
        )}

        {!data && !loading && (
          <div className="p-20 flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
              <i className="pi pi-cloud-upload text-4xl text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-400">No data to display</h3>
            <p className="text-slate-400 max-w-xs mt-2">Please upload an Excel file containing feedback records to see the analytics.</p>
          </div>
        )}

        {loading && (
          <div className="p-20 flex flex-col items-center justify-center text-center">
            <i className="pi pi-spin pi-spinner text-4xl text-indigo-600 mb-4" />
            <p className="text-slate-500 font-bold">Processing your data...</p>
          </div>
        )}
      </Card>

      {data && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* School Distribution */}
          <Card title="School Distribution" className="shadow-lg rounded-3xl border-none overflow-hidden">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.schoolDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.schoolDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Question Averages */}
          <Card title="Question Performance (Avg)" className="shadow-lg rounded-3xl border-none overflow-hidden">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.questionAverages}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} />
                  <YAxis domain={[0, 5]} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="average" fill="#6366f1" radius={[8, 8, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Top Faculty */}
          <Card title="Top Performing Faculty" className="shadow-lg rounded-3xl border-none overflow-hidden lg:col-span-2">
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.facultyPerformance} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" domain={[0, 5]} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={150} tick={{ fill: '#475569', fontSize: 11, fontWeight: 600 }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="rating" fill="#10b981" radius={[0, 8, 8, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default AnalyticsPage;
