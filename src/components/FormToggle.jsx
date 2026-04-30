// import React, { useEffect, useState } from 'react';
// import { Card } from 'primereact/card';
// import { Button } from 'primereact/button';
// import { Calendar } from 'primereact/calendar';
// import { InputSwitch } from 'primereact/inputswitch';
// import { Message } from 'primereact/message';
// import { motion } from 'motion/react';
// import {
//   useScheduleFormMutation,
//   useGetFormStatusQuery
// } from '../services/api';

// const FormToggle = () => {
//   const [isEnabled, setIsEnabled] = useState(false);
//   const [endTime, setEndTime] = useState(null);
//   const [success, setSuccess] = useState(false);

//   const { data: formStatus, isLoading: statusLoading } = useGetFormStatusQuery();
//   const [scheduleForm, { isLoading }] = useScheduleFormMutation();

//   useEffect(() => {
//     if (formStatus?.data) {
//       const { feedbackEnabled, endTime } = formStatus.data;

//       setIsEnabled(feedbackEnabled);

//       if (endTime) {
//         setEndTime(new Date(endTime));
//       }
//     }
//   }, [formStatus]);

//   const handleSubmit = async () => {
//     if (!isEnabled || !endTime) return;

//     try {
//       await scheduleForm({
//         endTime: endTime.toISOString()
//       }).unwrap();

//       setSuccess(true);
//       setTimeout(() => setSuccess(false), 3000);

//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <Card className="shadow-xl rounded-2xl border-none bg-white max-w-xl mx-auto">
//       <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

//         <h2 className="text-2xl font-bold mb-6">Form Control</h2>

//         {/* Loading */}
//         {statusLoading && (
//           <p className="text-slate-500">Loading status...</p>
//         )}

//         {/* Success */}
//         {success && (
//           <Message severity="success" text="Form scheduled successfully!" />
//         )}

//         {/* Toggle */}
//         <div className="flex items-center justify-between mb-6">
//           <span className="font-semibold">Enable Feedback Form</span>
//           <InputSwitch
//             checked={isEnabled}
//             onChange={(e) => setIsEnabled(e.value)}
//           />
//         </div>

//         {/* Show Current Status */}
//         {formStatus?.data?.feedbackEnabled && (
//           <div className="mb-4 text-sm text-green-600 font-semibold">
//             ✅ Form is currently ACTIVE
//           </div>
//         )}

//         {/* End Time */}
//         {isEnabled && (
//           <div className="mb-6">
//             <label className="block mb-2 font-semibold">Select End Time</label>
//             <Calendar
//               value={endTime}
//               onChange={(e) => setEndTime(e.value)}
//               showTime
//               hourFormat="24"
//               className="w-full"
//             />
//           </div>
//         )}

//         {/* Button */}
//         <Button
//           label="Apply Schedule"
//           onClick={handleSubmit}
//           loading={isLoading}
//           disabled={!isEnabled || !endTime}
//           className="w-full"
//         />

//       </motion.div>
//     </Card>
//   );
// };

// export default FormToggle;

