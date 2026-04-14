import React from 'react';
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { useGetAllFeedbacksQuery } from '../services/api';
import { motion } from 'motion/react';

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

  return (
    <div className="p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

        <Card className="shadow-xl rounded-2xl border-none">

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">All Feedbacks</h2>
            <span className="text-sm text-gray-500">
              Total: {feedbacks.length}
            </span>
          </div>

          <DataTable
            value={feedbacks}
            loading={isLoading}
            paginator
            rows={10}
            responsiveLayout="scroll"
            emptyMessage="No feedback found"
            className="p-datatable-sm"
          >

            <Column field="studentName" header="Student" sortable />
            <Column field="studentRollNo" header="Roll No" />

            <Column header="School" body={schoolTemplate} />
            <Column header="Department" body={deptTemplate} />

            <Column field="semester" header="Sem" />
            <Column field="classSection" header="Section" />

            <Column header="Faculty" body={facultyTemplate} />
            <Column header="Course" body={courseTemplate} />

            <Column header="Avg Rating" body={ratingTag} />

            <Column field="remarks" header="Remarks" />

            <Column 
              field="createdAt" 
              header="Date"
              body={(row) => new Date(row.createdAt).toLocaleString()}
            />

          </DataTable>

        </Card>

      </motion.div>
    </div>
  );
};

export default FeedbackList;