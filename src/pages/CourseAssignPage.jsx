// import React, { useState } from 'react';
// import { Card } from 'primereact/card';
// import { Button } from 'primereact/button';
// import { DataTable } from 'primereact/datatable';
// import { Column } from 'primereact/column';
// import { Dropdown } from 'primereact/dropdown';
// import { Message } from 'primereact/message';
// import { 
//   useGetAssignmentsQuery, 
//   useAddAssignmentMutation, 
//   useUpdateAssignmentMutation, 
//   useDeleteAssignmentMutation,
//   useGetFacultyQuery,
//   useGetDepartmentsQuery,
//   useGetCoursesQuery
// } from '../services/api';
// import { motion } from 'motion/react';

// const CourseAssignPage = () => {
//   const [selectedFaculty, setSelectedFaculty] = useState(null);
//   const [selectedDepartment, setSelectedDepartment] = useState(null);
//   const [selectedCourse, setSelectedCourse] = useState(null);
//   const [editingId, setEditingId] = useState(null);
//   const [submitted, setSubmitted] = useState(false);

//   const { data: assignmentsResponse, isLoading: assignmentsLoading } = useGetAssignmentsQuery();
//   const { data: facultyResponse } = useGetFacultyQuery();
//   const { data: departmentsResponse } = useGetDepartmentsQuery();
//   const { data: coursesResponse } = useGetCoursesQuery();

//   const assignments = Array.isArray(assignmentsResponse) ? assignmentsResponse : [];
//   const faculty = Array.isArray(facultyResponse) ? facultyResponse : [];
//   const departments = Array.isArray(departmentsResponse) ? departmentsResponse : [];
//   const courses = Array.isArray(coursesResponse) ? coursesResponse : [];

//   const [addAssignment] = useAddAssignmentMutation();
//   const [updateAssignment] = useUpdateAssignmentMutation();
//   const [deleteAssignment] = useDeleteAssignmentMutation();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!selectedFaculty || !selectedDepartment || !selectedCourse) return;

//     try {
//       const payload = {
//         facultyId: selectedFaculty.id,
//         facultyName: selectedFaculty.name,
//         departmentId: selectedDepartment.id,
//         departmentName: selectedDepartment.name,
//         courseId: selectedCourse.id,
//         courseName: selectedCourse.name
//       };

//       if (editingId) {
//         await updateAssignment({ id: editingId, ...payload }).unwrap();
//       } else {
//         await addAssignment(payload).unwrap();
//       }

//       resetForm();
//       setSubmitted(true);
//       setTimeout(() => setSubmitted(false), 3000);
//     } catch (err) {
//       console.error('Failed to save assignment:', err);
//     }
//   };

//   const resetForm = () => {
//     setSelectedFaculty(null);
//     setSelectedDepartment(null);
//     setSelectedCourse(null);
//     setEditingId(null);
//   };

//   const handleEdit = (assignment) => {
//     setEditingId(assignment.id);
    
//     // Find objects in lists to set as dropdown values
//     const f = faculty.find(fac => fac.id === assignment.facultyId || fac.name === assignment.facultyName);
//     const d = departments.find(dept => dept.id === assignment.departmentId || dept.name === assignment.departmentName);
//     const c = courses.find(course => course.id === assignment.courseId || course.name === assignment.courseName);
    
