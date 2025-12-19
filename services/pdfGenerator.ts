import { jsPDF } from 'jspdf';
import { AnalysisResult, ReportStatus } from '../types';

export function generatePDF(result: AnalysisResult): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 25;
  const contentWidth = pageWidth - margin * 2;
  let yPos = margin;

  const textDark: [number, number, number] = [30, 41, 59];
  const textMuted: [number, number, number] = [100, 116, 139];
  const primaryColor: [number, number, number] = [20, 184, 166];

  // Header - Logo with medical cross icon
  // Draw a rounded rectangle as logo background
  doc.setFillColor(...primaryColor);
  doc.roundedRect(margin, yPos - 2, 12, 12, 2, 2, 'F');
  
  // Draw medical cross inside
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(1.5);
  doc.line(margin + 6, yPos + 1, margin + 6, yPos + 7); // vertical
  doc.line(margin + 3, yPos + 4, margin + 9, yPos + 4); // horizontal
  
  // Brand name
  doc.setTextColor(...primaryColor);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Doclyst', margin + 16, yPos + 7);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...textMuted);
  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  doc.text(dateStr, pageWidth - margin, yPos + 6, { align: 'right' });

  yPos += 20;
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 15;

  // Status
  const getStatusText = (status: ReportStatus): string => {
    switch (status) {
      case ReportStatus.NORMAL:
        return 'Status: Everything looks good';
      case ReportStatus.ATTENTION:
        return 'Status: Needs attention';
      case ReportStatus.URGENT:
        return 'Status: Please see a doctor soon';
      default:
        return 'Status: Analysis complete';
    }
  };

  doc.setTextColor(...textDark);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(getStatusText(result.overallStatus), margin, yPos);
  yPos += 15;

  // Summary
  doc.setFontSize(11);
  doc.text('Summary', margin, yPos);
  yPos += 7;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(...textMuted);
  const summaryLines = doc.splitTextToSize(result.summary, contentWidth);
  doc.text(summaryLines, margin, yPos);
  yPos += summaryLines.length * 5 + 15;

  // Test Results Header
  doc.setTextColor(...textDark);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Test Results', margin, yPos);
  yPos += 10;

  // Table header
  doc.setFillColor(248, 250, 252);
  doc.rect(margin, yPos, contentWidth, 8, 'F');
  doc.setFontSize(9);
  doc.setTextColor(...textMuted);
  doc.text('Test Name', margin + 3, yPos + 5.5);
  doc.text('Value', margin + 65, yPos + 5.5);
  doc.text('Normal Range', margin + 100, yPos + 5.5);
  doc.text('Status', margin + 145, yPos + 5.5);
  yPos += 12;

  // Table rows
  doc.setFont('helvetica', 'normal');
  result.tests.forEach((test) => {
    if (yPos > pageHeight - 50) {
      doc.addPage();
      yPos = margin;
    }

    doc.setTextColor(...textDark);
    doc.text(test.name.substring(0, 25), margin + 3, yPos);
    doc.text(test.value.substring(0, 15), margin + 65, yPos);
    doc.setTextColor(...textMuted);
    doc.text(test.range.substring(0, 18), margin + 100, yPos);

    const statusText = test.status === 'normal' ? 'Normal' : test.status === 'warning' ? 'Attention' : 'Alert';
    const statusColor: [number, number, number] =
      test.status === 'normal'
        ? [16, 185, 129]
        : test.status === 'warning'
        ? [245, 158, 11]
        : [239, 68, 68];
    doc.setTextColor(...statusColor);
    doc.text(statusText, margin + 145, yPos);

    yPos += 8;
  });

  yPos += 10;

  // Explanations
  if (yPos > pageHeight - 80) {
    doc.addPage();
    yPos = margin;
  }

  doc.setTextColor(...textDark);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Explanations', margin, yPos);
  yPos += 8;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  result.tests.forEach((test) => {
    if (yPos > pageHeight - 30) {
      doc.addPage();
      yPos = margin;
    }
    doc.setTextColor(...textDark);
    doc.setFont('helvetica', 'bold');
    doc.text(test.name + ':', margin, yPos);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...textMuted);
    const expLines = doc.splitTextToSize(test.explanation, contentWidth);
    doc.text(expLines, margin, yPos + 5);
    yPos += 5 + expLines.length * 4 + 5;
  });

  // Comparison Results (if comparison mode)
  if (result.isComparison && result.comparison) {
    if (yPos > pageHeight - 50) {
      doc.addPage();
      yPos = margin;
    }
    yPos += 5;
    doc.setTextColor(139, 92, 246); // purple
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Report Comparison', margin, yPos);
    yPos += 8;

    // Comparison Summary
    if (result.comparison.comparisonSummary) {
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...textMuted);
      const summLines = doc.splitTextToSize(result.comparison.comparisonSummary, contentWidth);
      doc.text(summLines, margin, yPos);
      yPos += summLines.length * 4 + 8;
    }

    // Improved
    if (result.comparison.improved && result.comparison.improved.length > 0) {
      if (yPos > pageHeight - 30) { doc.addPage(); yPos = margin; }
      doc.setTextColor(16, 185, 129);
      doc.setFont('helvetica', 'bold');
      doc.text('Improved (' + result.comparison.improved.length + ')', margin, yPos);
      yPos += 6;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      result.comparison.improved.forEach((item) => {
        if (yPos > pageHeight - 20) { doc.addPage(); yPos = margin; }
        doc.setTextColor(...textDark);
        doc.text(item.name + ': ' + item.oldValue + ' → ' + item.newValue, margin, yPos);
        yPos += 5;
      });
      yPos += 3;
    }

    // Worsened
    if (result.comparison.worsened && result.comparison.worsened.length > 0) {
      if (yPos > pageHeight - 30) { doc.addPage(); yPos = margin; }
      doc.setTextColor(239, 68, 68);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text('Needs Attention (' + result.comparison.worsened.length + ')', margin, yPos);
      yPos += 6;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      result.comparison.worsened.forEach((item) => {
        if (yPos > pageHeight - 20) { doc.addPage(); yPos = margin; }
        doc.setTextColor(...textDark);
        doc.text(item.name + ': ' + item.oldValue + ' → ' + item.newValue, margin, yPos);
        yPos += 5;
      });
      yPos += 3;
    }

    // Stable
    if (result.comparison.stable && result.comparison.stable.length > 0) {
      if (yPos > pageHeight - 30) { doc.addPage(); yPos = margin; }
      doc.setTextColor(...textMuted);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text('Stable (' + result.comparison.stable.length + ')', margin, yPos);
      yPos += 6;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      result.comparison.stable.forEach((item) => {
        if (yPos > pageHeight - 20) { doc.addPage(); yPos = margin; }
        doc.setTextColor(...textDark);
        doc.text(item.name + ': ' + item.newValue, margin, yPos);
        yPos += 5;
      });
      yPos += 3;
    }

    // New Findings
    if (result.comparison.newFindings && result.comparison.newFindings.length > 0) {
      if (yPos > pageHeight - 30) { doc.addPage(); yPos = margin; }
      doc.setTextColor(245, 158, 11);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text('New Findings (' + result.comparison.newFindings.length + ')', margin, yPos);
      yPos += 6;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      result.comparison.newFindings.forEach((item) => {
        if (yPos > pageHeight - 20) { doc.addPage(); yPos = margin; }
        doc.setTextColor(...textDark);
        doc.text(item.name + ': ' + item.newValue, margin, yPos);
        yPos += 5;
      });
      yPos += 3;
    }
  }

  // What This Does NOT Mean
  if (result.doesNotMean && result.doesNotMean.length > 0) {
    if (yPos > pageHeight - 50) {
      doc.addPage();
      yPos = margin;
    }
    yPos += 5;
    doc.setTextColor(239, 68, 68); // rose color
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('What This Does NOT Mean', margin, yPos);
    yPos += 8;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...textMuted);
    result.doesNotMean.forEach((item) => {
      if (yPos > pageHeight - 20) {
        doc.addPage();
        yPos = margin;
      }
      const lines = doc.splitTextToSize('• ' + item, contentWidth);
      doc.text(lines, margin, yPos);
      yPos += lines.length * 4 + 3;
    });
  }

  // What You Should Do Next
  if (result.nextSteps && result.nextSteps.length > 0) {
    if (yPos > pageHeight - 50) {
      doc.addPage();
      yPos = margin;
    }
    yPos += 5;
    doc.setTextColor(16, 185, 129); // mint/green color
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('What You Should Do Next', margin, yPos);
    yPos += 8;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...textMuted);
    result.nextSteps.forEach((step, idx) => {
      if (yPos > pageHeight - 20) {
        doc.addPage();
        yPos = margin;
      }
      const lines = doc.splitTextToSize((idx + 1) + '. ' + step, contentWidth);
      doc.text(lines, margin, yPos);
      yPos += lines.length * 4 + 3;
    });
  }

  // Questions to Ask Your Doctor
  if (result.doctorQuestions && result.doctorQuestions.length > 0) {
    if (yPos > pageHeight - 50) {
      doc.addPage();
      yPos = margin;
    }
    yPos += 5;
    doc.setTextColor(139, 92, 246); // lavender/purple color
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Questions to Ask Your Doctor', margin, yPos);
    yPos += 8;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...textMuted);
    result.doctorQuestions.forEach((question) => {
      if (yPos > pageHeight - 20) {
        doc.addPage();
        yPos = margin;
      }
      const lines = doc.splitTextToSize('? ' + question, contentWidth);
      doc.text(lines, margin, yPos);
      yPos += lines.length * 4 + 3;
    });
  }

  yPos += 5;

  // Footer
  const footerY = pageHeight - 15;
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, footerY - 8, pageWidth - margin, footerY - 8);
  doc.setTextColor(...textMuted);
  doc.setFontSize(8);
  doc.text(
    'This report is for informational purposes only and does not constitute medical advice.',
    margin,
    footerY
  );
  doc.text('Doclyst', pageWidth - margin, footerY, { align: 'right' });

  const fileName = result.isComparison 
    ? 'Doclyst_Comparison_' + new Date().toISOString().split('T')[0] + '.pdf'
    : 'Doclyst_Report_' + new Date().toISOString().split('T')[0] + '.pdf';
  doc.save(fileName);
}
