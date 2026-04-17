import React, { useState } from "react";
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Rating } from "primereact/rating";
import { Calendar } from "primereact/calendar";
import { Message } from "primereact/message";
import { motion } from "motion/react";

import {
  useGetFormStatusQuery,
  useGetSchoolsQuery,
  useGetDepartmentsQuery,
  useGetFacultyQuery,
  useGetCoursesQuery,
  useAddFeedbackMutation,
  useValidateFormQuery,
} from "../services/api";

import { RATING_QUESTIONS } from "../constants";
import { useParams } from "react-router-dom";



const CreateFormPage = () => {
  const { token } = useParams();
  const { data: formStatus, isLoading: statusLoading } =
    useGetFormStatusQuery();
  const { data: schools } = useGetSchoolsQuery();
  const { data: departments } = useGetDepartmentsQuery();
  const { data: faculty } = useGetFacultyQuery();
  const { data: courses } = useGetCoursesQuery();

  const [addFeedback, { isLoading }] = useAddFeedbackMutation();
  const { data: validation, isLoading:loading, isError } = useValidateFormQuery(token, {
    skip: !token,
  });

  const [formData, setFormData] = useState({
    submittedAt: new Date(),
    // studentName: "",
    // studentRollNumber: "",
    // studentEmail: "",
    schoolId: null,
    departmentId: null,
    semester: "",
    classSection: "",
    facultyId: null,
    courseId: null,
    q1: 0,
    q2: 0,
    q3: 0,
    q4: 0,
    q5: 0,
    comments: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // 🔥 Smart filtering
  const filteredDepartments = departments?.departments?.filter(
    (d) => d.school.id === formData.schoolId,
  );

  const filteredFaculty = faculty?.faculties?.filter((f) =>
    f.departments?.some((d) => d.id === formData.departmentId),
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Basic validation
    if (
      // !formData.studentName ||
      // !formData.studentRollNumber ||
      // !formData.studentEmail ||
      !formData.schoolId ||
      !formData.departmentId ||
      !formData.facultyId ||
      !formData.courseId
    ) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const payload = {
        // studentName: formData.studentName,
        // studentRollNo: formData.studentRollNumber, // ✅ important key
        // studentEmail: formData.studentEmail,
        schoolId: formData.schoolId,
        departmentId: formData.departmentId,
        semester: Number(formData.semester),
        classSection: formData.classSection,
        facultyId: formData.facultyId,
        courseId: formData.courseId,
        q1: formData.q1,
        q2: formData.q2,
        q3: formData.q3,
        q4: formData.q4,
        q5: formData.q5,
        remarks: formData.comments,
      };

      console.log("Sending Payload:", payload); // 🔥 debug

      await addFeedback(payload).unwrap();

      setSubmitted(true);

      // reset form
      setFormData({
        submittedAt: new Date(),
        // studentName: "",
        // studentRollNumber: "",
        // studentEmail: "",
        schoolId: null,
        departmentId: null,
        semester: "",
        classSection: "",
        facultyId: null,
        courseId: null,
        q1: 0,
        q2: 0,
        q3: 0,
        q4: 0,
        q5: 0,
        comments: "",
      });

      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      console.error("API Error:", err);
      alert(err?.data?.message || "Failed to submit feedback");
    }
  };

  // if (!token || isLoading) return <Loading />;

if (isError || validation?.valid === false){
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <h2 className="text-xl font-bold text-red-500">Form Closed</h2>
        <p className="text-sm text-slate-500">
          This link is invalid or expired
        </p>
      </div>
    </div>
  );
}

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {statusLoading ? (
          <p>Loading...</p>
        ) : formStatus?.data?.feedbackEnabled === false ? (
          <p>Form Closed</p>
        ) : (
          <Card className="rounded-2xl border border-slate-200 bg-white px-8 py-10">
            {/* HEADER */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900">
                Submit Feedback
              </h2>
              <p className="text-sm text-slate-500">
                Fill the form below to provide your feedback
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-10">
              {/* SUCCESS */}
              {submitted && (
                <Message
                  severity="success"
                  text="Feedback submitted successfully!"
                />
              )}

              {/* ---------------- STUDENT INFO ---------------- */}
              {/* <div>
                <h3 className="text-sm font-bold text-slate-500 uppercase mb-4">
                  Student Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputText
                    placeholder="Student Name"
                    value={formData.studentName}
                    onChange={(e) => updateField("studentName", e.target.value)}
                    className="p-3"
                  />

                  <InputText
                    placeholder="Roll Number"
                    value={formData.studentRollNumber}
                    onChange={(e) =>
                      updateField("studentRollNumber", e.target.value)
                    }
                    className="p-3"
                  />

                  <InputText
                    placeholder="Email"
                    value={formData.studentEmail}
                    onChange={(e) =>
                      updateField("studentEmail", e.target.value)
                    }
                    className="p-3 md:col-span-2"
                  />
                </div>
              </div> */}

              {/* ---------------- ACADEMIC DETAILS ---------------- */}
              <div>
                <h3 className="text-sm font-bold text-slate-500 uppercase mb-4">
                  Academic Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Dropdown
                    value={formData.schoolId}
                    options={schools?.schools || []}
                    optionLabel="schoolName"
                    optionValue="id"
                    onChange={(e) => updateField("schoolId", e.value)}
                    placeholder="Select School"
                    className="w-full"
                    filter
                  />

                  <Dropdown
                    value={formData.departmentId}
                    options={filteredDepartments || []}
                    optionLabel="departmentName"
                    optionValue="id"
                    onChange={(e) => updateField("departmentId", e.value)}
                    placeholder="Select Department"
                    className="w-full"
                    filter
                  />

                  <Dropdown
                    value={formData.facultyId}
                    options={filteredFaculty || []}
                    optionLabel="facultyName"
                    optionValue="id"
                    onChange={(e) => updateField("facultyId", e.value)}
                    placeholder="Select Faculty"
                    className="w-full"
                    filter
                  />

                  <Dropdown
                    value={formData.courseId}
                    options={courses?.courses || []}
                    optionLabel="courseName"
                    optionValue="id"
                    onChange={(e) => updateField("courseId", e.value)}
                    placeholder="Select Course"
                    className="w-full"
                    filter
                  />

                  <InputText
                    placeholder="Semester"
                    value={formData.semester}
                    onChange={(e) => updateField("semester", e.target.value)}
                    className="p-3"
                  />

                  <InputText
                    placeholder="Class Section"
                    value={formData.classSection}
                    onChange={(e) =>
                      updateField("classSection", e.target.value)
                    }
                    className="p-3"
                  />
                </div>
              </div>

              {/* ---------------- RATINGS ---------------- */}
              <div>
                <h3 className="text-sm font-bold text-slate-500 uppercase mb-4">
                  Feedback Ratings
                </h3>

                <div className="flex flex-col gap-5">
                  {RATING_QUESTIONS.map((q) => (
                    <div
                      key={q.id}
                      className="flex items-center justify-between bg-slate-50 px-4 py-3 rounded-xl border border-slate-200"
                    >
                      <span className="text-sm font-medium text-slate-700">
                        {q.label}
                      </span>

                      <Rating
                        value={formData[q.id]}
                        onChange={(e) => updateField(q.id, e.value)}
                        cancel={false}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* ---------------- REMARKS ---------------- */}
              <div>
                <h3 className="text-sm font-bold text-slate-500 uppercase mb-4">
                  Additional Remarks
                </h3>

                <textarea
                  placeholder="Write your comments..."
                  value={formData.comments}
                  onChange={(e) => updateField("comments", e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows={4}
                />
              </div>

              {/* ---------------- SUBMIT ---------------- */}
              <div className="flex justify-end">
                <Button
                  label="Submit Feedback"
                  type="submit"
                  loading={isLoading}
                  className="px-8 py-3 font-bold rounded-xl bg-indigo-600 border-none"
                />
              </div>
            </form>
          </Card>
        )}
      </motion.div>
    </div>
  );
};

export default CreateFormPage;
