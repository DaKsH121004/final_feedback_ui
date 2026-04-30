import React, { useState } from "react";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { MultiSelect } from "primereact/multiselect";
import { Message } from "primereact/message";
import {
  useGetFacultyQuery,
  useAddFacultyMutation,
  useGetDepartmentsQuery,
  useUpdateFacultyMutation,
  useDeleteFacultyMutation,
} from "../services/api";

import * as XLSX from "xlsx";
import { motion } from "motion/react";

const FacultyPage = () => {
  const [facultyName, setFacultyName] = useState("");
  const [facultyCode, setFacultyCode] = useState("");
  const [facultyEmail, setFacultyEmail] = useState("");
  const [facultyPhone, setFacultyPhone] = useState("");
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const { data: faculty, isLoading, refetch } = useGetFacultyQuery();
  const { data: deptData } = useGetDepartmentsQuery();
  const [addFaculty] = useAddFacultyMutation();
  const [updateFaculty] = useUpdateFacultyMutation();
  const [deleteFaculty] = useDeleteFacultyMutation();
  const [submitted, setSubmitted] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!facultyName || !facultyCode || !facultyEmail || !facultyPhone) return;

    try {
      if (editingId) {
        await updateFaculty({
          id: editingId,
          facultyName,
          facultyCode,
          facultyEmail,
          facultyPhone,
          departmentId: selectedDepartments,
        }).unwrap();

        setEditingId(null);
      } else {
        await addFaculty({
          facultyName,
          facultyCode,
          facultyEmail,
          facultyPhone,
          departmentId: selectedDepartments,
        }).unwrap();
      }

      // ✅ IMPORTANT FIX
      refetch();

      setFacultyName("");
      setFacultyCode("");
      setFacultyEmail("");
      setFacultyPhone("");
      setSelectedDepartments([]);

      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);

    } catch (err) {
      console.error("Failed to submit faculty:", err);
    }
  };

  const downloadExcel = () => {
    const dataToExport = faculty?.faculties || [];

    if (!Array.isArray(dataToExport)) {
      console.error("Data is not an array:", dataToExport);
      return;
    }

    const formattedData = dataToExport.map((item) => ({
      Name: item.facultyName,
      Code: item.facultyCode,
      Email: item.facultyEmail,
      Phone: item.facultyPhone,
      Rating: item.averageRating,
      Responses: item.totalResponses,
      Departments:
        item.departments?.map((d) => d.departmentName).join(", ") ||
        "No Department",
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Faculty");

    XLSX.writeFile(workbook, "Faculty_List.xlsx");
  };

  const departmentOptions =
    deptData?.departments?.map((dept) => ({
      label: dept.departmentName,
      value: dept.id,
    })) || [];


  const resetForm = () => {
    setFacultyName('');
    setSelectedDepartments([]);
    setFacultyCode("");
    setFacultyEmail("");
    setFacultyPhone("");
    setEditingId(null);
  };


  const handleEdit = (facultyMember) => {
    setEditingId(facultyMember.id);
    setFacultyName(facultyMember.facultyName);
    setFacultyCode(facultyMember.facultyCode);
    setFacultyEmail(facultyMember.facultyEmail);
    setFacultyPhone(facultyMember.facultyPhone);

    // Map department names back to the objects from our departments list
    // const filteredDepts = departments.filter(d =>
    //   facultyMember.departmentNames?.includes(d.name)
    // );
    // setSelectedDepartments(filteredDepts);


    const filteredDepts = departmentOptions
      .filter(d =>
        facultyMember.departments?.some(dep => dep.id === d.value)
      )
      .map(d => d.value);

    setSelectedDepartments(filteredDepts);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('WARNING: Are you sure you want to delete this faculty member? This action cannot be undone.')) {
      try {
        await deleteFaculty(id).unwrap();

        // ✅ IMPORTANT FIX
        refetch();

      } catch (err) {
        console.error('Failed to delete faculty:', err);
      }
    }
  };

  const actionTemplate = (rowData) => {
    return (
      <div className="flex gap-2">
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-text p-button-warning"
          onClick={() => handleEdit(rowData)}
          tooltip="Edit"
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-text p-button-danger"
          onClick={() => handleDelete(rowData.id)}
          tooltip="Delete"
        />
      </div>
    );
  };

  const [globalFilter, setGlobalFilter] = useState('');

  const renderHeader = () => {
    return (
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1.5 h-6 bg-[#701515] rounded-full"></div>
            <h2 className="text-3xl font-serif font-black text-slate-900 tracking-tight">Faculty Registry</h2>
          </div>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest ml-4">
            {faculty?.faculties?.length || 0} Professional Records synchronized
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-80 group">
            <i className="pi pi-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#701515] transition-colors"></i>
            <InputText
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search by Name, Code, or Email..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl border-slate-100 bg-slate-50/50 focus:ring-8 focus:ring-[#701515]/5 transition-all font-bold text-slate-700"
            />
          </div>
          <Button
            label="Download Dossier"
            icon="pi pi-file-excel"
            className="p-button-text p-button-secondary font-black text-[10px] uppercase tracking-widest border-2 border-slate-100 rounded-2xl px-8 h-14 hover:bg-slate-50 transition-all w-full sm:w-auto"
            onClick={downloadExcel}
            disabled={!faculty?.faculties?.length}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* Registration Card */}
        <Card className="shadow-2xl rounded-[2.5rem] border-none overflow-hidden mb-12 bg-white relative">
           <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
             <i className="pi pi-users text-9xl text-white" />
           </div>
           
          <div className="bg-gradient-to-br from-[#701515] via-[#4a0d0d] to-black p-10 md:p-14 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full -mr-32 -mt-32 blur-[100px]" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-amber-500/20 text-amber-400 text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-[0.2em] border border-amber-500/20 backdrop-blur-md">Faculty Administration</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-serif font-black text-white mb-4 tracking-tighter">
                {editingId ? 'Modify Faculty Profile' : 'Register New Faculty'}
              </h1>
              <p className="text-red-100/70 text-lg font-medium max-w-2xl leading-relaxed">
                Onboard academic professionals into the MRU central database and assign departmental affiliations.
              </p>
            </div>
          </div>

          <div className="p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-10">
              {submitted && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                  <Message
                    severity="success"
                    text={editingId ? "Faculty credentials updated successfully." : "New faculty profile established in the registry."}
                    className="w-full rounded-2xl border-none shadow-lg py-4 bg-emerald-50 text-emerald-700 font-bold"
                  />
                </motion.div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                <div className="flex flex-col gap-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Full Legal Name</label>
                  <InputText
                    value={facultyName}
                    onChange={(e) => setFacultyName(e.target.value)}
                    placeholder="e.g. Dr. Jane Smith"
                    className="w-full rounded-2xl border-slate-100 bg-slate-50/50 p-5 focus:ring-8 focus:ring-[#701515]/5 transition-all font-bold text-slate-700"
                    required
                  />
                </div>
                
                <div className="flex flex-col gap-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Faculty Identity Code</label>
                  <InputText
                    value={facultyCode}
                    onChange={(e) => setFacultyCode(e.target.value)}
                    placeholder="e.g. MRU-CS-2024"
                    className="w-full rounded-2xl border-slate-100 bg-slate-50/50 p-5 focus:ring-8 focus:ring-[#701515]/5 transition-all font-bold text-slate-700 uppercase"
                    required
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Official Email Address</label>
                  <InputText
                    value={facultyEmail}
                    onChange={(e) => setFacultyEmail(e.target.value)}
                    placeholder="jane.smith@mru.edu.in"
                    className="w-full rounded-2xl border-slate-100 bg-slate-50/50 p-5 focus:ring-8 focus:ring-[#701515]/5 transition-all font-bold text-slate-700"
                    required
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Contact Number</label>
                  <InputText
                    value={facultyPhone}
                    onChange={(e) => setFacultyPhone(e.target.value)}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full rounded-2xl border-slate-100 bg-slate-50/50 p-5 focus:ring-8 focus:ring-[#701515]/5 transition-all font-bold text-slate-700"
                    required
                  />
                </div>

                <div className="flex flex-col gap-3 lg:col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Departmental Affiliations</label>
                  <MultiSelect
                    value={selectedDepartments}
                    onChange={(e) => setSelectedDepartments(e.value)}
                    options={departmentOptions}
                    optionLabel="label"
                    placeholder="Assign to Departments"
                    className="w-full rounded-2xl border-slate-100 bg-slate-50/50 min-h-[64px] flex items-center"
                    display="chip"
                    filter
                  />
                </div>
              </div>

              <div className="flex justify-end items-center gap-6 pt-6 border-t border-slate-100">
                {editingId && (
                  <Button
                    label="Discard Changes"
                    icon="pi pi-times"
                    className="p-button-text p-button-secondary rounded-2xl font-black text-[10px] uppercase tracking-widest px-8 h-14"
                    onClick={resetForm}
                  />
                )}
                <Button
                  label={editingId ? "Update Faculty Profile" : "Register Faculty Member"}
                  icon={editingId ? "pi pi-check-circle" : "pi pi-plus-circle"}
                  className="rounded-2xl font-black text-[10px] uppercase tracking-widest px-12 h-14 shadow-2xl shadow-red-900/20 border-none transition-all duration-300 hover:scale-105 active:scale-95"
                  style={{ background: 'linear-gradient(135deg, #701515 0%, #4a0d0d 100%)', color: '#fff' }}
                  type="submit"
                />
              </div>
            </form>
          </div>
        </Card>

        {/* List Card */}
        <Card className="shadow-2xl rounded-[2.5rem] border-none overflow-hidden bg-white relative">
          <div className="p-8 md:p-12">
            {renderHeader()}

            <div className="rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
              <DataTable
                value={faculty?.faculties}
                loading={isLoading}
                className="p-datatable-sm custom-modern-table"
                paginator
                rows={10}
                globalFilter={globalFilter}
                emptyMessage="No matching faculty records found."
                responsiveLayout="stack"
                rowClassName={() => 'hover:bg-slate-50/50 transition-colors duration-200'}
              >
                <Column field="id" header="ID" className="font-bold text-slate-400" />
                <Column field="facultyName" header="Faculty Name" className="font-bold text-slate-800" sortable />
                <Column field="facultyCode" header="Code" className="font-bold text-[#701515]" sortable />
                <Column field="facultyEmail" header="Email" className="font-semibold text-slate-600" />
                <Column field="facultyPhone" header="Phone" className="font-semibold text-slate-600" />
                <Column 
                  field="averageRating" 
                  header="Rating" 
                  body={(row) => (row.averageRating || 0).toFixed(2)}
                  className="font-bold text-amber-600 text-center" 
                  sortable
                />
                <Column field="totalResponses" header="Responses" className="text-center font-bold text-slate-500" sortable />
                <Column
                  header="Departments"
                  body={(row) => row.departments?.map(d => d.departmentName).join(', ')}
                  className="text-xs font-semibold text-slate-500"
                />
                <Column header="Actions" body={actionTemplate} />
              </DataTable>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default FacultyPage;
