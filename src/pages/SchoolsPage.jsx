import React, { useState } from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Message } from 'primereact/message';
import { useGetSchoolsQuery, useAddSchoolMutation } from '../services/api';
import * as XLSX from 'xlsx';
import { motion } from 'motion/react';

const SchoolsPage = () => {
  const [schoolName, setSchoolName] = useState('');
  const { data: schools, isLoading } = useGetSchoolsQuery();
  const [addSchool] = useAddSchoolMutation();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!schoolName.trim()) return;
    
    try {
      await addSchool({ schoolName: schoolName }).unwrap();
      setSchoolName('');
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      console.error('Failed to add school:', err);
    }
  };

  const downloadExcel = () => {
    const dataToExport = schools?.schools || [];
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Schools");
    XLSX.writeFile(workbook, "Schools_List.xlsx");
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* Registration Card */}
        <Card className="shadow-2xl rounded-[2.5rem] border-none overflow-hidden mb-12 bg-white/80 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-[#701515] via-[#4a0d0d] to-black p-10 md:p-14 relative overflow-hidden">
            {/* Decorations */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full -mr-32 -mt-32 blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-500/10 rounded-full -ml-32 -mb-32 blur-[80px]" />
            
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="max-w-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-amber-500/20 p-2 rounded-xl backdrop-blur-md border border-amber-500/20">
                    <i className="pi pi-building text-amber-400 text-xl"></i>
                  </div>
                  <span className="text-amber-400 font-black uppercase tracking-[0.2em] text-[10px]">Academic Architecture</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-serif font-black text-white mb-4 tracking-tighter">
                  Manage Schools
                </h1>
                <p className="text-red-100 text-lg font-medium opacity-80 leading-relaxed">
                  Establish the foundational academic blocks of Manav Rachna University.
                </p>
              </div>
            </div>
          </div>

          <div className="p-8 md:p-12">
            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
              {submitted && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                  <Message severity="success" text="School entity successfully registered in the central system." className="w-full rounded-2xl border-none shadow-lg py-4 bg-emerald-50 text-emerald-700" />
                </motion.div>
              )}
              
              <div className="flex flex-col gap-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Institutional Entity Name</label>
                <div className="flex flex-col md:flex-row gap-6">
                  <InputText 
                    value={schoolName} 
                    onChange={(e) => setSchoolName(e.target.value)} 
                    placeholder="e.g. School of Engineering & Technology" 
                    className="flex-1 rounded-2xl border-slate-100 bg-slate-50/50 p-5 focus:ring-8 focus:ring-[#701515]/5 focus:border-[#701515]/50 transition-all font-bold text-slate-700 text-lg"
                    required
                  />
                  <Button 
                    label="Register School" 
                    icon="pi pi-plus-circle" 
                    className="rounded-2xl font-black text-xs uppercase tracking-widest px-12 py-5 shadow-2xl shadow-red-900/20 border-none transition-all duration-300 hover:scale-[1.02] active:scale-95"
                    style={{ background: 'linear-gradient(135deg, #701515 0%, #4a0d0d 100%)', color: '#fff' }}
                    type="submit" 
                  />
                </div>
              </div>
            </form>
          </div>
        </Card>

        {/* List Card */}
        <Card className="shadow-2xl rounded-[2.5rem] border-none overflow-hidden bg-white/80 backdrop-blur-sm">
          <div className="p-8 md:p-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                  <h2 className="text-3xl font-serif font-black text-slate-900 tracking-tight">Institutional Registry</h2>
                </div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{schools?.schools?.length || 0} Registered Entities</p>
              </div>
              <Button 
                label="Export Registry (.xlsx)" 
                icon="pi pi-download" 
                className="p-button-text p-button-secondary font-black text-[10px] uppercase tracking-widest hover:text-[#701515] transition-colors border-2 border-slate-100 rounded-2xl px-6 py-3" 
                onClick={downloadExcel} 
                disabled={!schools?.schools?.length} 
              />
            </div>

            <div className="rounded-[2rem] border border-slate-100 overflow-hidden shadow-inner">
              <DataTable 
                value={schools?.schools} 
                loading={isLoading} 
                className="p-datatable-sm custom-modern-table" 
                paginator 
                rows={10} 
                emptyMessage="No institutional records found."
                responsiveLayout="stack"
                rowClassName={() => 'hover:bg-slate-50/50 cursor-default transition-colors duration-200'}
              >
                <Column 
                  field="id" 
                  header="ENTITY REF" 
                  sortable 
                  className="font-black text-slate-400 px-8 py-6"
                  style={{ width: '150px' }}
                />
                <Column 
                  field="schoolName" 
                  header="INSTITUTIONAL NAME" 
                  sortable 
                  className="font-extrabold text-slate-700 px-8 py-6 text-lg"
                  body={(rowData) => (
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-[#701515]">
                        <i className="pi pi-university"></i>
                      </div>
                      {rowData.schoolName}
                    </div>
                  )}
                />
              </DataTable>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default SchoolsPage;
