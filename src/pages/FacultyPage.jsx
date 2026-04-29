import React, { useState } from "react";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { MultiSelect } from "primereact/multiselect";
import { Message } from "primereact/message";
import {
  useGetFacultyQuery,
  useAddFacultyMutation,
  useGetDepartmentsQuery,
  useUpdateFacultyMutation,
  useDeleteFacultyMutation,
} from "../services/api";

import * as XLSX from "xlsx";
import { motion } from "motion/react";

const FacultyPage = () => {
  const [facultyName, setFacultyName] = useState("");
  const [facultyCode, setFacultyCode] = useState("");
  const [facultyEmail, setFacultyEmail] = useState("");
  const [facultyPhone, setFacultyPhone] = useState("");
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const { data: faculty, isLoading, refetch } = useGetFacultyQuery();
  const { data: deptData } = useGetDepartmentsQuery();
  const [addFaculty] = useAddFacultyMutation();
  const [updateFaculty] = useUpdateFacultyMutation();
  const [deleteFaculty] = useDeleteFacultyMutation();
  const [submitted, setSubmitted] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!facultyName || !facultyCode || !facultyEmail || !facultyPhone) return;

    try {
      if (editingId) {
        await updateFaculty({
          id: editingId,
          facultyName,
          facultyCode,
          facultyEmail,
          facultyPhone,
          departmentId: selectedDepartments,
        }).unwrap();

        setEditingId(null);
      } else {
        await addFaculty({
          facultyName,
          facultyCode,
          facultyEmail,
          facultyPhone,
          departmentId: selectedDepartments,
        }).unwrap();
      }

      // ✅ IMPORTANT FIX
      refetch();

      setFacultyName("");
      setFacultyCode("");
      setFacultyEmail("");
      setFacultyPhone("");
      setSelectedDepartments([]);

      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);

    } catch (err) {
      console.error("Failed to submit faculty:", err);
    }
  };

  const downloadExcel = () => {
    const dataToExport = faculty?.faculties || [];

    if (!Array.isArray(dataToExport)) {
      console.error("Data is not an array:", dataToExport);
      return;
    }

    const formattedData = dataToExport.map((item) => ({
      Name: item.facultyName,
      Code: item.facultyCode,
      Email: item.facultyEmail,
      Phone: item.facultyPhone,
      Rating: item.averageRating,
      Responses: item.totalResponses,
      Departments:
        item.departments?.map((d) => d.departmentName).join(", ") ||
        "No Department",
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Faculty");

    XLSX.writeFile(workbook, "Faculty_List.xlsx");
  };

  const departmentOptions =
    deptData?.departments?.map((dept) => ({
      label: dept.departmentName,
      value: dept.id,
    })) || [];


  const resetForm = () => {
    setFacultyName('');
    setSelectedDepartments([]);
    setFacultyCode("");
    setFacultyEmail("");
    setFacultyPhone("");
    setEditingId(null);
  };


  const handleEdit = (facultyMember) => {
    setEditingId(facultyMember.id);
    setFacultyName(facultyMember.facultyName);
    setFacultyCode(facultyMember.facultyCode);
    setFacultyEmail(facultyMember.facultyEmail);
    setFacultyPhone(facultyMember.facultyPhone);

    // Map department names back to the objects from our departments list
    // const filteredDepts = departments.filter(d =>
    //   facultyMember.departmentNames?.includes(d.name)
    // );
    // setSelectedDepartments(filteredDepts);


    const filteredDepts = departmentOptions
      .filter(d =>
        facultyMember.departments?.some(dep => dep.id === d.value)
      )
      .map(d => d.value);

    setSelectedDepartments(filteredDepts);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('WARNING: Are you sure you want to delete this faculty member? This action cannot be undone.')) {
      try {
        await deleteFaculty(id).unwrap();

        // ✅ IMPORTANT FIX
        refetch();

      } catch (err) {
        console.error('Failed to delete faculty:', err);
      }
    }
  };

  const actionTemplate = (rowData) => {
    return (
      <div className="flex gap-2">
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-text p-button-warning"
          onClick={() => handleEdit(rowData)}
          tooltip="Edit"
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-text p-button-danger"
          onClick={() => handleDelete(rowData.id)}
          tooltip="Delete"
        />
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="shadow-2xl rounded-[2rem] border-none overflow-hidden mb-10 bg-white">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-10 -mx-6 -mt-6 mb-10 relative overflow-hidden">
            <div className="relative z-10">
              <h1 className="text-4xl font-black text-white mb-3 tracking-tight">
                Manage Faculty
              </h1>
              <p className="text-indigo-100 font-medium opacity-90">
                Register faculty members and assign them to one or more
                departments.
              </p>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-8 px-4">
            {submitted && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Message
                  severity="success"
                  text={editingId ? "Faculty updated successfully!" : "Faculty added successfully!"}
                  className="w-full rounded-2xl border-none shadow-md"
                />
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-2.5">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
                  Faculty Name
                </label>
                <InputText
                  value={facultyName}
                  onChange={(e) => setFacultyName(e.target.value)}
                  placeholder="Enter full name"
                  className="w-full rounded-2xl border-slate-200 p-4 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                  required
                />
              </div>
              {/* Code */}
              <div className="flex flex-col gap-2.5">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
                  Faculty Code
                </label>
                <InputText
                  value={facultyCode}
                  onChange={(e) => setFacultyCode(e.target.value)}
                  placeholder="Enter code"
                  className="w-full rounded-2xl border-slate-200 p-4"
                  required
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-2.5">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
                  Email
                </label>
                <InputText
                  value={facultyEmail}
                  onChange={(e) => setFacultyEmail(e.target.value)}
                  placeholder="Enter email"
                  className="w-full rounded-2xl border-slate-200 p-4"
                  required
                />
              </div>

              {/* Phone */}
              <div className="flex flex-col gap-2.5">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
                  Phone Number
                </label>
                <InputText
                  value={facultyPhone}
                  onChange={(e) => setFacultyPhone(e.target.value)}
                  placeholder="Enter phone"
                  className="w-full rounded-2xl border-slate-200 p-4"
                  required
                />
              </div>
              <div className="flex flex-col gap-2.5">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
                  Departments
                </label>

                <MultiSelect
                  value={selectedDepartments}
                  onChange={(e) => setSelectedDepartments(e.value)}
                  options={departmentOptions}
                  optionLabel="label"
                  placeholder="Select Departments"
                  className="w-full rounded-2xl"
                  display="chip"
                  filter
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              {editingId && (
                <Button
                  label="Cancel"
                  icon="pi pi-times"
                  className="p-button-text p-button-secondary rounded-2xl font-bold px-8"
                  type="button"
                  onClick={resetForm}
                />
              )}
              <Button
                label={editingId ? "Update Faculty Member" : "Add Faculty Member"}
                icon={editingId ? "pi pi-check" : "pi pi-plus"}
                className={`p-button-primary rounded-2xl font-black px-12 py-4 shadow-xl border-none hover:scale-[1.02] transition-transform ${editingId ? 'bg-amber-500 shadow-amber-500/30' : 'bg-gradient-to-r from-indigo-600 to-purple-700 shadow-indigo-500/30'
                  }`}
                type="submit"
              />
            </div>
          </form>
        </Card>

        <Card className="shadow-2xl rounded-[2rem] border-none overflow-hidden bg-white">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 px-4">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Existing Faculty
              </h2>
              <p className="text-sm font-bold text-slate-400">
                Total {faculty?.length || 0} faculty members registered
              </p>
            </div>
            <Button
              label="Export to Excel"
              icon="pi pi-download"
              className="p-button-outlined p-button-secondary rounded-2xl font-bold px-6 py-3 border-2"
              onClick={downloadExcel}
              disabled={!faculty?.faculties?.length}
            />
          </div>

          <div className="px-2">
            <DataTable
              value={faculty?.faculties}
              loading={isLoading}
              className="p-datatable-sm custom-table"
              paginator
              rows={10}
              emptyMessage="No faculty found."
              responsiveLayout="stack"
            >
              <Column field="id" header="ID" />
              <Column field="facultyName" header="Faculty Name" />
              <Column field="facultyCode" header="Code" />
              <Column field="facultyEmail" header="Email" />
              <Column field="facultyPhone" header="Phone" />
              <Column field="averageRating" header="Rating" />
              <Column field="totalResponses" header="Responses" />
              <Column
                header="Departments"
                body={(row) =>
                  row.departments?.map((d) => d.departmentName).join(", ")
                }
              />
              <Column header="Actions" body={actionTemplate} style={{ width: '150px' }}></Column>
            </DataTable>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default FacultyPage;
