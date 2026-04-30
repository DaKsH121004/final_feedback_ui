import React, { useState } from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import { Message } from 'primereact/message';
import { useGetCoursesQuery, useAddCourseMutation, useGetFacultyQuery, useBulkUploadCoursesMutation } from '../services/api';
import * as XLSX from 'xlsx';
import { motion } from 'motion/react';
import { MultiSelect } from 'primereact/multiselect';

const CoursesPage = () => {
  const [courseName, setCourseName] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState([]);
  const { data: courses, isLoading } = useGetCoursesQuery();
  const { data: faculty } = useGetFacultyQuery();
  const [addCourse] = useAddCourseMutation();
  const [submitted, setSubmitted] = useState(false);

  // Bulk Upload States
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [excelData, setExcelData] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [bulkError, setBulkError] = useState(null);
  const [bulkSuccess, setBulkSuccess] = useState(null);

  const [bulkUploadCourses] = useBulkUploadCoursesMutation();

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);
      
      console.log("Parsed Excel Data:", data);

      const previewData = data.map((row, index) => {
        // Find a key that looks like "Course Name"
        const key = Object.keys(row).find(k => k.toLowerCase().trim() === 'course name') || 'Course Name';
        return {
          id: index,
          courseName: row[key] || row['course name'] || row['Course Name'] || '',
        };
      }).filter(item => item.courseName); // Only show rows that have a course name

      setExcelData(previewData);
    };
    reader.readAsBinaryString(file);
    
    e.target.value = null;
  };

  const downloadTemplate = () => {
    const ws = XLSX.utils.json_to_sheet([{
      "Course Name": "",
    }]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, "bulk_course_template.xlsx");
  };

  const handleBulkSubmit = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);

    setIsUploading(true);
    setBulkError(null);
    setBulkSuccess(null);
    try {
      const response = await bulkUploadCourses(formData).unwrap();
      setBulkSuccess(response.message || "Courses uploaded successfully!");
      setExcelData([]);
      setSelectedFile(null);
      if (!response.message?.includes("Skipped")) {
        setTimeout(() => {
          setShowBulkUpload(false);
          setBulkSuccess(null);
        }, 5000);
      }
    } catch (error) {
      console.error("Bulk upload failed:", error);
      const errorMsg = error?.data?.message || "Bulk upload failed. Please check the file format.";
      setBulkError(errorMsg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!courseName.trim() || !selectedFaculty) return;

    try {
      await addCourse({
        courseName,
      }).unwrap();

      setCourseName('');
      setSelectedFaculty([]);

      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);

    } catch (err) {
      console.error('Failed to add course:', err);
    }
  };

  const downloadExcel = () => {
    const dataToExport = courses?.courses || [];
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Courses");
    XLSX.writeFile(workbook, "Courses_List.xlsx");
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* Main Card: Add Course */}
        <Card className="shadow-2xl rounded-[2.5rem] border-none overflow-hidden mb-12 bg-white/80 backdrop-blur-sm relative">
           <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
             <i className="pi pi-book text-9xl text-white" />
           </div>

          <div className="bg-gradient-to-br from-[#701515] via-[#4a0d0d] to-black p-10 md:p-14 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full -mr-32 -mt-32 blur-[100px]" />
            
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="max-w-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-amber-500/20 text-amber-400 text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-[0.2em] border border-amber-500/20 backdrop-blur-md">Curriculum Management</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-serif font-black text-white mb-4 tracking-tighter">
                  Manage Courses
                </h1>
                <p className="text-red-100/70 text-lg font-medium max-w-2xl leading-relaxed">
                  Easily create, organize, and monitor your academic courses from one central dashboard.
                </p>
              </div>
              
              <div className="shrink-0">
                <Button
                  type="button"
                  label="Bulk Upload (.xlsx)"
                  icon="pi pi-upload"
                  className="p-button-text text-white border-2 border-white/20 hover:border-amber-500/50 hover:bg-white/5 transition-all duration-300 rounded-2xl font-black text-[10px] uppercase tracking-widest px-8 h-14"
                  onClick={() => setShowBulkUpload(true)}
                />
              </div>
            </div>
          </div>

          <div className="p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-10">
              {submitted && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                  <Message severity="success" text="New course successfully integrated into the system." className="w-full rounded-2xl border-none shadow-lg py-4 bg-emerald-50 text-emerald-700 font-bold" />
                </motion.div>
              )}

              <div className="grid grid-cols-1 gap-8">
                <div className="flex flex-col gap-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Course Identification Name</label>
                  <div className="relative group">
                    <i className="pi pi-pencil absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#701515] transition-colors"></i>
                    <InputText
                      value={courseName}
                      onChange={(e) => setCourseName(e.target.value)}
                      placeholder="e.g. Advanced Data Structures & Algorithms"
                      className="w-full rounded-2xl border-slate-100 bg-slate-50/50 p-5 pl-14 focus:ring-8 focus:ring-[#701515]/5 transition-all text-slate-700 font-bold"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <Button
                  label="Add New Course"
                  icon="pi pi-plus-circle"
                  className="rounded-2xl font-black text-[10px] uppercase tracking-widest px-12 h-14 shadow-2xl shadow-red-900/20 border-none transition-all duration-300 hover:scale-105 active:scale-95"
                  style={{ background: 'linear-gradient(135deg, #701515 0%, #4a0d0d 100%)', color: '#fff' }}
                  type="submit"
                />
              </div>
            </form>
          </div>
        </Card>

        {/* List Card: Existing Courses */}
        <Card className="shadow-2xl rounded-[2.5rem] border-none overflow-hidden bg-white/80 backdrop-blur-sm">
          <div className="p-8 md:p-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-1.5 h-6 bg-[#701515] rounded-full"></div>
                  <h2 className="text-3xl font-serif font-black text-slate-900 tracking-tight">Active Curriculum</h2>
                </div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest ml-4">Inventorying {courses?.courses?.length || 0} unique courses</p>
              </div>
              <Button
                label="Export Registry (.xlsx)"
                icon="pi pi-file-excel"
                className="p-button-text p-button-secondary font-black text-[10px] uppercase tracking-widest border-2 border-slate-100 rounded-2xl px-8 h-12 hover:bg-slate-50 transition-all"
                onClick={downloadExcel}
                disabled={!courses?.courses?.length}
              />
            </div>

            <div className="rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
              <DataTable
                value={courses?.courses}
                loading={isLoading}
                className="p-datatable-sm custom-modern-table"
                paginator
                rows={10}
                emptyMessage="No academic records found."
                responsiveLayout="stack"
                rowClassName={() => 'hover:bg-slate-50/50 transition-colors duration-200'}
              >
                <Column 
                  field="id" 
                  header="REF" 
                  className="font-black text-slate-400 px-8 py-6 text-xs" 
                  style={{ width: '120px' }}
                />
                <Column 
                  field="courseName" 
                  header="COURSE SPECIFICATION" 
                  className="font-black text-slate-800 px-8 py-6 text-lg"
                  body={(rowData) => (
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-[#701515]">
                        <i className="pi pi-book"></i>
                      </div>
                      <span className="tracking-tight">{rowData.courseName}</span>
                    </div>
                  )}
                />
              </DataTable>
            </div>
          </div>
        </Card>

        {/* BULK UPLOAD DIALOG */}
        <Dialog
          header={
            <div className="flex items-center gap-4 py-2">
              <div className="bg-red-50 p-3 rounded-2xl">
                <i className="pi pi-upload text-[#701515] text-xl"></i>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-serif font-black text-slate-900 tracking-tight leading-none">Bulk Import</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Accelerated Course Setup</span>
              </div>
            </div>
          }
          visible={showBulkUpload}
          style={{ width: '90vw', maxWidth: '700px' }}
          modal
          onHide={() => {
            setShowBulkUpload(false);
            setExcelData([]);
            setBulkError(null);
          }}
          className="rounded-[2.5rem] overflow-hidden"
          maskClassName="backdrop-blur-md bg-[#701515]/10"
        >
          <div className="flex flex-col gap-8 pt-4 pb-2">
            {bulkError && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <Message severity="error" text={bulkError} className="w-full rounded-2xl border-none shadow-md" />
              </motion.div>
            )}
            
            {bulkSuccess && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <Message 
                  severity={bulkSuccess.includes("Skipped") ? "warn" : "success"} 
                  content={(
                    <div className="flex flex-col gap-2 py-2 px-4">
                      <span className="font-black text-sm uppercase tracking-wider">Operation Status:</span>
                      <span className="text-base font-medium opacity-90">{bulkSuccess}</span>
                    </div>
                  )} 
                  className="w-full rounded-2xl border-none shadow-md" 
                />
              </motion.div>
            )}

            <div 
              className="group border-2 border-dashed border-slate-100 rounded-[2rem] p-12 flex flex-col items-center justify-center gap-6 bg-slate-50/50 hover:bg-red-50/30 hover:border-[#701515]/30 transition-all duration-500 cursor-pointer relative overflow-hidden"
              onClick={() => document.getElementById('excel-upload').click()}
            >
              <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                <i className="pi pi-file-excel text-3xl text-[#701515]"></i>
              </div>
              
              <div className="text-center relative z-10">
                <p className="text-xl font-black text-slate-800 mb-2 tracking-tight">Drop your Excel sheet here</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">or click to browse from storage</p>
              </div>

              <input
                type="file"
                accept=".xlsx, .xls"
                id="excel-upload"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
              <div className="flex items-center gap-3 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                <i className="pi pi-info-circle text-[#701515]"></i>
                <span>Mandatory header: Course Name</span>
              </div>
              <Button
                type="button"
                label="Download Protocol Template"
                icon="pi pi-download"
                className="p-button-text p-button-secondary font-black text-[10px] uppercase tracking-widest h-12"
                onClick={downloadTemplate}
              />
            </div>

            {excelData.length > 0 && (
              <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="mt-4">
                <div className="flex items-center justify-between mb-4 px-2">
                  <span className="font-black text-slate-700 flex items-center gap-2 text-[10px] uppercase tracking-widest">
                    <i className="pi pi-eye text-amber-500"></i>
                    Data Preview ({excelData.length} records)
                  </span>
                </div>
                <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-2xl">
                  <DataTable value={excelData} paginator rows={3} responsiveLayout="scroll" className="p-datatable-sm">
                    <Column field="courseName" header="COURSE NAME" className="font-bold text-slate-600 p-4" />
                  </DataTable>
                </div>
              </motion.div>
            )}

            <div className="flex justify-end items-center gap-4 mt-6 pt-4 border-t border-slate-50">
              <Button
                type="button"
                label="Abort"
                className="p-button-text p-button-secondary font-black text-[10px] uppercase tracking-widest h-14 px-8"
                onClick={() => {
                  setShowBulkUpload(false);
                  setExcelData([]);
                }}
              />
              <Button
                type="button"
                label="Finalize Upload"
                icon="pi pi-check-circle"
                className="rounded-2xl font-black text-[10px] uppercase tracking-widest px-10 h-14 shadow-2xl shadow-red-900/20 border-none"
                style={{ background: 'linear-gradient(135deg, #701515 0%, #4a0d0d 100%)', color: '#fff' }}
                disabled={excelData.length === 0 || isUploading}
                loading={isUploading}
                onClick={handleBulkSubmit}
              />
            </div>
          </div>
        </Dialog>
      </motion.div>
    </div>
  );
};

export default CoursesPage;
