export interface ApplicantData {
  code: string;
  name: string;
  age: number;
  barangay: string;
  gender: string;
  status: string;
  dateSubmitted: string;
}

export interface StatsData {
  totalApplicants: number;
  pending: number;
  approved: number;
  deployed: number;
  completed: number;
  rejected: number;
  resigned: number;
  barangaysCovered: number;
  maleCount: number;
  femaleCount: number;
}

export const exportApplicantsToCSV = (applicants: ApplicantData[], program: "GIP" | "TUPAD") => {
  const headers = ["Code", "Name", "Age", "Barangay", "Gender", "Status", "Date Submitted"];
  const csvContent = [
    headers.join(","),
    ...applicants.map(a =>
      [
        a.code,
        `"${a.name}"`,
        a.age,
        a.barangay,
        a.gender,
        a.status,
        a.dateSubmitted
      ].join(",")
    )
  ].join("\n");

  downloadFile(csvContent, `${program}_Applicants_${getCurrentDate()}.csv`, "text/csv");
};

export const exportStatsToCSV = (stats: StatsData, program: "GIP" | "TUPAD") => {
  const headers = ["Metric", "Total", "Male", "Female"];
  const csvContent = [
    headers.join(","),
    `Total Applicants,${stats.totalApplicants},${stats.maleCount},${stats.femaleCount}`,
    `Pending,${stats.pending},${stats.maleCount},${stats.femaleCount}`,
    `Approved,${stats.approved},${stats.maleCount},${stats.femaleCount}`,
    `Deployed,${stats.deployed},${stats.maleCount},${stats.femaleCount}`,
    `Completed,${stats.completed},${stats.maleCount},${stats.femaleCount}`,
    `Rejected,${stats.rejected},${stats.maleCount},${stats.femaleCount}`,
    `Resigned,${stats.resigned},${stats.maleCount},${stats.femaleCount}`,
    `Barangays Covered,${stats.barangaysCovered},N/A,N/A`
  ].join("\n");

  downloadFile(csvContent, `${program}_Statistics_${getCurrentDate()}.csv`, "text/csv");
};

export const exportApplicantsToPDF = (applicants: ApplicantData[], program: "GIP" | "TUPAD") => {
  const programName = program === "GIP" ? "Government Internship Program" : "TUPAD Program";

  let pdfContent = `
    <html>
      <head>
        <title>${program} Applicants Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #000; padding: 8px; text-align: left; }
          th { background-color: #dc2626; color: white; }
          tr:nth-child(even) { background-color: #f9f9f9; }
        </style>
      </head>
      <body>
        <h1 style="text-align:center;">${program} APPLICANTS REPORT</h1>
        <h3 style="text-align:center;">${programName}<br>City Government of Santa Rosa</h3>

        <table>
          <thead>
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th>Age</th>
              <th>Barangay</th>
              <th>Gender</th>
              <th>Status</th>
              <th>Date Submitted</th>
            </tr>
          </thead>
          <tbody>
  `;

  if (applicants.length === 0) {
    pdfContent += `<tr><td colspan="7" style="text-align:center;padding:20px;">No applicants found.</td></tr>`;
  } else {
    applicants.forEach(a => {
      pdfContent += `
        <tr>
          <td>${a.code}</td>
          <td>${a.name}</td>
          <td>${a.age}</td>
          <td>${a.barangay}</td>
          <td>${a.gender}</td>
          <td>${a.status}</td>
          <td>${a.dateSubmitted}</td>
        </tr>`;
    });
  }

  pdfContent += `
          </tbody>
        </table>
      </body>
    </html>
  `;

  printHTML(pdfContent);
};

export const exportStatsToPDF = (stats: StatsData, program: "GIP" | "TUPAD") => {
  const programName = program === "GIP" ? "Government Internship Program" : "TUPAD Program";

  const pdfContent = `
    <html>
      <head>
        <title>${program} Statistics Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 20px 0; }
          .stat-card { border: 1px solid #ddd; padding: 15px; border-radius: 8px; text-align: center; }
          .stat-value { font-size: 24px; font-weight: bold; }
          .stat-label { font-size: 14px; color: #666; margin-top: 5px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${program} STATISTICS REPORT</h1>
          <p>${programName}</p>
        </div>

        <div class="stats-grid">
          <div class="stat-card"><div class="stat-value">${stats.totalApplicants}</div><div class="stat-label">Total Applicants</div></div>
          <div class="stat-card"><div class="stat-value">${stats.pending}</div><div class="stat-label">Pending</div></div>
          <div class="stat-card"><div class="stat-value">${stats.approved}</div><div class="stat-label">Approved</div></div>
          <div class="stat-card"><div class="stat-value">${stats.deployed}</div><div class="stat-label">Deployed</div></div>
          <div class="stat-card"><div class="stat-value">${stats.completed}</div><div class="stat-label">Completed</div></div>
          <div class="stat-card"><div class="stat-value">${stats.rejected}</div><div class="stat-label">Rejected</div></div>
          <div class="stat-card"><div class="stat-value">${stats.resigned}</div><div class="stat-label">Resigned</div></div>
          <div class="stat-card"><div class="stat-value">${stats.barangaysCovered}</div><div class="stat-label">Barangays Covered</div></div>
        </div>
      </body>
    </html>
  `;

  printHTML(pdfContent);
};

