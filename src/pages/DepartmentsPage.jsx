import React, { useState } from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { Message } from 'primereact/message';
import { useGetDepartmentsQuery, useAddDepartmentMutation, useGetSchoolsQuery } from '../services/api';
import * as XLSX from 'xlsx';
import { motion } from 'motion/react';

const DepartmentsPage = () => {
  const [departmentName, setDepartmentName] = useState('');
  const [selectedSchool, setSelectedSchool] = useState(null);
  const { data: departments, isLoading } = useGetDepartmentsQuery();
  const { data: schools } = useGetSchoolsQuery();
  const [addDepartment] = useAddDepartmentMutation();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!departmentName.trim() || !selectedSchool) return;
    
    try {
      await addDepartment({ 
        departmentName,
  schoolId: selectedSchool.id
      }).unwrap();
      setDepartmentName('');
      setSelectedSchool(null);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      console.error('Failed to add department:', err);
    }
  };

  const downloadExcel = () => {
    const dataToExport = departments?.departments || [];
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Departments");
    XLSX.writeFile(workbook, "Departments_List.xlsx");
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* Registration Card */}
        <Card className="shadow-2xl rounded-[2.5rem] border-none overflow-hidden mb-12 bg-white/80 backdrop-blur-sm relative">
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
            <i className="pi pi-briefcase text-9xl text-white" />
          </div>

          <div className="bg-gradient-to-br from-[#701515] via-[#4a0d0d] to-black p-10 md:p-14 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full -mr-32 -mt-32 blur-[100px]" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-amber-500/20 text-amber-400 text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-[0.2em] border border-amber-500/20 backdrop-blur-md">Organizational Structure</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-serif font-black text-white mb-4 tracking-tighter">
                Manage Departments
              </h1>
              <p className="text-red-100/70 text-lg font-medium max-w-2xl leading-relaxed">
                Define and organize academic departments within their respective institutional schools.
              </p>
            </div>
          </div>

          <div className="p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-10">
              {submitted && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                  <Message severity="success" text="Department successfully integrated into the university structure." className="w-full rounded-2xl border-none shadow-lg py-4 bg-emerald-50 text-emerald-700 font-bold" />
                </motion.div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="flex flex-col gap-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Parent Institution (School)</label>
                  <Dropdown 
                    value={selectedSchool} 
                    options={schools?.schools} 
                    optionLabel="schoolName"
                    onChange={(e) => setSelectedSchool(e.value)} 
                    placeholder="Select School" 
                    className="w-full rounded-2xl border-slate-100 bg-slate-50/50 min-h-[64px] flex items-center px-2"
                    required
                    filter
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Department Nomenclature</label>
                  <InputText 
                    value={departmentName} 
                    onChange={(e) => setDepartmentName(e.target.value)} 
                    placeholder="e.g. Department of Mechanical Engineering" 
                    className="w-full rounded-2xl border-slate-100 bg-slate-50/50 p-5 focus:ring-8 focus:ring-[#701515]/5 transition-all font-bold text-slate-700"
                    required
                  />
                </div>
              </div>
              
              <div className="flex justify-end pt-6 border-t border-slate-100">
                <Button 
                  label="Establish Department" 
                  icon="pi pi-plus-circle" 
                  className="rounded-2xl font-black text-[10px] uppercase tracking-widest px-12 h-14 shadow-2xl shadow-red-900/20 border-none transition-all duration-300 hover:scale-105 active:scale-95" 
                  style={{ background: 'linear-gradient(135deg, #701515 0%, #4a0d0d 100%)', color: '#fff' }}
                  type="submit" 
                />
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
                  <div className="w-1.5 h-6 bg-[#701515] rounded-full"></div>
                  <h2 className="text-3xl font-serif font-black text-slate-900 tracking-tight">Divisional Index</h2>
                </div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest ml-4">{departments?.departments?.length || 0} Departments Registered</p>
              </div>
              <Button 
                label="Export Registry (.xlsx)" 
                icon="pi pi-download" 
                className="p-button-text p-button-secondary font-black text-[10px] uppercase tracking-widest border-2 border-slate-100 rounded-2xl px-8 h-12 hover:bg-slate-50 transition-all" 
                onClick={downloadExcel} 
                disabled={!departments?.departments?.length} 
              />
            </div>

            <div className="rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
              <DataTable 
                value={departments?.departments} 
                loading={isLoading} 
                className="p-datatable-sm custom-modern-table" 
                paginator 
                rows={10} 
                emptyMessage="No departmental records synchronized."
                responsiveLayout="stack"
                rowClassName={() => 'hover:bg-slate-50/50 transition-colors duration-200'}
              >
                <Column field="id" header="ID" sortable className="font-bold text-slate-400" />
                <Column field="departmentName" header="Department Name" sortable className="font-bold text-slate-800" />
                <Column 
                  header="School" 
                  sortable 
                  body={(row) => row.school?.schoolName}
                  className="font-semibold text-[#701515]"
                />
              </DataTable>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default DepartmentsPage;
