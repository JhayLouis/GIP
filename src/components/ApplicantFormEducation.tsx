import React, { useState } from "react";
import Swal from "sweetalert2";
import {
  COLLEGE_COURSES,
  TECHNICAL_VOCATIONAL_COURSES,
  ALS_SECONDARY_COURSES,
  COLLEGE_UNDERGRADUATE_COURSES
} from "../utils/courses.ts";

interface ApplicantFormEducationProps {
  formData: any;
  activeProgram: "GIP" | "TUPAD";
  onInputChange: (field: string, value: any) => void;
}

const ApplicantFormEducation: React.FC<ApplicantFormEducationProps> = ({
  formData,
  activeProgram,
  onInputChange,
}) => {
  const [customCourse, setCustomCourse] = useState("");
  const [showCustomCourse, setShowCustomCourse] = useState(false);

  const renderYearOptions = () =>
    Array.from({ length: new Date().getFullYear() - 1950 + 1 }, (_, i) => 1950 + i);

  if (activeProgram !== "GIP") return null;

  const validateYear = (condition: boolean, msg: string, callback: () => void) => {
    if (condition) {
      Swal.fire("Invalid Selection", msg, "error");
      callback();
      return false;
    }
    return true;
  };
    const safeValidateYear = (value, condition, message, resetCallback) => {
      if (!value || value.toString().length < 4) {
        return true;
      }
      return validateYear(condition, message, resetCallback);
    };


  return (
    <>
      <div className="col-span-3 mt-3">
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-bold uppercase">Primary Education *</label>
            <input
              type="text"
              value={formData.primarySchoolName || ""}
              onChange={(e) => {
                const value = e.target.value.toUpperCase();
                onInputChange("primarySchoolName", value);

                if (!value.trim()) {
                  onInputChange("primaryFrom", "");
                  onInputChange("primaryTo", "");
                  onInputChange("primaryEducation", "");
                } else if (formData.primaryFrom && formData.primaryTo) {
                  onInputChange("primaryEducation", "ELEMENTARY GRADUATE");
                }
              }}
              required
              placeholder="Enter Elementary School Name"
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          {formData.primarySchoolName?.trim() !== "" && (
            <>
              <div>
                <label className="block text-sm font-bold uppercase">From *</label>
                <input
                  type="number"
                  value={formData.primaryFrom || ""}
                  onChange={(e) => {
                    const value = Number(e.target.value);

                    if (
                      !safeValidateYear(
                        value,
                        formData.primaryTo && value > formData.primaryTo,
                        "'FROM' year cannot be greater than 'TO' year.",
                        () => onInputChange("primaryFrom", "")
                      )
                    ) return;

                    onInputChange("primaryFrom", value);

                    if (formData.primarySchoolName && formData.primaryTo)
                      onInputChange("primaryEducation", "ELEMENTARY GRADUATE");
                  }}
                  required
                  placeholder="FROM (Year)"
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-bold uppercase">To *</label>
                <input
                  type="number"
                  value={formData.primaryTo || ""}
                  onChange={(e) => {
                    const value = Number(e.target.value);

                    if (
                      !safeValidateYear(
                        value,
                        formData.primaryFrom && value < formData.primaryFrom,
                        "'TO' year cannot be lower than 'FROM' year.",
                        () => onInputChange("primaryTo", "")
                      )
                    ) return;

                    onInputChange("primaryTo", value);

                    if (formData.primarySchoolName && formData.primaryFrom)
                      onInputChange("primaryEducation", "ELEMENTARY GRADUATE");
                  }}
                  required
                  placeholder="TO (Year)"
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
            </>
          )}
        </div>
      </div>
          <div className="col-span-3 mt-2">
            <div className="grid grid-cols-4 gap-4 mt-2">

              <div className="col-span-2">
                <label className="block text-sm font-bold uppercase">Junior High School Name *</label>
                <input
                  type="text"
                  value={formData.juniorHighSchoolName || ""}
                  onChange={(e) => {
                    const value = e.target.value.toUpperCase();
                    onInputChange("juniorHighSchoolName", value);

                    if (!value.trim()) {
                      onInputChange("juniorHighFrom", "");
                      onInputChange("juniorHighTo", "");
                      onInputChange("juniorHighEducation", "");
                    } else if (formData.juniorHighFrom && formData.juniorHighTo) {
                      onInputChange("juniorHighEducation", "JUNIOR HIGH SCHOOL GRADUATE");
                    }
                  }}
                  required
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="Enter Junior High School Name"
                />
              </div>

              {formData.juniorHighSchoolName?.trim() !== "" && (
            <>
              <div>
                <label className="block text-sm font-bold uppercase">From *</label>
                <input
                  type="number"
                  value={formData.juniorHighFrom || ""}
                  onChange={(e) => {
                    const value = Number(e.target.value);

                    if (
                      !safeValidateYear(
                        value,
                        formData.primaryTo && value < Number(formData.primaryTo),
                        "Junior High FROM year must be AFTER Primary TO.",
                        () => onInputChange("juniorHighFrom", "")
                      )
                    ) return;

                    if (
                      !safeValidateYear(
                        value,
                        formData.juniorHighTo && value > formData.juniorHighTo,
                        "'FROM' year cannot be greater than 'TO' year.",
                        () => onInputChange("juniorHighFrom", "")
                      )
                    ) return;

                    onInputChange("juniorHighFrom", value);

                    if (formData.juniorHighSchoolName && formData.juniorHighTo)
                      onInputChange("juniorHighEducation", "JUNIOR HIGH SCHOOL GRADUATE");
                  }}
                  required
                  placeholder="FROM (Year)"
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-bold uppercase">To *</label>
                <input
                  type="number"
                  value={formData.juniorHighTo || ""}
                  onChange={(e) => {
                    const value = Number(e.target.value);

                    if (
                      !safeValidateYear(
                        value,
                        formData.primaryTo && value < Number(formData.primaryTo),
                        "Junior High TO must be AFTER Primary TO.",
                        () => onInputChange("juniorHighTo", "")
                      )
                    ) return;

                    if (
                      !safeValidateYear(
                        value,
                        formData.juniorHighFrom && value < formData.juniorHighFrom,
                        "'TO' year cannot be lower than 'FROM' year.",
                        () => onInputChange("juniorHighTo", "")
                      )
                    ) return;

                    onInputChange("juniorHighTo", value);

                    if (formData.juniorHighSchoolName && formData.juniorHighFrom)
                      onInputChange("juniorHighEducation", "JUNIOR HIGH SCHOOL GRADUATE");
                  }}
                  required
                  placeholder="TO (Year)"
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
            </>
          )}
     </div>
        <div className="grid grid-cols-4 gap-4 mt-4">
          <div className="col-span-2">
            <label className="block text-sm font-bold uppercase">Senior High School Name *</label>
            <input
              type="text"
              value={formData.seniorHighSchoolName || ""}
              onChange={(e) => {
                const value = e.target.value.toUpperCase();
                onInputChange("seniorHighSchoolName", value);

                if (!value.trim()) {
                  onInputChange("seniorHighFrom", "");
                  onInputChange("seniorHighTo", "");
                  onInputChange("seniorHighEducation", "");
                } else if (formData.seniorHighFrom && formData.seniorHighTo) {
                  onInputChange("seniorHighEducation", "SENIOR HIGH SCHOOL GRADUATE");
                }
              }}
              required
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Enter Senior High School Name"
            />
          </div>
         {formData.seniorHighSchoolName?.trim() !== "" && (
          <>
            <div>
              <label className="block text-sm font-bold uppercase">From *</label>
              <input
                type="number"
                value={formData.seniorHighFrom || ""}
                onChange={(e) => {
                  const value = Number(e.target.value);

                  if (
                    !safeValidateYear(
                      value,
                      formData.juniorHighTo && value < Number(formData.juniorHighTo),
                      "Senior High FROM must be AFTER Junior High TO.",
                      () => onInputChange("seniorHighFrom", "")
                    )
                  )
                    return;

                  if (
                    !safeValidateYear(
                      value,
                      formData.seniorHighTo && value > formData.seniorHighTo,
                      "'FROM' year cannot be greater than 'TO' year.",
                      () => onInputChange("seniorHighFrom", "")
                    )
                  )
                    return;

                  onInputChange("seniorHighFrom", value);

                  if (formData.seniorHighSchoolName && formData.seniorHighTo)
                    onInputChange("seniorHighEducation", "SENIOR HIGH SCHOOL GRADUATE");
                }}
                required
                placeholder="FROM (Year)"
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-bold uppercase">To *</label>
              <input
                type="number"
                value={formData.seniorHighTo || ""}
                onChange={(e) => {
                  const value = Number(e.target.value);

                  if (
                    !safeValidateYear(
                      value,
                      formData.juniorHighTo && value < Number(formData.juniorHighTo),
                      "Senior High TO must be AFTER Junior High TO.",
                      () => onInputChange("seniorHighTo", "")
                    )
                  )
                    return;

                  if (
                    !safeValidateYear(
                      value,
                      formData.seniorHighFrom && value < formData.seniorHighFrom,
                      "'TO' year cannot be lower than 'FROM' year.",
                      () => onInputChange("seniorHighTo", "")
                    )
                  )
                    return;

                  onInputChange("seniorHighTo", value);

                  if (formData.seniorHighSchoolName && formData.seniorHighFrom)
                    onInputChange("seniorHighEducation", "SENIOR HIGH SCHOOL GRADUATE");
                }}
                required
                placeholder="TO (Year)"
                className="w-full border rounded-lg px-3 py-2"
              />
          </div>
        </>
      )}
        </div>
      </div>
      <div className="col-span-3 mt-2">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold uppercase">Tertiary Education *</label>
            <select
              value={formData.tertiaryEducation || ""}
              onChange={(e) => {
                onInputChange("tertiaryEducation", e.target.value);
                onInputChange("tertiarySchoolName", "");
                onInputChange("tertiaryFrom", "");
                onInputChange("tertiaryTo", "");
                onInputChange("course", "");
                setCustomCourse("");
                setShowCustomCourse(false);
              }}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="">SELECT TERTIARY EDUCATION</option>
              <option value="ALS SECONDARY GRADUATE">ALS SECONDARY GRADUATE</option>
              <option value="TECHNICAL/VOCATIONAL COURSE GRADUATE">
                TECHNICAL/VOCATIONAL COURSE GRADUATE
              </option>
              <option value="COLLEGE UNDERGRADUATE">COLLEGE UNDERGRADUATE</option>
              <option value="COLLEGE GRADUATE">COLLEGE GRADUATE</option>
            </select>
          </div>

          {formData.tertiaryEducation && (
            <div>
              <label className="block text-sm font-bold uppercase">Tertiary School Name *</label>
              <input
                type="text"
                value={formData.tertiarySchoolName || ""}
                onChange={(e) => {
                  const value = e.target.value.toUpperCase();
                  onInputChange("tertiarySchoolName", value);

                  if (!value.trim()) {
                    onInputChange("tertiaryFrom", "");
                    onInputChange("tertiaryTo", "");
                    onInputChange("course", "");
                    setCustomCourse("");
                    setShowCustomCourse(false);
                  }
                }}
                required
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
          )}
        </div>

        {formData.tertiarySchoolName?.trim() !== "" && (
          <div className="grid grid-cols-3 gap-4 mt-3">
            <div>
              <label className="block text-sm font-bold uppercase">From *</label>
              <select
                value={formData.tertiaryFrom || ""}
                onChange={(e) => {
                  const value = Number(e.target.value);

                  if (
                    !validateYear(
                      formData.seniorHighTo && value < Number(formData.seniorHighTo),
                      "Tertiary FROM must be AFTER Senior High TO.",
                      () => onInputChange("tertiaryFrom", "")
                    )
                  )
                    return;

                  if (
                    !validateYear(
                      formData.tertiaryTo && value > Number(formData.tertiaryTo),
                      "'FROM' year cannot be greater than 'TO' year.",
                      () => onInputChange("tertiaryFrom", "")
                    )
                  )
                    return;

                  onInputChange("tertiaryFrom", value);
                }}
                required
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="">SELECT YEAR</option>
                {renderYearOptions().map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold uppercase">To *</label>
              <select
                value={formData.tertiaryTo || ""}
                onChange={(e) => {
                  const value = Number(e.target.value);

                  if (
                    !validateYear(
                      formData.seniorHighTo && value < Number(formData.seniorHighTo),
                      "Tertiary TO must be AFTER Senior High TO.",
                      () => onInputChange("tertiaryTo", "")
                    )
                  )
                    return;

                  if (
                    !validateYear(
                      formData.tertiaryFrom && value < Number(formData.tertiaryFrom),
                      "'TO' year cannot be lower than 'FROM' year.",
                      () => onInputChange("tertiaryTo", "")
                    )
                  )
                    return;

                  onInputChange("tertiaryTo", value);
                }}
                required
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="">SELECT YEAR</option>
                {renderYearOptions().map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold uppercase">Course *</label>
              {!showCustomCourse ? (
                <select
                  value={formData.course || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "OTHERS") {
                      setShowCustomCourse(true);
                      setCustomCourse("");
                      onInputChange("course", "");
                    } else {
                      onInputChange("course", value);
                    }
                  }}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                >
                  <option value="">SELECT COURSE</option>
                  <option value="OTHERS">OTHERS (Type manually)</option>
                  {formData.tertiaryEducation === "COLLEGE GRADUATE" &&
                    COLLEGE_COURSES.map((c, i) => (
                      <option key={i} value={c}>
                        {c}
                      </option>
                    ))}
                  {formData.tertiaryEducation === "TECHNICAL/VOCATIONAL COURSE GRADUATE" &&
                    TECHNICAL_VOCATIONAL_COURSES.map((c, i) => (
                      <option key={i} value={c}>
                        {c}
                      </option>
                    ))}
                  {formData.tertiaryEducation === "ALS SECONDARY GRADUATE" &&
                    ALS_SECONDARY_COURSES.map((c, i) => (
                      <option key={i} value={c}>
                        {c}
                      </option>
                    ))}
                  {formData.tertiaryEducation === "COLLEGE UNDERGRADUATE" &&
                    COLLEGE_UNDERGRADUATE_COURSES.map((c, i) => (
                      <option key={i} value={c}>
                        {c}
                      </option>
                    ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={customCourse}
                  onChange={(e) => {
                    const value = e.target.value.toUpperCase();
                    setCustomCourse(value);
                    onInputChange("course", value);

                    if (!value.trim()) setShowCustomCourse(false);
                  }}
                  required
                  placeholder="Enter your course"
                  className="w-full border rounded-lg px-3 py-2 uppercase"
                />
              )}
            </div>
          </div>
          )}
      </div>
      <div>
        <label className="block text-sm font-bold mb-2 uppercase">Beneficiary Name</label>
        <input
          type="text"
          value={formData.beneficiaryName}
          onChange={(e) => onInputChange("beneficiaryName", e.target.value)}
          className="w-full border rounded-lg px-3 py-2 uppercase"
          style={{ textTransform: "uppercase" }}
        />
      </div>
    </>
  );
};

export default ApplicantFormEducation;