import React, { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { InputSwitch } from "primereact/inputswitch";
import { Message } from "primereact/message";
import { motion } from "motion/react";
import {
  useScheduleFormMutation,
  useGetFormStatusQuery,
} from "../services/api";

const FormToggle = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [endTime, setEndTime] = useState(null);
  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  const { data: formStatus, isLoading: statusLoading } =
    useGetFormStatusQuery();
    const formUrl = formStatus?.url;
  const [scheduleForm, { isLoading }] = useScheduleFormMutation();

  useEffect(() => {
    if (formStatus?.data) {
      const { feedbackEnabled, endTime } = formStatus.data;

      setIsEnabled(feedbackEnabled);

      if (endTime) {
        setEndTime(new Date(endTime));
      }
    }
  }, [formStatus]);

  const handleSubmit = async () => {
    if (!isEnabled || !endTime) return;

    try {
      await scheduleForm({
        endTime: endTime.toISOString(),
      }).unwrap();

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopy = async () => {
    if (!formUrl) return;

    await navigator.clipboard.writeText(formUrl);
    setCopied(true);

    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white shadow-2xl relative overflow-hidden"
    >
      {/* Background Glows */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#701515]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="mb-8 border-b border-slate-100 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-1.5 h-4 bg-[#701515] rounded-full"></div>
          <h2 className="text-xl font-serif font-black text-slate-900 tracking-tight">
            Portal Control Center
          </h2>
        </div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
          Session Governance & Intake Authorization
        </p>
      </div>

      {/* Loading */}
      {statusLoading && (
        <div className="flex items-center gap-3 mb-6 p-4 bg-slate-50 rounded-2xl animate-pulse">
          <i className="pi pi-spin pi-spinner text-[#701515]"></i>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Synchronizing Portal Status...</p>
        </div>
      )}

      {/* Success */}
      {success && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <Message
            severity="success"
            text="Intake schedule successfully applied to the central registry."
            className="mb-6 rounded-2xl border-none shadow-lg py-4 bg-emerald-50 text-emerald-700 font-bold"
          />
        </motion.div>
      )}

      <div className="space-y-8">
        {/* Toggle Section */}
        <div className="flex items-center justify-between p-6 rounded-[2rem] bg-gradient-to-br from-slate-50 to-white border border-slate-100 shadow-inner group hover:border-[#701515]/20 transition-all duration-500">
          <div>
            <p className="text-sm font-black text-slate-800 tracking-tight mb-1 group-hover:text-[#701515] transition-colors">Feedback Intake Status</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global student submission toggle</p>
          </div>

          <InputSwitch
            checked={isEnabled}
            onChange={(e) => setIsEnabled(e.value)}
            className="scale-125"
          />
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-3 px-6">
          <div className={`w-2 h-2 rounded-full ${formStatus?.data?.feedbackEnabled ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]'} animate-pulse`} />
          <span
            className={`text-[10px] font-black tracking-[0.2em] uppercase ${
              formStatus?.data?.feedbackEnabled
                ? "text-emerald-600"
                : "text-red-600"
            }`}
          >
            {formStatus?.data?.feedbackEnabled ? "Live Submission Active" : "Intake Cycle Terminated"}
          </span>
        </div>

        {formUrl && (
          <div className="px-1">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-2">
              Encrypted Access URI
            </label>

            <div className="flex items-center gap-4 border border-slate-100 rounded-2xl p-4 bg-white/50 backdrop-blur-sm group hover:border-[#701515]/30 transition-all duration-300">
              <i className="pi pi-link text-slate-300 group-hover:text-[#701515] transition-colors"></i>
              <input
                value={formUrl}
                readOnly
                className="flex-1 bg-transparent text-xs font-bold text-slate-600 outline-none truncate"
              />

              <Button
                icon={copied ? "pi pi-check" : "pi pi-copy"}
                className={`p-button-rounded p-button-text ${
                  copied ? "text-emerald-600" : "text-slate-400"
                } hover:bg-slate-100 transition-all`}
                onClick={handleCopy}
                tooltip="Copy Access URI"
                tooltipOptions={{ position: "top" }}
              />
            </div>

            {copied && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] text-emerald-600 mt-3 font-black uppercase tracking-widest ml-4">
                <i className="pi pi-check-circle mr-2 text-[8px]"></i>
                Copied to secure clipboard
              </motion.p>
            )}
          </div>
        )}

        {/* End Time */}
        {isEnabled && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="px-1">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-2">
              Automatic Termination Timestamp
            </label>

            <div className="relative group">
              <Calendar
                value={endTime}
                onChange={(e) => setEndTime(e.value)}
                showTime
                hourFormat="24"
                className="w-full custom-mru-calendar"
                placeholder="Select Termination Date & Time"
                showIcon
              />
            </div>
          </motion.div>
        )}

        {/* Action Button */}
        <div className="pt-4">
          <Button
            label="Apply Governance Protocols"
            onClick={handleSubmit}
            loading={isLoading}
            disabled={!isEnabled || !endTime}
            className="w-full rounded-2xl font-black text-[10px] uppercase tracking-widest h-16 shadow-2xl shadow-red-900/20 border-none transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:grayscale"
            style={{ background: 'linear-gradient(135deg, #701515 0%, #4a0d0d 100%)', color: '#fff' }}
          />
          <p className="text-center text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-6 flex items-center justify-center gap-2">
             <i className="pi pi-shield text-[8px] text-emerald-500"></i>
             Authorization Protocol Session 2026
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default FormToggle;
