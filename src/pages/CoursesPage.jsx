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
    <div className="max-w-5xl mx-auto pb-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="shadow-2xl rounded-[2rem] border-none overflow-hidden mb-10 bg-white">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-10 -mx-6 -mt-6 mb-10 relative overflow-hidden">
            <div className="relative z-10">
              <h1 className="text-4xl font-black text-white mb-3 tracking-tight">Manage Courses</h1>
              <p className="text-emerald-100 font-medium opacity-90">Create new courses and link them to their respective faculty members.</p>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
            <div className="absolute right-10 top-1/2 -translate-y-1/2 z-10">
              <Button
                type="button"
                label="Bulk Upload (.xlsx)"
                icon="pi pi-upload"
                className="p-button-outlined text-white border-white hover:bg-white/20 whitespace-nowrap rounded-2xl font-bold px-6 py-3 border-2"
                onClick={() => setShowBulkUpload(true)}
              />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-8 px-4">
            {submitted && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                <Message severity="success" text="Course added successfully!" className="w-full rounded-2xl border-none shadow-md" />
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-2.5">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Course Name</label>
                <InputText
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  placeholder="e.g. Advanced Mathematics"
                  className="w-full rounded-2xl border-slate-200 p-4 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button
                label="Add New Course"
                icon="pi pi-plus"
                className="p-button-primary rounded-2xl font-black px-12 py-4 shadow-xl shadow-emerald-500/30 bg-gradient-to-r from-emerald-600 to-teal-700 border-none hover:scale-[1.02] transition-transform"
                type="submit"
              />
            </div>
          </form>
        </Card>

        {/* BULK UPLOAD DIALOG */}
        <Dialog
          header="Bulk Assign Courses"
          visible={showBulkUpload}
          style={{ width: '60vw' }}
          breakpoints={{ '960px': '75vw', '641px': '90vw' }}
          onHide={() => {
            setShowBulkUpload(false);
            setExcelData([]);
            setBulkError(null);
          }}
          className="rounded-3xl"
        >
          <div className="flex flex-col gap-6 pt-2">
            {bulkError && (
              <Message severity="error" text={bulkError} className="w-full mb-2" />
            )}
            {bulkSuccess && (
              <Message 
                severity={bulkSuccess.includes("Skipped") ? "warn" : "success"} 
                content={(
                  <div className="flex flex-col gap-1 py-1">
                    <span className="font-bold">Bulk Upload Result:</span>
                    <span className="text-sm">{bulkSuccess}</span>
                  </div>
                )} 
                className="w-full mb-2" 
              />
            )}
            <div className="flex flex-wrap items-center gap-4">
              <input
                type="file"
                accept=".xlsx, .xls"
                id="excel-upload"
                className="hidden"
                onChange={handleFileUpload}
              />
              <Button
                type="button"
                label="Select Excel File"
                icon="pi pi-file-excel"
                className="p-button-outlined p-button-info"
                onClick={() => document.getElementById('excel-upload').click()}
              />
              <Button
                type="button"
                label="Download Template"
                icon="pi pi-download"
                className="p-button-text p-button-secondary"
                onClick={downloadTemplate}
              />
              <span className="text-sm text-slate-500">
                Required columns: <b>Course Name</b>
              </span>
            </div>

            {excelData.length > 0 && (
              <div className="border border-slate-200 rounded-xl overflow-hidden mt-4">
                <DataTable value={excelData} paginator rows={5} responsiveLayout="scroll" className="p-datatable-sm">
                  <Column field="courseName" header="Course Name" />
                </DataTable>
              </div>
            )}

            <div className="flex justify-end gap-3 mt-4">
              <Button
                type="button"
                label="Cancel"
                className="p-button-text p-button-secondary"
                onClick={() => {
                  setShowBulkUpload(false);
                  setExcelData([]);
                }}
              />
              <Button
                type="button"
                label="Process Upload"
                icon="pi pi-check"
                className="p-button-success"
                disabled={excelData.length === 0 || isUploading}
                loading={isUploading}
                onClick={handleBulkSubmit}
              />
            </div>
          </div>
        </Dialog>

        <Card className="shadow-2xl rounded-[2rem] border-none overflow-hidden bg-white">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 px-4">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Existing Courses</h2>
              <p className="text-sm font-bold text-slate-400">Total {courses?.length || 0} courses in curriculum</p>
            </div>
            <Button
              label="Export to Excel"
              icon="pi pi-download"
              className="p-button-outlined p-button-secondary rounded-2xl font-bold px-6 py-3 border-2"
              onClick={downloadExcel}
              disabled={!courses?.courses?.length}
            />
          </div>

          <div className="px-2">
            <DataTable
              value={courses?.courses}
              loading={isLoading}
              className="p-datatable-sm custom-table"
              paginator
              rows={10}
              emptyMessage="No courses found."
              responsiveLayout="stack"
            >
              <Column field="id" header="ID" />
              <Column field="courseName" header="Course Name" />

              
            </DataTable>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default CoursesPage;
