import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export const WorkflowStepper = ({ status, rejectionReason }) => {
  const steps = [
    { label: 'Draft', description: 'Created by Employee' },
    { label: 'Submitted', description: 'Pending Director Approval' },
    {
      label: status === 'Rejected' ? 'Rejected' : 'Approved',
      description: status === 'Rejected' ? 'Disapproved with remarks' : 'Approved by Director',
    },
    { label: 'Accounts Processing', description: 'Reimbursement Queue' },
  ];

  const getStepStatus = (index) => {
    if (status === 'Draft') {
      if (index === 0) return 'current';
      return 'upcoming';
    }
    if (status === 'Submitted') {
      if (index === 0) return 'complete';
      if (index === 1) return 'current';
      return 'upcoming';
    }
    if (status === 'Approved') {
      if (index <= 2) return 'complete';
      return 'current';
    }
    if (status === 'Rejected') {
      if (index <= 1) return 'complete';
      if (index === 2) return 'rejected';
      return 'upcoming';
    }
    return 'upcoming';
  };

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200">
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
        Voucher Lifecycle Workflow
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 relative">
        {steps.map((step, idx) => {
          const stepState = getStepStatus(idx);
          let bgClass = 'bg-slate-100 text-slate-500 border-slate-200';
          let lineClass = 'bg-slate-200';

          if (stepState === 'complete') {
            bgClass = 'bg-emerald-50 text-emerald-700 border-emerald-300 font-medium';
            lineClass = 'bg-emerald-500';
          } else if (stepState === 'current') {
            bgClass = 'bg-indigo-50 text-indigo-700 border-indigo-300 font-semibold ring-2 ring-indigo-200';
          } else if (stepState === 'rejected') {
            bgClass = 'bg-rose-50 text-rose-700 border-rose-300 font-semibold ring-2 ring-rose-200';
          }

          return (
            <div
              key={idx}
              className={`p-3 rounded-lg border text-left flex flex-col justify-between ${bgClass}`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold uppercase tracking-wider">
                  Step {idx + 1}
                </span>
                {stepState === 'complete' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
              </div>
              <div>
                <p className="text-sm font-bold">{step.label}</p>
                <p className="text-xs opacity-80 mt-0.5">{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {status === 'Rejected' && rejectionReason && (
        <div className="mt-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-left">
          <p className="text-xs font-bold text-rose-700 uppercase tracking-wider">
            Rejection Feedback from Director:
          </p>
          <p className="text-sm text-rose-900 mt-1 font-medium italic">"{rejectionReason}"</p>
        </div>
      )}
    </div>
  );
};
