import React, { useState } from "react";
import { Search, Plus, Download, FileText, CreditCard as Edit, Trash2, Archive, ArchiveRestore } from "lucide-react";
import { exportApplicantsToCSV, exportApplicantsToPDF, printApplicants } from '../utils/exportUtils.ts';
import { useData } from '../hooks/useData.ts';
import { Applicant, calculateAge } from "../utils/dataService.ts";
import { handleArchive, handleUnarchive, handleDelete } from '../components/ApplicantActions.tsx';
import ApplicantForm from '../components/ApplicantForm.tsx';
import ApplicantProfile from '../components/ApplicantProfile.tsx';
import { getCurrentUser } from '../utils/auth';
import Swal from "sweetalert2";

interface ApplicantsTabProps {
  activeProgram: 'GIP' | 'TUPAD';
}

const ApplicantsTab: React.FC<ApplicantsTabProps> = ({ activeProgram }) => {
  const {addApplicant, updateApplicant, deleteApplicant, getFilteredApplicants, refreshData } = useData(activeProgram);
  const currentUser = getCurrentUser();
  const isAdmin = currentUser?.role === 'admin';

  const [showModal, setShowModal] = useState(false);
  const [editingApplicant, setEditingApplicant] = useState<Applicant | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [barangayFilter, setBarangayFilter] = useState('All Barangays');
  const [genderFilter, setGenderFilter] = useState('All Genders');
  const [ageFilter, setAgeFilter] = useState('All Ages');
  const [educationFilter, setEducationFilter] = useState('All Education Levels');
  const [showArchived, setShowArchived] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [applicantCode, setApplicantCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewingApplicant, setViewingApplicant] = useState<Applicant | null>(null);

  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    extensionName: '',
    birthDate: '',
    age: '',
    placeOfBirth: '',
    residentialAddress: '',
    barangay: '',
    contactNumber: '',
    telephoneNumber: '',
    email: '',
    school: '',
    civilStats: '',
    gender: '' as "" | "MALE" | "FEMALE",
    primaryEducation: '',
    primarySchoolName: '',
    primaryFrom: '',
    primaryTo: '',
    juniorHighEducation: '',
    juniorHighSchoolName: '',
    juniorHighFrom: '',
    juniorHighTo: '',
    seniorHighEducation: '',
    seniorHighSchoolName: '',
    seniorHighFrom: '',
    seniorHighTo: '',
    tertiaryEducation: '',
    tertiarySchoolName: '',
    tertiaryFrom: '',
    tertiaryTo: '',
    courseType: '',
    course: '',
    beneficiaryName: '',
    status: 'PENDING' as 'PENDING' | 'APPROVED' | 'DEPLOYED' | 'COMPLETED' | 'REJECTED' | 'RESIGNED',
    idType: '',
    idNumber: '',
    occupation: '',
    civilStatus: '',
    averageMonthlyIncome: '',
    dependentName: '',
    relationshipToDependent: '',
    resumeFile: null as File | null,
    photoFile: null as File | null,
    photoFileName: '',
    photoFileData: ''
  });

  const generateApplicantCode = () => {
    const existingApplicants = getFilteredApplicants({});
    const prefix = activeProgram === 'GIP' ? 'GIP' : 'TPD';

    let maxNumber = 0;
    existingApplicants.forEach(applicant => {
      const codeMatch = applicant.code.match(new RegExp(`${prefix}-(\\d+)`));
      if (codeMatch) {
        const number = parseInt(codeMatch[1], 10);
        if (number > maxNumber) {
          maxNumber = number;
        }
      }
    });

    const nextNumber = maxNumber + 1;
    const paddedNumber = nextNumber.toString().padStart(6, '0');
    return `${prefix}-${paddedNumber}`;
  };

  const openModal = () => {
    setEditingApplicant(null);
    setApplicantCode(generateApplicantCode());
    setShowModal(true);
  };

  const openEditModal = (applicant: Applicant) => {
    setEditingApplicant(applicant);
    setApplicantCode(applicant.code);
    setFormData({
      firstName: applicant.firstName,
      middleName: applicant.middleName || '',
      lastName: applicant.lastName,
      extensionName: applicant.extensionName || '',
      birthDate: applicant.birthDate,
      age: applicant.age.toString(),
      placeOfBirth: applicant.placeOfBirth || '',
      residentialAddress: applicant.residentialAddress || '',
      barangay: applicant.barangay,
      contactNumber: applicant.contactNumber,
      telephoneNumber: applicant.telephoneNumber || '',
      email: applicant.email || '',
      school: applicant.school || '',
      civilStats: applicant.civilStats || '',
      gender: applicant.gender,
      primaryEducation: applicant.primaryEducation || '',
      primarySchoolName: applicant.primarySchoolName || '',
      primaryFrom: applicant.primaryFrom || '',
      primaryTo: applicant.primaryTo || '',
      juniorHighEducation: applicant.juniorHighEducation || '',
      juniorHighSchoolName: applicant.juniorHighSchoolName || '',
      juniorHighFrom: applicant.juniorHighFrom || '',
      juniorHighTo: applicant.juniorHighTo || '',
      seniorHighEducation: applicant.seniorHighEducation || '',
      seniorHighSchoolName: applicant.seniorHighSchoolName || '',
      seniorHighFrom: applicant.seniorHighFrom || '',
      seniorHighTo: applicant.seniorHighTo || '',
      tertiaryEducation: applicant.tertiaryEducation || '',
      tertiarySchoolName: applicant.tertiarySchoolName || '',
      tertiaryFrom: applicant.tertiaryFrom || '',
      tertiaryTo: applicant.tertiaryTo || '',
      courseType: applicant.courseType || '',
      course: applicant.course || '',
      beneficiaryName: applicant.beneficiaryName || '',
      status: applicant.status,
      idType: applicant.idType || '',
      idNumber: applicant.idNumber || '',
      occupation: applicant.occupation || '',
      civilStatus: applicant.civilStatus || '',
      averageMonthlyIncome: applicant.averageMonthlyIncome || '',
      dependentName: applicant.dependentName || '',
      relationshipToDependent: applicant.relationshipToDependent || '',
      resumeFile: null,
      photoFile: null,
      photoFileName: applicant.photoFileName || '',
      photoFileData: applicant.photoFileData || ''
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingApplicant(null);
    setApplicantCode('');
    setFormData({
      firstName: '',
      middleName: '',
      lastName: '',
      extensionName: '',
      birthDate: '',
      age: '',
      placeOfBirth: '',
      residentialAddress: '',
      barangay: '',
      contactNumber: '',
      telephoneNumber: '',
      email: '',
      school: '',
      civilStats: '',
      gender: 'MALE',
      primaryEducation: '',
      primarySchoolName: '',
      primaryFrom: '',
      primaryTo: '',
      juniorHighEducation: '',
      juniorHighSchoolName: '',
      juniorHighFrom: '',
      juniorHighTo: '',
      seniorHighEducation: '',
      seniorHighSchoolName: '',
      seniorHighFrom: '',
      seniorHighTo: '',
      tertiaryEducation: '',
      tertiarySchoolName: '',
      tertiaryFrom: '',
      tertiaryTo: '',
      courseType: '',
      course: '',
      beneficiaryName: '',
      status: 'PENDING',
      idType: '',
      idNumber: '',
      occupation: '',
      civilStatus: '',
      averageMonthlyIncome: '',
      dependentName: '',
      relationshipToDependent: '',
      resumeFile: null,
      photoFile: null,
      photoFileName: '',
      photoFileData: ''
    });
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.birthDate || !formData.barangay || !formData.contactNumber) {
      await Swal.fire({
        icon: 'error',
        title: 'Missing Required Fields',
        text: 'Please fill in all required fields',
        confirmButtonColor: '#3085d6',
        customClass: {
          popup: 'rounded-2xl shadow-lg',
          confirmButton: 'px-5 py-2 rounded-lg text-white font-semibold'
        }
      });
      return;
    }

    if (activeProgram === 'GIP') {
      if (!formData.primaryEducation || !formData.primarySchoolName || !formData.primarySchoolName.trim()) {
        await Swal.fire({
          icon: 'error',
          title: 'Missing Required Fields',
          text: 'Please fill in Primary Education and School Name',
          confirmButtonColor: '#3085d6',
          customClass: {
            popup: 'rounded-2xl shadow-lg',
            confirmButton: 'px-5 py-2 rounded-lg text-white font-semibold'
          }
        });
        return;
      }
      if (!formData.juniorHighEducation || !formData.juniorHighSchoolName || !formData.juniorHighSchoolName.trim()) {
        await Swal.fire({
          icon: 'error',
          title: 'Missing Required Fields',
          text: 'Please fill in Secondary Education and School Name',
          confirmButtonColor: '#3085d6',
          customClass: {
            popup: 'rounded-2xl shadow-lg',
            confirmButton: 'px-5 py-2 rounded-lg text-white font-semibold'
          }
        });
        return;
      }
    }

    if (activeProgram === 'TUPAD' && !formData.idType) {
      await Swal.fire({
        icon: 'error',
        title: 'Missing Required Fields',
        text: 'Please fill in all required fields',
        confirmButtonColor: '#3085d6',
        customClass: {
          popup: 'rounded-2xl shadow-lg',
          confirmButton: 'px-5 py-2 rounded-lg text-white font-semibold'
        }
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const age = calculateAge(formData.birthDate);

      if (activeProgram === 'GIP' && (age < 18 || age > 29)) {
        await Swal.fire({
          icon: 'error',
          title: 'Age Requirement Not Met',
          text: 'GIP applicants must be between 18-29 years old',
          confirmButtonColor: '#3085d6',
          customClass: {
            popup: 'rounded-2xl shadow-lg',
            confirmButton: 'px-5 py-2 rounded-lg text-white font-semibold'
          }
        });
        setIsSubmitting(false);
        return;
      }

      if (activeProgram === 'TUPAD' && (age < 25 || age > 58)) {
        await Swal.fire({
          icon: 'error',
          title: 'Age Requirement Not Met',
          text: 'TUPAD applicants must be between 25-58 years old',
          confirmButtonColor: '#3085d6',
          customClass: {
            popup: 'rounded-2xl shadow-lg',
            confirmButton: 'px-5 py-2 rounded-lg text-white font-semibold'
          }
        });
        setIsSubmitting(false);
        return;
      }

      if (editingApplicant) {
        let resumeFileName = editingApplicant.resumeFileName;
        let resumeFileData = editingApplicant.resumeFileData;
        let photoFileName = editingApplicant.photoFileName;
        let photoFileData = editingApplicant.photoFileData;

        if (formData.resumeFile) {
          resumeFileName = formData.resumeFile.name;
          resumeFileData = await fileToBase64(formData.resumeFile);
        }

        if (formData.photoFile) {
          photoFileName = formData.photoFile.name;
          photoFileData = await fileToBase64(formData.photoFile);
        } else if (formData.photoFileName && formData.photoFileData) {
          photoFileName = formData.photoFileName;
          photoFileData = formData.photoFileData;
        }

        const updatedApplicant: Applicant = {
          ...editingApplicant,
          firstName: formData.firstName,
          middleName: formData.middleName || undefined,
          lastName: formData.lastName,
          extensionName: formData.extensionName || undefined,
          birthDate: formData.birthDate,
          age,
          placeOfBirth: formData.placeOfBirth || '',
          residentialAddress: formData.residentialAddress || '',
          barangay: formData.barangay,
          contactNumber: formData.contactNumber,
          telephoneNumber: formData.telephoneNumber || '',
          email: formData.email || undefined,
          school: formData.school || undefined,
          civilStats: formData.civilStats || '',
          gender: formData.gender,
          primaryEducation: formData.primaryEducation || undefined,
          primarySchoolName: formData.primarySchoolName || undefined,
          primaryFrom: formData.primaryFrom ||'',
          primaryTo: formData.primaryTo || '',
          seniorHighEducation: formData.seniorHighEducation || undefined,
          seniorHighSchoolName: formData.seniorHighSchoolName || undefined,
          seniorHighFrom: formData.seniorHighFrom || '',
          seniorHighTo: formData.seniorHighTo || '',
          juniorHighEducation: formData.juniorHighEducation || undefined,
          juniorHighSchoolName: formData.juniorHighSchoolName || undefined,
          juniorHighFrom: formData.juniorHighFrom || '',
          juniorHighTo: formData.juniorHighTo || '',
          tertiaryEducation: formData.tertiaryEducation || undefined,
          tertiarySchoolName: formData.tertiarySchoolName || undefined,
          tertiaryFrom: formData.tertiaryFrom || '',
          tertiaryTo: formData.tertiaryTo || '',
          courseType: formData.courseType || '',
          course: formData.course || '',
          beneficiaryName: formData.beneficiaryName || undefined,
          code: applicantCode,
          status: formData.status,
          program: activeProgram,
          resumeFileName,
          resumeFileData,
          photoFileName,
          photoFileData,
          idType: activeProgram === 'TUPAD' ? formData.idType : undefined,
          idNumber: activeProgram === 'TUPAD' ? formData.idNumber : undefined,
          occupation: activeProgram === 'TUPAD' ? formData.occupation : undefined,
          civilStatus: activeProgram === 'TUPAD' ? formData.civilStatus : undefined,
          averageMonthlyIncome: activeProgram === 'TUPAD' ? formData.averageMonthlyIncome : undefined,
          dependentName: activeProgram === 'TUPAD' ? formData.dependentName : undefined,
          relationshipToDependent: activeProgram === 'TUPAD' ? formData.relationshipToDependent : undefined
        };

        await updateApplicant(updatedApplicant);

        Swal.fire({
          icon: "success",
          title: "Applicant Updated!",
          text: "The applicant information has been successfully updated.",
          confirmButtonColor: "#3085d6",
          customClass: {
            popup: "rounded-2xl shadow-lg",
            confirmButton: "px-5 py-2 rounded-lg text-white font-semibold",
          },
        });
      } else {
        let resumeFileName: string | undefined;
        let resumeFileData: string | undefined;
        let photoFileName: string | undefined;
        let photoFileData: string | undefined;

        if (formData.resumeFile) {
          resumeFileName = formData.resumeFile.name;
          resumeFileData = await fileToBase64(formData.resumeFile);
        }

        if (formData.photoFile) {
          photoFileName = formData.photoFile.name;
          photoFileData = await fileToBase64(formData.photoFile);
        } else if (formData.photoFileName && formData.photoFileData) {
          photoFileName = formData.photoFileName;
          photoFileData = formData.photoFileData;
        }

        const applicantData: Omit<Applicant, 'id' | 'dateSubmitted'> = {
          firstName: formData.firstName,
          middleName: formData.middleName || undefined,
          lastName: formData.lastName,
          extensionName: formData.extensionName || undefined,
          birthDate: formData.birthDate,
          age,
          placeOfBirth: formData.placeOfBirth || '',
          residentialAddress: formData.residentialAddress || '',
          barangay: formData.barangay,
          contactNumber: formData.contactNumber,
          telephoneNumber: formData.telephoneNumber || '',
          email: formData.email || undefined,
          school: formData.school || undefined,
          civilStats: formData.civilStats || '',
          gender: formData.gender,
          primaryEducation: formData.primaryEducation || undefined,
          primarySchoolName: formData.primarySchoolName || undefined,
          primaryFrom: formData.primaryFrom || '',
          primaryTo: formData.primaryFrom || '',
          seniorHighEducation: formData.seniorHighEducation || undefined,
          seniorHighSchoolName: formData.seniorHighSchoolName || undefined,
          seniorHighFrom: formData.seniorHighFrom || '',
          seniorHighTo: formData.seniorHighTo || '',
          juniorHighEducation: formData.juniorHighEducation || undefined,
          juniorHighSchoolName: formData.juniorHighSchoolName || undefined,
          juniorHighFrom: formData.juniorHighFrom || '',
          juniorHighTo: formData.juniorHighTo || '',
          tertiaryEducation: formData.tertiaryEducation || undefined,
          tertiarySchoolName: formData.tertiarySchoolName || undefined,
          tertiaryFrom: formData.tertiaryFrom || '',
          tertiaryTo: formData.tertiaryFrom || '',
          courseType: formData.courseType || '',
          course: formData.course || '',
          beneficiaryName: formData.beneficiaryName || undefined,
          code: applicantCode,
          encoder: 'Administrator',
          status: formData.status,
          program: activeProgram,
          resumeFileName,
          resumeFileData,
          photoFileName,
          photoFileData,
          idType: activeProgram === 'TUPAD' ? formData.idType : undefined,
          idNumber: activeProgram === 'TUPAD' ? formData.idNumber : undefined,
          occupation: activeProgram === 'TUPAD' ? formData.occupation : undefined,
          civilStatus: activeProgram === 'TUPAD' ? formData.civilStatus : undefined,
          averageMonthlyIncome: activeProgram === 'TUPAD' ? formData.averageMonthlyIncome : undefined,
          dependentName: activeProgram === 'TUPAD' ? formData.dependentName : undefined,
          relationshipToDependent: activeProgram === 'TUPAD' ? formData.relationshipToDependent : undefined
        };

        await addApplicant(applicantData);
        await Swal.fire({
          icon: 'success',
          title: 'Applicant Added!',
          text: 'The applicant has been successfully added to the system.',
          confirmButtonColor: '#3085d6',
          customClass: {
            popup: 'rounded-2xl shadow-lg',
            confirmButton: 'px-5 py-2 rounded-lg text-white font-semibold'
          }
        });
      }

      closeModal();
    } catch (error) {
      console.error('Error saving applicant:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error saving applicant. Please try again.',
        confirmButtonColor: '#3085d6',
        customClass: {
          popup: 'rounded-2xl shadow-lg',
          confirmButton: 'px-5 py-2 rounded-lg text-white font-semibold'
        }
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    const fieldsToCapitalize = [
      'firstName', 'middleName', 'lastName', 'extensionName',
      'barangay', 'idNumber', 'occupation', 'dependentName',
      'relationshipToDependent', 'beneficiaryName', 'school'
    ];

    if (fieldsToCapitalize.includes(field) && typeof value === 'string') {
      value = value.toUpperCase();
    }

    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const filteredApplicants = getFilteredApplicants({
    searchTerm,
    status: statusFilter === 'ALL STATUS' ? '' : statusFilter,
    barangay: barangayFilter === 'ALL BARANGAYS' ? '' : barangayFilter,
    gender: genderFilter === 'ALL GENDERS' ? '' : genderFilter,
    ageRange: ageFilter === 'ALL AGES' ? '' : ageFilter,
    education: educationFilter === 'ALL EDUCATION' || educationFilter === 'All Education Levels' ? '' : educationFilter
  }).filter(applicant => showArchived ? applicant.archived : !applicant.archived);


  const totalEntries = filteredApplicants.length;
  const totalPages = Math.ceil(totalEntries / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const currentEntries = filteredApplicants.slice(startIndex, endIndex);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, barangayFilter, genderFilter, ageFilter, educationFilter, showArchived]);

  const handleExportCSV = () => {
    const exportData = filteredApplicants.map(applicant => ({
      code: applicant.code,
      name: `${applicant.firstName} ${applicant.middleName || ''} ${applicant.lastName} ${applicant.extensionName || ''}`.trim(),
      age: applicant.age,
      barangay: applicant.barangay,
      gender: applicant.gender,
      status: applicant.status,
      dateSubmitted: applicant.dateSubmitted
    }));
    exportApplicantsToCSV(exportData, activeProgram);
  };

  const handleExportPDF = () => {
    const exportData = filteredApplicants.map(applicant => ({
      code: applicant.code,
      name: `${applicant.firstName} ${applicant.middleName || ''} ${applicant.lastName} ${applicant.extensionName || ''}`.trim(),
      age: applicant.age,
      barangay: applicant.barangay,
      gender: applicant.gender,
      status: applicant.status,
      dateSubmitted: applicant.dateSubmitted
    }));
    exportApplicantsToPDF(exportData, activeProgram);
  };

  const handlePrint = () => {
    const exportData = filteredApplicants.map(applicant => ({
      code: applicant.code,
      name: `${applicant.firstName} ${applicant.middleName || ''} ${applicant.lastName} ${applicant.extensionName || ''}`.trim(),
      age: applicant.age,
      barangay: applicant.barangay,
      gender: applicant.gender,
      status: applicant.status,
      dateSubmitted: applicant.dateSubmitted
    }));
    printApplicants(exportData, activeProgram);
  };

  const primaryColor = activeProgram === 'GIP' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700';
  const focusColor = activeProgram === 'GIP' ? 'focus:ring-red-500 focus:border-red-500' : 'focus:ring-green-500 focus:border-green-500';
  const headerBgColor = activeProgram === 'GIP' ? 'bg-red-600' : 'bg-green-600';
  const programName = activeProgram === 'GIP' ? 'GIP' : 'TUPAD';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {programName} APPLICANTS{showArchived ? ' - ARCHIVE' : ''}
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          {isAdmin && (
            <>
              <button
                onClick={() => setShowArchived(!showArchived)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
              >
                {showArchived ? (
                  <>
                    <ArchiveRestore className="w-4 h-4" />
                    <span>View Active</span>
                  </>
                ) : (
                  <>
                    <Archive className="w-4 h-4" />
                    <span>Archive</span>
                  </>
                )}
              </button>

              {!showArchived && (
                <button
                  onClick={openModal}
                  className={`${primaryColor} text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200`}
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Applicant</span>
                </button>
              )}
                <button
                onClick={handlePrint}
                className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg flex items-center space-x-1 transition-colors duration-200"
              >
                <FileText className="w-4 h-4" />
                <span>Print</span>
              </button>
              <button
                onClick={handleExportCSV}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg flex items-center space-x-1 transition-colors duration-200"
              >
                <Download className="w-4 h-4" />
                <span>CSV</span>
              </button>
            </>
          )}
        </div>
      </div>
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-slate-700">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 dark:text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Applicants..."
              className={`w-full bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 ${focusColor}`}
            />
          </div>

          <select style={{backgroundColor: "var(--color-bg-primary)", color: "var(--color-text-primary)"}} 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 ${focusColor} text-sm`}
          >
            <option>ALL STATUS</option>
            <option>PENDING</option>
            <option>APPROVED</option>
            <option>DEPLOYED</option>
            <option>COMPLETED</option>
            <option>REJECTED</option>
            <option>RESIGNED</option>
          </select>

          <select style={{backgroundColor: "var(--color-bg-primary)", color: "var(--color-text-primary)"}} 
            value={barangayFilter}
            onChange={(e) => setBarangayFilter(e.target.value)}
            className={`px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 ${focusColor} text-sm`}
          >
            <option>ALL BARANGAYS</option>
            <option>APLAYA</option>
            <option>BALIBAGO</option>
            <option>CAINGIN</option>
            <option>DILA</option>
            <option>DITA</option>
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

          <select style={{backgroundColor: "var(--color-bg-primary)", color: "var(--color-text-primary)"}} 
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className={`px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 ${focusColor} text-sm`}
          >
            <option>ALL GENDERS</option>
            <option>MALE</option>
            <option>FEMALE</option>
          </select>

          <select style={{backgroundColor: "var(--color-bg-primary)", color: "var(--color-text-primary)"}} 
            value={ageFilter}
            onChange={(e) => setAgeFilter(e.target.value)}
            className={`px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 ${focusColor} text-sm`}
          >
            <option>ALL AGES</option>
            <option>18-25</option>
            <option>26-35</option>
            <option>36-45</option>
            <option>46+</option>
          </select>

          <select style={{backgroundColor: "var(--color-bg-primary)", color: "var(--color-text-primary)"}} 
            value={educationFilter}
            onChange={(e) => setEducationFilter(e.target.value)}
            className={`px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 ${focusColor} text-sm`}
          >
            <option>ALL EDUCATION</option>
            <option>JUNIOR HIGH SCHOOL GRADUATE</option>
            <option>SENIOR HIGH SCHOOL GRADUATE</option>
            <option>HIGH SCHOOL GRADUATE</option>
            <option>COLLEGE GRADUATE</option>
            <option>TECHNICAL/VOCATIONAL COURSE GRADUATE</option>
            <option>ALS SECONDARY GRADUATE</option>
            <option>COLLEGE UNDERGRADUATE</option>
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600 dark:text-gray-300">Show</span>
          <select style={{backgroundColor: "var(--color-bg-primary)", color: "var(--color-text-primary)"}} 
            value={entriesPerPage}
            onChange={(e) => {
              setEntriesPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-3 py-1 border bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-slate-600 rounded text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <span className="text-sm text-gray-600 dark:text-gray-300">entries</span>
        </div>

        <div className="text-sm text-gray-600 dark:text-gray-300">
          Showing {startIndex + 1} to {Math.min(endIndex, totalEntries)} of {totalEntries} entries
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className={`${headerBgColor} text-white`}>
              <th className="px-6 py-4 text-center text-sm font-semibold tracking-wide first:rounded-tl-xl last:rounded-tr-xl">CODE</th>
              <th className="px-6 py-4 text-center text-sm font-semibold tracking-wide">NAME</th>
              <th className="px-6 py-4 text-center text-sm font-semibold tracking-wide">AGE</th>
              <th className="px-6 py-4 text-center text-sm font-semibold tracking-wide">BARANGAY</th>
              <th className="px-6 py-4 text-center text-sm font-semibold tracking-wide">GENDER</th>
              <th className="px-6 py-4 text-center text-sm font-semibold tracking-wide">STATUS</th>
              <th className="px-6 py-4 text-center text-sm font-semibold tracking-wide">DATE SUBMITTED</th>
              {isAdmin && <th className="px-6 py-4 text-center text-sm font-semibold tracking-wide last:rounded-tr-xl">ACTIONS</th>}
            </tr>
          </thead>
          <tbody>
            {currentEntries.length === 0 ? (
              <tr>
                  <td colSpan={isAdmin ? 8 : 7} className="px-6 py-2 text-center text-gray-500 dark:text-gray-400">
                  <div className="text-lg mb-2">No applicants found.</div>
                </td>
              </tr>
            ) : (
              currentEntries.map((applicant) => (
                <tr
                  key={applicant.id}
                  className="border-b border-gray-100 dark:border-slate-700 cursor-pointer transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-slate-700 dark:hover:to-slate-700 hover:shadow-md hover:scale-[1.01] hover:border-blue-200"
                  onClick={() => setViewingApplicant(applicant)}
                >
                  <td className="px-6 py-4 text-center text-sm font-bold text-gray-900 dark:text-gray-100">
                    <div className="truncate" title={applicant.code}>{applicant.code}</div>
                  </td>
                  <td className="px-6 py-4 text-center text-sm font-bold text-gray-900 dark:text-gray-100">
                    <div className="truncate max-w-[200px] mx-auto" title={`${applicant.firstName} ${applicant.middleName || ''} ${applicant.lastName} ${applicant.extensionName || ''}`.trim()}>
                      {`${applicant.firstName} ${applicant.middleName || ''} ${applicant.lastName} ${applicant.extensionName || ''}`.trim()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center text-sm font-bold text-gray-900 dark:text-gray-100">
                    <div className="truncate" title={applicant.age.toString()}>{applicant.age}</div>
                  </td>
                  <td className="px-6 py-4 text-center text-sm font-bold text-gray-900 dark:text-gray-100">
                    <div className="truncate max-w-[140px] mx-auto" title={applicant.barangay}>{applicant.barangay}</div>
                  </td>
                  <td className="px-6 py-4 text-center text-sm font-bold text-gray-900 dark:text-gray-100">
                    <div className="truncate" title={applicant.gender}>{applicant.gender}</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      applicant.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      applicant.status === 'APPROVED' ? 'bg-blue-100 text-blue-800' :
                      applicant.status === 'DEPLOYED' ? 'bg-green-100 text-green-800' :
                      applicant.status === 'COMPLETED' ? 'bg-pink-100 text-pink-800' :
                      applicant.status === 'REJECTED' ? 'bg-orange-100 text-orange-800' :
                      'bg-gray-100 text-gray-800 dark:text-gray-200'
                    }`}>
                      {applicant.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-sm font-bold text-gray-900 dark:text-gray-100">
                    <div className="truncate" title={applicant.dateSubmitted}>{applicant.dateSubmitted}</div>
                  </td>
                  {isAdmin && (
                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center space-x-2">
                        {showArchived ? (
                          <>
                            <button
                              onClick={() => handleUnarchive(applicant.id, `${applicant.firstName} ${applicant.lastName}`, getFilteredApplicants, updateApplicant, refreshData)}
                              className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors duration-200"
                              title="Restore applicant"
                            >
                              <ArchiveRestore className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(applicant.id, `${applicant.firstName} ${applicant.lastName}`, deleteApplicant)}
                              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors duration-200"
                              title="Delete permanently"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={(e) => { e.stopPropagation(); openEditModal(applicant); }}
                              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                              title="Edit applicant"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleArchive(applicant.id, `${applicant.firstName} ${applicant.lastName}`, getFilteredApplicants, updateApplicant, refreshData); }}
                              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors duration-200"
                              title="Delete (Archive)"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-md hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-2 text-sm border rounded-md ${
                currentPage === page
                  ? `${headerBgColor} text-white border-transparent`
                  : 'border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700'
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-md hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      <ApplicantForm
        showModal={showModal}
        editingApplicant={editingApplicant}
        applicantCode={applicantCode}
        formData={formData}
        isSubmitting={isSubmitting}
        activeProgram={activeProgram}
        onClose={closeModal}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
      />

      {viewingApplicant && activeProgram === 'GIP' && (
        <ApplicantProfile
          applicant={viewingApplicant}
          onClose={() => setViewingApplicant(null)}
        />
      )}
    </div>
  );
};

export default ApplicantsTab;