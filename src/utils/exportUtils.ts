import { EvaluationResult, Exam } from '../types';

export const exportToCSV = (filename: string, rows: Record<string, any>[]) => {
  if (!rows || !rows.length) return;
  const headers = Object.keys(rows[0]);
  const csvContent =
    'data:text/csv;charset=utf-8,' +
    [
      headers.join(','),
      ...rows.map((row) =>
        headers
          .map((header) => {
            const val = row[header] === undefined || row[header] === null ? '' : String(row[header]);
            return `"${val.replace(/"/g, '""')}"`;
          })
          .join(',')
      ),
    ].join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const printOrSaveReportHTML = (title: string, htmlBody: string) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to view/print the official PDF report.');
    return;
  }
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #1e293b; background: #ffffff; }
          .header { border-bottom: 2px solid #3b82f6; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center; }
          .brand { font-size: 24px; font-weight: bold; color: #1e3a8a; }
          .meta { font-size: 14px; color: #64748b; text-align: right; }
          .badge { background: #dbeafe; color: #1e40af; padding: 4px 12px; border-radius: 12px; font-weight: 600; font-size: 13px; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { border: 1px solid #cbd5e1; padding: 12px; text-align: left; }
          th { background: #f1f5f9; font-weight: 600; }
          .score-card { background: #f8fafc; border-radius: 8px; padding: 20px; border-left: 4px solid #2563eb; margin-bottom: 20px; }
          .footer { margin-top: 50px; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 15px; display: flex; justify-content: space-between; }
          @media print {
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="no-print" style="margin-bottom: 20px; text-align: right;">
          <button onclick="window.print()" style="background: #2563eb; color: white; border: none; padding: 10px 20px; border-radius: 6px; font-weight: bold; cursor: pointer;">🖨️ Print / Save as PDF</button>
        </div>
        ${htmlBody}
        <div class="footer">
          <span>Automated Exam Evaluation System • Official University Academic Record</span>
          <span>Verified by Automated Evaluation System Engine • ${new Date().toLocaleDateString()}</span>
        </div>
      </body>
    </html>
  `);
  printWindow.document.close();
};

export const generateStudentReportHTML = (evalResult: EvaluationResult) => {
  const qRows = evalResult.questionEvaluations
    .map(
      (q) => `
    <tr>
      <td><strong>Q${q.questionNumber}</strong></td>
      <td>${q.scoreObtained} / ${q.maxMarks}</td>
      <td>${q.semanticSimilarityScore}%</td>
      <td>${q.keywordMatchScore}%</td>
      <td>${q.grammarScore}%</td>
      <td>${q.confidenceScore}%</td>
      <td>${q.aiFeedbackText}</td>
    </tr>
  `
    )
    .join('');

  return `
    <div class="header">
      <div>
        <div class="brand">Exam Evaluation Report</div>
        <div style="font-size: 16px; font-weight: 600; margin-top: 4px;">${evalResult.examTitle}</div>
      </div>
      <div class="meta">
        <div><strong>Student:</strong> ${evalResult.studentName} (${evalResult.studentRollNumber})</div>
        <div><strong>Subject:</strong> ${evalResult.subjectName}</div>
        <div><strong>Evaluated:</strong> ${new Date(evalResult.evaluatedAt).toLocaleDateString()}</div>
      </div>
    </div>

    <div class="score-card">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <span style="font-size: 14px; color: #64748b;">Total Score Obtained</span>
          <div style="font-size: 32px; font-weight: 800; color: #1e293b;">${evalResult.totalObtainedMarks} <span style="font-size: 18px; color: #64748b;">/ ${evalResult.totalMarks}</span></div>
        </div>
        <div style="text-align: right;">
          <span class="badge">Overall Grade: ${evalResult.overallPercentage}%</span>
          <div style="font-size: 13px; color: #64748b; margin-top: 6px;">Evaluation Confidence: ${evalResult.overallConfidenceScore}%</div>
        </div>
      </div>
    </div>

    <h3>Question-wise Evaluation Breakdown</h3>
    <table>
      <thead>
        <tr>
          <th>Q#</th>
          <th>Score</th>
          <th>Semantic Match</th>
          <th>Keyword Score</th>
          <th>Grammar Score</th>
          <th>Confidence</th>
          <th>Feedback</th>
        </tr>
      </thead>
      <tbody>
        ${qRows}
      </tbody>
    </table>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 25px;">
      <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 15px; border-radius: 8px;">
        <h4 style="color: #166534; margin-top: 0;">✔ Strengths Highlighted</h4>
        <ul>
          ${evalResult.generalStrengths.map((s) => `<li>${s}</li>`).join('')}
        </ul>
      </div>
      <div style="background: #fef2f2; border: 1px solid #fecaca; padding: 15px; border-radius: 8px;">
        <h4 style="color: #991b1b; margin-top: 0;">✖ Areas for Improvement</h4>
        <ul>
          ${evalResult.generalWeaknesses.map((w) => `<li>${w}</li>`).join('')}
        </ul>
      </div>
    </div>

    <div style="background: #eff6ff; border: 1px solid #bfdbfe; padding: 15px; border-radius: 8px; margin-top: 20px;">
      <h4 style="color: #1e40af; margin-top: 0;">💡 Recommended Study Topics</h4>
      <ul>
        ${evalResult.studyRecommendations.map((rec) => `<li>${rec}</li>`).join('')}
      </ul>
    </div>

    ${
      evalResult.facultyNotes
        ? `
      <div style="margin-top: 20px; background: #fffbe3; border: 1px solid #fde047; padding: 15px; border-radius: 8px;">
        <strong>Faculty Examiner Review Notes:</strong> ${evalResult.facultyNotes}
      </div>
    `
        : ''
    }
  `;
};
