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
  const printContents = document.getElementById("applicant-profile-content")?.innerHTML;
  const originalContents = document.body.innerHTML;

  if (printContents) {
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload(); // Optional, refresh to restore event listeners
  }
};


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="bg-red-700 text-white px-6 py-4 flex items-center justify-between sticky top-0 z-10 no-print">
          <h2 className="text-xl font-bold">GIP APPLICANT FORM</h2>
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
        <div className="border-2 border-black border-b-0 p-3 flex justify-between items-center">
          <div className="flex-1">
          </div>
          <div className="border-2 border-black px-4 py-2 text-xs font-bold text-center">
            DOLE-GIP Application Form
          </div>
        </div>
            <div className="border-b-2 border-black flex items-center justify-center p-2">
              <img
                src="src/assets/DOLElogo.png"
                alt="DOLE Logo"
                className="w-16 h-16 object-contain mr-4"
              />
                <div className="text-center">
                <p className="font-bold text-sm mb-1">DOLE REGIONAL OFFICE NO. ___</p>
                <p className="font-bold text-sm mb-1">GOVERNMENT INTERNSHIP PROGRAM (GIP)</p>
                <p className="font-bold text-sm underline">APPLICATION FORM</p>
              </div>
              <img
                src="src/assets/GIPLogo.png"
                alt="GIP Logo"
                className="w-16 h-16 object-contain ml-4"
              />
            </div>
            <div className="border-b-2 border-black p-3">
              <p className="font-bold text-xs mb-1">INSTRUCTION TO APPLICANTS:</p>
              <p className="text-xs">Please fill out all the required information in this form and attach additional documents, if necessary.</p>
            </div>
            <div className="grid grid-cols-[2fr_1fr] border-t-2 border-b-2 border-black">
              <div className="border-r-2 border-black p-3">
                <p className="font-bold text-xs mb-2">1. NAME OF APPLICANT:</p>
                <div className="border-b border-black mb-3 pb-1">
                  <div className="grid grid-cols-3 text-xs  mb-1 text-center">
                    <div>{applicant.lastName.toUpperCase()}</div>
                    <div>{applicant.firstName.toUpperCase()}</div>
                    <div>{applicant.middleName ? applicant.middleName.toUpperCase() : '-'}</div>
                  </div>
                  <div className="grid grid-cols-3 text-[11px] font-bold text-center">
                    <div>Family Name</div>
                    <div>First Name</div>
                    <div>Middle Name</div>
                  </div>
               </div>
               <p className="font-bold text-xs mb-2">2. RESIDENTIAL ADDRESS:</p>
              <div className="border-b border-black mb-2 pb-2 text-xs text-center">
                <p>
                  {`${(applicant.residentialAddress || '').toUpperCase()}, BRGY. ${(applicant.barangay || '').toUpperCase()}`}
                </p>
              </div>


                <div className="text-xs space-y-2">
                <div className="grid grid-cols-[180px_1fr] items-center border-b border-black text-xs">
                   <p className="font-bold p-2">Telephone No.:</p>
                   <span className="p-2 "> {applicant.telephoneNumber}</span>
              </div>

              <div className="grid grid-cols-[180px_1fr] items-center border-b border-black text-xs">
                  <p className="font-bold p-2">Mobile No.:</p>
                  <span className="p-2"> {applicant.contactNumber}</span>
                  </div>
                  </div>
                  </div>
              <div className="flex flex-col items-center justify-center text-center p-3">
                {applicant.photoFileData ? (
                  <img
                    src={applicant.photoFileData}
                    alt="Applicant Photo"
                    className="w-[2in] h-[2in] object-cover border border-gray-400 cursor-pointer hover:opacity-80 transition"
                    onClick={() => setShowImageModal(true)}
                  />
                ) : (
                  <div className="w-[2in] h-[2in] flex flex-col items-center justify-center bg-gray-200 border border-gray-400 p-2">
                    <p className="text-xs font-bold text-center leading-tight">
                      ATTACH 2x2 PHOTO WITH NAME AND SIGNATURE TAKEN WITHIN THE LAST THREE (3) MONTHS
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-[180px_1fr] items-center border-b-2 border-black text-xs">
              <p className="font-bold p-2"> E-mail Address:</p>
              <span className="p-2">{(applicant.email || '-').toUpperCase()}</span>
            </div>
            <div className="grid grid-cols-[180px_1fr] items-center border-b-2 border-black text-xs">
              <p className="font-bold p-2">3. PLACE OF BIRTH (city/province):</p>
              <span className="p-2">{applicant.placeOfBirth ? applicant.placeOfBirth.toUpperCase() : '-'}</span>
            </div>
            <div className="grid grid-cols-[180px_1fr] items-center border-b-2 border-black text-xs">
              <p className="font-bold p-2">4. DATE OF BIRTH :</p>
              <span className="p-2">{applicant.birthDate}</span>
            </div>
            <div className="grid grid-cols-[180px_1fr] items-center border-b-2 border-black text-xs">
              <p className="font-bold p-2">5. GENDER</p>
              <div className="flex items-center gap-4 p-2">
                <label className="flex items-center gap-1">
                  <input type="checkbox" checked={applicant.gender === 'MALE'} readOnly className="w-3 h-3" />
                  <span>Male</span>
                </label>
                <label className="flex items-center gap-1">
                  <input type="checkbox" checked={applicant.gender === 'FEMALE'} readOnly className="w-3 h-3" />
                  <span>Female</span>
                </label>
              </div>
            </div>
            <div className="grid grid-cols-[180px_1fr] items-center border-b-2 border-black text-xs">
              <p className="font-bold p-2">6. CIVIL STATUS</p>
              <div className="flex items-center gap-4 p-2">
                <label className="flex items-center gap-1">
                  <input type="checkbox" checked={applicant.civilStats === 'SINGLE'} readOnly className="w-3 h-3" />
                  <span>Single</span>
                </label>
                <label className="flex items-center gap-1">
                  <input type="checkbox" checked={applicant.civilStats === 'MARRIED'} readOnly className="w-3 h-3" />
                  <span>Married</span>
                </label>
                <label className="flex items-center gap-1">
                  <input type="checkbox" checked={applicant.civilStats === 'WIDOW/WIDOWER'} readOnly className="w-3 h-3" />
                  <span>Widow/Widower</span>
                </label>
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
              <p className="text-xs leading-relaxed mb-6 text-justify">
                Certify that all information provided in this application, including the attached documents, is complete and accurate to the best of my knowledge. I attest
                to the veracity of the attached requirements. I understand and agree that any misrepresentation in this document or its attachments may result in
                disqualification, cancellation of the service or contract, and the forfeiture of any refunds received or pay damages to DOLE or comply with any other
                sanctions in accordance with the law.
              </p>
              <div className="text-center text-xs mt-10 space-y-10">
                <div>
                  <p className="mb-1">______________________________</p>
                  <p className="font-semibold">Signature of Applicant</p>
                </div>
                <div>
                  <p className="mb-1">{applicant.dateSubmitted || "____________________"}</p>
                  <p>______________________________</p>
                  <p className="font-semibold">Date Accomplished:</p>
                </div>
              </div>
            </div>
            <div className="border-b-2 border-black p-3 text-xs">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="font-bold italic mb-3">In case of Emergency, please notify:</p>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <p className="font-semibold w-32">Name:</p>
                      <div className="border-b border-black flex-1 h-5"></div>
                    </div>
                    <div className="flex items-center">
                      <p className="font-semibold w-32">Contact Details:</p>
                      <div className="border-b border-black flex-1 h-5"></div>
                    </div>
                    <div className="flex items-center">
                      <p className="font-semibold w-32">Address:</p>
                      <div className="border-b border-black flex-1 h-5"></div>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="font-bold mb-3">GSIS Beneficiary (Parent/Child's Name):</p>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <p className="font-semibold w-40">Name of Beneficiary:</p>
                      <div className="border-b border-black flex-1 h-5"></div>
                    </div>
                    <div className="flex items-center">
                      <p className="font-semibold w-40">Relationship:</p>
                      <div className="border-b border-black flex-1 h-5"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-b-2 border-black p-3">
              <p className="font-bold text-xs mb-2 text-center">FOR DOLE-RO/FO Use Only</p>
              <p className="font-bold text-xs mb-2">Interviewed and validated by:</p>
              <div className="border-b border-black h-12 mb-3"></div>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="font-semibold text-center">NAME and SIGNATURE/POSITION</p>
                </div>
                <div>
                  <p className="font-semibold text-center">DATE</p>
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
