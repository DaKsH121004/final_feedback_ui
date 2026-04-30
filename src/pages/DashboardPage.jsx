// import React, { useState } from "react";
// import { Card } from "primereact/card";
// import { Button } from "primereact/button";
// import { Avatar } from "primereact/avatar";
// import { Tag } from "primereact/tag";
// import { InputSwitch } from "primereact/inputswitch";
// import { motion } from "motion/react";
// import { Link } from "react-router-dom";
// import { useGetDashboardQuery, useGetFormStatusQuery } from "../services/api";
// import FormToggle from "../components/FormToggle";
// import { Dialog } from "primereact/dialog";

// const DashboardPage = () => {
//   const { data: formStatus, isLoading: statusLoading } =
//     useGetFormStatusQuery();
//   const { data: dashboardData, isLoading } = useGetDashboardQuery();
//   // const [toggleForm] = useToggleFormStatusMutation();
//   const [visible, setVisible] = useState(false);

//   const stats = [
//     {
//       title: "Total Feedbacks",
//       value: dashboardData?.totalFeedback || 0,
//       icon: "pi-comments",
//       color: "indigo",
//     },
//     {
//       title: "Avg. Rating",
//       value: (dashboardData?.averageRating || 0).toFixed(2),
//       icon: "pi-star",
//       color: "emerald",
//     },
//     {
//       title: "Faculty Members",
//       value: dashboardData?.totalFaculty || 0,
//       icon: "pi-users",
//       color: "orange",
//     },
//   ];

//   const topFaculty = dashboardData?.faculties || [];

//   if (isLoading) {
//     return <p className="text-center mt-10">Loading dashboard...</p>;
//   }

//   return (
//     <div className="max-w-7xl mx-auto">
//       <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
//         <div>
//           <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
//             System Overview
//           </h1>
//           <p className="text-slate-500 font-medium">
//             Welcome back! Here's the latest summary of faculty feedback.
//           </p>
//         </div>
//         <div className="flex gap-3">
//           {/* Form Control Toggle */}
//           <Button
//             label="Form Control"
//             icon="pi pi-cog"
//             className="p-button-secondary rounded-xl font-bold"
//             onClick={() => setVisible(true)}
//           />
//           {/* <FormToggle /> */}

//           <Link to="/create-form">
//             <Button
//               label="New Feedback"
//               icon="pi pi-plus"
//               className="p-button-primary rounded-xl font-bold px-6 shadow-lg shadow-indigo-100"
//             />
//           </Link>
//         </div>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">
//         {stats?.map((stat, idx) => (
//           <motion.div
//             key={idx}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: idx * 0.1 }}
//           >
//             <Card className="shadow-sm hover:shadow-xl transition-all duration-300 rounded-3xl border-none overflow-hidden group">
//               <div className="flex justify-between items-start mb-4">
//                 <div
//                   className={`w-12 h-12 rounded-2xl bg-${stat.color}-50 flex items-center justify-center text-${stat.color}-600 group-hover:bg-${stat.color}-600 group-hover:text-white transition-colors duration-500`}
//                 >
//                   <i className={`pi ${stat.icon} text-xl`} />
//                 </div>
//               </div>
//               <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">
//                 {stat.title}
//               </p>
//               <p className="text-3xl font-black text-slate-900 tracking-tight">
//                 {stat.value}
//               </p>
//             </Card>
//           </motion.div>
//         ))}
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {/* Recent Activity */}
//         <div className="lg:col-span-2">
//           <Card
//             title="Top Feedback Entities"
//             className="shadow-sm rounded-3xl border-none h-full"
//           >
//             <div className="flex flex-col gap-4 mt-4">
//               {topFaculty?.map((item, idx) => (
//                 <div
//                   key={idx}
//                   className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-colors group"
//                 >
//                   <div className="flex items-center gap-4">
//                     <Avatar
//                       label={item?.faculty?.charAt(0)}
//                       shape="circle"
//                       className="bg-white text-indigo-600 font-bold shadow-sm"
//                     />
//                     <div>
//                       <p className="text-sm font-bold text-slate-900">
//                         {item.facultyName}
//                       </p>

