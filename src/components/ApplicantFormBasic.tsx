import React, { useState } from "react";
import Swal from "sweetalert2";

interface ApplicantFormBasicProps {
  formData: any;
  editingApplicant: any;
  activeProgram: 'GIP' | 'TUPAD';
  applicantCode: string;
  onInputChange: (field: string, value: any) => void;
}

const truncateFileName = (fileName: string, maxLength: number = 15) => {
  if (fileName.length <= maxLength) return fileName;
  const extension = fileName.split('.').pop();
  const nameWithoutExtension = fileName.substring(0, fileName.lastIndexOf('.'));
  const truncatedName = nameWithoutExtension.substring(0, maxLength - 3 - (extension?.length || 0));
  return `${truncatedName}...${extension}`;
};

const downloadResume = (fileName: string, fileData: string) => {
  const link = document.createElement('a');
  link.href = fileData;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const validateName = (value: string) => {
  const pattern = /^[A-Z\s'-]*$/;
  return pattern.test(value);
};

const ApplicantFormBasic: React.FC<ApplicantFormBasicProps> = ({
  formData,
  editingApplicant,
  activeProgram,
  applicantCode,
  onInputChange
}) => {
  const [nameErrors, setNameErrors] = useState({
    first: '',
    middle: '',
    last: '',
  });
  const [telephoneError, setTelephoneError] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);

  return (
    <>
      <div>
        <label className="block text-sm font-bold mb-1 uppercase">Applicant Code</label>
        <input
          type="text"
          value={applicantCode}
          readOnly
          className="w-full border rounded-lg px-3 py-2 bg-gray-100"
        />
      </div>

      {activeProgram === 'GIP' && (
        <div>
          <label className="block text-sm font-bold mb-1 uppercase">Upload 2x2 Photo *</label>
          <div className="flex items-center gap-3 border rounded-lg px-3 py-2 bg-white">
            <label className="cursor-pointer shrink-0">
              <span className="bg-yellow-400 px-3 py-1 rounded-md font-medium hover:bg-yellow-500 transition whitespace-nowrap">
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
                      onInputChange('photoFile', file);
                      onInputChange('photoFileName', file.name);
                      onInputChange('photoFileData', reader.result as string);
                    };
                    reader.readAsDataURL(file);
                  } else {
                    onInputChange('photoFile', null);
                    onInputChange('photoFileName', '');
                    onInputChange('photoFileData', '');
                  }
                }}
              />
            </label>
            {(formData.photoFileName || editingApplicant?.photoFileName) ? (
              <span
                className="text-sm text-green-600 font-medium cursor-pointer hover:text-green-700 hover:underline"
                onClick={(e) => {
                  e.preventDefault();
                  if (formData.photoFileData || editingApplicant?.photoFileData) {
                    setSelectedImage(formData.photoFileData || editingApplicant?.photoFileData || null);
                    setShowImageModal(true);
                  }
                }}
                title={formData.photoFileName || editingApplicant?.photoFileName}
              >
                {truncateFileName(formData.photoFileName || editingApplicant?.photoFileName || '')}
              </span>
            ) : (
              <span className="text-gray-500 text-sm">No file chosen</span>
            )}
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-bold mb-1 uppercase">Upload Resume</label>
        <div className="flex items-center gap-3 border rounded-lg px-3 py-2 bg-white">
          <label className="cursor-pointer shrink-0">
            <span className="bg-yellow-400 px-3 py-1 rounded-md font-medium hover:bg-yellow-500 transition whitespace-nowrap">
              Choose File
            </span>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  onInputChange('resumeFile', file);
                  onInputChange('resumeFileName', file.name);
                } else {
                  onInputChange('resumeFile', null);
                  onInputChange('resumeFileName', '');
                }
              }}
            />
          </label>

          {(formData.resumeFileName || editingApplicant?.resumeFileName) ? (
            <button
              type="button"
              onClick={() => {
                const fileName = formData.resumeFileName || editingApplicant?.resumeFileName;
                const fileData = formData.resumeFileData || editingApplicant?.resumeFileData;
                if (fileName && fileData) {
                  downloadResume(fileName, fileData);
                }
              }}
              className="text-blue-600 hover:text-blue-800 hover:underline text-sm font-medium truncate max-w-[150px] text-left"
              title={formData.resumeFileName || editingApplicant?.resumeFileName}
            >
              {formData.resumeFileName || editingApplicant?.resumeFileName}
            </button>
          ) : (
            <span className="text-gray-500 text-sm">No file chosen</span>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold mb-1 uppercase">First Name *</label>
        <input
          type="text"
          value={formData.firstName}
          onChange={(e) => {
            const value = e.target.value.toUpperCase();
            if (value === '' || validateName(value)) {
              onInputChange('firstName', value);
              setNameErrors((prev) => ({ ...prev, first: '' }));
            } else {
              setNameErrors((prev) => ({ ...prev, first: 'Only letters, spaces, hyphen (-) and apostrophe (\') allowed.' }));
            }
          }}
          required
          className={`w-full border rounded-lg px-3 py-2 uppercase ${
            nameErrors.first ? 'border-red-500' : ''
          }`}
          style={{ textTransform: 'uppercase' }}
        />
        {nameErrors.first && <p className="text-xs text-red-500 mt-1">{nameErrors.first}</p>}
      </div>

      <div>
        <label className="block text-sm font-bold mb-1 uppercase">Middle Name</label>
        <input
          type="text"
          value={formData.middleName}
          onChange={(e) => {
            const value = e.target.value.toUpperCase();
            if (value === '' || validateName(value)) {
              onInputChange('middleName', value);
              setNameErrors((prev) => ({ ...prev, middle: '' }));
            } else {
              setNameErrors((prev) => ({ ...prev, middle: 'Only letters, spaces, hyphen (-) and apostrophe (\') allowed.' }));
            }
          }}
          className={`w-full border rounded-lg px-3 py-2 uppercase ${
            nameErrors.middle ? 'border-red-500' : ''
          }`}
          style={{ textTransform: 'uppercase' }}
        />
        {nameErrors.middle && <p className="text-xs text-red-500 mt-1">{nameErrors.middle}</p>}
      </div>

      <div>
        <label className="block text-sm font-bold mb-1 uppercase">Last Name *</label>
        <input
          type="text"
          value={formData.lastName}
          onChange={(e) => {
            const value = e.target.value.toUpperCase();
            if (value === '' || validateName(value)) {
              onInputChange('lastName', value);
              setNameErrors((prev) => ({ ...prev, last: '' }));
            } else {
              setNameErrors((prev) => ({ ...prev, last: 'Only letters, spaces, hyphen (-) and apostrophe (\') allowed.' }));
            }
          }}
          required
          className={`w-full border rounded-lg px-3 py-2 uppercase ${
            nameErrors.last ? 'border-red-500' : ''
          }`}
          style={{ textTransform: 'uppercase' }}
        />
        {nameErrors.last && <p className="text-xs text-red-500 mt-1">{nameErrors.last}</p>}
      </div>

      <div>
        <label className="block text-sm font-bold mb-1 uppercase">Suffix</label>
        <input
          type="text"
          value={formData.extensionName}
          onChange={(e) => onInputChange('extensionName', e.target.value)}
          placeholder="JR, SR, III, etc."
          className="w-full border rounded-lg px-3 py-2 uppercase"
          style={{ textTransform: 'uppercase' }}
        />
      </div>

      <div>
        <label className="block text-sm font-bold mb-1 uppercase">Birth Date</label>
        <input
          type="date"
          value={formData.birthDate}
          onChange={(e) => {
            const birthDate = e.target.value;
            onInputChange('birthDate', birthDate);
          }}
          required
          className="w-full border rounded-lg px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-bold mb-1 uppercase">Age</label>
        <input
          type="number"
          value={formData.age || ''}
          readOnly
          className="w-full border rounded-lg px-3 py-2 bg-gray-100"
        />
        <p className="text-xs text-gray-500 mt-1">
          {activeProgram === 'GIP' ? 'Must be 18–29 years old' : 'Must be 25-58 years old'}
        </p>
      </div>

      <div>
        <label className="block text-sm font-bold uppercase">Gender *</label>
        <select
          value={formData.gender}
          onChange={(e) => onInputChange('gender', e.target.value)}
          className="w-full border rounded-lg px-3 py-3"
        >
          <option value="">SELECT GENDER</option>
          <option value="MALE">MALE</option>
          <option value="FEMALE">FEMALE</option>
        </select>
      </div>

      {activeProgram === 'GIP' && (
        <div>
          <label className="block text-sm font-bold mb-1 uppercase">Place of Birth *</label>
          <input
            type="text"
            value={formData.placeOfBirth || ''}
            onChange={(e) => onInputChange('placeOfBirth', e.target.value)}
            required
            placeholder="City/Province"
            className="w-full border rounded-lg px-3 py-2 uppercase"
            style={{ textTransform: 'uppercase' }}
          />
        </div>
      )}

      {activeProgram === 'GIP' && (
        <div>
          <label className="block text-sm font-bold mb-1 uppercase">Residential Address *</label>
          <input
            type="text"
            value={formData.residentialAddress || ''}
            onChange={(e) => onInputChange('residentialAddress', e.target.value)}
            required
            placeholder="House No. / Street / Subdivision"
            className="w-full border rounded-lg px-3 py-2 uppercase placeholder:text-[10px]"
            style={{ textTransform: 'uppercase' }}
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-bold uppercase">Barangay *</label>
        <select
          value={formData.barangay}
          onChange={(e) => onInputChange('barangay', e.target.value)}
          required
          className="w-full border rounded-lg px-3 py-3"
        >
          <option value="">SELECT BARANGAY</option>
          <option>APLAYA</option>
          <option>BALIBAGO</option>
          <option>CAINGIN</option>
          <option>DITA</option>
          <option>DILA</option>
          <option>DON JOSE</option>
          <option>IBABA</option>
          <option>KANLURAN</option>
          <option>LABAS</option>
          <option>MACABLING</option>
          <option>MALITLIT</option>
          <option>MALUSAK</option>
          <option>MARKET AREA</option>
          <option>POOC</option>
          <option>PULONG SANTA CRUZ</option>
          <option>SANTO DOMINGO</option>
          <option>SINALHAN</option>
          <option>TAGAPO</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-bold mb-1 uppercase">Mobile Number *</label>
        <input
          type="text"
          value={formData.contactNumber}
          onChange={(e) => {
            let value = e.target.value.replace(/[^0-9]/g, '');

            if (value.length > 11) {
              value = value.slice(0, 11);
            }

            if (value.length > 0) {
              let formatted = value;
              if (value.length > 4) {
                formatted = value.slice(0, 4) + '-' + value.slice(4);
              }
              if (value.length > 7) {
                formatted = value.slice(0, 4) + '-' + value.slice(4, 7) + '-' + value.slice(7);
              }
              onInputChange('contactNumber', formatted);
            } else {
              onInputChange('contactNumber', value);
            }
          }}
          pattern="09[0-9]{2}-[0-9]{3}-[0-9]{4}"
          title="Contact number must start with 09 and follow format: 09XX-XXX-XXXX"
          required
          maxLength={13}
          placeholder="09XX-XXX-XXXX"
          className="w-full border rounded-lg px-3 py-2"
        />
        <p className="text-xs text-gray-500 mt-1">Format: 09XX-XXX-XXXX</p>
      </div>

      {activeProgram === 'GIP' && (
        <div>
          <label className="block text-sm font-bold mb-1 uppercase">Telephone Number</label>
          <input
            type="text"
            value={formData.telephoneNumber || ''}
            onChange={(e) => {
              const value = e.target.value.toUpperCase();
              if (value.trim() === "") {
                onInputChange('telephoneNumber', "");
                setTelephoneError('');
                return;
              }
              const pattern = /^[0-9()\-\s]*$/;

              if (pattern.test(value) && value.length <= 20) {
                onInputChange('telephoneNumber', value);
                setTelephoneError('');
              } else {
                setTelephoneError('Invalid format. Use digits, parentheses, hyphen, or leave blank.');
              }
            }}
            placeholder="(Area code) Number"
            className={`w-full border rounded-lg px-3 py-2 ${
              telephoneError ? 'border-red-500' : ''
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

      {activeProgram === 'GIP' && (
        <div>
          <label className="block text-sm font-bold mb-1 uppercase">Email *</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => onInputChange('email', e.target.value)}
            required
            placeholder="example@email.com"
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>
      )}

      {activeProgram === 'GIP' && (
        <div>
          <label className="block text-sm font-bold uppercase">Civil Status *</label>
          <select
            value={formData.civilStats || ''}
            onChange={(e) => onInputChange('civilStats', e.target.value)}
            required
            className="w-full border rounded-lg px-3 py-3"
          >
            <option value="">SELECT CIVIL STATUS</option>
            <option>SINGLE</option>
            <option>MARRIED</option>
            <option>WIDOW/WIDOWER</option>
          </select>
        </div>
      )}

      {activeProgram === 'TUPAD' && (
        <>
          <div>
            <label className="block text-sm font-bold mb-2 uppercase">Type of ID Submitted *</label>
            <select
              value={formData.idType}
              onChange={(e) => onInputChange('idType', e.target.value)}
              required
              className="w-full border rounded-lg px-3 py-3"
            >
              <option value="">SELECT ID TYPE</option>
              <option>PHILSYS ID</option>
              <option>DRIVER'S LICENSE</option>
              <option>SSS ID</option>
              <option>UMID</option>
              <option>PASSPORT</option>
              <option>VOTER'S ID</option>
              <option>POSTAL ID</option>
              <option>PRC ID</option>
              <option>SENIOR CITIZEN ID</option>
              <option>PWD ID</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold mb-1 uppercase">ID Number</label>
            <input
              type="text"
              value={formData.idNumber}
              onChange={(e) => onInputChange('idNumber', e.target.value)}
              className="w-full border rounded-lg px-3 py-2 uppercase"
              style={{ textTransform: 'uppercase' }}
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1 uppercase">Occupation</label>
            <input
              type="text"
              value={formData.occupation}
              onChange={(e) => onInputChange('occupation', e.target.value)}
              className="w-full border rounded-lg px-3 py-2 uppercase"
              style={{ textTransform: 'uppercase' }}
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 uppercase">Civil Status</label>
            <select
              value={formData.civilStatus}
              onChange={(e) => onInputChange('civilStatus', e.target.value)}
              className="w-full border rounded-lg px-3 py-3"
            >
              <option value="">SELECT CIVIL STATUS</option>
              <option>SINGLE</option>
              <option>MARRIED</option>
              <option>WIDOWED</option>
              <option>SEPARATED</option>
              <option>DIVORCED</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold mb-1 uppercase">Average Monthly Income</label>
            <input
              type="text"
              value={formData.averageMonthlyIncome}
              onChange={(e) => onInputChange('averageMonthlyIncome', e.target.value)}
              placeholder="₱"
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1 uppercase">Dependent Name</label>
            <input
              type="text"
              value={formData.dependentName}
              onChange={(e) => onInputChange('dependentName', e.target.value.toUpperCase())}
              className="w-full border rounded-lg px-3 py-2 uppercase"
              style={{ textTransform: 'uppercase' }}
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1 uppercase">Relationship to Dependent</label>
            <input
              type="text"
              value={formData.relationshipToDependent}
              onChange={(e) => onInputChange('relationshipToDependent', e.target.value)}
              className="w-full border rounded-lg px-3 py-2 uppercase"
              style={{ textTransform: 'uppercase' }}
            />
          </div>
        </>
      )}

      {showImageModal && selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[60]"
          onClick={() => setShowImageModal(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh] p-4">
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-6 right-6 bg-white rounded-full p-2 hover:bg-gray-100 transition z-10"
            >
              <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img
              src={selectedImage}
              alt="Preview"
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ApplicantFormBasic;
