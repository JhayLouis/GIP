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
  }
};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
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
       <div className="p-6 bg-white dark:bg-slate-800">
        <div className="border-2 border-black" id="applicant-profile-content">
        <div className="border-2 border-black border-b-0 p-3 flex justify-between items-center">
          <div className="flex-1">
          </div>
          <div className="border-2 border-black px-4 py-2 text-xs font-bold text-center">
            DOLE-GIP Application Form
          </div>
        </div>
            <div className="border-b-2 border-black flex items-center justify-center p-1">
              <img
                src="src/assets/DOLElogo.png"
                alt="DOLE Logo"
                className="w-12 h-12 object-contain mr-2"
              />
                <div className="text-center">
                <p className="font-bold text-xs mb-0.5">DOLE REGIONAL OFFICE NO. ___</p>
                <p className="font-bold text-xs mb-0.5">GOVERNMENT INTERNSHIP PROGRAM (GIP)</p>
                <p className="font-bold text-xs underline">APPLICATION FORM</p>
              </div>
              <img
                src="src/assets/GIPLogo.png"
                alt="GIP Logo"
                className="w-12 h-12 object-contain ml-2"
              />
            </div>
            <div className="border-b-2 border-black p-2">
              <p className="font-bold text-[10px] mb-0.5">INSTRUCTION TO APPLICANTS:</p>
              <p className="text-[10px]">Please fill out all the required information in this form and attach additional documents, if necessary.</p>
            </div>
            <div className="grid grid-cols-[2fr_1fr] border-t-2 border-b-2 border-black">
              <div className="border-r-2 border-black p-2">
                <p className="font-bold text-[10px] mb-1">1. NAME OF APPLICANT:</p>
                <div className="border-b border-black mb-1.5 pb-0.5">
                  <div className="grid grid-cols-3 text-[10px] mb-0.5 text-center">
                    <div>{applicant.lastName.toUpperCase()}</div>
                    <div>{applicant.firstName.toUpperCase()}</div>
                    <div>{applicant.middleName ? applicant.middleName.toUpperCase() : '-'}</div>
                  </div>
                  <div className="grid grid-cols-3 text-[9px] font-bold text-center">
                    <div>Family Name</div>
                    <div>First Name</div>
                    <div>Middle Name</div>
                  </div>
               </div>
               <p className="font-bold text-[10px] mb-1">2. RESIDENTIAL ADDRESS:</p>
              <div className="border-b border-black mb-1 pb-1 text-[10px] text-center">
                <p>
                  {`${(applicant.residentialAddress || '').toUpperCase()}, BRGY. ${(applicant.barangay || '').toUpperCase()}`}
                </p>
              </div>


                <div className="text-[10px] space-y-1">
                <div className="grid grid-cols-[140px_1fr] border-b border-black text-[10px]">
                   <p className="font-bold p-1">Telephone No.:</p>
                   <span className="p-1 ml-7"> {applicant.telephoneNumber}</span>
              </div>

              <div className="grid grid-cols-[140px_1fr] border-b border-black text-[10px]">
                  <p className="font-bold p-1">Mobile No.:</p>
                  <span className="p-1 ml-7"> {applicant.contactNumber}</span>
                  </div>
                  </div>
                  </div>
              <div className="flex flex-col items-center justify-center text-center p-2">
                {applicant.photoFileData ? (
                  <img
                    src={applicant.photoFileData}
                    alt="Applicant Photo"
                    className="w-[1.5in] h-[1.5in] object-cover border border-black cursor-pointer hover:opacity-80 transition"
                    onClick={() => setShowImageModal(true)}
                  />
                ) : (
                  <div className="w-[1.5in] h-[1.5in] flex flex-col items-center justify-center bg-gray-200 border border-black p-2">
                    <p className="text-[7px] font-bold text-center leading-tight">
                      ATTACH 2x2 PHOTO WITH NAME AND SIGNATURE TAKEN WITHIN THE LAST THREE (3) MONTHS
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-[140px_1fr] border-b-2 border-black text-[10px]">
              <p className="font-bold p-1"> E-mail Address:</p>
              <span className="p-1 ml-9">{(applicant.email || '-').toUpperCase()}</span>
            </div>
            <div className="flex border-b-2 border-black text-[10px] gap-1">
              <p className="font-bold p-1 whitespace-nowrap">
                3. PLACE OF BIRTH (city/province):
              </p>
              <span className="p-1 truncate">
                {applicant.placeOfBirth ? applicant.placeOfBirth.toUpperCase() : '-'}
              </span>
            </div>
            <div className="flex border-b-2 border-black text-[10px] gap-1">
              <p className="font-bold p-1 whitespace-nowrap">
                4. DATE OF BIRTH (dd/mm/yyyy):
              </p>
              <span className="p-1 ml-2 truncate">
                {applicant.birthDate ? applicant.birthDate.toUpperCase() : '-'}
              </span>
            </div>
            <div className="grid grid-cols-[140px_1fr] items-center border-b-2 border-black text-[10px]">
              <p className="font-bold p-1">5. GENDER</p>
              <div className="flex items-center gap-3 p-1 ml-9">
                <label className="flex items-center gap-0.5">
                  <input type="checkbox" checked={applicant.gender === 'MALE'} readOnly className="w-2.5 h-2.5" />
                  <span>Male</span>
                </label>
                <label className="flex items-center gap-0.5">
                  <input type="checkbox" checked={applicant.gender === 'FEMALE'} readOnly className="w-2.5 h-2.5" />
                  <span>Female</span>
                </label>
              </div>
            </div>
            <div className="grid grid-cols-[140px_1fr] items-center border-b-2 border-black text-[10px]">
              <p className="font-bold p-1">6. CIVIL STATUS</p>
              <div className="flex items-center gap-2 p-1 ml-9">
                <label className="flex items-center gap-0.5">
                  <input type="checkbox" checked={applicant.civilStats === 'SINGLE'} readOnly className="w-2.5 h-2.5" />
                  <span>Single</span>
                </label>
                <label className="flex items-center gap-0.5">
                  <input type="checkbox" checked={applicant.civilStats === 'MARRIED'} readOnly className="w-2.5 h-2.5" />
                  <span>Married</span>
                </label>
                <label className="flex items-center gap-0.5">
                  <input type="checkbox" checked={applicant.civilStats === 'WIDOW/WIDOWER'} readOnly className="w-2.5 h-2.5" />
                  <span>Widow/Widower</span>
                </label>
              </div>
            </div>
            <div className="border-b-2 border-black p-2">
              <p className="font-bold text-[10px] mb-1">7. EDUCATIONAL ATTAINMENT</p>
              <table className="w-full border-collapse text-[10px]">
                <thead>
                  <tr>
                    <th className="border border-black p-1 text-left font-bold">NAME OF SCHOOL</th>
                    <th className="border border-black p-1 text-center font-bold" colSpan={2}>
                      INCLUSIVE DATES
                    </th>
                    <th className="border border-black p-1 text-left font-bold">DEGREE OR DIPLOMA</th>
                  </tr>
                  <tr>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td className="border border-black p-1">
                      {applicant.tertiarySchoolName
                        ? applicant.tertiarySchoolName.toUpperCase()
                        : '-'}
                    </td>
                    <td className="border border-black p-1 text-center">
                      {applicant.tertiaryFrom || "-"}
                    </td>

                    <td className="border border-black p-1 text-center">
                      {applicant.tertiaryTo || "-"}
                    </td>
                    <td className="border border-black p-1">
                      {applicant.tertiaryEducation
                        ? applicant.tertiaryEducation.toUpperCase()
                        : '-'}
                    </td>
                  </tr>
                   <tr> 
                    <td className="border border-black p-1">
                      {applicant.seniorHighSchoolName
                        ? applicant.seniorHighSchoolName.toUpperCase()
                        : '-'}
                    </td>
                    <td className="border border-black p-1 text-center">
                      {applicant.seniorHighFrom || "-"}
                    </td>

                    <td className="border border-black p-1 text-center">
                      {applicant.seniorHighTo || "-"}
                    </td>
                    <td className="border border-black p-1">
                      {applicant.seniorHighEducation
                        ? applicant.seniorHighEducation.toUpperCase()
                        : '-'}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-black p-1">
                      {applicant.juniorHighSchoolName
                        ? applicant.juniorHighSchoolName.toUpperCase()
                        : '-'}
                    </td>
                    <td className="border border-black p-1 text-center">
                      {applicant.juniorHighFrom || "-"}
                    </td>

                    <td className="border border-black p-1 text-center">
                      {applicant.juniorHighTo || "-"}
                    </td>
                    <td className="border border-black p-1">
                      {applicant.juniorHighEducation
                        ? applicant.juniorHighEducation.toUpperCase()
                        : '-'}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-black p-1">
                      {applicant.primarySchoolName
                        ? applicant.primarySchoolName.toUpperCase()
                        : '-'}
                    </td>
                    <td className="border border-black p-1 text-center">
                      {applicant.primaryFrom || "-"}
                    </td>

                    <td className="border border-black p-1 text-center">
                      {applicant.primaryTo || "-"}
                    </td>
                    <td className="border border-black p-1">
                      {applicant.primaryEducation
                        ? applicant.primaryEducation.toUpperCase()
                        : '-'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="border-b-2 border-black p-2">
              <p className="font-bold text-[10px] mb-0.5">8. DISADVANTAGED GROUP</p>
              <div className="text-[10px] flex flex-wrap gap-2 mt-0.5">
                <div className="flex items-center gap-0.5">
                  <input type="checkbox" readOnly className="w-2.5 h-2.5" />
                  <span>PWDs</span>
                </div>
                <div className="flex items-center gap-0.5">
                  <input type="checkbox" readOnly className="w-2.5 h-2.5" />
                  <span>IPs</span>
                </div>
                <div className="flex items-center gap-0.5">
                  <input type="checkbox" readOnly className="w-2.5 h-2.5" />
                  <span>Victims of Armed Conflict</span>
                </div>
                <div className="flex items-center gap-0.5">
                  <input type="checkbox" readOnly className="w-2.5 h-2.5" />
                  <span>Rebel Returnee</span>
                </div>
                <div className="flex items-center gap-0.5">
                  <input type="checkbox" readOnly className="w-2.5 h-2.5" />
                  <span>4Ps</span>
                </div>
                <div className="flex items-center gap-0.5">
                  <input type="checkbox" readOnly className="w-2.5 h-2.5" />
                  <span>Others:</span>
                  <input type="text" className="border border-black w-16 px-0.5 text-[10px]" readOnly />
                </div>
              </div>
            </div>
            <div className="border-b-2 border-black p-2">
              <p className="font-bold text-[10px] mb-1">CERTIFICATION:</p>
              <p className="text-[10px] leading-snug mb-3 text-justify">
                Certify that all information provided in this application, including the attached documents, is complete and accurate to the best of my knowledge. I attest
                to the veracity of the attached requirements. I understand and agree that any misrepresentation in this document or its attachments may result in
                disqualification, cancellation of the service or contract, and the forfeiture of any refunds received or pay damages to DOLE or comply with any other
                sanctions in accordance with the law.
              </p>
              <div className="text-center text-[10px] mt-4 space-y-4">
                <div>
                  <p className="mb-0.5">______________________________</p>
                  <p className="font-semibold">Signature of Applicant</p>
                </div>
                <div>
                  <p className="mb-0.5">{applicant.dateSubmitted || "____________________"}</p>
                  <p>______________________________</p>
                  <p className="font-semibold">Date Accomplished:</p>
                </div>
              </div>
            </div>
            <div className="border-b-2 border-black p-2 text-[10px]">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-bold italic mb-1.5">In case of Emergency, please notify:</p>
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <p className="font-semibold w-24">Name:</p>
                      <div className="border-b border-black flex-1 h-4"></div>
                    </div>
                    <div className="flex items-center">
                      <p className="font-semibold w-24">Contact Details:</p>
                      <div className="border-b border-black flex-1 h-4"></div>
                    </div>
                    <div className="flex items-center">
                      <p className="font-semibold w-24">Address:</p>
                      <div className="border-b border-black flex-1 h-4"></div>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="font-bold mb-1.5">GSIS Beneficiary (Parent/Child's Name):</p>
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <p className="font-semibold w-32">Name of Beneficiary:</p>
                      <div className="border-b border-black flex-1 h-4"></div>
                    </div>
                    <div className="flex items-center">
                      <p className="font-semibold w-32">Relationship:</p>
                      <div className="border-b border-black flex-1 h-4"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-b-2 border-black p-2">
              <p className="font-bold text-[10px] mb-1 text-center">FOR DOLE-RO/FO Use Only</p>
              <p className="font-bold text-[10px] mb-1">Interviewed and validated by:</p>
              <div className="border-b border-black h-8 mb-1.5"></div>
              <div className="grid grid-cols-2 gap-3 text-[10px]">
                <div>
                  <p className="font-semibold text-center">NAME and SIGNATURE/POSITION</p>
                </div>
                <div>
                  <p className="font-semibold text-center">DATE</p>
                </div>
              </div>
            </div>
            <div className="border-b-2 border-black p-2">
              <p className="font-bold text-[10px] mb-1">Documents Received:</p>
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div>
                  <div className="flex items-center gap-1 mb-0.5">
                    <input type="checkbox" readOnly className="w-2.5 h-2.5" />
                    <span>Birth certificate or equivalent</span>
                  </div>
                  <div className="flex items-center gap-1 mb-0.5">
                    <input type="checkbox" readOnly className="w-2.5 h-2.5" />
                    <span>Transcript of Records</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <input type="checkbox" readOnly className="w-2.5 h-2.5" />
                    <span>Barangay Certification</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-0.5">
                    <input type="checkbox" readOnly className="w-2.5 h-2.5" />
                    <span>Form 137/138</span>
                  </div>
                  <div className="flex items-center gap-1 mb-0.5">
                    <input type="checkbox" readOnly className="w-2.5 h-2.5" />
                    <span>Diploma</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <input type="checkbox" readOnly className="w-2.5 h-2.5" />
                    <span>Certification from school or any docs equivalent hereto</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 mt-1 text-[10px]">
                <input type="checkbox" readOnly className="w-2.5 h-2.5" />
                <span>Others:</span>
                <input type="text" className="border border-black w-24 px-0.5 text-[10px]" readOnly />
              </div>
              <p className="font-bold text-[10px] mt-1">DOLE REGIONAL OFFICE NO. ____</p>
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
              className="absolute top-6 right-6 bg-white dark:bg-slate-800 rounded-full p-2 hover:bg-gray-100 transition z-10"
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
