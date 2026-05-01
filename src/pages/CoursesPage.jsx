import React, { useState } from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import { Message } from 'primereact/message';
import { 
  useGetCoursesQuery, 
  useAddCourseMutation, 
  useUpdateCourseMutation, 
  useDeleteCourseMutation,
  useDeleteAllCoursesMutation,
  useGetDepartmentsQuery,
  useBulkUploadCoursesMutation 
} from '../services/api';
import * as XLSX from 'xlsx';
import { motion } from 'motion/react';

const CoursesPage = () => {
  const [courseName, setCourseName] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [globalFilter, setGlobalFilter] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const { data: courses, isLoading, refetch } = useGetCoursesQuery();
  const { data: departmentsResponse } = useGetDepartmentsQuery();
  const departments = departmentsResponse?.departments || [];

  const [addCourse] = useAddCourseMutation();
  const [updateCourse] = useUpdateCourseMutation();
  const [deleteCourse] = useDeleteCourseMutation();
  const [deleteAllCourses] = useDeleteAllCoursesMutation();
  const [bulkUploadCourses] = useBulkUploadCoursesMutation();

  // Bulk Upload States
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [excelData, setExcelData] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [bulkError, setBulkError] = useState(null);
  const [bulkSuccess, setBulkSuccess] = useState(null);

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
      
      const previewData = data.map((row, index) => {
        const key = Object.keys(row).find(k => k.toLowerCase().trim() === 'course name') || 'Course Name';
        return {
          id: index,
          courseName: row[key] || row['course name'] || row['Course Name'] || '',
        };
      }).filter(item => item.courseName);

      setExcelData(previewData);
    };
    reader.readAsBinaryString(file);
    e.target.value = null;
  };

  const downloadTemplate = () => {
    const ws = XLSX.utils.json_to_sheet([{"Course Name": ""}]);
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
      setTimeout(() => {
        setShowBulkUpload(false);
        setBulkSuccess(null);
      }, 5000);
    } catch (error) {
      setBulkError(error?.data?.message || "Bulk upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!courseName.trim()) return;

    try {
      const payload = { 
        courseName,
        departmentId: selectedDepartment?.id 
      };

      if (editingId) {
        await updateCourse({ id: editingId, ...payload }).unwrap();
      } else {
        await addCourse(payload).unwrap();
      }

      resetForm();
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
      refetch();
    } catch (err) {
      console.error('Failed to save course:', err);
    }
  };

  const resetForm = () => {
    setCourseName('');
    setSelectedDepartment(null);
    setEditingId(null);
  };

  const handleEdit = (course) => {
    setEditingId(course.id);
    setCourseName(course.courseName);
    const dept = departments.find(d => d.id === course.department?.id || d.departmentName === course.departmentName);
    setSelectedDepartment(dept || null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await deleteCourse(id).unwrap();
        refetch();
      } catch (err) {
        console.error('Failed to delete course:', err);
      }
    }
  };

  const handleDeleteAll = async () => {
    if (window.confirm('Are you sure you want to delete ALL courses? This action cannot be undone.')) {
      try {
        await deleteAllCourses().unwrap();
        refetch();
      } catch (err) {
        console.error('Failed to delete all courses:', err);
      }
    }
  };

  const actionTemplate = (rowData) => (
    <div className="flex gap-2">
      <Button icon="pi pi-pencil" className="p-button-rounded p-button-text p-button-warning" onClick={() => handleEdit(rowData)} tooltip="Edit" />
      <Button icon="pi pi-trash" className="p-button-rounded p-button-text p-button-danger" onClick={() => handleDelete(rowData.id)} tooltip="Delete" />
    </div>
  );

  const downloadExcel = () => {
    const dataToExport = courses?.courses || [];
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Courses");
    XLSX.writeFile(workbook, "Courses_List.xlsx");
  };

  const renderHeader = () => (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-1.5 h-6 bg-[#701515] rounded-full"></div>
          <h2 className="text-3xl font-serif font-black text-slate-900 tracking-tight">Curriculum Registry</h2>
        </div>
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest ml-4">
          Inventorying {courses?.courses?.length || 0} Professional Courses
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
        <div className="relative w-full sm:w-80 group">
          <i className="pi pi-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#701515] transition-colors z-10"></i>
          <InputText
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search Courses..."
            className="w-full pr-4 py-3 rounded-2xl border-2 border-slate-200 bg-slate-50 focus:border-[#701515] focus:ring-4 focus:ring-[#701515]/10 transition-all font-bold text-slate-700"
            style={{ paddingLeft: '3rem' }}
          />
        </div>
        <Button
          label="Export (.xlsx)"
          icon="pi pi-file-excel"
          className="p-button-text p-button-secondary font-black text-[10px] uppercase tracking-widest border-2 border-slate-100 rounded-2xl px-8 h-14 hover:bg-slate-50 transition-all w-full sm:w-auto"
          onClick={downloadExcel}
          disabled={!courses?.courses?.length}
        />
        <Button
          label="Delete All"
          icon="pi pi-trash"
          className="p-button-text p-button-danger font-black text-[10px] uppercase tracking-widest border-2 border-red-100 rounded-2xl px-8 h-14 hover:bg-red-50 transition-all w-full sm:w-auto"
          onClick={handleDeleteAll}
          disabled={!courses?.courses?.length}
        />
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* Registration Card */}
        <Card className="shadow-2xl rounded-[2.5rem] border-none overflow-hidden mb-12 bg-white relative">
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
            <i className="pi pi-book text-9xl text-white" />
          </div>
          
          <div className="bg-gradient-to-br from-[#701515] via-[#4a0d0d] to-black p-10 md:p-14 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full -mr-32 -mt-32 blur-[100px]" />
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="max-w-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-amber-500/20 text-amber-400 text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-[0.2em] border border-amber-500/20 backdrop-blur-md">Curriculum Administration</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-serif font-black text-white mb-4 tracking-tighter">
                  {editingId ? 'Modify Course Profile' : 'Register New Course'}
                </h1>
                <p className="text-red-100/70 text-lg font-medium leading-relaxed">
                  Onboard academic courses and assign departmental categories for organized curriculum tracking.
                </p>
              </div>
              <Button
                type="button"
                label="Bulk Upload"
                icon="pi pi-upload"
                className="p-button-text text-white border-2 border-white/20 hover:border-amber-500/50 hover:bg-white/5 rounded-2xl font-black text-[10px] uppercase tracking-widest px-8 h-14"
                onClick={() => setShowBulkUpload(true)}
              />
            </div>
          </div>

          <div className="p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-10">
              {submitted && (
                <Message severity="success" text={editingId ? "Course profile updated successfully." : "New course successfully registered."} className="w-full rounded-2xl border-none shadow-lg py-4 bg-emerald-50 text-emerald-700 font-bold" />
              )}

              <div className="grid grid-cols-1 gap-10">
                <div className="flex flex-col gap-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Course Identification Name</label>
                  <InputText
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    placeholder="e.g. Advanced Machine Learning"
                    className="w-full rounded-2xl border-slate-100 bg-slate-50/50 p-5 focus:ring-8 focus:ring-[#701515]/5 transition-all font-bold text-slate-700"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end items-center gap-6 pt-6 border-t border-slate-100">
                {editingId && (
                  <Button label="Discard Changes" icon="pi pi-times" className="p-button-text p-button-secondary rounded-2xl font-black text-[10px] uppercase tracking-widest px-8 h-14" onClick={resetForm} />
                )}
                <Button
                  label={editingId ? "Update Course" : "Register Course"}
                  icon={editingId ? "pi pi-check-circle" : "pi pi-plus-circle"}
                  className="rounded-2xl font-black text-[10px] uppercase tracking-widest px-12 h-14 shadow-2xl border-none transition-all duration-300 hover:scale-105"
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
                value={courses?.courses}
                loading={isLoading}
                className="p-datatable-sm custom-modern-table"
                paginator rows={10}
                globalFilter={globalFilter}
                emptyMessage="No matching academic records found."
                responsiveLayout="stack"
                rowClassName={() => 'hover:bg-slate-50/50 transition-colors duration-200'}
              >
                <Column field="id" header="ID" className="font-bold text-slate-400" />
                <Column field="courseName" header="Course Title" className="font-bold text-slate-800" sortable />
                <Column header="Actions" body={actionTemplate} />
              </DataTable>
            </div>
          </div>
        </Card>

        {/* Bulk Upload Dialog */}
        <Dialog 
          visible={showBulkUpload} 
          onHide={() => setShowBulkUpload(false)}
          header="Accelerated Course Import"
          style={{ width: '90vw', maxWidth: '600px' }}
          className="rounded-[2.5rem] overflow-hidden"
          maskClassName="backdrop-blur-md bg-[#701515]/10"
        >
          <div className="flex flex-col gap-6 pt-4">
            {bulkError && <Message severity="error" text={bulkError} className="w-full rounded-2xl" />}
            {bulkSuccess && <Message severity="success" text={bulkSuccess} className="w-full rounded-2xl" />}
            
            <div className="border-2 border-dashed border-slate-100 rounded-[2rem] p-10 flex flex-col items-center gap-4 bg-slate-50/50" onClick={() => document.getElementById('bulk-course-upload').click()}>
              <i className="pi pi-file-excel text-4xl text-[#701515]" />
              <div className="text-center">
                <p className="font-black text-slate-800">Drop curriculum data here</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Supports .xlsx and .xls</p>
              </div>
              <input type="file" id="bulk-course-upload" className="hidden" accept=".xlsx, .xls" onChange={handleFileUpload} />
            </div>

            {excelData.length > 0 && (
              <div className="px-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Data Preview ({excelData.length} records)</p>
                <div className="border border-slate-100 rounded-2xl overflow-hidden">
                  <DataTable value={excelData} rows={3} className="p-datatable-sm">
                    <Column field="courseName" header="COURSE NAME" />
                  </DataTable>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center pt-4 border-t border-slate-50">
              <Button label="Download Template" icon="pi pi-download" className="p-button-text font-black text-[10px] uppercase" onClick={downloadTemplate} />
              <Button 
                label="Commit Upload" 
                icon="pi pi-check-circle" 
                className="rounded-2xl font-black text-[10px] uppercase tracking-widest px-8 h-12" 
                style={{ background: '#701515', color: '#fff' }}
                disabled={!selectedFile || isUploading}
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
