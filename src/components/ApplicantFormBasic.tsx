import React, { useState } from "react";

interface ApplicantFormBasicProps {
  formData: any;
  editingApplicant: any;
  activeProgram: "GIP" | "TUPAD";
  applicantCode: string;
  onInputChange: (field: string, value: any) => void;
}

const truncateFileName = (fileName: string, maxLength: number = 15) => {
  if (!fileName) return "";
  if (fileName.length <= maxLength) return fileName;

  const extension = fileName.split(".").pop();
  const base = fileName.substring(0, fileName.lastIndexOf("."));
  const shortBase = base.substring(0, maxLength - (extension?.length || 0) - 3);
  return `${shortBase}...${extension}`;
};

const downloadResume = (fileName: string, fileData: string) => {
  const link = document.createElement("a");
  link.href = fileData;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
};

const validateName = (value: string) => /^[A-Z\s'-]*$/.test(value);

const calculateAge = (birthDate: string) => {
  if (!birthDate) return "";
  const today = new Date();
  const dob = new Date(birthDate);
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
};

const ApplicantFormBasic: React.FC<ApplicantFormBasicProps> = ({
  formData,
  editingApplicant,
  activeProgram,
  applicantCode,
  onInputChange,
}) => {
  const [nameErrors, setNameErrors] = useState({
    first: "",
    middle: "",
    last: "",
  });

  const [telephoneError, setTelephoneError] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);

  return (
    <>
      {/* Applicant Code */}
      <div>
        <label className="block text-sm font-bold mb-1 uppercase">
          Applicant Code
        </label>
        <input
          type="text"
          value={applicantCode}
          readOnly
          className="w-full border rounded-lg px-3 py-2 
            bg-gray-100 dark:bg-slate-700/60 
            text-gray-800 dark:text-white"
        />
      </div>

      {/* Photo Upload */}
      {activeProgram === "GIP" && (
        <div>
          <label className="block text-sm font-bold mb-1 uppercase">
            Upload 2x2 Photo *
          </label>

          <div
            className="flex items-center gap-3 border rounded-lg px-3 py-2 
            bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
          >
            <label className="cursor-pointer shrink-0">
              <span className="bg-yellow-400 px-3 py-1 rounded-md font-medium hover:bg-yellow-500 transition">
                Choose File
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      onInputChange("photoFile", file);
                      onInputChange("photoFileName", file.name);
                      onInputChange("photoFileData", reader.result as string);
                    };
                    reader.readAsDataURL(file);
                  } else {
                    onInputChange("photoFile", null);
                    onInputChange("photoFileName", "");
                    onInputChange("photoFileData", "");
                  }
                }}
              />
            </label>

            {(formData.photoFileName || editingApplicant?.photoFileName) ? (
              <span
                className="text-sm text-green-600 dark:text-green-400 font-medium cursor-pointer hover:underline"
                onClick={() => {
                  const img =
                    formData.photoFileData ||
                    editingApplicant?.photoFileData ||
                    null;
                  if (img) {
                    setSelectedImage(img);
                    setShowImageModal(true);
                  }
                }}
              >
                {truncateFileName(
                  formData.photoFileName || editingApplicant?.photoFileName
                )}
              </span>
            ) : (
              <span className="text-gray-500 text-sm">No file chosen</span>
            )}
          </div>
        </div>
      )}

      {/* Resume Upload */}
      <div>
        <label className="block text-sm font-bold mb-1 uppercase">
          Upload Resume
        </label>
        <div
          className="flex items-center gap-3 border rounded-lg px-3 py-2 
          bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
        >
          <label className="cursor-pointer shrink-0">
            <span className="bg-yellow-400 px-3 py-1 rounded-md font-medium hover:bg-yellow-500 transition">
              Choose File
            </span>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  onInputChange("resumeFile", file);
                  onInputChange("resumeFileName", file.name);
                } else {
                  onInputChange("resumeFile", null);
                  onInputChange("resumeFileName", "");
                }
              }}
            />
          </label>

          {(formData.resumeFileName || editingApplicant?.resumeFileName) ? (
            <button
              type="button"
              onClick={() => {
                const fileName =
                  formData.resumeFileName ||
                  editingApplicant?.resumeFileName;
                const fileData =
                  formData.resumeFileData || editingApplicant?.resumeFileData;
                if (fileName && fileData) {
                  downloadResume(fileName, fileData);
                }
              }}
              className="text-blue-600 dark:text-blue-300 hover:underline text-sm font-medium truncate max-w-[150px]"
            >
              {formData.resumeFileName || editingApplicant?.resumeFileName}
            </button>
          ) : (
            <span className="text-gray-500 text-sm">No file chosen</span>
          )}
        </div>
      </div>

      {["firstName", "middleName", "lastName"].map((key, i) => {
        const labels = ["First Name *", "Middle Name", "Last Name *"];
        const errorKey = ["first", "middle", "last"][i];

        return (
          <div key={key}>
            <label className="block text-sm font-bold mb-1 uppercase">
              {labels[i]}
            </label>
            <input
              type="text"
              value={formData[key]}
              onChange={(e) => {
                const value = e.target.value.toUpperCase();
                if (value === "" || validateName(value)) {
                  onInputChange(key, value);
                  setNameErrors((prev) => ({ ...prev, [errorKey]: "" }));
                } else {
                  setNameErrors((prev) => ({
                    ...prev,
                    [errorKey]:
                      "Only letters, spaces, hyphens (-), apostrophes (') allowed.",
                  }));
                }
              }}
              required={key !== "middleName"}
              className={`w-full border rounded-lg px-3 py-2 uppercase 
                bg-white dark:bg-slate-700 text-gray-800 dark:text-white
                ${nameErrors[errorKey] ? "border-red-500" : ""}`}
            />
            {nameErrors[errorKey] && (
              <p className="text-xs text-red-500 mt-1">
                {nameErrors[errorKey]}
              </p>
            )}
          </div>
        );
      })}

      {/* Suffix */}
      <div>
        <label className="block text-sm font-bold mb-1 uppercase">Suffix</label>
        <input
          type="text"
          value={formData.extensionName}
          onChange={(e) => onInputChange("extensionName", e.target.value)}
          className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-slate-700 uppercase text-gray-900 dark:text-white"
          placeholder="JR, SR, III, ETC."
        />
      </div>

      {/* Birth Date */}
      <div>
        <label className="block text-sm font-bold mb-1 uppercase">
          Birth Date
        </label>
        <input
          type="date"
          value={formData.birthDate}
          onChange={(e) => {
            const birthDate = e.target.value;
            onInputChange("birthDate", birthDate);
            onInputChange("age", calculateAge(birthDate));
          }}
          className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
          required
        />
      </div>

      {/* AGE — READONLY */}
      <div>
        <label className="block text-sm font-bold mb-1 uppercase">Age</label>
        <input
          type="number"
          readOnly
          value={formData.age || ""}
          className="w-full border rounded-lg px-3 py-2
            bg-gray-100 dark:bg-slate-700/60 
            text-gray-900 dark:text-white"
        />
      </div>

      {/* Gender */}
      <div>
        <label className="block text-sm font-bold mb-1 uppercase">Gender *</label>
        <select
          value={formData.gender}
          onChange={(e) => onInputChange("gender", e.target.value)}
          className="w-full border rounded-lg px-3 py-2
            bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
        >
          <option value="">SELECT GENDER</option>
          <option value="MALE">MALE</option>
          <option value="FEMALE">FEMALE</option>
        </select>
      </div>

      {/* GIP-ONLY FIELDS */}
      {activeProgram === "GIP" && (
        <>
          <div>
            <label className="block text-sm font-bold mb-1 uppercase">
              Place of Birth *
            </label>
            <input
              type="text"
              value={formData.placeOfBirth || ""}
              onChange={(e) => onInputChange("placeOfBirth", e.target.value)}
              className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-slate-700 uppercase text-gray-900 dark:text-white"
              placeholder="CITY / PROVINCE"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1 uppercase">
              Residential Address *
            </label>
            <input
              type="text"
              value={formData.residentialAddress || ""}
              onChange={(e) =>
                onInputChange("residentialAddress", e.target.value)
              }
              className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-slate-700 uppercase text-gray-900 dark:text-white placeholder:text-[10px]"
              placeholder="HOUSE NO. / STREET / SUBDIVISION"
              required
            />
          </div>
        </>
      )}

      {/* Barangay */}
      <div>
        <label className="block text-sm font-bold mb-1 uppercase">Barangay *</label>
        <select
          value={formData.barangay}
          onChange={(e) => onInputChange("barangay", e.target.value)}
          className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
          required
        >
          <option value="">SELECT BARANGAY</option>
          {[
            "APLAYA",
            "BALIBAGO",
            "CAINGIN",
            "DITA",
            "DILA",
            "DON JOSE",
            "IBABA",
            "KANLURAN",
            "LABAS",
            "MACABLING",
            "MALITLIT",
            "MALUSAK",
            "MARKET AREA",
            "POOC",
            "PULONG SANTA CRUZ",
            "SANTO DOMINGO",
            "SINALHAN",
            "TAGAPO",
          ].map((b) => (
            <option key={b}>{b}</option>
          ))}
        </select>
      </div>

      {/* MOBILE NUMBER */}
      <div>
        <label className="block text-sm font-bold mb-1 uppercase">
          Mobile Number *
        </label>
        <input
          type="text"
          value={formData.contactNumber}
          onChange={(e) => {
            let v = e.target.value.replace(/[^0-9]/g, "");
            if (v.length > 11) v = v.slice(0, 11);

            let formatted = v;
            if (v.length > 4) formatted = v.slice(0, 4) + "-" + v.slice(4);
            if (v.length > 7)
              formatted = v.slice(0, 4) + "-" + v.slice(4, 7) + "-" + v.slice(7);

            onInputChange("contactNumber", formatted);
          }}
          placeholder="09XX-XXX-XXXX"
          className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
          maxLength={13}
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          Format: 09XX-XXX-XXXX
        </p>
      </div>

      {activeProgram === "GIP" && (
        <div>
          <label className="block text-sm font-bold mb-1 uppercase">
            Telephone Number
          </label>
          <input
            type="text"
            value={formData.telephoneNumber || ""}
            onChange={(e) => {
              const val = e.target.value.toUpperCase();
              if (val === "") {
                onInputChange("telephoneNumber", "");
                setTelephoneError("");
                return;
              }
              if (/^[0-9()\-\s]*$/.test(val) && val.length <= 20) {
                onInputChange("telephoneNumber", val);
                setTelephoneError("");
              } else {
                setTelephoneError(
                  "Invalid format: numbers, parentheses, hyphens only."
                );
              }
            }}
            placeholder="(AREA CODE) NUMBER"
            className={`w-full border rounded-lg px-3 py-2 bg-white dark:bg-slate-700 text-gray-900 dark:text-white ${
              telephoneError ? "border-red-500" : ""
            }`}
          />
          {telephoneError && (
            <p className="text-xs text-red-500 mt-1">{telephoneError}</p>
          )}
          {!telephoneError && (
            <p className="text-xs text-gray-500 mt-1">Leave blank if none</p>
          )}
        </div>
      )}

      {activeProgram === "GIP" && (
        <div>
          <label className="block text-sm font-bold mb-1 uppercase">
            Email *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => onInputChange("email", e.target.value)}
            className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
            placeholder="Enter Email Address"
            required
          />
        </div>
      )}

      {activeProgram === "GIP" && (
        <div>
          <label className="block text-sm font-bold mb-1 uppercase">
            Civil Status *
          </label>
          <select
            value={formData.civilStats || ""}
            onChange={(e) => onInputChange("civilStats", e.target.value)}
            className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
            required
          >
            <option value="">SELECT CIVIL STATUS</option>
            <option>SINGLE</option>
            <option>MARRIED</option>
            <option>WIDOW/WIDOWER</option>
          </select>
        </div>
      )}
      {showImageModal && selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60]"
          onClick={() => setShowImageModal(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh] p-4">
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 bg-white dark:bg-slate-700 p-2 rounded-full"
            >
              ✕
            </button>
            <img
              src={selectedImage}
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ApplicantFormBasic;
