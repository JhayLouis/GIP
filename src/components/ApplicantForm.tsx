import React from "react";
import { X } from "lucide-react";
import { Applicant } from "../utils/dataService.ts";
import Swal from "sweetalert2";
import ApplicantFormBasic from "./ApplicantFormBasic";
import ApplicantFormEducation from "./ApplicantFormEducation";

interface ApplicantFormProps {
  showModal: boolean;
  editingApplicant: Applicant | null;
  applicantCode: string;
  formData: any;
  isSubmitting: boolean;
  activeProgram: 'GIP' | 'TUPAD';
  onClose: () => void;
  onInputChange: (field: string, value: any) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const ApplicantForm: React.FC<ApplicantFormProps> = ({
  showModal,
  editingApplicant,
  applicantCode,
  formData,
  isSubmitting,
  activeProgram,
  onClose,
  onInputChange,
  onSubmit
}) => {
  if (!showModal) return null;

  const headerDarkBgColor = activeProgram === 'GIP' ? 'bg-red-700' : 'bg-green-700';
  const primaryColor = activeProgram === 'GIP' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700';
  const programName = activeProgram === 'GIP' ? 'GIP' : 'TUPAD';

  const handleCancel = async () => {
    const hasData = Object.values(formData).some(val => val !== '' && val !== null);

    if (hasData) {
      const result = await Swal.fire({
        title: "Discard Changes?",
        text: "You have unsaved data. Are you sure you want to cancel?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
        reverseButtons: true,
        customClass: {
          popup: "rounded-2xl shadow-lg",
          confirmButton: "px-4 py-2 rounded-lg",
          cancelButton: "px-4 py-2 rounded-lg"
        }
      });

      if (result.isConfirmed) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className="bg-white dark:bg-slate-800 rounded-lg shadow-lg w-full max-w-4xl overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`${headerDarkBgColor} text-white px-6 py-4 flex items-center justify-between rounded-t-lg`}>
          <h2 className="text-xl font-bold">
            {editingApplicant ? 'EDIT' : 'ADD NEW'} {programName} APPLICANT
          </h2>
          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <ApplicantFormBasic
            formData={formData}
            editingApplicant={editingApplicant}
            activeProgram={activeProgram}
            applicantCode={applicantCode}
            onInputChange={onInputChange}
          />

          <ApplicantFormEducation
            formData={formData}
            activeProgram={activeProgram}
            onInputChange={onInputChange}
          />

          <div>
            <label className="block text-sm font-bold mb-1 uppercase">Status</label>
            <select
              value={formData.status}
              onChange={(e) => onInputChange('status', e.target.value)}
              className="w-full border rounded-lg px-3 py-3"
            >
              <option value="PENDING">PENDING</option>
              <option value="APPROVED">APPROVED</option>
              <option value="DEPLOYED">DEPLOYED</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="REJECTED">REJECTED</option>
              <option value="RESIGNED">RESIGNED</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold mb-1 uppercase">Encoder</label>
            <input
              type="text"
              value="ADMIN"
              readOnly
              className="w-full border rounded-lg px-3 py-3 bg-gray-100"
            />
          </div>

          <div className="md:col-span-3 flex justify-end mt-6 space-x-3">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 rounded-lg border border-gray-400 text-gray-700 hover:bg-gray-100 transition duration-200"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`${primaryColor} text-white px-6 py-2 rounded-lg font-medium transition duration-200`}
            >
              {isSubmitting ? 'Submitting...' : 'Save Applicant'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicantForm;
