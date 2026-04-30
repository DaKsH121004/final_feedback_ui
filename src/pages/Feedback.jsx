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

  // 🏫 School
  const schoolTemplate = (row) => row.school?.schoolName || 'N/A';

  // 🏢 Department
  const deptTemplate = (row) => row.department?.departmentName || 'N/A';

  // 👨‍🏫 Faculty
  const facultyTemplate = (row) => row.faculty?.facultyName || 'N/A';

  // 📘 Course
  const courseTemplate = (row) => row.course?.courseName || 'N/A';

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
        
        {/* Institutional Feedback Registry Header */}
        <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-2 h-6 bg-[#701515] rounded-full"></div>
              <h1 className="text-4xl md:text-5xl font-serif font-black text-slate-900 tracking-tighter">
                Feedback <span className="text-[#701515]">Repository</span>
              </h1>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-5">
              Comprehensive Archive of Institutional Performance Metrics
            </p>
          </div>
          
          <div className="flex flex-col items-end gap-3">
            <div className="bg-amber-50 px-4 py-2 rounded-xl border border-amber-100 flex items-center gap-3 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
              <span className="text-xs font-black text-slate-700 uppercase tracking-widest">{feedbacks.length} Registered Submissions</span>
            </div>
            <Button 
              label="Export Dossier (.xlsx)" 
              icon="pi pi-file-excel" 
              className="p-button-text p-button-secondary font-black text-[10px] uppercase tracking-widest border-2 border-slate-100 rounded-2xl px-8 h-12 hover:bg-slate-50 transition-all" 
              onClick={downloadExcel} 
              disabled={!data?.feedbacks?.length} 
            />
          </div>
        </div>

        {/* Feedback Data Table Card */}
        <Card className="shadow-2xl rounded-[2.5rem] border-none overflow-hidden bg-white/80 backdrop-blur-md relative">
          <div className="p-2 md:p-6">
            <DataTable
              value={feedbacks}
              loading={isLoading}
              paginator
              rows={10}
              responsiveLayout="stack"
              emptyMessage="No institutional records found in the current feedback cycle."
              className="p-datatable-sm custom-modern-table"
              rowClassName={() => 'hover:bg-slate-50/50 transition-colors duration-200'}
            >

              <Column 
                header="ACADEMIC UNIT" 
                body={(row) => (
                  <div className="flex flex-col gap-1 py-2">
                    <span className="text-[10px] font-black text-[#701515] uppercase tracking-widest">{row.school?.schoolName || 'N/A'}</span>
                    <span className="text-xs font-bold text-slate-600">{row.department?.departmentName || 'N/A'}</span>
                  </div>
                )}
                className="px-6"
              />

              <Column 
                header="SESSION" 
                body={(row) => (
                  <div className="flex items-center gap-2">
                    <div className="bg-slate-100 px-2 py-1 rounded-md text-[10px] font-black text-slate-500 uppercase tracking-tighter">SEM {row.semester}</div>
                    <div className="bg-amber-50 px-2 py-1 rounded-md text-[10px] font-black text-amber-600 uppercase tracking-tighter">SEC {row.classSection}</div>
                  </div>
                )}
              />

              <Column 
                header="PROFESSIONAL DETAILS" 
                body={(row) => (
                  <div className="flex flex-col gap-1 py-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-red-50 flex items-center justify-center text-[#701515] font-black text-[10px] border border-red-100">
                        {row.faculty?.facultyName?.charAt(0)}
                      </div>
                      <span className="font-black text-slate-800 text-sm tracking-tight">{row.faculty?.facultyName || 'N/A'}</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-8">{row.course?.courseName || 'N/A'}</span>
                  </div>
                )}
              />

              <Column 
                header="PERFORMANCE" 
                body={ratingTag} 
                className="text-center"
                style={{ width: '120px' }}
              />

              <Column 
                field="remarks" 
                header="STUDENT INSIGHTS" 
                className="px-6 italic text-slate-500 text-xs font-medium"
                body={(row) => row.remarks || <span className="text-slate-300 font-bold uppercase text-[9px] tracking-widest">No Remarks Provided</span>}
              />

              <Column 
                field="createdAt" 
                header="TIMESTAMP"
                className="px-6 font-black text-slate-400 text-[10px] uppercase tracking-widest"
                body={(row) => (
                  <div className="flex flex-col">
                    <span>{new Date(row.createdAt).toLocaleDateString()}</span>
                    <span className="opacity-60">{new Date(row.createdAt).toLocaleTimeString()}</span>
                  </div>
                )}
                style={{ width: '150px' }}
              />

            </DataTable>
          </div>
        </Card>

        {/* Security Footer */}
        <div className="mt-8 flex justify-center">
           <div className="bg-slate-100/50 backdrop-blur-sm px-6 py-3 rounded-2xl border border-slate-200 flex items-center gap-3">
              <i className="pi pi-shield text-emerald-500 text-xs"></i>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Institutional Data Integrity Verified · 2026</span>
           </div>
        </div>

      </motion.div>
    </div>
  );
};

export default FeedbackList;