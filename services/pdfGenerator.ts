import { jsPDF } from 'jspdf';
import { AnalysisResult, ReportStatus } from '../types';

// Font URLs from Google Fonts CDN (base64 will be fetched)
const FONT_URLS: Record<string, string> = {
  // Noto Sans for Latin/Spanish/English
  latin: 'https://cdn.jsdelivr.net/npm/@fontsource/noto-sans@5.0.0/files/noto-sans-latin-400-normal.woff',
  // Noto Sans Bengali
  bengali: 'https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-bengali@5.0.0/files/noto-sans-bengali-bengali-400-normal.woff',
  // Noto Sans Devanagari for Hindi
  hindi: 'https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-devanagari@5.0.0/files/noto-sans-devanagari-devanagari-400-normal.woff',
  // Noto Sans SC for Chinese
  chinese: 'https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-sc@5.0.0/files/noto-sans-sc-chinese-simplified-400-normal.woff',
};

// Detect language from text content
function detectLanguage(text: string): string {
  if (/[\u4e00-\u9fff]/.test(text)) return 'chinese';
  if (/[\u0980-\u09FF]/.test(text)) return 'bengali';
  if (/[\u0900-\u097F]/.test(text)) return 'hindi';
  return 'latin';
}

// Convert array buffer to base64
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Load font and convert to base64
async function loadFont(language: string): Promise<string | null> {
  const url = FONT_URLS[language];
  if (!url) return null;
  
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const buffer = await response.arrayBuffer();
    return arrayBufferToBase64(buffer);
  } catch {
    return null;
  }
}

