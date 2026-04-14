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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-2xl p-5 border border-slate-200"
    >
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-lg font-bold text-slate-900">
          Feedback Form Control
        </h2>
        <p className="text-xs text-slate-500">
          Enable or schedule feedback form availability
        </p>
      </div>

      {/* Loading */}
      {statusLoading && (
        <p className="text-sm text-slate-400">Loading status...</p>
      )}

      {/* Success */}
      {success && (
        <Message
          severity="success"
          text="Form scheduled successfully!"
          className="mb-4"
        />
      )}

      {/* Toggle Section */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 mb-4">
        <div>
          <p className="text-sm font-semibold text-slate-800">Feedback Form</p>
          <p className="text-xs text-slate-500">Enable or disable submission</p>
        </div>

        <InputSwitch
          checked={isEnabled}
          onChange={(e) => setIsEnabled(e.value)}
        />
      </div>

      {/* Status Badge */}
      <div className="mb-4">
        <span
          className={`text-xs font-bold px-3 py-1 rounded-full ${
            formStatus?.data?.feedbackEnabled
              ? "bg-green-100 text-green-600"
              : "bg-red-100 text-red-600"
          }`}
        >
          {formStatus?.data?.feedbackEnabled ? "ACTIVE" : "DISABLED"}
        </span>
      </div>

      {formUrl && (
        <div className="mb-5">
          <label className="block text-sm font-semibold mb-2 text-slate-700">
            Share Form Link
          </label>

          <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-2 bg-slate-50">
            {/* URL */}
            <input
              value={formUrl}
              readOnly
              className="flex-1 bg-transparent text-sm text-slate-600 outline-none"
            />

            {/* Copy Button */}
            <Button
              icon={copied ? "pi pi-check" : "pi pi-copy"}
              className={`p-button-rounded p-button-text ${
                copied ? "text-green-600" : "text-slate-500"
              }`}
              onClick={handleCopy}
              tooltip="Copy link"
              tooltipOptions={{ position: "top" }}
            />
          </div>

          {/* Copy Success */}
          {copied && (
            <p className="text-xs text-green-600 mt-1 font-medium">
              Link copied to clipboard!
            </p>
          )}
        </div>
      )}

      {/* End Time */}
      {isEnabled && (
        <div className="mb-5">
          <label className="block text-sm font-semibold mb-2 text-slate-700">
            End Time
          </label>

          <Calendar
            value={endTime}
            onChange={(e) => setEndTime(e.value)}
            showTime
            hourFormat="24"
            className="w-full"
          />
        </div>
      )}

      {/* Action Button */}
      <Button
        label="Apply Schedule"
        onClick={handleSubmit}
        loading={isLoading}
        disabled={!isEnabled || !endTime}
        className="w-full p-button-primary"
      />
    </motion.div>
  );
};

export default FormToggle;
