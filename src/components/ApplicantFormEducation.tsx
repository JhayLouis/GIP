import React, { useState } from "react";
import Swal from "sweetalert2";
import { COLLEGE_COURSES, TECHNICAL_VOCATIONAL_COURSES, ALS_SECONDARY_COURSES, COLLEGE_UNDERGRADUATE_COURSES } from "../utils/courses.ts";

interface ApplicantFormEducationProps {
  formData: any;
  activeProgram: 'GIP' | 'TUPAD';
  onInputChange: (field: string, value: any) => void;
}

const ApplicantFormEducation: React.FC<ApplicantFormEducationProps> = ({
  formData,
  activeProgram,
  onInputChange
}) => {
  const [customCourse, setCustomCourse] = useState('');
  const [showCustomCourse, setShowCustomCourse] = useState(false);

  const renderYearOptions = () => {
    return Array.from(
      { length: new Date().getFullYear() - 1950 + 1 },
      (_, i) => 1950 + i
    );
  };

  if (activeProgram !== 'GIP') {
    return null;
  }

  return (
    <>
      <div className="col-span-3 mt-3">
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-bold uppercase">
              Primary Education *
            </label>
            <input
              type="text"
              value={formData.primarySchoolName || ''}
              onChange={(e) => {
                const value = e.target.value.toUpperCase();
                onInputChange('primarySchoolName', value);

                if (value.trim() === '') {
                  onInputChange('primaryFrom', '');
                  onInputChange('primaryTo', '');
                  onInputChange('primaryEducation', '');
                } else if (
                  value.trim() !== '' &&
                  formData.primaryFrom &&
                  formData.primaryTo
                ) {
                  onInputChange('primaryEducation', 'ELEMENTARY GRADUATE');
                }
              }}
              required
              placeholder="Enter elementary school name"
              className="w-full border rounded-lg px-3 py-3"
            />
          </div>

          {formData.primarySchoolName?.trim() !== '' && (
            <>
              <div>
                <label className="block text-sm font-bold uppercase">From *</label>
                <select
                  value={formData.primaryFrom || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    onInputChange('primaryFrom', value);

                    if (formData.primaryTo && value > formData.primaryTo) {
                      Swal.fire(
                        "Invalid Selection",
                        "'FROM' year cannot be greater than 'TO' year.",
                        "error"
                      );
                      onInputChange('primaryFrom', '');
                    } else if (formData.primarySchoolName && value && formData.primaryTo) {
                      onInputChange('primaryEducation', 'ELEMENTARY GRADUATE');
                    }
                  }}
                  required
                  className="w-full border rounded-lg px-3 py-3"
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
                  value={formData.primaryTo || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    onInputChange('primaryTo', value);

                    if (formData.primaryFrom && value < formData.primaryFrom) {
                      Swal.fire(
                        "Invalid Selection",
                        "'TO' year cannot be lower than 'FROM' year.",
                        "error"
                      );
                      onInputChange('primaryTo', '');
                    } else if (formData.primarySchoolName && formData.primaryFrom && value) {
                      onInputChange('primaryEducation', 'ELEMENTARY GRADUATE');
                    }
                  }}
                  required
                  className="w-full border rounded-lg px-3 py-3"
                >
                  <option value="">SELECT YEAR</option>
                  {renderYearOptions().map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="col-span-3 mt-2">
        <div className="grid grid-cols-4 gap-4 mt-2">
          <div className="col-span-2">
            <label className="block text-sm font-bold uppercase">
              Junior High School Name *
            </label>
            <input
              type="text"
              value={formData.juniorHighSchoolName || ''}
              onChange={(e) => {
                const value = e.target.value.toUpperCase();
                onInputChange('juniorHighSchoolName', value);
                if (value.trim() === '') {
                  onInputChange('juniorHighFrom', '');
                  onInputChange('juniorHighTo', '');
                  onInputChange('juniorHighEducation', '');
                } else if (
                  value.trim() !== '' &&
                  formData.juniorHighFrom &&
                  formData.juniorHighTo
                ) {
                  onInputChange('juniorHighEducation', 'JUNIOR HIGH SCHOOL GRADUATE');
                }
              }}
              required
              placeholder="Enter junior high school name"
              className="w-full border rounded-lg px-3 py-3"
            />
          </div>

          {formData.juniorHighSchoolName?.trim().length > 0 && (
            <>
              <div>
                <label className="block text-sm font-bold uppercase">From *</label>
                <select
                  value={formData.juniorHighFrom || ''}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (formData.primaryTo && value <= Number(formData.primaryTo)) {
                      Swal.fire(
                        "Invalid Selection",
                        "Junior High FROM year must be after Primary TO year.",
                        "error"
                      );
                      onInputChange('juniorHighFrom', '');
                      return;
                    }
                    if (formData.juniorHighTo && value > formData.juniorHighTo) {
                      Swal.fire(
                        "Invalid Selection",
                        "'FROM' year cannot be greater than 'TO' year.",
                        "error"
                      );
                      onInputChange('juniorHighFrom', '');
                      return;
                    }
                    onInputChange('juniorHighFrom', value);
                    if (formData.juniorHighSchoolName && formData.juniorHighTo) {
                      onInputChange('juniorHighEducation', 'JUNIOR HIGH SCHOOL GRADUATE');
                    }
                  }}
                  required
                  className="w-full border rounded-lg px-3 py-3"
                >
                  <option value="">SELECT YEAR</option>
                  {renderYearOptions().map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold uppercase">To *</label>
                <select
                  value={formData.juniorHighTo || ''}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (formData.primaryTo && value <= Number(formData.primaryTo)) {
                      Swal.fire(
                        "Invalid Selection",
                        "Junior High TO year must be after Primary TO year.",
                        "error"
                      );
                      onInputChange('juniorHighTo', '');
                      return;
                    }
                    if (formData.juniorHighFrom && value < formData.juniorHighFrom) {
                      Swal.fire(
                        "Invalid Selection",
                        "'TO' year cannot be lower than 'FROM' year.",
                        "error"
                      );
                      onInputChange('juniorHighTo', '');
                      return;
                    }
                    onInputChange('juniorHighTo', value);
                    if (formData.juniorHighSchoolName && formData.juniorHighFrom) {
                      onInputChange('juniorHighEducation', 'JUNIOR HIGH SCHOOL GRADUATE');
                    }
                  }}
                  required
                  className="w-full border rounded-lg px-3 py-3"
                >
                  <option value="">SELECT YEAR</option>
                  {renderYearOptions().map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </>
          )}
        </div>

        <div className="grid grid-cols-4 gap-4 mt-4">
          <div className="col-span-2">
            <label className="block text-sm font-bold uppercase">
              Senior High School Name *
            </label>
            <input
              type="text"
              value={formData.seniorHighSchoolName || ''}
              onChange={(e) => {
                const value = e.target.value.toUpperCase();
                onInputChange('seniorHighSchoolName', value);
                if (value.trim() === '') {
                  onInputChange('seniorHighFrom', '');
                  onInputChange('seniorHighTo', '');
                  onInputChange('seniorHighEducation', '');
                } else if (value && formData.seniorHighFrom && formData.seniorHighTo) {
                  onInputChange('seniorHighEducation', 'SENIOR HIGH SCHOOL GRADUATE');
                }
              }}
              required
              placeholder="Enter senior high school name"
              className="w-full border rounded-lg px-3 py-3"
            />
          </div>

          {formData.seniorHighSchoolName?.trim().length > 0 && (
            <>
              <div>
                <label className="block text-sm font-bold uppercase">From *</label>
                <select
                  value={formData.seniorHighFrom || ''}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (formData.juniorHighTo && value <= Number(formData.juniorHighTo)) {
                      Swal.fire(
                        "Invalid Selection",
                        "Senior High FROM year must be after Junior High TO year.",
                        "error"
                      );
                      onInputChange('seniorHighFrom', '');
                      return;
                    }
                    if (formData.seniorHighTo && value > formData.seniorHighTo) {
                      Swal.fire(
                        "Invalid Selection",
                        "'FROM' year cannot be greater than 'TO' year.",
                        "error"
                      );
                      onInputChange('seniorHighFrom', '');
                      return;
                    }
                    onInputChange('seniorHighFrom', value);
                    if (formData.seniorHighSchoolName && formData.seniorHighTo) {
                      onInputChange('seniorHighEducation', 'SENIOR HIGH SCHOOL GRADUATE');
                    }
                  }}
                  required
                  className="w-full border rounded-lg px-3 py-3"
                >
                  <option value="">SELECT YEAR</option>
                  {renderYearOptions().map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold uppercase">To *</label>
                <select
                  value={formData.seniorHighTo || ''}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (formData.juniorHighTo && value <= Number(formData.juniorHighTo)) {
                      Swal.fire(
                        "Invalid Selection",
                        "Senior High TO year must be after Junior High TO year.",
                        "error"
                      );
                      onInputChange('seniorHighTo', '');
                      return;
                    }
                    if (formData.seniorHighFrom && value < Number(formData.seniorHighFrom)) {
                      Swal.fire(
                        "Invalid Selection",
                        "'TO' year cannot be lower than 'FROM' year.",
                        "error"
                      );
                      onInputChange('seniorHighTo', '');
                      return;
                    }
                    onInputChange('seniorHighTo', value);
                    if (formData.seniorHighSchoolName && formData.seniorHighFrom) {
                      onInputChange('seniorHighEducation', 'SENIOR HIGH SCHOOL GRADUATE');
                    }
                  }}
                  required
                  className="w-full border rounded-lg px-3 py-3"
                >
                  <option value="">SELECT YEAR</option>
                  {renderYearOptions().map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="col-span-3 mt-2">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold uppercase">
              Tertiary Education *
            </label>
            <select
              value={formData.tertiaryEducation || ''}
              onChange={(e) => {
                onInputChange('tertiaryEducation', e.target.value);
                onInputChange('tertiarySchoolName', '');
                onInputChange('tertiaryFrom', '');
                onInputChange('tertiaryTo', '');
                onInputChange('course', '');
                setCustomCourse('');
                setShowCustomCourse(false);
              }}
              className="border rounded w-full p-3"
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
              <label className="block text-sm font-bold uppercase">
                Tertiary School Name *
              </label>
              <input
                type="text"
                value={formData.tertiarySchoolName || ''}
                onChange={(e) => {
                  const value = e.target.value.toUpperCase();
                  onInputChange('tertiarySchoolName', value);
                  if (value.trim() === '') {
                    onInputChange('tertiaryFrom', '');
                    onInputChange('tertiaryTo', '');
                    onInputChange('course', '');
                    setCustomCourse('');
                    setShowCustomCourse(false);
                  }
                }}
                required
                placeholder="Enter school name"
                className="w-full border rounded-lg px-3 py-3"
              />
            </div>
          )}
        </div>

        {formData.tertiarySchoolName?.trim() !== '' && (
          <div className="grid grid-cols-3 gap-4 mt-3">
            <div>
              <label className="block text-sm font-bold uppercase">From *</label>
              <select
                value={formData.tertiaryFrom || ''}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (formData.seniorHighTo && value <= Number(formData.seniorHighTo)) {
                    Swal.fire(
                      "Invalid Selection",
                      "Tertiary FROM year must be after Senior High TO year.",
                      "error"
                    );
                    onInputChange('tertiaryFrom', '');
                    return;
                  }
                  if (formData.tertiaryTo && value > Number(formData.tertiaryTo)) {
                    Swal.fire("Invalid Selection", "'FROM' year cannot be greater than 'TO' year.", "error");
                    onInputChange('tertiaryFrom', '');
                    return;
                  }
                  onInputChange('tertiaryFrom', value);
                }}
                required
                className="w-full border rounded-lg px-3 py-3"
              >
                <option value="">SELECT YEAR</option>
                {renderYearOptions().map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold uppercase">To *</label>
              <select
                value={formData.tertiaryTo || ''}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (formData.seniorHighTo && value <= Number(formData.seniorHighTo)) {
                    Swal.fire(
                      "Invalid Selection",
                      "Tertiary TO year must be after Senior High TO year.",
                      "error"
                    );
                    onInputChange('tertiaryTo', '');
                    return;
                  }
                  if (formData.tertiaryFrom && value < Number(formData.tertiaryFrom)) {
                    Swal.fire("Invalid Selection", "'TO' year cannot be lower than 'FROM' year.", "error");
                    onInputChange('tertiaryTo', '');
                    return;
                  }
                  onInputChange('tertiaryTo', value);
                }}
                required
                className="w-full border rounded-lg px-3 py-3"
              >
                <option value="">SELECT YEAR</option>
                {renderYearOptions().map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold uppercase">Course *</label>
              {!showCustomCourse ? (
                <select
                  value={formData.course || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === 'OTHERS') {
                      setShowCustomCourse(true);
                      setCustomCourse('');
                      onInputChange('course', '');
                    } else {
                      onInputChange('course', value);
                    }
                  }}
                  className="w-full border rounded-lg px-3 py-3"
                  required
                >
                  <option value="">SELECT COURSE</option>
                  {formData.tertiaryEducation === "COLLEGE GRADUATE" &&
                    COLLEGE_COURSES.map((course, index) => (
                      <option key={index} value={course}>{course}</option>
                    ))}
                  {formData.tertiaryEducation === "TECHNICAL/VOCATIONAL COURSE GRADUATE" &&
                    TECHNICAL_VOCATIONAL_COURSES.map((course, index) => (
                      <option key={index} value={course}>{course}</option>
                    ))}
                  {formData.tertiaryEducation === "ALS SECONDARY GRADUATE" &&
                    ALS_SECONDARY_COURSES.map((course, index) => (
                      <option key={index} value={course}>{course}</option>
                    ))}
                  {formData.tertiaryEducation === "COLLEGE UNDERGRADUATE" &&
                    COLLEGE_UNDERGRADUATE_COURSES.map((course, index) => (
                      <option key={index} value={course}>{course}</option>
                    ))}
                  <option value="OTHERS">OTHERS (Type manually)</option>
                </select>
              ) : (
                <input
                  type="text"
                  value={customCourse}
                  onChange={(e) => {
                    const value = e.target.value.toUpperCase();
                    setCustomCourse(value);
                    onInputChange('course', value);
                    if (value.trim() === '') setShowCustomCourse(false);
                  }}
                  required
                  placeholder="Enter your course"
                  className="w-full border rounded-lg px-3 py-3 uppercase"
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
          onChange={(e) => onInputChange('beneficiaryName', e.target.value)}
          className="w-full border rounded-lg px-3 py-3 uppercase"
          style={{ textTransform: 'uppercase' }}
        />
      </div>
    </>
  );
};

export default ApplicantFormEducation;
