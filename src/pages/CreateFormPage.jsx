// import React, { useState } from "react";
// import { Card } from "primereact/card";
// import { Dropdown } from "primereact/dropdown";
// import { InputText } from "primereact/inputtext";
// import { Button } from "primereact/button";
// import { Rating } from "primereact/rating";
// import { Calendar } from "primereact/calendar";
// import { Message } from "primereact/message";
// import { motion } from "motion/react";

// import {
//   useGetFormStatusQuery,
//   useGetSchoolsQuery,
//   useGetDepartmentsQuery,
//   useGetFacultyQuery,
//   useGetCoursesQuery,
//   useAddFeedbackMutation,
//   useValidateFormQuery,
// } from "../services/api";

// import { classSection, RATING_QUESTIONS, semester } from "../constants";
// import { useParams } from "react-router-dom";



// const CreateFormPage = () => {
//   const { token } = useParams();
//   const { data: formStatus, isLoading: statusLoading } =
//     useGetFormStatusQuery();
//   const { data: schools } = useGetSchoolsQuery();
//   const { data: departments } = useGetDepartmentsQuery();
//   const { data: faculty } = useGetFacultyQuery();
//   const { data: courses } = useGetCoursesQuery();

//   const [addFeedback, { isLoading }] = useAddFeedbackMutation();
//   const { data: validation, isLoading: loading, isError } = useValidateFormQuery(token, {
//     skip: !token,
//   });

//   const [formData, setFormData] = useState({
//     submittedAt: new Date(),
//     // studentName: "",
//     // studentRollNumber: "",
//     // studentEmail: "",
//     schoolId: null,
//     departmentId: null,
//     semester: null,
//     classSection: "",
//     facultyId: null,
//     courseId: null,
//     q1: 0,
//     q2: 0,
//     q3: 0,
//     q4: 0,
//     q5: 0,
//     comments: "",
//   });

//   const [submitted, setSubmitted] = useState(false);

//   const updateField = (field, value) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//   };

//   // 🔥 Smart filtering
//   const filteredDepartments = departments?.departments?.filter(
//     (d) => d.school.id === formData.schoolId,
//   );

//   const filteredFaculty = faculty?.faculties?.filter((f) =>
//     f.departments?.some((d) => d.id === formData.departmentId),
//   );

//   const selectedDepartment = departments?.departments?.find(
//     (d) => d.id === formData.departmentId
//   );

//   const cleanDeptName = selectedDepartment?.departmentName?.trim();

// const availableSections = classSection[cleanDeptName] || [];

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // ✅ Basic validation
//     if (
//       // !formData.studentName ||
//       // !formData.studentRollNumber ||
//       // !formData.studentEmail ||
//       !formData.schoolId ||
//       !formData.departmentId ||
//       !formData.facultyId ||
//       !formData.courseId
//     ) {
//       alert("Please fill all required fields");
//       return;
//     }

//     try {
//       const payload = {
//         // studentName: formData.studentName,
//         // studentRollNo: formData.studentRollNumber, // ✅ important key
//         // studentEmail: formData.studentEmail,
//         schoolId: formData.schoolId,
//         departmentId: formData.departmentId,
//         semester: Number(formData.semester),
//         classSection: formData.classSection,
//         facultyId: formData.facultyId,
//         courseId: formData.courseId,
//         q1: formData.q1,
//         q2: formData.q2,
//         q3: formData.q3,
//         q4: formData.q4,
//         q5: formData.q5,
//         remarks: formData.comments,
//       };

//       console.log("Sending Payload:", payload); // 🔥 debug

//       await addFeedback(payload).unwrap();

//       setSubmitted(true);

//       // reset form
//       setFormData({
//         submittedAt: new Date(),
//         // studentName: "",
//         // studentRollNumber: "",
//         // studentEmail: "",
//         schoolId: null,
//         departmentId: null,
//         semester: "",
//         classSection: "",
//         facultyId: null,
//         courseId: null,
//         q1: 0,
//         q2: 0,
//         q3: 0,
//         q4: 0,
//         q5: 0,
//         comments: "",
//       });

