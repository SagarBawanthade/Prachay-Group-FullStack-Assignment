import React from 'react';
import { Check } from 'lucide-react';

export const WorkflowStepper = ({ status, rejectionReason }) => {
  const steps = [
    { label: 'Draft', description: 'Created by Employee' },
    { label: 'Submitted', description: 'Pending Director Approval' },
    {
      label: status === 'Rejected' ? 'Rejected' : 'Approved',
      description: status === 'Rejected' ? 'Disapproved with remarks' : 'Approved by Director',
    },
    { label: 'Settlement', description: 'Accounts Processing' },
  ];

  const getStepStatus = (index) => {
    if (status === 'Draft') return index === 0 ? 'current' : 'upcoming';
    if (status === 'Submitted') return index === 0 ? 'complete' : index === 1 ? 'current' : 'upcoming';
    if (status === 'Approved') return index <= 2 ? 'complete' : 'current';
    if (status === 'Rejected') return index <= 1 ? 'complete' : index === 2 ? 'rejected' : 'upcoming';
    return 'upcoming';
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
      <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 text-left">
        Voucher Approval Lifecycle
      </p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        {steps.map((step, idx) => {
          const stepState = getStepStatus(idx);
          let bgClass = 'bg-slate-50 dark:bg-slate-850 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800';

          if (stepState === 'complete') {
            bgClass = 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border-slate-300 dark:border-slate-700';
          } else if (stepState === 'current') {
            bgClass = 'bg-slate-900 text-white dark:bg-indigo-600 dark:text-white border-slate-900 dark:border-indigo-600';
          } else if (stepState === 'rejected') {
            bgClass = 'bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-900';
          }

          return (
            <div
              key={idx}
              className={`p-3 rounded-lg border text-left flex flex-col justify-between ${bgClass}`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-75">
                  Stage 0{idx + 1}
                </span>
                {stepState === 'complete' && <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
              </div>
              <div>
                <p className="text-xs font-semibold">{step.label}</p>
                <p className="text-[11px] opacity-75 mt-0.5">{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {status === 'Rejected' && rejectionReason && (
        <div className="mt-3 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-left">
          <p className="text-[11px] font-semibold text-rose-700 dark:text-rose-400 uppercase tracking-wider">
            Director Review Remarks:
          </p>
          <p className="text-xs text-rose-900 dark:text-rose-200 mt-0.5">"{rejectionReason}"</p>
        </div>
      )}
    </div>
  );
};
