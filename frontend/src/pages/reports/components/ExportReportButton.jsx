import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useState } from "react";

const ExportReportButton = ({ targetRef, month, year }) => {
  const [exporting, setExporting] = useState(false);

  const handleExportPDF = async () => {
    if (!targetRef.current) return;

    try {
      setExporting(true);

      const canvas = await html2canvas(targetRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#f6fbf8",
        scrollX: 0,
        scrollY: -window.scrollY,
      });

      const imageData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("l", "mm", "a4");

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const margin = 8;

      const maxWidth = pageWidth - margin * 2;
      const maxHeight = pageHeight - margin * 2;

      const widthRatio = maxWidth / canvas.width;
      const heightRatio = maxHeight / canvas.height;
      const ratio = Math.min(widthRatio, heightRatio);

      const imageWidth = canvas.width * ratio;
      const imageHeight = canvas.height * ratio;

      const imageX = (pageWidth - imageWidth) / 2;
      const imageY = (pageHeight - imageHeight) / 2;

      pdf.addImage(imageData, "PNG", imageX, imageY, imageWidth, imageHeight);

      pdf.save(`bao-cao-thang-${String(month).padStart(2, "0")}-${year}.pdf`);
    } finally {
      setExporting(false);
    }
  };
  return (
    <button
      type="button"
      className="btn export-btn w-100 mt-3 mb-4"
      onClick={handleExportPDF}
      disabled={exporting}
    >
      <i className="bi bi-download me-2"></i>
      {exporting ? "Đang xuất PDF..." : "Xuất báo cáo PDF"}
    </button>
  );
};

export default ExportReportButton;