//       setTimeout(() => setSubmitted(false), 3000);
//     } catch (err) {
//       console.error("API Error:", err);
//       alert(err?.data?.message || "Failed to submit feedback");
//     }
//   };

//   // if (!token || isLoading) return <Loading />;

//   if (isError || validation?.valid === false) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-slate-50">
//         <div className="text-center">
//           <h2 className="text-xl font-bold text-red-500">Form Closed</h2>
//           <p className="text-sm text-slate-500">
//             This link is invalid or expired
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-4xl mx-auto pb-12">
//       <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
//         {statusLoading ? (
//           <p>Loading...</p>
//         ) : formStatus?.data?.feedbackEnabled === false ? (
//           <p>Form Closed</p>
//         ) : (
//           <Card className="rounded-2xl border border-slate-200 bg-white px-8 py-10">
//             {/* HEADER */}
//             <div className="mb-8">
//               <h2 className="text-2xl font-bold text-slate-900">
//                 Submit Feedback
//               </h2>
//               <p className="text-sm text-slate-500">
//                 Fill the form below to provide your feedback
//               </p>
//             </div>

//             <form onSubmit={handleSubmit} className="flex flex-col gap-10">
//               {/* SUCCESS */}
//               {submitted && (
//                 <Message
//                   severity="success"
//                   text="Feedback submitted successfully!"
//                 />
//               )}

//               {/* ---------------- STUDENT INFO ---------------- */}
//               {/* <div>
//                 <h3 className="text-sm font-bold text-slate-500 uppercase mb-4">
//                   Student Information
//                 </h3>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <InputText
//                     placeholder="Student Name"
//                     value={formData.studentName}
//                     onChange={(e) => updateField("studentName", e.target.value)}
//                     className="p-3"
//                   />

//                   <InputText
//                     placeholder="Roll Number"
//                     value={formData.studentRollNumber}
//                     onChange={(e) =>
//                       updateField("studentRollNumber", e.target.value)
//                     }
//                     className="p-3"
//                   />

//                   <InputText
//                     placeholder="Email"
//                     value={formData.studentEmail}
//                     onChange={(e) =>
//                       updateField("studentEmail", e.target.value)
//                     }
//                     className="p-3 md:col-span-2"
//                   />
//                 </div>
//               </div> */}

//               {/* ---------------- ACADEMIC DETAILS ---------------- */}
//               <div>
//                 <h3 className="text-sm font-bold text-slate-500 uppercase mb-4">
//                   Academic Details
//                 </h3>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <Dropdown
//                     value={formData.schoolId}
//                     options={schools?.schools || []}
//                     optionLabel="schoolName"
//                     optionValue="id"
//                     onChange={(e) => updateField("schoolId", e.value)}
//                     placeholder="Select School"
//                     className="w-full"
//                     filter
//                   />

//                   <Dropdown
//                     value={formData.departmentId}
//                     options={filteredDepartments || []}
//                     optionLabel="departmentName"
//                     optionValue="id"
//                     onChange={(e) => {
//                       updateField("departmentId", e.value);
//                       updateField("classSection", "");
//                     }}
//                     placeholder="Select Department"
//                     className="w-full"
//                     filter
//                   />

//                   <Dropdown
//                     value={formData.facultyId}
//                     options={filteredFaculty || []}
//                     optionLabel="facultyName"
//                     optionValue="id"
//                     onChange={(e) => updateField("facultyId", e.value)}
//                     placeholder="Select Faculty"
//                     className="w-full"
//                     filter
//                   />

//                   <Dropdown
//                     value={formData.courseId}
//                     options={courses?.courses || []}
//                     optionLabel="courseName"
//                     optionValue="id"
//                     onChange={(e) => updateField("courseId", e.value)}
//                     placeholder="Select Course"
//                     className="w-full"
//                     filter
//                   />

//                   <Dropdown
//                     value={formData.semester}
//                     options={semester}
//                     onChange={(e) => updateField("semester", e.value)}
//                     placeholder="Select Semester"
//                     className="w-full"
//                     filter
//                   />

//                   <Dropdown
//                     value={formData.classSection}
//                     options={availableSections}
//                     onChange={(e) => updateField("classSection", e.value)}
//                     placeholder="Select Class Section"
//                     className="w-full"
//                     disabled={!formData.departmentId}
//                   />
//                 </div>
//               </div>

