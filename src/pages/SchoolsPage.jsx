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
    <div className="max-w-5xl mx-auto pb-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="shadow-2xl rounded-[2rem] border-none overflow-hidden mb-10 bg-white">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-10 -mx-6 -mt-6 mb-10 relative overflow-hidden">
            <div className="relative z-10">
              <h1 className="text-4xl font-black text-white mb-3 tracking-tight">Manage Schools</h1>
              <p className="text-blue-100 font-medium opacity-90">Define the primary academic institutions within your organization.</p>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-8 px-4">
            {submitted && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                <Message severity="success" text="School added successfully!" className="w-full rounded-2xl border-none shadow-md" />
              </motion.div>
            )}
            
            <div className="flex flex-col gap-2.5">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">School Name</label>
              <div className="flex flex-col sm:flex-row gap-4">
                <InputText 
                  value={schoolName} 
                  onChange={(e) => setSchoolName(e.target.value)} 
                  placeholder="e.g. School of Engineering" 
                  className="flex-1 rounded-2xl border-slate-200 p-4 focus:ring-4 focus:ring-blue-500/10 transition-all"
                  required
                />
                <Button 
                  label="Add School" 
                  icon="pi pi-plus" 
                  className="p-button-primary rounded-2xl font-black px-12 py-4 shadow-xl shadow-blue-500/30 bg-gradient-to-r from-blue-600 to-indigo-700 border-none hover:scale-[1.02] transition-transform" 
                  type="submit" 
                />
              </div>
            </div>
          </form>
        </Card>

        <Card className="shadow-2xl rounded-[2rem] border-none overflow-hidden bg-white">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 px-4">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Existing Schools</h2>
              <p className="text-sm font-bold text-slate-400">Total {schools?.length || 0} schools registered</p>
            </div>
            <Button 
              label="Export to Excel" 
              icon="pi pi-download" 
              className="p-button-outlined p-button-secondary rounded-2xl font-bold px-6 py-3 border-2" 
              onClick={downloadExcel} 
              disabled={!schools?.schools?.length} 
            />
          </div>

          <div className="px-2">
            <DataTable 
              value={schools?.schools} 
              loading={isLoading} 
              className="p-datatable-sm custom-table" 
              paginator 
              rows={10} 
              emptyMessage="No schools found."
              responsiveLayout="stack"
            >
              <Column field="id" header="ID" sortable className="font-mono text-xs text-slate-400"></Column>
              <Column field="schoolName" header="School Name" sortable className="font-bold text-slate-700"></Column>
            </DataTable>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default SchoolsPage;
