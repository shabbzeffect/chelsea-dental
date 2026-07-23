'use client';

interface ExportButtonProps {
  reportTitle: string;
  className?: string;
}

export default function ExportButton({ reportTitle, className = '' }: ExportButtonProps) {
  const handleExportPDF = () => {
    // Add print-specific title
    const titleElement = document.getElementById('report-title');
    if (titleElement) {
      titleElement.setAttribute('data-print-title', reportTitle);
    }

    // Trigger print dialog (user can save as PDF)
    window.print();
  };

  return (
    <button
      onClick={handleExportPDF}
      className={`flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm font-medium ${className}`}
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
      </svg>
      Export PDF
    </button>
  );
}
