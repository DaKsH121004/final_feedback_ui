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
    <div className="max-w-5xl mx-auto pb-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="shadow-2xl rounded-[2rem] border-none overflow-hidden mb-10 bg-white">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-10 -mx-6 -mt-6 mb-10 relative overflow-hidden">
            <div className="relative z-10">
              <h1 className="text-4xl font-black text-white mb-3 tracking-tight">Manage Departments</h1>
              <p className="text-indigo-100 font-medium opacity-90">Organize your academic structure by linking departments to their respective schools.</p>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-8 px-4">
            {submitted && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                <Message severity="success" text="Department added successfully!" className="w-full rounded-2xl border-none shadow-md" />
              </motion.div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-2.5">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Select School</label>
                <Dropdown 
                  value={selectedSchool} 
                  options={schools?.schools} 
                  optionLabel="schoolName"
                  onChange={(e) => setSelectedSchool(e.value)} 
                  placeholder="Which school's department?" 
                  className="w-full rounded-2xl border-slate-200"
                  required
                  filter
                />
              </div>
              <div className="flex flex-col gap-2.5">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Department Name</label>
                <InputText 
                  value={departmentName} 
                  onChange={(e) => setDepartmentName(e.target.value)} 
                  placeholder="Enter department name" 
                  className="w-full rounded-2xl border-slate-200 p-4 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                  required
                />
              </div>
            </div>
            
            <div className="flex justify-end pt-4">
              <Button 
                label="Add Department" 
                icon="pi pi-plus" 
                className="p-button-primary rounded-2xl font-black px-12 py-4 shadow-xl shadow-indigo-500/30 bg-gradient-to-r from-indigo-600 to-purple-700 border-none hover:scale-[1.02] transition-transform" 
                type="submit" 
              />
            </div>
          </form>
        </Card>

        <Card className="shadow-2xl rounded-[2rem] border-none overflow-hidden bg-white">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 px-4">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Existing Departments</h2>
              <p className="text-sm font-bold text-slate-400">Total {departments?.length || 0} departments registered</p>
            </div>
            <Button 
              label="Export to Excel" 
              icon="pi pi-download" 
              className="p-button-outlined p-button-secondary rounded-2xl font-bold px-6 py-3 border-2" 
              onClick={downloadExcel} 
              disabled={!departments?.departments?.length} 
            />
          </div>

          <div className="px-2">
            <DataTable 
              value={departments?.departments} 
              loading={isLoading} 
              className="p-datatable-sm custom-table" 
              paginator 
              rows={10} 
              emptyMessage="No departments found."
              responsiveLayout="stack"
            >
              <Column field="id" header="ID" sortable className="font-mono text-xs text-slate-400"></Column>
              <Column field="departmentName" header="Department Name" sortable className="font-bold text-slate-700"></Column>
              <Column field="school.schoolName" header="School" sortable className="text-slate-500"></Column>
            </DataTable>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default DepartmentsPage;