//     setSelectedFaculty(f || { id: assignment.facultyId, name: assignment.facultyName });
//     setSelectedDepartment(d || { id: assignment.departmentId, name: assignment.departmentName });
//     setSelectedCourse(c || { id: assignment.courseId, name: assignment.courseName });
    
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm('Are you sure you want to delete this assignment?')) {
//       try {
//         await deleteAssignment(id).unwrap();
//       } catch (err) {
//         console.error('Failed to delete assignment:', err);
//       }
//     }
//   };

//   const actionTemplate = (rowData) => {
//     return (
//       <div className="flex gap-2">
//         <Button 
//           icon="pi pi-pencil" 
//           className="p-button-rounded p-button-text p-button-warning" 
//           onClick={() => handleEdit(rowData)} 
//         />
//         <Button 
//           icon="pi pi-trash" 
//           className="p-button-rounded p-button-text p-button-danger" 
//           onClick={() => handleDelete(rowData.id)} 
//         />
//       </div>
//     );
//   };

//   return (
//     <div className="max-w-6xl mx-auto pb-12">
//       <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
//         <Card className="shadow-2xl rounded-[2rem] border-none overflow-hidden mb-10 bg-white">
//           <div className="bg-gradient-to-r from-orange-500 to-red-600 p-10 -mx-6 -mt-6 mb-10 relative overflow-hidden">
//             <div className="relative z-10">
//               <h1 className="text-4xl font-black text-white mb-3 tracking-tight">Course Assignment</h1>
//               <p className="text-orange-100 font-medium opacity-90">Link faculty members with departments and specific courses they teach.</p>
//             </div>
//             <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
//           </div>

//           <form onSubmit={handleSubmit} className="flex flex-col gap-8 px-4">
//             {submitted && (
//               <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
//                 <Message severity="success" text={`Assignment ${editingId ? 'updated' : 'added'} successfully!`} className="w-full rounded-2xl border-none shadow-md" />
//               </motion.div>
//             )}
            
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               <div className="flex flex-col gap-2.5">
//                 <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Faculty</label>
//                 <Dropdown 
//                   value={selectedFaculty} 
//                   options={faculty} 
//                   optionLabel="name"
//                   onChange={(e) => setSelectedFaculty(e.value)} 
//                   placeholder="Select Faculty" 
//                   className="w-full rounded-2xl border-slate-200"
//                   filter
//                   required
//                 />
//               </div>
              
//               <div className="flex flex-col gap-2.5">
//                 <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Department</label>
//                 <Dropdown 
//                   value={selectedDepartment} 
//                   options={departments} 
//                   optionLabel="name"
//                   onChange={(e) => setSelectedDepartment(e.value)} 
//                   placeholder="Select Department" 
//                   className="w-full rounded-2xl border-slate-200"
//                   filter
//                   required
//                 />
//               </div>

//               <div className="flex flex-col gap-2.5">
//                 <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Course</label>
//                 <Dropdown 
//                   value={selectedCourse} 
//                   options={courses} 
//                   optionLabel="name"
//                   onChange={(e) => setSelectedCourse(e.value)} 
//                   placeholder="Select Course" 
//                   className="w-full rounded-2xl border-slate-200"
//                   filter
//                   required
//                 />
//               </div>
//             </div>
            
//             <div className="flex justify-end gap-4 pt-4">
//               {editingId && (
//                 <Button 
//                   label="Cancel" 
//                   icon="pi pi-times" 
//                   className="p-button-text p-button-secondary rounded-2xl font-bold px-8" 
//                   type="button"
//                   onClick={resetForm}
//                 />
//               )}
//               <Button 
//                 label={editingId ? "Update Assignment" : "Create Assignment"} 
//                 icon={editingId ? "pi pi-check" : "pi pi-plus"} 
//                 className={`p-button-primary rounded-2xl font-black px-12 py-4 shadow-xl border-none hover:scale-[1.02] transition-transform ${
//                   editingId ? 'bg-amber-500 shadow-amber-500/30' : 'bg-gradient-to-r from-orange-500 to-red-600 shadow-orange-500/30'
//                 }`} 
//                 type="submit" 
//               />
//             </div>
//           </form>
//         </Card>

//         <Card className="shadow-2xl rounded-[2rem] border-none overflow-hidden bg-white">
//           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 px-4">
//             <div>
//               <h2 className="text-2xl font-black text-slate-900 tracking-tight">Active Assignments</h2>
//               <p className="text-sm font-bold text-slate-400">Manage links between faculty, departments and courses</p>
//             </div>
//           </div>

//           <div className="px-2">
//             <DataTable 
//               value={assignments} 
//               loading={assignmentsLoading} 
//               className="p-datatable-sm custom-table" 
//               paginator 
//               rows={10} 
//               emptyMessage="No assignments found."
//               responsiveLayout="stack"
//             >
//               <Column field="id" header="ID" sortable className="font-mono text-xs text-slate-400" style={{ width: '10%' }}></Column>
//               <Column field="facultyName" header="Faculty" sortable className="font-bold text-slate-700"></Column>
//               <Column field="departmentName" header="Department" sortable className="text-slate-500"></Column>
//               <Column field="courseName" header="Course" sortable className="text-indigo-600 font-semibold"></Column>
//               <Column header="Actions" body={actionTemplate} style={{ width: '15%' }}></Column>
//             </DataTable>
//           </div>
//         </Card>
//       </motion.div>
//     </div>
//   );
// };

// export default CourseAssignPage;



import React, { useState } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { Message } from 'primereact/message';
import { Dialog } from 'primereact/dialog';
import * as XLSX from 'xlsx';
import {
  useGetAssignmentsQuery,
  useAddAssignmentMutation,
  useUpdateAssignmentMutation,
  useDeleteAssignmentMutation,
  useGetFacultyQuery,
  useGetDepartmentsQuery,
  useGetCoursesQuery,
  useBulkUploadAssignmentsMutation
} from '../services/api';
import { motion } from 'motion/react';

const CourseAssignPage = () => {
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  // Bulk Upload States
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [excelData, setExcelData] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [bulkError, setBulkError] = useState(null);
  const [bulkSuccess, setBulkSuccess] = useState(null);

  const { data: assignmentsResponse, isLoading: assignmentsLoading } =
    useGetAssignmentsQuery();
  
  const [bulkUploadAssignments] = useBulkUploadAssignmentsMutation();

  const { data: facultyResponse } = useGetFacultyQuery();
  const { data: departmentsResponse } = useGetDepartmentsQuery();
  const { data: coursesResponse } = useGetCoursesQuery();

  const [addAssignment] = useAddAssignmentMutation();
  const [updateAssignment] = useUpdateAssignmentMutation();
  const [deleteAssignment] = useDeleteAssignmentMutation();

  // Correct API Mapping
  const assignments = assignmentsResponse?.assignments || [];
  const faculty = facultyResponse?.faculties || [];
  const departments = departmentsResponse?.departments || [];
  const courses = coursesResponse?.courses || [];

  // Filter faculty based on selected department
  const filteredFaculty = selectedDepartment
    ? faculty.filter((item) =>
        item.departments?.some(
          (dept) => dept.id === selectedDepartment.id
        )
      )
    : faculty;

  const resetForm = () => {
    setSelectedFaculty(null);
    setSelectedDepartment(null);
    setSelectedCourse(null);
    setEditingId(null);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setBulkError(null);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target.result);
        const wb = XLSX.read(data, { type: 'array' });
        const wsName = wb.SheetNames[0];
        const ws = wb.Sheets[wsName];
        
        // Read raw data
        const rows = XLSX.utils.sheet_to_json(ws, { header: 1 });
        
        if (rows.length === 0) {
          setBulkError("The selected file is empty.");
          setExcelData([]);
          return;
        }

        // Search for headers in the first 10 rows
        let headerRowIndex = -1;
        let colMap = { course: -1, faculty: -1, dept: -1 };

        for (let i = 0; i < Math.min(rows.length, 10); i++) {
          const row = rows[i];
          if (!row || !Array.isArray(row)) continue;

          const courseIdx = row.findIndex(c => String(c || '').toLowerCase().includes('course'));
          const facultyIdx = row.findIndex(c => String(c || '').toLowerCase().includes('faculty'));
          const deptIdx = row.findIndex(c => {
            const s = String(c || '').toLowerCase();
            return s.includes('department') || s === 'dept';
          });

          if (courseIdx !== -1 || facultyIdx !== -1 || deptIdx !== -1) {
            headerRowIndex = i;
            colMap = { course: courseIdx, faculty: facultyIdx, dept: deptIdx };
            break;
          }
        }

        if (headerRowIndex === -1) {
          setBulkError("Could not identify the header row. Please check your file columns.");
          setExcelData([]);
          return;
        }

        const previewData = [];
        for (let i = headerRowIndex + 1; i < rows.length; i++) {
          const row = rows[i];
          if (!row || row.length === 0) continue;

          const courseName = colMap.course !== -1 ? String(row[colMap.course] || '').trim() : '';
          const facultyName = colMap.faculty !== -1 ? String(row[colMap.faculty] || '').trim() : '';
          const deptName = colMap.dept !== -1 ? String(row[colMap.dept] || '').trim() : '';

          if (!courseName && !facultyName && !deptName) continue;

          previewData.push({
            id: i,
            courseName,
            facultyName,
            departmentName: deptName
          });
        }

        if (previewData.length === 0) {
          setBulkError("No valid data rows found.");
          setExcelData([]);
        } else {
          setExcelData(previewData);
          setBulkError(null);
        }
      } catch (err) {
        setBulkError("Failed to parse the Excel file.");
        setExcelData([]);
      }
    };
    reader.onerror = () => {
      setBulkError("Failed to read the file.");
    };
    reader.readAsArrayBuffer(file);
    e.target.value = null;
  };

  const downloadTemplate = () => {
    const ws = XLSX.utils.json_to_sheet([{
      "Course Name": "",
      "Faculty Name": "",
      "Department": ""
    }]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, "bulk_assignment_template.xlsx");
  };

  const handleBulkSubmit = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);

    setIsUploading(true);
    setBulkError(null);
    setBulkSuccess(null);
    try {
      const response = await bulkUploadAssignments(formData).unwrap();
      setBulkSuccess(response.message);
      setExcelData([]);
      setSelectedFile(null);
      // Don't close immediately if there were skips, let admin see it
      if (!response.message.includes("Skipped")) {
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

    if (!selectedFaculty || !selectedDepartment || !selectedCourse) return;

    const payload = {
      facultyId: selectedFaculty.id,
      facultyName: selectedFaculty.facultyName,

      departmentId: selectedDepartment.id,
      departmentName: selectedDepartment.departmentName,

      courseId: selectedCourse.id,
      courseName: selectedCourse.courseName
    };

    try {
      if (editingId) {
        await updateAssignment({
          id: editingId,
          ...payload
        }).unwrap();
      } else {
        await addAssignment(payload).unwrap();
      }

      setSubmitted(true);
      resetForm();

      setTimeout(() => {
        setSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this assignment?')) {
      await deleteAssignment(id).unwrap();
    }
  };

  const handleEdit = (row) => {
    setEditingId(row.id);

    const dept = departments.find((d) => d.id === row.departmentId);
    const fac = faculty.find((f) => f.id === row.facultyId);
    const course = courses.find((c) => c.id === row.courseId);

    setSelectedDepartment(dept || null);
    setSelectedFaculty(fac || null);
    setSelectedCourse(course || null);

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const actionTemplate = (rowData) => {
    return (
      <div className="flex gap-2">
        <Button
          icon="pi pi-pencil"
          className="p-button-warning p-button-rounded p-button-text"
          onClick={() => handleEdit(rowData)}
        />

        <Button
          icon="pi pi-trash"
          className="p-button-danger p-button-rounded p-button-text"
          onClick={() => handleDelete(rowData.id)}
        />
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* Main Card: Assignment Form */}
        <Card className="shadow-2xl rounded-[2.5rem] border-none overflow-hidden mb-12 bg-white/80 backdrop-blur-sm relative">
           <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
             <i className="pi pi-link text-9xl text-white" />
           </div>

          <div className="bg-gradient-to-br from-[#701515] via-[#4a0d0d] to-black p-10 md:p-14 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full -mr-32 -mt-32 blur-[100px]" />
            
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="max-w-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-amber-500/20 text-amber-400 text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-[0.2em] border border-amber-500/20 backdrop-blur-md">Academic Resource Allocation</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-serif font-black text-white mb-4 tracking-tighter">
                  Course Assignment
                </h1>
                <p className="text-red-100/70 text-lg font-medium max-w-2xl leading-relaxed">
                  Strategically link faculty expertise with departments and specific courses to optimize academic delivery.
                </p>
              </div>
              
              <div className="shrink-0">
                <Button
                  type="button"
                  label="Bulk Assignment (.xlsx)"
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
                  <Message severity="success" text={`Academic link ${editingId ? 'updated' : 'established'} successfully in the institutional registry.`} className="w-full rounded-2xl border-none shadow-lg py-4 bg-emerald-50 text-emerald-700 font-bold" />
                </motion.div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {/* Department Selection */}
                <div className="flex flex-col gap-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Department Focus</label>
                  <Dropdown
                    value={selectedDepartment}
                    options={departments}
                    optionLabel="departmentName"
                    onChange={(e) => {
                      setSelectedDepartment(e.value);
                      setSelectedFaculty(null);
                    }}
                    placeholder="Select Department"
                    className="w-full rounded-2xl border-slate-100 bg-slate-50/50 min-h-[64px] flex items-center px-2"
                    filter
                  />
                </div>

                {/* Faculty Selection */}
                <div className="flex flex-col gap-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Faculty Member</label>
                  <Dropdown
                    value={selectedFaculty}
                    options={filteredFaculty}
                    optionLabel="facultyName"
                    onChange={(e) => setSelectedFaculty(e.value)}
                    placeholder="Select Faculty"
                    className="w-full rounded-2xl border-slate-100 bg-slate-50/50 min-h-[64px] flex items-center px-2"
                    filter
                    disabled={!selectedDepartment}
                  />
                </div>

                {/* Course Selection */}
                <div className="flex flex-col gap-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Assigned Course</label>
                  <Dropdown
                    value={selectedCourse}
                    options={courses}
                    optionLabel="courseName"
                    onChange={(e) => setSelectedCourse(e.value)}
                    placeholder="Select Course"
                    className="w-full rounded-2xl border-slate-100 bg-slate-50/50 min-h-[64px] flex items-center px-2"
                    filter
                  />
                </div>
              </div>

              <div className="flex justify-end items-center gap-6 pt-6 border-t border-slate-100">
                {editingId && (
                  <Button
                    type="button"
                    label="Discard Changes"
                    className="p-button-text p-button-secondary font-black text-[10px] uppercase tracking-widest px-8 h-14"
                    onClick={resetForm}
                  />
                )}
                <Button
                  label={editingId ? "Update Assignment" : "Finalize Assignment"}
                  icon={editingId ? "pi pi-sync" : "pi pi-check-circle"}
                  className="rounded-2xl font-black text-[10px] uppercase tracking-widest px-12 h-14 shadow-2xl shadow-red-900/20 border-none transition-all duration-300 hover:scale-105 active:scale-95"
                  style={{ background: 'linear-gradient(135deg, #701515 0%, #4a0d0d 100%)', color: '#fff' }}
                  type="submit"
                />
              </div>
            </form>
          </div>
        </Card>

        {/* List Card: Active Assignments */}
        <Card className="shadow-2xl rounded-[2.5rem] border-none overflow-hidden bg-white/80 backdrop-blur-sm">
          <div className="p-8 md:p-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-1.5 h-6 bg-[#701515] rounded-full"></div>
                  <h2 className="text-3xl font-serif font-black text-slate-900 tracking-tight">Assignment Registry</h2>
                </div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest ml-4">{assignments?.length || 0} active teaching links</p>
              </div>
            </div>

            <div className="rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
              <DataTable
                value={assignments}
                loading={assignmentsLoading}
                className="p-datatable-sm custom-modern-table"
                paginator
                rows={10}
                emptyMessage="No active assignment records synchronized."
                responsiveLayout="stack"
                rowClassName={() => 'hover:bg-slate-50/50 transition-colors duration-200'}
              >
                <Column field="id" header="ID" className="font-bold text-slate-400" />
                <Column field="facultyName" header="Faculty" className="font-bold text-slate-800" />
                <Column field="departmentName" header="Department" className="font-semibold text-slate-500" />
                <Column field="courseName" header="Course" className="font-bold text-[#701515]" />
                <Column header="Actions" body={actionTemplate} />
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
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Matrix Synchronization</span>
              </div>
            </div>
          }
          visible={showBulkUpload}
          style={{ width: '90vw', maxWidth: '800px' }}
          modal
          onHide={() => {
            setShowBulkUpload(false);
            setExcelData([]);
            setBulkError(null);
            setSelectedFile(null);
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
                <p className="text-xl font-black text-slate-800 mb-2 tracking-tight">Drop Assignment Matrix here</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">or click to upload matrix data</p>
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
                <span>Headers: Course Name, Faculty Name, Department</span>
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
                    Data Preview: <span className="text-[#701515]">{selectedFile?.name}</span> ({excelData.length} records)
                  </span>
                </div>
                <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-2xl">
                  <DataTable value={excelData} paginator rows={3} responsiveLayout="scroll" className="p-datatable-sm">
                    <Column field="courseName" header="COURSE" className="font-bold text-slate-600 p-4" />
                    <Column field="faculty" header="FACULTY" className="font-bold text-slate-600 p-4" />
                    <Column field="department" header="DEPT" className="font-bold text-slate-600 p-4" />
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
                label="Commit Assignments"
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

export default CourseAssignPage;