export const printApplicants = (applicants: ApplicantData[], program: "GIP" | "TUPAD") => {
  const programName =
    program === "GIP" ? "Government Internship Program" : "TUPAD Program";

  const headerColor = program === "GIP" ? "#dc2626" : "#16a34a";

  const html = `
    <html>
      <head>
        <title>${program} Applicants</title>

        <style>
          @media print {
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
          }

          body { font-family: Arial, sans-serif; margin: 20px; }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            font-size: 12px;
            border: 1px solid #000;
          }

          th, td {
            border: 1px solid #000;
            padding: 6px;
            text-align: left;
          }

          thead th {
            background-color: ${headerColor} !important;
            color: #fff !important;
          }

          tr:nth-child(even) { background: #f9f9f9; }
        </style>
      </head>

      <body>
        <h1 style="text-align:center;">${program} Applicants</h1>
        <h3 style="text-align:center;">${programName}<br>City Government of Santa Rosa</h3>

        <table>
          <thead>
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th>Age</th>
              <th>Barangay</th>
              <th>Gender</th>
              <th>Status</th>
              <th>Date Submitted</th>
            </tr>
          </thead>

          <tbody>
            ${
              applicants.length === 0
                ? `<tr><td colspan="7" style="text-align:center;padding:20px;">No applicants found.</td></tr>`
                : applicants
                    .map(
                      (a) => `
                <tr>
                  <td>${a.code}</td>
                  <td>${a.name}</td>
                  <td>${a.age}</td>
                  <td>${a.barangay}</td>
                  <td>${a.gender}</td>
                  <td>${a.status}</td>
                  <td>${a.dateSubmitted}</td>
                </tr>
              `
                    )
                    .join("")
            }
          </tbody>
        </table>
      </body>
    </html>
  `;

  printWithIframe(html);
};

export const printStats = (stats: StatsData, program: "GIP" | "TUPAD") => {
  const programName = program === "GIP" ? "Government Internship Program" : "TUPAD Program";

  const html = `
    <html>
      <head>
        <title>${program} Statistics</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
          .stat-card { border: 1px solid #ddd; padding: 15px; border-radius: 8px; text-align: center; }
          .stat-value { font-size: 24px; font-weight: bold; }
          .stat-label { font-size: 14px; color: #555; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${program} STATISTICS</h1>
          <p>${programName}</p>
          <p>Printed on: ${new Date().toLocaleDateString()}</p>
        </div>

        <div class="stats-grid">
          <div class="stat-card"><div class="stat-value">${stats.totalApplicants}</div><div class="stat-label">Total Applicants</div></div>
          <div class="stat-card"><div class="stat-value">${stats.pending}</div><div class="stat-label">Pending</div></div>
          <div class="stat-card"><div class="stat-value">${stats.approved}</div><div class="stat-label">Approved</div></div>
          <div class="stat-card"><div class="stat-value">${stats.deployed}</div><div class="stat-label">Deployed</div></div>
          <div class="stat-card"><div class="stat-value">${stats.completed}</div><div class="stat-label">Completed</div></div>
          <div class="stat-card"><div class="stat-value">${stats.rejected}</div><div class="stat-label">Rejected</div></div>
          <div class="stat-card"><div class="stat-value">${stats.resigned}</div><div class="stat-label">Resigned</div></div>
          <div class="stat-card"><div class="stat-value">${stats.barangaysCovered}</div><div class="stat-label">Barangays Covered</div></div>
        </div>
      </body>
    </html>
  `;

  printWithIframe(html);
};

const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

const printHTML = (htmlContent: string) => {
  printWithIframe(htmlContent);
};

const printWithIframe = (html: string) => {
  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  iframe.style.visibility = "hidden";

  document.body.appendChild(iframe);

  const doc = iframe.contentWindow!.document;
  doc.open();
  doc.write(html);
  doc.close();

  iframe.onload = () => {
    iframe.contentWindow!.focus();
    iframe.contentWindow!.print();
    setTimeout(() => document.body.removeChild(iframe), 500);
  };
};

const getCurrentDate = () => {
  return new Date().toISOString().split("T")[0];
};