//                       {/* <p className="text-xs text-slate-500">
//                         {item.departments
//                           ?.map((d) => d?.departmentName)
//                           .join(", ") || "No Department"}
//                       </p> */}
//                     </div>
//                   </div>
//                   <div className="text-right">
//                     <div className="flex items-center gap-1 mb-1 justify-end">
//                       {[...Array(5)].map((_, i) => (
//                         <i
//                           key={i}
//                           className={`pi pi-star-fill text-[10px] ${i < Math.round(item.averageRating || 0) ? "text-amber-400" : "text-slate-200"}`}
//                         />
//                       ))}
//                     </div>
//                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
//                       {item.time}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//             <Link to="/analytics">
//               <Button
//                 label="View Detailed Analytics"
//                 className="p-button-text p-button-sm w-full mt-6 font-bold"
//               />
//             </Link>
//           </Card>
//         </div>

//         {/* Quick Actions / Info */}
//         <div className="flex flex-col gap-6">
//           <Card className="shadow-sm rounded-3xl border-none bg-indigo-600 text-white overflow-hidden relative">
//             <div className="relative z-10">
//               <h3 className="text-xl font-bold mb-2">Ready to analyze?</h3>
//               <p className="text-indigo-100 text-sm mb-6 opacity-80">
//                 Upload your latest feedback data to generate comprehensive
//                 reports and insights.
//               </p>
//               <Link to="/analytics">
//                 <Button
//                   label="Go to Analytics"
//                   icon="pi pi-arrow-right"
//                   iconPos="right"
//                   className="p-button-secondary w-full rounded-xl font-bold py-3"
//                 />
//               </Link>
//             </div>
//             <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-white/10 rounded-full blur-2xl" />
//           </Card>

//           {/* <Card
//             title="System Status"
//             className="shadow-sm rounded-3xl border-none"
//           >
//             <div className="flex flex-col gap-4 mt-2">
//               <div className="flex items-center justify-between">
//                 <span className="text-sm font-medium text-slate-600">
//                   Database Sync
//                 </span>
//                 <Tag value="Active" severity="success" className="rounded-lg" />
//               </div>
//               <div className="flex items-center justify-between">
//                 <span className="text-sm font-medium text-slate-600">
//                   Last Backup
//                 </span>
//                 <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
//                   2h ago
//                 </span>
//               </div>
//               <div className="flex items-center justify-between">
//                 <span className="text-sm font-medium text-slate-600">
//                   Active Users
//                 </span>
//                 <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
//                   12 Online
//                 </span>
//               </div>
//             </div>
//           </Card> */}
//         </div>
//       </div>
//       <Dialog
//         header="Feedback Form Control"
//         visible={visible}
//         onHide={() => setVisible(false)}
//         className="rounded-2xl w-[400px]"
//       >
//         <div className="flex flex-col gap-4">
//           <div className="flex flex-col items-center justify-between p-4 bg-slate-50 rounded-xl gap-3">
//             <div>
//               <p className="text-sm font-bold text-slate-800">
//                 Enable Feedback Form
//               </p>
//               <p className="text-xs text-slate-500">
//                 Toggle to allow students to submit feedback
//               </p>
//             </div>

//             {/* Your existing toggle component */}
//             <FormToggle />
//           </div>
//         </div>
//       </Dialog>
//     </div>
//   );
// };

// export default DashboardPage;



import React, { useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";
import { InputSwitch } from "primereact/inputswitch";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { useGetDashboardQuery, useGetFormStatusQuery } from "../services/api";
import FormToggle from "../components/FormToggle";
import { Dialog } from "primereact/dialog";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  RadialBarChart,
  RadialBar,
} from "recharts";

