import React from "react";
import { X, Printer } from "lucide-react";
import { Applicant } from "../utils/dataService";

interface ApplicantProfileProps {
  applicant: Applicant;
  onClose: () => void;
}

const ApplicantProfile: React.FC<ApplicantProfileProps> = ({ applicant, onClose }) => {
  const [showImageModal, setShowImageModal] = React.useState(false);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="bg-red-700 text-white px-6 py-4 flex items-center justify-between sticky top-0 z-10 no-print">
          <h2 className="text-xl font-bold">DOLE-GIP Application Form</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="hover:bg-red-800 p-2 rounded transition-colors"
              title="Print"
            >
              <Printer className="w-5 h-5" />
            </button>
            <button onClick={onClose} className="hover:bg-red-800 p-2 rounded transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 bg-white">
          <div className="border-2 border-black" id="applicant-profile-content">
            <div className="border-b-2 border-black p-4 text-center">
              <p className="font-bold text-sm mb-1">DOLE REGIONAL OFFICE NO. ____</p>
              <p className="font-bold text-sm mb-1">GOVERNMENT INTERNSHIP PROGRAM (GIP)</p>
              <p className="font-bold text-sm">APPLICATION FORM</p>
            </div>

            <div className="border-b-2 border-black p-3">
              <p className="font-bold text-xs mb-1">INSTRUCTION TO APPLICANTS:</p>
              <p className="text-xs">Please fill out all the required information in this form and attach additional documents, if necessary.</p>
            </div>

            <div className="grid grid-cols-3 gap-0">
              <div className="col-span-2 border-r-2 border-black border-b-2 p-3">
                <p className="font-bold text-xs mb-2">1. NAME OF APPLICANT:</p>
                <div className="border-b border-black mb-2 pb-1">
                  <div className="grid grid-cols-3 gap-2 text-xs font-semibold">
                    <div>Family Name</div>
                    <div>First Name</div>
                    <div>Middle Name</div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs mt-1">
                    <div>{applicant.lastName.toUpperCase()}</div>
                    <div>{applicant.firstName.toUpperCase()}</div>
                    <div>{applicant.middleName ? applicant.middleName.toUpperCase() : '-'}</div>
                  </div>
                </div>
              </div>

              <div className="border-b-2 border-black p-3 flex flex-col items-center justify-center">
                <p className="text-xs font-bold text-center mb-2">ATTACH 2x2 PHOTO WITH NAME AND SIGNATURE TAKEN WITHIN THE LAST THREE (3) MONTHS</p>
                {applicant.photoFileData && (
                  <img
                    src={applicant.photoFileData}
                    alt="Applicant Photo"
                    className="w-16 h-16 object-cover border border-gray-400 cursor-pointer hover:opacity-80 transition"
                    onClick={() => setShowImageModal(true)}
                  />
                )}
                {!applicant.photoFileData && (
                  <div className="w-16 h-16 bg-gray-200 border border-gray-400 flex items-center justify-center text-xs text-gray-500">
                    No photo
                  </div>
                )}
              </div>
            </div>

            <div className="border-b-2 border-black p-3">
              <p className="font-bold text-xs mb-2">2. RESIDENTIAL ADDRESS:</p>
              <div className="border-b border-black mb-2 pb-2 text-xs">
                <p>{applicant.barangay.toUpperCase()}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="border-b border-black pb-1">
                  <p className="font-semibold">Telephone No.:</p>
                  <p>{applicant.telephoneNumber || '-'}</p>
                </div>
                <div className="border-b border-black pb-1">
                  <p className="font-semibold">Mobile No.:</p>
                  <p>{applicant.contactNumber}</p>
                </div>
              </div>
              <div className="mt-2 text-xs border-b border-black pb-1">
                <p className="font-semibold">E-mail Address:</p>
                <p>{(applicant.email || '-').toUpperCase()}</p>
              </div>
            </div>

            <div className="border-b-2 border-black p-3">
              <p className="font-bold text-xs mb-1">3. PLACE OF BIRTH (city/province)</p>
              <p className="text-xs border-b border-black pb-2">{applicant.placeOfBirth ? applicant.placeOfBirth.toUpperCase() : '-'}</p>
            </div>

            <div className="border-b-2 border-black p-3">
              <p className="font-bold text-xs mb-1">4. DATE OF BIRTH (mm/dd/yyyy)</p>
              <p className="text-xs">{applicant.birthDate}</p>
            </div>

            <div className="grid grid-cols-2 gap-0 border-b-2 border-black">
              <div className="border-r-2 border-black p-3">
                <p className="font-bold text-xs mb-1">5. GENDER</p>
                <div className="text-xs space-y-1">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" checked={applicant.gender === 'MALE'} readOnly className="w-3 h-3" />
                    <span>Male</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" checked={applicant.gender === 'FEMALE'} readOnly className="w-3 h-3" />
                    <span>Female</span>
                  </div>
                </div>
              </div>

              <div className="p-3">
                <p className="font-bold text-xs mb-1">6. CIVIL STATUS</p>
                <div className="text-xs space-y-1">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" checked={applicant.civilStats === 'SINGLE'} readOnly className="w-3 h-3" />
                    <span>Single</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" checked={applicant.civilStats === 'MARRIED'} readOnly className="w-3 h-3" />
                    <span>Married</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" checked={applicant.civilStats === 'WIDOW/WIDOWER'} readOnly className="w-3 h-3" />
                    <span>Widow/Widower</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-b-2 border-black p-3">
              <p className="font-bold text-xs mb-2">7. EDUCATIONAL ATTAINMENT</p>
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr>
                    <th className="border border-black p-2 text-left font-bold">NAME OF SCHOOL</th>
                    <th className="border border-black p-2 text-center font-bold" colSpan={2}>INCLUSIVE DATES</th>
                    <th className="border border-black p-2 text-left font-bold">DEGREE OR DIPLOMA</th>
                  </tr>
                  <tr>
                    <th className="border border-black p-1"></th>
                    <th className="border border-black p-1 text-center font-semibold">From</th>
                    <th className="border border-black p-1 text-center font-semibold">To</th>
                    <th className="border border-black p-1"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-black p-2">{applicant.school ? applicant.school.toUpperCase() : '-'}</td>
                    <td className="border border-black p-2 text-center">-</td>
                    <td className="border border-black p-2 text-center">-</td>
                    <td className="border border-black p-2">{applicant.educationalAttainment.toUpperCase()}</td>
                  </tr>
                  <tr>
                    <td className="border border-black p-2"></td>
                    <td className="border border-black p-2"></td>
                    <td className="border border-black p-2"></td>
                    <td className="border border-black p-2"></td>
                  </tr>
                  <tr>
                    <td className="border border-black p-2"></td>
                    <td className="border border-black p-2"></td>
                    <td className="border border-black p-2"></td>
                    <td className="border border-black p-2"></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="border-b-2 border-black p-3">
              <p className="font-bold text-xs mb-1">8. DISADVANTAGED GROUP</p>
              <div className="text-xs flex flex-wrap gap-4 mt-1">
                <div className="flex items-center gap-1">
                  <input type="checkbox" readOnly className="w-3 h-3" />
                  <span>PWDs</span>
                </div>
                <div className="flex items-center gap-1">
                  <input type="checkbox" readOnly className="w-3 h-3" />
                  <span>IPs</span>
                </div>
                <div className="flex items-center gap-1">
                  <input type="checkbox" readOnly className="w-3 h-3" />
                  <span>Victims of Armed Conflict</span>
                </div>
                <div className="flex items-center gap-1">
                  <input type="checkbox" readOnly className="w-3 h-3" />
                  <span>Rebel Returnee</span>
                </div>
                <div className="flex items-center gap-1">
                  <input type="checkbox" readOnly className="w-3 h-3" />
                  <span>4Ps</span>
                </div>
                <div className="flex items-center gap-1">
                  <input type="checkbox" readOnly className="w-3 h-3" />
                  <span>Others:</span>
                  <input type="text" className="border border-black w-20 px-1 text-xs" readOnly />
                </div>
              </div>
            </div>

            <div className="border-b-2 border-black p-3">
              <p className="font-bold text-xs mb-2">CERTIFICATION:</p>
              <p className="text-xs leading-relaxed mb-3">
                Certify that all information provided in this application, including the attached documents, is complete and accurate to the best of my knowledge. I attest to the veracity of the attached requirements. I understand and agree that any misrepresentation in this document or its attachments may result in disqualification, cancellation of the service or contract, and the forfeiture of any refunds received or pay damages to DOLE or comply with any other sanctions in accordance with the law.
              </p>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="font-semibold mb-1">Signature of Applicant</p>
                  <div className="border-b-2 border-black h-10"></div>
                </div>
                <div>
                  <p className="font-semibold mb-1">Date Accomplished</p>
                  <p>{applicant.dateSubmitted}</p>
                </div>
              </div>
            </div>

            <div className="border-b-2 border-black p-3">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="font-bold mb-2">In case of Emergency, please notify:</p>
                  <div className="space-y-2">
                    <div>
                      <p className="font-semibold">Name:</p>
                      <div className="border-b border-black h-6"></div>
                    </div>
                    <div>
                      <p className="font-semibold">Contact Details:</p>
                      <div className="border-b border-black h-6"></div>
                    </div>
                    <div>
                      <p className="font-semibold">Address:</p>
                      <div className="border-b border-black h-6"></div>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="font-bold mb-2">GSIS Beneficiary (Parent/Child's Name)</p>
                  <div className="space-y-2">
                    <div>
                      <p className="font-semibold">Name of Beneficiary:</p>
                      <div className="border-b border-black h-6"></div>
                    </div>
                    <div>
                      <p className="font-semibold">Relationship:</p>
                      <div className="border-b border-black h-6"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-b-2 border-black p-3">
              <p className="font-bold text-xs mb-2">FOR DOLE-RO/FO Use Only</p>
              <p className="font-bold text-xs mb-2">Interviewed and validated by:</p>
              <div className="border-b-2 border-black h-12 mb-3"></div>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="font-semibold">NAME and SIGNATURE/Position</p>
                </div>
                <div>
                  <p className="font-semibold">DATE</p>
                </div>
              </div>
            </div>

            <div className="border-b-2 border-black p-3">
              <p className="font-bold text-xs mb-2">Documents Received:</p>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <input type="checkbox" readOnly className="w-3 h-3" />
                    <span>Birth certificate or equivalent</span>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <input type="checkbox" readOnly className="w-3 h-3" />
                    <span>Transcript of Records</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" readOnly className="w-3 h-3" />
                    <span>Barangay Certification</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <input type="checkbox" readOnly className="w-3 h-3" />
                    <span>Form 137/138</span>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <input type="checkbox" readOnly className="w-3 h-3" />
                    <span>Diploma</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" readOnly className="w-3 h-3" />
                    <span>Certification from school or any docs equivalent hereto</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2 text-xs">
                <input type="checkbox" readOnly className="w-3 h-3" />
                <span>Others:</span>
                <input type="text" className="border border-black w-32 px-1 text-xs" readOnly />
              </div>
              <p className="font-bold text-xs mt-2">DOLE REGIONAL OFFICE NO. ____</p>
            </div>
          </div>
        </div>
      </div>

      {showImageModal && applicant.photoFileData && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[60]"
          onClick={() => setShowImageModal(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh] p-4">
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-6 right-6 bg-white rounded-full p-2 hover:bg-gray-100 transition z-10"
            >
              <X className="w-6 h-6 text-gray-800" />
            </button>
            <img
              src={applicant.photoFileData}
              alt="Preview"
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicantProfile;