//               {/* ---------------- RATINGS ---------------- */}
//               <div>
//                 <h3 className="text-sm font-bold text-slate-500 uppercase mb-4">
//                   Feedback Ratings
//                 </h3>

//                 <div className="flex flex-col gap-5">
//                   {RATING_QUESTIONS.map((q) => (
//                     <div
//                       key={q.id}
//                       className="flex items-center justify-between bg-slate-50 px-4 py-3 rounded-xl border border-slate-200"
//                     >
//                       <span className="text-sm font-medium text-slate-700">
//                         {q.label}
//                       </span>

//                       <Rating
//                         value={formData[q.id]}
//                         onChange={(e) => updateField(q.id, e.value)}
//                         cancel={false}
//                       />
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* ---------------- REMARKS ---------------- */}
//               <div>
//                 <h3 className="text-sm font-bold text-slate-500 uppercase mb-4">
//                   Additional Remarks
//                 </h3>

//                 <textarea
//                   placeholder="Write your comments..."
//                   value={formData.comments}
//                   onChange={(e) => updateField("comments", e.target.value)}
//                   className="w-full border border-slate-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                   rows={4}
//                 />
//               </div>

//               {/* ---------------- SUBMIT ---------------- */}
//               <div className="flex justify-end">
//                 <Button
//                   label="Submit Feedback"
//                   type="submit"
//                   loading={isLoading}
//                   className="px-8 py-3 font-bold rounded-xl bg-indigo-600 border-none"
//                 />
//               </div>
//             </form>
//           </Card>
//         )}
//       </motion.div>
//     </div>
//   );
// };

// export default CreateFormPage;



import React, { useState } from "react";
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Rating } from "primereact/rating";
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

import { classSection, RATING_QUESTIONS, semester } from "../constants";
import { useParams } from "react-router-dom";


/* ─── Manav Rachna Brand Tokens ─── */
const MR = {
  maroon: "#7B1C1C",
  maroonDark: "#5A1414",
  maroonLight: "#9B2C2C",
  gold: "#C9A84C",
  goldLight: "#E8C97A",
  cream: "#FDF8F0",
  white: "#FFFFFF",
  slate50: "#F8FAFC",
  slate200: "#E2E8F0",
  slate500: "#64748B",
  slate700: "#334155",
  slate900: "#0F172A",
};

