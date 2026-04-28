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
import {
  useGetAssignmentsQuery,
  useAddAssignmentMutation,
  useUpdateAssignmentMutation,
  useDeleteAssignmentMutation,
  useGetFacultyQuery,
  useGetDepartmentsQuery,
  useGetCoursesQuery
} from '../services/api';
import { motion } from 'motion/react';

const CourseAssignPage = () => {
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const { data: assignmentsResponse, isLoading: assignmentsLoading } =
    useGetAssignmentsQuery();

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
    <div className="max-w-7xl mx-auto pb-10">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {/* FORM */}
        <Card className="shadow-2xl rounded-3xl mb-8">
          <div className="bg-gradient-to-r from-orange-500 to-red-600 p-8 rounded-t-3xl text-white mb-8">
            <h1 className="text-4xl font-bold">Course Assignment</h1>
            <p className="mt-2 text-orange-100">
              Assign Faculty with Department and Course
            </p>
          </div>

          <form onSubmit={handleSubmit} className="px-4 pb-6">
            {submitted && (
              <Message
                severity="success"
                text={`Assignment ${
                  editingId ? 'updated' : 'created'
                } successfully`}
                className="mb-5"
              />
            )}

            <div className="grid md:grid-cols-3 gap-5">
              {/* Department */}
              <div>
                <label className="font-semibold block mb-2">
                  Department
                </label>

                <Dropdown
                  value={selectedDepartment}
                  options={departments}
                  optionLabel="departmentName"
                  onChange={(e) => {
                    setSelectedDepartment(e.value);
                    setSelectedFaculty(null);
                  }}
                  placeholder="Select Department"
                  className="w-full"
                  filter
                />
              </div>

              {/* Faculty */}
              <div>
                <label className="font-semibold block mb-2">
                  Faculty
                </label>

                <Dropdown
                  value={selectedFaculty}
                  options={filteredFaculty}
                  optionLabel="facultyName"
                  onChange={(e) => setSelectedFaculty(e.value)}
                  placeholder="Select Faculty"
                  className="w-full"
                  filter
                />
              </div>

              {/* Course */}
              <div>
                <label className="font-semibold block mb-2">
                  Course
                </label>

                <Dropdown
                  value={selectedCourse}
                  options={courses}
                  optionLabel="courseName"
                  onChange={(e) => setSelectedCourse(e.value)}
                  placeholder="Select Course"
                  className="w-full"
                  filter
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              {editingId && (
                <Button
                  type="button"
                  label="Cancel"
                  className="p-button-secondary"
                  onClick={resetForm}
                />
              )}

              <Button
                type="submit"
                label={
                  editingId
                    ? 'Update Assignment'
                    : 'Create Assignment'
                }
                icon="pi pi-check"
                className="p-button-success"
              />
            </div>
          </form>
        </Card>

        {/* TABLE */}
        <Card className="shadow-2xl rounded-3xl">
          <div className="mb-5">
            <h2 className="text-2xl font-bold">
              Active Assignments
            </h2>
          </div>

          <DataTable
            value={assignments}
            paginator
            rows={10}
            loading={assignmentsLoading}
            responsiveLayout="scroll"
            emptyMessage="No assignments found"
          >
            <Column field="id" header="ID" sortable />
            <Column field="facultyName" header="Faculty" sortable />
            <Column
              field="departmentName"
              header="Department"
              sortable
            />
            <Column field="courseName" header="Course" sortable />
            <Column
              header="Action"
              body={actionTemplate}
            />
          </DataTable>
        </Card>
      </motion.div>
    </div>
  );
};

export default CourseAssignPage;