// ── Custom Tooltip ──────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-100 shadow-xl rounded-2xl px-4 py-3">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">
          {label}
        </p>
        {payload.map((p, i) => (
          <p key={i} className="text-sm font-bold" style={{ color: p.color }}>
            {p.name}: <span className="text-slate-800">{p.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// ── Stat Card ───────────────────────────────────────────────────────────────
const StatCard = ({ stat, idx }) => {
  const colorMap = {
    indigo: {
      bg: "bg-indigo-50",
      text: "text-indigo-600",
      hoverBg: "group-hover:bg-indigo-600",
      hoverText: "group-hover:text-white",
      gradient: "from-indigo-500 to-indigo-700",
    },
    emerald: {
      bg: "bg-emerald-50",
      text: "text-emerald-600",
      hoverBg: "group-hover:bg-emerald-600",
      hoverText: "group-hover:text-white",
      gradient: "from-emerald-500 to-emerald-700",
    },
    orange: {
      bg: "bg-orange-50",
      text: "text-orange-600",
      hoverBg: "group-hover:bg-orange-600",
      hoverText: "group-hover:text-white",
      gradient: "from-orange-500 to-orange-700",
    },
  };
  const c = colorMap[stat.color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.1, type: "spring", stiffness: 120 }}
    >
      <Card className="shadow-sm hover:shadow-2xl transition-all duration-300 rounded-3xl border-none overflow-hidden group cursor-default">
        <div className="flex justify-between items-start mb-4">
          <div
            className={`w-12 h-12 rounded-2xl ${c.bg} ${c.text} ${c.hoverBg} ${c.hoverText} flex items-center justify-center transition-colors duration-500`}
          >
            <i className={`pi ${stat.icon} text-xl`} />
          </div>
          {stat.change && (
            <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full">
              {stat.change}
            </span>
          )}
        </div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
          {stat.title}
        </p>
        <p className="text-4xl font-black text-slate-900 tracking-tight">
          {stat.value}
        </p>
      </Card>
    </motion.div>
  );
};

// ── Section Header ──────────────────────────────────────────────────────────
const SectionHeader = ({ title, subtitle }) => (
  <div className="mb-5">
    <h2 className="text-lg font-black text-slate-900 tracking-tight">{title}</h2>
    {subtitle && <p className="text-xs text-slate-400 font-medium mt-0.5">{subtitle}</p>}
  </div>
);

// ── Main Component ──────────────────────────────────────────────────────────
const DashboardPage = () => {
  const { data: formStatus, isLoading: statusLoading } = useGetFormStatusQuery();
  const { data: dashboardData, isLoading } = useGetDashboardQuery();
  const [visible, setVisible] = useState(false);

  const stats = [
    {
      title: "Total Feedbacks",
      value: dashboardData?.totalFeedback || 0,
      icon: "pi-comments",
      color: "indigo",
      change: "+12%",
    },
    {
      title: "Avg. Rating",
      value: (dashboardData?.averageRating || 0).toFixed(2),
      icon: "pi-star",
      color: "emerald",
      change: "+0.3",
    },
    {
      title: "Faculty Members",
      value: dashboardData?.totalFaculty || 0,
      icon: "pi-users",
      color: "orange",
    },
    {
      title: "Total Courses",
      value: dashboardData?.totalCourses || 0,
      icon: "pi-book",
      color: "indigo",
    },
    {
      title: "Departments",
      value: dashboardData?.totalDepartments || 0,
      icon: "pi-building",
      color: "emerald",
    },
  ];

  const topFaculty = dashboardData?.faculties || [];

  const departmentPerformance = dashboardData?.departmentPerformance || [];
  const facultyTrend = dashboardData?.ratingTrend || [];
  const feedbackVolume = dashboardData?.feedbackVolume || [];

  // Top 5 faculty for bar chart
  const topFacultyChart = topFaculty.slice(0, 5).map((f) => ({
    name: f.facultyName?.split(" ").slice(-1)[0] || f.facultyName, // last name only
    fullName: f.facultyName,
    rating: parseFloat((f.averageRating || 0).toFixed(2)),
  }));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <i className="pi pi-spin pi-spinner text-3xl text-indigo-500" />
          <p className="text-slate-500 font-medium text-sm">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-1">
            System Overview
          </h1>
          <p className="text-slate-500 font-medium">
            Welcome back! Here's the latest summary of faculty feedback.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            label="Form Control"
            icon="pi pi-cog"
            className="p-button-secondary rounded-xl font-bold"
            onClick={() => setVisible(true)}
          />
          <Link to="/create-form">
            <Button
              label="New Feedback"
              icon="pi pi-plus"
              className="p-button-primary rounded-xl font-bold px-6 shadow-lg shadow-indigo-100"
            />
          </Link>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <StatCard key={idx} stat={stat} idx={idx} />
        ))}
      </div>

      {/* ── Charts Row 1 ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Department Avg Rating Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="shadow-sm rounded-3xl border-none h-full">
            <SectionHeader
              title="Department Performance"
              subtitle="Average rating per department"
            />
            <ResponsiveContainer width="100%" height={240}>
              <BarChart
                data={departmentPerformance}
                margin={{ top: 4, right: 8, left: -20, bottom: 0 }}
                barSize={28}
              >
                <defs>
                  <linearGradient id="deptGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
                    <stop offset="100%" stopColor="#a5b4fc" stopOpacity={0.7} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fontWeight: 700, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 5]}
                  ticks={[0, 1, 2, 3, 4, 5]}
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f8fafc" }} />
                <Bar
                  dataKey="value"
                  name="Avg Rating"
                  fill="url(#deptGrad)"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Faculty Rating Trend Line Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="shadow-sm rounded-3xl border-none h-full">
            <SectionHeader
              title="Rating Trend"
              subtitle="Monthly average faculty rating"
            />
            <ResponsiveContainer width="100%" height={240}>
              <LineChart
                data={facultyTrend}
                margin={{ top: 4, right: 8, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#6366f1" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fontWeight: 700, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 5]}
                  ticks={[0, 1, 2, 3, 4, 5]}
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="value"
                  name="Avg Rating"
                  stroke="url(#lineGrad)"
                  strokeWidth={3}
                  dot={{ r: 5, fill: "#6366f1", strokeWidth: 2, stroke: "#fff" }}
                  activeDot={{ r: 7, fill: "#6366f1" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>
      </div>

      {/* ── Charts Row 2 + Faculty List ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Top Faculty Bar Chart */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="shadow-sm rounded-3xl border-none h-full">
            <SectionHeader
              title="Top Faculty Ratings"
              subtitle="Highest rated faculty members"
            />
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                layout="vertical"
                data={topFacultyChart}
                margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
                barSize={18}
              >
                <defs>
                  <linearGradient id="facGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.85} />
                    <stop offset="100%" stopColor="#fbbf24" stopOpacity={1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis
                  type="number"
                  domain={[0, 5]}
                  ticks={[0, 1, 2, 3, 4, 5]}
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 11, fontWeight: 700, fill: "#475569" }}
                  axisLine={false}
                  tickLine={false}
                  width={60}
                />
                <Tooltip
                  content={({ active, payload }) =>
                    active && payload?.length ? (
                      <div className="bg-white border border-slate-100 shadow-xl rounded-2xl px-4 py-3">
                        <p className="text-xs font-bold text-slate-500 mb-1">
                          {payload[0]?.payload?.fullName}
                        </p>
                        <p className="text-sm font-bold text-amber-500">
                          ⭐ {payload[0]?.value}
                        </p>
                      </div>
                    ) : null
                  }
                  cursor={{ fill: "#fafafa" }}
                />
                <Bar
                  dataKey="rating"
                  name="Rating"
                  fill="url(#facGrad)"
                  radius={[0, 8, 8, 0]}
                />
              </BarChart>
            </ResponsiveContainer>

            {/* Faculty list below chart */}
            <div className="flex flex-col gap-3 mt-5">
              {topFaculty.slice(0, 4).map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Avatar
                      label={item?.facultyName?.charAt(0)}
                      shape="circle"
                      className="bg-white text-indigo-600 font-bold shadow-sm"
                    />
                    <p className="text-sm font-bold text-slate-900">{item.facultyName}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <i
                        key={i}
                        className={`pi pi-star-fill text-[10px] ${
                          i < Math.round(item.averageRating || 0)
                            ? "text-amber-400"
                            : "text-slate-200"
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-xs font-bold text-slate-500">
                      {(item.averageRating || 0).toFixed(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <Link to="/analytics">
              <Button
                label="View Detailed Analytics"
                className="p-button-text p-button-sm w-full mt-5 font-bold"
              />
            </Link>
          </Card>
        </motion.div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
          {/* Dept Feedback Volume */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="shadow-sm rounded-3xl border-none">
              <SectionHeader title="Feedback Volume" subtitle="By department" />
              <ResponsiveContainer width="100%" height={180}>
                <BarChart
                  data={feedbackVolume}
                  margin={{ top: 4, right: 4, left: -28, bottom: 0 }}
                  barSize={16}
                >
                  <defs>
                    <linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                      <stop offset="100%" stopColor="#6ee7b7" stopOpacity={0.6} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 10, fontWeight: 700, fill: "#94a3b8" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: "#94a3b8" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f8fafc" }} />
                  <Bar
                    dataKey="value"
                    name="Feedbacks"
                    fill="url(#volGrad)"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>

          {/* CTA Card */}
          <Card className="shadow-sm rounded-3xl border-none bg-indigo-600 text-white overflow-hidden relative">
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-2">Ready to analyze?</h3>
              <p className="text-indigo-100 text-sm mb-6 opacity-80">
                Generate comprehensive reports and insights from your feedback data.
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
        </div>
      </div>

      {/* ── Form Control Dialog ── */}
      <Dialog
        header="Feedback Form Control"
        visible={visible}
        onHide={() => setVisible(false)}
        className="rounded-2xl w-[400px]"
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col items-center justify-between p-4 bg-slate-50 rounded-xl gap-3">
            <div>
              <p className="text-sm font-bold text-slate-800">Enable Feedback Form</p>
              <p className="text-xs text-slate-500">
                Toggle to allow students to submit feedback
              </p>
            </div>
            <FormToggle />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default DashboardPage;
