import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // 1. Import it as a standalone function

export const generateImpactReport = (stats, inventory, t) => {
  const doc = new jsPDF();
  const primaryColor = [22, 163, 74]; // NeedNourish Green

  // Helper to force English (Even if the UI is in another language)
  const te = (key) => t(key, { lng: "en" });

  // 1. Header: Branding
  doc.setFontSize(24);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text("NeedNourish", 14, 20);

  // 2. Report Info
  doc.setFontSize(16);
  doc.setTextColor(60, 60, 60);
  doc.text(te("pdf.report_title"), 14, 32);

  doc.setFontSize(10);
  doc.setTextColor(120);
  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  doc.text(`${te("pdf.generated_on")}: ${date}`, 14, 40);

  // 3. Stats Section
  doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.line(14, 45, 196, 45);

  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.text(te("pdf.summary"), 14, 55);

  const statsData = [
    [te("stats.total"), stats.total],
    [te("stats.active"), stats.active],
    [te("stats.claimed"), stats.claimed],
  ];

  // 2. CHANGE: Call autoTable(doc, {...}) instead of doc.autoTable({...})
  autoTable(doc, {
    startY: 60,
    head: [["Metric", "Quantity"]],
    body: statsData,
    theme: "grid",
    headStyles: { fillColor: primaryColor },
    styles: { fontSize: 10 },
  });

  // 4. Inventory Log Table
  doc.text("Detailed Donation Log", 14, doc.lastAutoTable.finalY + 15);

  const tableRows = inventory.map((item) => [
    item.title,
    te(`categories.${item.category}`),
    te(`food.status_${item.status}`),
    new Date(item.created_at).toLocaleDateString("en-US"),
  ]);

  // 3. CHANGE: Call autoTable(doc, {...}) here too
  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 20,
    head: [
      [
        te("pdf.table_title"),
        te("pdf.table_cat"),
        te("pdf.table_status"),
        te("pdf.table_date"),
      ],
    ],
    body: tableRows,
    headStyles: { fillColor: primaryColor },
    styles: { fontSize: 9 },
  });

  // 5. Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setTextColor(150);
    doc.text(te("pdf.footer"), 14, doc.internal.pageSize.height - 10);
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.width - 30,
      doc.internal.pageSize.height - 10,
    );
  }

  doc.save(`NeedNourish_Impact_Report_${new Date().getTime()}.pdf`);
};