/* ─── Inline styles ─── */
const styles = {
  page: {
    minHeight: "100vh",
    background: `linear-gradient(160deg, ${MR.cream} 0%, #f5ede0 50%, #ede0d0 100%)`,
    fontFamily: "'Georgia', 'Times New Roman', serif",
  },

  /* Top stripe */
  topStripe: {
    height: 5,
    background: `linear-gradient(90deg, ${MR.maroonDark}, ${MR.gold}, ${MR.maroon})`,
  },

  /* Header */
  header: {
    background: `linear-gradient(135deg, ${MR.maroonDark} 0%, ${MR.maroon} 60%, ${MR.maroonLight} 100%)`,
    boxShadow: "0 4px 24px rgba(91,20,20,0.35)",
  },
  headerInner: {
    maxWidth: 900,
    margin: "0 auto",
    padding: "18px 32px",
    display: "flex",
    alignItems: "center",
    gap: 20,
  },
  logoWrap: {
    // background: MR.white,
    borderRadius: 12,
    padding: "6px 10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    // boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
    flexShrink: 0,
  },
  logoImg: {
    height: 56,
    width: "auto",
    display: "block",
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    color: MR.white,
    fontSize: 22,
    fontWeight: 700,
    letterSpacing: "0.02em",
    margin: 0,
    lineHeight: 1.2,
    fontFamily: "'Georgia', serif",
  },
  headerSubtitle: {
    color: MR.goldLight,
    fontSize: 12.5,
    margin: "3px 0 0",
    fontFamily: "'Georgia', serif",
    letterSpacing: "0.04em",
    fontStyle: "italic",
  },
  headerBadge: {
    background: `linear-gradient(135deg, ${MR.gold}, ${MR.goldLight})`,
    color: MR.maroonDark,
    fontSize: 11,
    fontWeight: 700,
    padding: "5px 14px",
    borderRadius: 20,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    whiteSpace: "nowrap",
    fontFamily: "'Georgia', serif",
  },

  /* Sub-header ribbon */
  ribbon: {
    background: `linear-gradient(90deg, ${MR.gold} 0%, ${MR.goldLight} 50%, ${MR.gold} 100%)`,
    textAlign: "center",
    padding: "7px 16px",
    fontSize: 12,
    fontWeight: 600,
    color: MR.maroonDark,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    fontFamily: "'Georgia', serif",
  },

  /* Content wrapper */
  content: {
    maxWidth: 860,
    margin: "0 auto",
    padding: "36px 24px 60px",
  },

  /* Card */
  card: {
    background: MR.white,
    borderRadius: 18,
    boxShadow:
      "0 8px 40px rgba(91,20,20,0.12), 0 2px 8px rgba(91,20,20,0.06)",
    overflow: "hidden",
    border: `1.5px solid rgba(201,168,76,0.3)`,
  },

  /* Gold top accent bar on card */
  cardAccent: {
    height: 4,
    background: `linear-gradient(90deg, ${MR.maroon}, ${MR.gold}, ${MR.maroon})`,
  },

  cardBody: {
    padding: "36px 40px 40px",
  },

  /* Form header */
  formHeader: {
    marginBottom: 32,
    paddingBottom: 20,
    borderBottom: `2px solid ${MR.slate200}`,
    display: "flex",
    alignItems: "flex-start",
    gap: 16,
  },
  formHeaderIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    background: `linear-gradient(135deg, ${MR.maroon}, ${MR.maroonLight})`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    color: MR.white,
    fontSize: 22,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: 700,
    color: MR.maroonDark,
    margin: 0,
    fontFamily: "'Georgia', serif",
  },
  formSubtitle: {
    fontSize: 13,
    color: MR.slate500,
    margin: "4px 0 0",
    fontFamily: "sans-serif",
  },

  /* Section heading */
  sectionHeading: {
    fontSize: 11,
    fontWeight: 700,
    color: MR.maroon,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    marginBottom: 16,
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontFamily: "sans-serif",
  },
  sectionLine: {
    flex: 1,
    height: 1,
    background: `linear-gradient(90deg, rgba(201,168,76,0.5), transparent)`,
  },

  /* Grid */
  grid2: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 18,
  },

  /* Rating row */
  ratingRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: MR.slate50,
    padding: "14px 18px",
    borderRadius: 12,
    border: `1px solid ${MR.slate200}`,
    gap: 12,
  },
  ratingLabel: {
    fontSize: 13.5,
    fontWeight: 500,
    color: MR.slate700,
    fontFamily: "sans-serif",
    flex: 1,
  },

  /* Textarea */
  textarea: {
    width: "100%",
    border: `1.5px solid ${MR.slate200}`,
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    fontFamily: "sans-serif",
    color: MR.slate700,
    resize: "vertical",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  },

  /* Submit button */
  submitBtn: {
    background: `linear-gradient(135deg, ${MR.maroonDark}, ${MR.maroon})`,
    border: "none",
    color: MR.white,
    padding: "12px 36px",
    borderRadius: 10,
    fontWeight: 700,
    fontSize: 14,
    letterSpacing: "0.04em",
    fontFamily: "sans-serif",
    cursor: "pointer",
    boxShadow: "0 4px 16px rgba(91,20,20,0.25)",
    transition: "transform 0.15s, box-shadow 0.15s",
  },

  /* Footer */
  footer: {
    textAlign: "center",
    padding: "16px 24px",
    fontSize: 12,
    color: MR.slate500,
    background: `linear-gradient(135deg, ${MR.maroonDark}, ${MR.maroon})`,
    color: MR.goldLight,
    fontFamily: "sans-serif",
    letterSpacing: "0.03em",
  },
};

/* ─── Section Heading Component ─── */
const SectionHeading = ({ children }) => (
  <div style={styles.sectionHeading}>
    <span>{children}</span>
    <span style={styles.sectionLine} />
  </div>
);