export async function generatePDF(result: AnalysisResult): Promise<void> {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 25;
  const contentWidth = pageWidth - margin * 2;
  let yPos = margin;

  const textDark: [number, number, number] = [30, 41, 59];
  const textMuted: [number, number, number] = [100, 116, 139];
  const primaryColor: [number, number, number] = [20, 184, 166];

  // Detect language from content
  const sampleText = result.summary + (result.tests[0]?.explanation || '');
  const language = detectLanguage(sampleText);
  
  // Load and register font
  let fontLoaded = false;
  if (language !== 'latin') {
    const fontBase64 = await loadFont(language);
    if (fontBase64) {
      try {
        const fontName = 'NotoSans' + language.charAt(0).toUpperCase() + language.slice(1);
        doc.addFileToVFS(fontName + '.woff', fontBase64);
        doc.addFont(fontName + '.woff', fontName, 'normal');
        doc.setFont(fontName);
        fontLoaded = true;
      } catch {
        fontLoaded = false;
      }
    }
  }

  // Helper to set font safely
  const setFont = (style: 'normal' | 'bold') => {
    if (fontLoaded) {
      const fontName = 'NotoSans' + language.charAt(0).toUpperCase() + language.slice(1);
      doc.setFont(fontName, style);
    } else {
      doc.setFont('helvetica', style);
    }
  };

  // Header - Logo with medical cross icon
  doc.setFillColor(...primaryColor);
  doc.roundedRect(margin, yPos - 2, 12, 12, 2, 2, 'F');
  
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(1.5);
  doc.line(margin + 6, yPos + 1, margin + 6, yPos + 7);
  doc.line(margin + 3, yPos + 4, margin + 9, yPos + 4);
  
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
  doc.setFont('helvetica', 'bold');
  doc.text('Summary', margin, yPos);
  yPos += 7;

  setFont('normal');
  doc.setFontSize(10);
  doc.setTextColor(...textMuted);
  
  try {
    const summaryLines = doc.splitTextToSize(result.summary, contentWidth);
    doc.text(summaryLines, margin, yPos);
    yPos += summaryLines.length * 5 + 15;
  } catch {
    doc.setFont('helvetica', 'normal');
    doc.text('[View in app for full content]', margin, yPos);
    yPos += 20;
  }

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
  setFont('normal');
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
    doc.setFont('helvetica', 'normal');
    doc.text(statusText, margin + 145, yPos);
    setFont('normal');

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
  setFont('normal');
  result.tests.forEach((test) => {
    if (yPos > pageHeight - 30) {
      doc.addPage();
      yPos = margin;
    }
    doc.setTextColor(...textDark);
    doc.setFont('helvetica', 'bold');
    doc.text(test.name + ':', margin, yPos);
    setFont('normal');
    doc.setTextColor(...textMuted);
    try {
      const expLines = doc.splitTextToSize(test.explanation, contentWidth);
      doc.text(expLines, margin, yPos + 5);
      yPos += 5 + expLines.length * 4 + 5;
    } catch {
      yPos += 10;
    }
  });

  // Comparison Results
  if (result.isComparison && result.comparison) {
    if (yPos > pageHeight - 50) {
      doc.addPage();
      yPos = margin;
    }
    yPos += 5;
    doc.setTextColor(139, 92, 246);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Report Comparison', margin, yPos);
    yPos += 8;

    if (result.comparison.comparisonSummary) {
      doc.setFontSize(9);
      setFont('normal');
      doc.setTextColor(...textMuted);
      try {
        const summLines = doc.splitTextToSize(result.comparison.comparisonSummary, contentWidth);
        doc.text(summLines, margin, yPos);
        yPos += summLines.length * 4 + 8;
      } catch {
        yPos += 10;
      }
    }

    // Improved
    if (result.comparison.improved && result.comparison.improved.length > 0) {
      if (yPos > pageHeight - 30) { doc.addPage(); yPos = margin; }
      doc.setTextColor(16, 185, 129);
      doc.setFont('helvetica', 'bold');
      doc.text('Improved (' + result.comparison.improved.length + ')', margin, yPos);
      yPos += 6;
      setFont('normal');
      doc.setFontSize(8);
      result.comparison.improved.forEach((item) => {
        if (yPos > pageHeight - 20) { doc.addPage(); yPos = margin; }
        doc.setTextColor(...textDark);
        doc.text(item.name + ': ' + item.oldValue + ' -> ' + item.newValue, margin, yPos);
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
      setFont('normal');
      doc.setFontSize(8);
      result.comparison.worsened.forEach((item) => {
        if (yPos > pageHeight - 20) { doc.addPage(); yPos = margin; }
        doc.setTextColor(...textDark);
        doc.text(item.name + ': ' + item.oldValue + ' -> ' + item.newValue, margin, yPos);
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
      setFont('normal');
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
      setFont('normal');
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
    doc.setTextColor(239, 68, 68);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('What This Does NOT Mean', margin, yPos);
    yPos += 8;

    doc.setFontSize(9);
    setFont('normal');
    doc.setTextColor(...textMuted);
    result.doesNotMean.forEach((item) => {
      if (yPos > pageHeight - 20) {
        doc.addPage();
        yPos = margin;
      }
      try {
        const lines = doc.splitTextToSize('- ' + item, contentWidth);
        doc.text(lines, margin, yPos);
        yPos += lines.length * 4 + 3;
      } catch {
        yPos += 5;
      }
    });
  }

  // What You Should Do Next
  if (result.nextSteps && result.nextSteps.length > 0) {
    if (yPos > pageHeight - 50) {
      doc.addPage();
      yPos = margin;
    }
    yPos += 5;
    doc.setTextColor(16, 185, 129);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('What You Should Do Next', margin, yPos);
    yPos += 8;

    doc.setFontSize(9);
    setFont('normal');
    doc.setTextColor(...textMuted);
    result.nextSteps.forEach((step, idx) => {
      if (yPos > pageHeight - 20) {
        doc.addPage();
        yPos = margin;
      }
      try {
        const lines = doc.splitTextToSize((idx + 1) + '. ' + step, contentWidth);
        doc.text(lines, margin, yPos);
        yPos += lines.length * 4 + 3;
      } catch {
        yPos += 5;
      }
    });
  }

  // Questions to Ask Your Doctor
  if (result.doctorQuestions && result.doctorQuestions.length > 0) {
    if (yPos > pageHeight - 50) {
      doc.addPage();
      yPos = margin;
    }
    yPos += 5;
    doc.setTextColor(139, 92, 246);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Questions to Ask Your Doctor', margin, yPos);
    yPos += 8;

    doc.setFontSize(9);
    setFont('normal');
    doc.setTextColor(...textMuted);
    result.doctorQuestions.forEach((question) => {
      if (yPos > pageHeight - 20) {
        doc.addPage();
        yPos = margin;
      }
      try {
        const lines = doc.splitTextToSize('- ' + question, contentWidth);
        doc.text(lines, margin, yPos);
        yPos += lines.length * 4 + 3;
      } catch {
        yPos += 5;
      }
    });
  }

  // Footer
  const footerY = pageHeight - 15;
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, footerY - 8, pageWidth - margin, footerY - 8);
  doc.setTextColor(...textMuted);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
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
