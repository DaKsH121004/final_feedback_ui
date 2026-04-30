import React from 'react';
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { useGetAllFeedbacksQuery } from '../services/api';
import { motion } from 'motion/react';
import { Button } from 'primereact/button';
import * as XLSX from 'xlsx';

const FeedbackList = () => {

  const { data, isLoading } = useGetAllFeedbacksQuery();

  const feedbacks = data?.feedbacks || [];

  // ⭐ Average Rating
  const avgRatingTemplate = (row) => {
    const avg = (row.q1 + row.q2 + row.q3 + row.q4 + row.q5) / 5;
    return <span className="font-bold text-indigo-600">{avg.toFixed(1)}</span>;
  };


  // 📊 Rating Tag
  const ratingTag = (row) => {
    const avg = (row.q1 + row.q2 + row.q3 + row.q4 + row.q5) / 5;
    return (
      <Tag 
        value={avg.toFixed(1)} 
        severity={avg >= 4 ? 'success' : avg >= 3 ? 'warning' : 'danger'} 
      />
    );
  };

  const downloadExcel = () => {
  const dataToExport = (data?.feedbacks || []).map((row) => ({

    School: row.school?.schoolName || "N/A",
    Department: row.department?.departmentName || "N/A",

    Semester: row.semester,
    Section: row.classSection,

    Faculty: row.faculty?.facultyName || "N/A",
    Course: row.course?.courseName || "N/A",

    Q1: row.q1,
    Q2: row.q2,
    Q3: row.q3,
    Q4: row.q4,
    Q5: row.q5,

    AvgRating: (
      (row.q1 + row.q2 + row.q3 + row.q4 + row.q5) / 5
    ).toFixed(1),

    Remarks: row.remarks,

    Date: new Date(row.createdAt).toLocaleString(),
  }));

  const worksheet = XLSX.utils.json_to_sheet(dataToExport);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Feedback");
  XLSX.writeFile(workbook, "Feedback.xlsx");
};

  return (
    <div className="max-w-full space-y-10 p-4 md:p-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        
        {/* Institutional Header */}
        <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-2 h-6 bg-[#701515] rounded-full"></div>
              <h1 className="text-4xl md:text-5xl font-serif font-black text-slate-900 tracking-tighter">
                All <span className="text-[#701515]">Feedbacks</span>
              </h1>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-5">
              Comprehensive Registry of Institutional Feedback Submissions
            </p>
          </div>
          
          <div className="flex flex-col items-end gap-3">
            <div className="bg-amber-50 px-4 py-2 rounded-xl border border-amber-100 flex items-center gap-3 shadow-sm">
              <span className="text-xs font-black text-slate-700 uppercase tracking-widest">Total: {feedbacks.length}</span>
            </div>
            <Button 
              label="Export to Excel" 
              icon="pi pi-download" 
              className="p-button-outlined p-button-secondary font-black text-[10px] uppercase tracking-widest border-2 rounded-2xl px-8 h-12 hover:bg-slate-50 transition-all" 
              onClick={downloadExcel} 
              disabled={!data?.feedbacks?.length} 
            />
          </div>
        </div>

        {/* Data Registry Card */}
        <Card className="shadow-2xl rounded-[2.5rem] border-none overflow-hidden bg-white relative">
          <div className="p-2 md:p-6">
            <DataTable
              value={feedbacks}
              loading={isLoading}
              paginator
              rows={10}
              responsiveLayout="scroll"
              emptyMessage="No feedback found"
              className="p-datatable-sm custom-modern-table"
              rowClassName={() => 'hover:bg-slate-50/50 transition-colors duration-200'}
            >
              <Column field="school.schoolName" header="School" className="font-semibold text-slate-600" />
              <Column field="department.departmentName" header="Department" className="font-semibold text-slate-600" />
              <Column field="semester" header="Sem" className="text-center font-bold text-slate-500" />
              <Column field="classSection" header="Section" className="text-center font-bold text-slate-500" />
              <Column field="faculty.facultyName" header="Faculty" className="font-bold text-slate-700" />
              <Column field="course.courseName" header="Course" className="font-bold text-[#701515]" />
              <Column header="Avg Rating" body={ratingTag} className="text-center" />
              <Column field="remarks" header="Remarks" className="italic text-slate-500 text-xs" />
              <Column 
                field="createdAt" 
                header="Date"
                body={(row) => new Date(row.createdAt).toLocaleString()}
                className="text-slate-400 text-xs font-medium"
              />
            </DataTable>
          </div>
        </Card>

        {/* Footer Accent */}
        <div className="mt-8 flex justify-center">
           <div className="bg-slate-100/50 px-6 py-3 rounded-2xl border border-slate-200 flex items-center gap-3">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Manav Rachna University · Session 2026</span>
           </div>
        </div>

      </motion.div>
    </div>
  );
};

export default FeedbackList;