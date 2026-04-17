import React, { useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";
import { Tag } from "primereact/tag";
import { InputSwitch } from "primereact/inputswitch";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { useGetDashboardQuery, useGetFormStatusQuery } from "../services/api";
import FormToggle from "../components/FormToggle";
import { Dialog } from "primereact/dialog";

const DashboardPage = () => {
  const { data: formStatus, isLoading: statusLoading } =
    useGetFormStatusQuery();
  const { data: dashboardData, isLoading } = useGetDashboardQuery();
  // const [toggleForm] = useToggleFormStatusMutation();
  const [visible, setVisible] = useState(false);

  const stats = [
    {
      title: "Total Feedbacks",
      value: dashboardData?.totalFeedback || 0,
      icon: "pi-comments",
      color: "indigo",
    },
    {
      title: "Avg. Rating",
      value: (dashboardData?.averageRating || 0).toFixed(2),
      icon: "pi-star",
      color: "emerald",
    },
    {
      title: "Faculty Members",
      value: dashboardData?.totalFaculty || 0,
      icon: "pi-users",
      color: "orange",
    },
  ];

  const topFaculty = dashboardData?.faculties || [];

  if (isLoading) {
    return <p className="text-center mt-10">Loading dashboard...</p>;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
            System Overview
          </h1>
          <p className="text-slate-500 font-medium">
            Welcome back! Here's the latest summary of faculty feedback.
          </p>
        </div>
        <div className="flex gap-3">
          {/* Form Control Toggle */}
          <Button
            label="Form Control"
            icon="pi pi-cog"
            className="p-button-secondary rounded-xl font-bold"
            onClick={() => setVisible(true)}
          />
          {/* <FormToggle /> */}

          <Link to="/create-form">
            <Button
              label="New Feedback"
              icon="pi pi-plus"
              className="p-button-primary rounded-xl font-bold px-6 shadow-lg shadow-indigo-100"
            />
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">
        {stats?.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="shadow-sm hover:shadow-xl transition-all duration-300 rounded-3xl border-none overflow-hidden group">
              <div className="flex justify-between items-start mb-4">
                <div
                  className={`w-12 h-12 rounded-2xl bg-${stat.color}-50 flex items-center justify-center text-${stat.color}-600 group-hover:bg-${stat.color}-600 group-hover:text-white transition-colors duration-500`}
                >
                  <i className={`pi ${stat.icon} text-xl`} />
                </div>
              </div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">
                {stat.title}
              </p>
              <p className="text-3xl font-black text-slate-900 tracking-tight">
                {stat.value}
              </p>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card
            title="Top Feedback Entities"
            className="shadow-sm rounded-3xl border-none h-full"
          >
            <div className="flex flex-col gap-4 mt-4">
              {topFaculty?.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <Avatar
                      label={item?.faculty?.charAt(0)}
                      shape="circle"
                      className="bg-white text-indigo-600 font-bold shadow-sm"
                    />
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        {item.facultyName}
                      </p>

                      <p className="text-xs text-slate-500">
                        {item.departments
                          ?.map((d) => d?.departmentName)
                          .join(", ") || "No Department"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 mb-1 justify-end">
                      {[...Array(5)].map((_, i) => (
                        <i
                          key={i}
                          className={`pi pi-star-fill text-[10px] ${i < Math.round(item.averageRating || 0) ? "text-amber-400" : "text-slate-200"}`}
                        />
                      ))}
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {item.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/analytics">
              <Button
                label="View Detailed Analytics"
                className="p-button-text p-button-sm w-full mt-6 font-bold"
              />
            </Link>
          </Card>
        </div>

        {/* Quick Actions / Info */}
        <div className="flex flex-col gap-6">
          <Card className="shadow-sm rounded-3xl border-none bg-indigo-600 text-white overflow-hidden relative">
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-2">Ready to analyze?</h3>
              <p className="text-indigo-100 text-sm mb-6 opacity-80">
                Upload your latest feedback data to generate comprehensive
                reports and insights.
              </p>
              <Link to="/analytics">
                <Button
                  label="Go to Analytics"
                  icon="pi pi-arrow-right"
                  iconPos="right"
                  className="p-button-secondary w-full rounded-xl font-bold py-3"
                />
              </Link>
            </div>
            <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          </Card>

          <Card
            title="System Status"
            className="shadow-sm rounded-3xl border-none"
          >
            <div className="flex flex-col gap-4 mt-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600">
                  Database Sync
                </span>
                <Tag value="Active" severity="success" className="rounded-lg" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600">
                  Last Backup
                </span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  2h ago
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600">
                  Active Users
                </span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  12 Online
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
      <Dialog
        header="Feedback Form Control"
        visible={visible}
        onHide={() => setVisible(false)}
        className="rounded-2xl w-[400px]"
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col items-center justify-between p-4 bg-slate-50 rounded-xl gap-3">
            <div>
              <p className="text-sm font-bold text-slate-800">
                Enable Feedback Form
              </p>
              <p className="text-xs text-slate-500">
                Toggle to allow students to submit feedback
              </p>
            </div>

            {/* Your existing toggle component */}
            <FormToggle />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default DashboardPage;
