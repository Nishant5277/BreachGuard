import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function ExportPdfButton({ results }) {
  const exportPDF = () => {
    const doc = new jsPDF();
    
    // Add Title
    doc.setFontSize(20);
    doc.text('BreachGuard Security Report', 14, 22);
    
    // Add Date
    doc.setFontSize(11);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
    
    // Calculate stats
    const total = results.length;
    const leaked = results.filter(r => r.leaked).length;
    const safe = total - leaked;

    doc.text(`Total Passwords Checked: ${total}`, 14, 40);
    doc.text(`Compromised Passwords: ${leaked}`, 14, 46);
    doc.text(`Safe Passwords: ${safe}`, 14, 52);

    // Prepare table data
    const tableColumn = ["Password", "Status", "Breach Count", "Strength"];
    const tableRows = [];

    results.forEach(item => {
      const ticketData = [
        item.password,
        item.leaked ? "Compromised" : "Safe",
        item.count || '0',
        item.strength
      ];
      tableRows.push(ticketData);
    });

    // AutoTable plugin
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 60,
      theme: 'grid',
      headStyles: { fillColor: [39, 39, 42] },
      styles: { fontSize: 10 }
    });

    doc.save(`breachguard_report_${Date.now()}.pdf`);
  };

  return (
    <button className="reset-btn" onClick={exportPDF} style={{ marginLeft: '1rem' }}>
      Download PDF Report
    </button>
  );
}