/* ─── Main Component ─── */
const CreateFormPage = () => {
  const { token } = useParams();
  const { data: formStatus, isLoading: statusLoading } = useGetFormStatusQuery();
  const { data: schools } = useGetSchoolsQuery();
  const { data: departments } = useGetDepartmentsQuery();
  const { data: faculty } = useGetFacultyQuery();
  const { data: courses } = useGetCoursesQuery();

  const [addFeedback, { isLoading }] = useAddFeedbackMutation();
  const {
    data: validation,
    isLoading: loading,
    isError,
  } = useValidateFormQuery(token, { skip: !token });

  const [formData, setFormData] = useState({
    submittedAt: new Date(),
    schoolId: null,
    departmentId: null,
    semester: null,
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

  const updateField = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const filteredDepartments = departments?.departments?.filter(
    (d) => d.school.id === formData.schoolId
  );
  const filteredFaculty = faculty?.faculties?.filter((f) =>
    f.departments?.some((d) => d.id === formData.departmentId)
  );
  const selectedDepartment = departments?.departments?.find(
    (d) => d.id === formData.departmentId
  );
  const cleanDeptName = selectedDepartment?.departmentName?.trim();
  const availableSections = classSection[cleanDeptName] || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
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
      await addFeedback(payload).unwrap();
      setSubmitted(true);
      setFormData({
        submittedAt: new Date(),
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

  /* ── Error / Invalid State ── */
  if (isError || validation?.valid === false) {
    return (
      <div style={styles.page}>
        <div style={styles.topStripe} />
        <header style={styles.header}>
          <div style={styles.headerInner}>
            <div style={styles.logoWrap}>
              <img
                src="https://manavrachna.edu.in/assets/images/logo.png"
                alt="Manav Rachna Logo"
                style={styles.logoImg}
              />
            </div>
            <div style={styles.headerText}>
              <p style={styles.headerTitle}>Manav Rachna University</p>
              <p style={styles.headerSubtitle}>
                Aravalli Hills, Sector–43, Faridabad, Haryana
              </p>
            </div>
          </div>
        </header>
        <div
          style={{
            minHeight: "60vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              textAlign: "center",
              background: "#fff",
              padding: "48px 60px",
              borderRadius: 16,
              boxShadow: "0 4px 24px rgba(0,0,0,0.1)",
              border: `2px solid rgba(201,168,76,0.3)`,
            }}
          >
            <div
              style={{
                fontSize: 48,
                marginBottom: 16,
              }}
            >
              🔒
            </div>
            <h2
              style={{
                color: MR.maroon,
                fontSize: 22,
                fontFamily: "'Georgia', serif",
                margin: "0 0 8px",
              }}
            >
              Form Unavailable
            </h2>
            <p style={{ color: MR.slate500, fontSize: 14, margin: 0 }}>
              This feedback link is invalid or has expired.
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* ── Main Render ── */
  return (
    <div style={styles.page}>
      {/* Gold top stripe */}
      <div style={styles.topStripe} />

      {/* ── Header ── */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          {/* Logo */}
          <div style={styles.logoWrap}>
            <img
              src="https://manavrachna.edu.in/assets/images/logo.png"
              alt="Manav Rachna"
              style={styles.logoImg}
            />
          </div>

          {/* Text */}
          <div style={styles.headerText}>
            <h1 style={styles.headerTitle}>Manav Rachna University</h1>
            <p style={styles.headerSubtitle}>
              Aravalli Hills, Sector–43, Faridabad, Haryana — NAAC A+ Accredited
            </p>
          </div>

          {/* Badge */}
          <div style={styles.headerBadge}>Faculty Feedback</div>
        </div>
      </header>

      {/* Gold ribbon */}
      <div style={styles.ribbon}>
        ✦ Academic Excellence · Student Feedback Portal · {new Date().getFullYear()} ✦
      </div>

      {/* ── Page Content ── */}
      <div style={styles.content}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          {statusLoading ? (
            <div style={{ textAlign: "center", padding: 60, color: MR.slate500 }}>
              Loading…
            </div>
          ) : formStatus?.data?.feedbackEnabled === false ? (
            <div
              style={{
                textAlign: "center",
                background: "#fff",
                padding: "48px 60px",
                borderRadius: 16,
                color: MR.maroon,
                fontFamily: "'Georgia', serif",
                fontSize: 18,
              }}
            >
              Feedback form is currently closed.
            </div>
          ) : (
            <div style={styles.card}>
              {/* Card top accent */}
              <div style={styles.cardAccent} />

              <div style={styles.cardBody}>
                {/* Form header */}
                <div style={styles.formHeader}>
                  <div style={styles.formHeaderIcon}>📝</div>
                  <div>
                    <h2 style={styles.formTitle}>Submit Faculty Feedback</h2>
                    <p style={styles.formSubtitle}>
                      Your responses are confidential and help improve teaching quality.
                      Please fill all fields carefully.
                    </p>
                  </div>
                </div>

                <form
                  onSubmit={handleSubmit}
                  style={{ display: "flex", flexDirection: "column", gap: 32 }}
                >
                  {/* Success message */}
                  {submitted && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <Message
                        severity="success"
                        text="✅ Feedback submitted successfully! Thank you."
                        style={{ width: "100%", borderRadius: 10 }}
                      />
                    </motion.div>
                  )}

                  {/* ── Academic Details ── */}
                  <div>
                    <SectionHeading>Academic Details</SectionHeading>
                    <div style={styles.grid2}>
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
                        onChange={(e) => {
                          updateField("departmentId", e.value);
                          updateField("classSection", "");
                        }}
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
                      <Dropdown
                        value={formData.semester}
                        options={semester}
                        onChange={(e) => updateField("semester", e.value)}
                        placeholder="Select Semester"
                        className="w-full"
                        filter
                      />
                      <Dropdown
                        value={formData.classSection}
                        options={availableSections}
                        onChange={(e) => updateField("classSection", e.value)}
                        placeholder="Select Class Section"
                        className="w-full"
                        disabled={!formData.departmentId}
                      />
                    </div>
                  </div>

                  {/* ── Feedback Ratings ── */}
                  <div>
                    <SectionHeading>Feedback Ratings</SectionHeading>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {RATING_QUESTIONS.map((q, i) => (
                        <motion.div
                          key={q.id}
                          style={styles.ratingRow}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.06 }}
                        >
                          <span style={styles.ratingLabel}>
                            <span
                              style={{
                                display: "inline-block",
                                width: 22,
                                height: 22,
                                borderRadius: "50%",
                                background: `linear-gradient(135deg, ${MR.maroon}, ${MR.maroonLight})`,
                                color: "#fff",
                                fontSize: 11,
                                fontWeight: 700,
                                textAlign: "center",
                                lineHeight: "22px",
                                marginRight: 10,
                              }}
                            >
                              {i + 1}
                            </span>
                            {q.label}
                          </span>
                          <Rating
                            value={formData[q.id]}
                            onChange={(e) => updateField(q.id, e.value)}
                            cancel={false}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* ── Remarks ── */}
                  <div>
                    <SectionHeading>Additional Remarks</SectionHeading>
                    <textarea
                      placeholder="Share any additional comments or suggestions..."
                      value={formData.comments}
                      onChange={(e) => updateField("comments", e.target.value)}
                      style={styles.textarea}
                      rows={4}
                      onFocus={(e) =>
                        (e.target.style.borderColor = MR.maroon)
                      }
                      onBlur={(e) =>
                        (e.target.style.borderColor = MR.slate200)
                      }
                    />
                  </div>

                  {/* ── Submit ── */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      paddingTop: 8,
                      borderTop: `1px solid ${MR.slate200}`,
                    }}
                  >
                    <Button
                      label={isLoading ? "Submitting…" : "Submit Feedback"}
                      type="submit"
                      loading={isLoading}
                      style={styles.submitBtn}
                    />
                  </div>
                </form>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* ── Footer ── */}
      <footer style={styles.footer}>
        © {new Date().getFullYear()} Manav Rachna University · All Rights Reserved ·
        Aravalli Hills, Sector–43, Faridabad – 121004, Haryana, India
      </footer>
    </div>
  );
};

export default CreateFormPage;