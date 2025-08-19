/* src/components/AccountStatement.jsx */
import React, { useState, useEffect } from "react";
import "./AccountStatements.css";

function AccountStatement({ user = "demo@bank.com", transactions = [] }) {
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [dateRange, setDateRange] = useState("all");
  const [isDownloading, setIsDownloading] = useState(false);
  const [accountNumber] = useState("****-****-****-4521");
  const [sortCode] = useState("12-34-56");

  useEffect(() => {
    filterTransactions();
  }, [transactions, dateRange]);

  const filterTransactions = () => {
    let filtered = [...transactions];
    const now = new Date();
    
    switch (dateRange) {
      case "7days":
        const week = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(t => new Date(t.date) >= week);
        break;
      case "30days":
        const month = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(t => new Date(t.date) >= month);
        break;
      case "90days":
        const quarter = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(t => new Date(t.date) >= quarter);
        break;
      default:
        // Show all transactions
        break;
    }
    
    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    setFilteredTransactions(filtered);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateSummary = () => {
    const summary = filteredTransactions.reduce((acc, transaction) => {
      if (transaction.type === 'credit') {
        acc.totalCredits += transaction.amount;
        acc.creditCount += 1;
      } else {
        acc.totalDebits += transaction.amount;
        acc.debitCount += 1;
      }
      return acc;
    }, {
      totalCredits: 0,
      totalDebits: 0,
      creditCount: 0,
      debitCount: 0
    });

    summary.netAmount = summary.totalCredits - summary.totalDebits;
    return summary;
  };

  const generatePDF = async () => {
    setIsDownloading(true);
    
    try {
      // Dynamic import of jsPDF to avoid build issues
      const jsPDFModule = await import('jspdf');
      const jsPDF = jsPDFModule.jsPDF;
      const doc = new jsPDF();
      
      const summary = calculateSummary();
      const pageWidth = doc.internal.pageSize.width;
      const margin = 20;
      let yPos = 30;

      // Header
      doc.setFontSize(20);
      doc.setTextColor(37, 99, 235); // Primary color
      doc.text('MODERN BANK', margin, yPos);
      
      yPos += 10;
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text('Account Statement', margin, yPos);

      // Account Information
      yPos += 20;
      doc.setFontSize(12);
      doc.text('Account Information', margin, yPos);
      
      yPos += 8;
      doc.setFontSize(10);
      doc.text(`Account Holder: ${user.split('@')[0] || user}`, margin, yPos);
      yPos += 6;
      doc.text(`Account Number: ${accountNumber}`, margin, yPos);
      yPos += 6;
      doc.text(`Sort Code: ${sortCode}`, margin, yPos);
      yPos += 6;
      doc.text(`Statement Period: ${dateRange === 'all' ? 'All Time' : dateRange}`, margin, yPos);
      yPos += 6;
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, margin, yPos);

      // Summary
      yPos += 20;
      doc.setFontSize(12);
      doc.text('Summary', margin, yPos);
      
      yPos += 8;
      doc.setFontSize(10);
      doc.text(`Total Credits: ${formatCurrency(summary.totalCredits)} (${summary.creditCount} transactions)`, margin, yPos);
      yPos += 6;
      doc.text(`Total Debits: ${formatCurrency(summary.totalDebits)} (${summary.debitCount} transactions)`, margin, yPos);
      yPos += 6;
      doc.text(`Net Amount: ${formatCurrency(summary.netAmount)}`, margin, yPos);

      // Transactions Table
      yPos += 20;
      doc.setFontSize(12);
      doc.text('Transaction Details', margin, yPos);

      // Table headers
      yPos += 15;
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      
      const colWidths = [25, 40, 50, 30, 35];
      const headers = ['Date', 'Description', 'From/To', 'Type', 'Amount'];
      let xPos = margin;
      
      headers.forEach((header, index) => {
        doc.text(header, xPos, yPos);
        xPos += colWidths[index];
      });

      // Table data
      yPos += 8;
      doc.setTextColor(0, 0, 0);
      
      filteredTransactions.forEach((transaction, index) => {
        if (yPos > 250) { // New page if needed
          doc.addPage();
          yPos = 30;
        }

        xPos = margin;
        const rowData = [
          new Date(transaction.date).toLocaleDateString(),
          transaction.description.substring(0, 25) + (transaction.description.length > 25 ? '...' : ''),
          transaction.type === 'credit' ? transaction.from : transaction.to,
          transaction.type.toUpperCase(),
          (transaction.type === 'credit' ? '+' : '-') + formatCurrency(transaction.amount)
        ];

        rowData.forEach((data, colIndex) => {
          if (colIndex === 4) { // Amount column
            doc.setTextColor(transaction.type === 'credit' ? 16 : 239, transaction.type === 'credit' ? 185 : 68, transaction.type === 'credit' ? 129 : 68);
          } else {
            doc.setTextColor(0, 0, 0);
          }
          doc.text(data.toString(), xPos, yPos);
          xPos += colWidths[colIndex];
        });

        yPos += 7;
      });

      // Footer
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text(`Page ${i} of ${pageCount}`, pageWidth - 40, doc.internal.pageSize.height - 10);
        doc.text('This is a computer generated statement', margin, doc.internal.pageSize.height - 10);
      }

      // Download the PDF
      const filename = `bank-statement-${user.split('@')[0]}-${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(filename);
      
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('PDF download failed. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const summary = calculateSummary();

  return (
    <div className="statement-container">
      <div className="statement-content">
        {/* Header */}
        <div className="statement-header">
          <h1 className="statement-title">📋 Account Statement</h1>
          <div className="statement-actions">
            <div className="date-range">
              <label>Period:</label>
              <select 
                value={dateRange} 
                onChange={(e) => setDateRange(e.target.value)}
                className="form-select"
              >
                <option value="all">All Time</option>
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="90days">Last 90 Days</option>
              </select>
            </div>
            <button 
              onClick={generatePDF}
              className="btn btn-primary"
              disabled={isDownloading}
            >
              {isDownloading ? (
                <>
                  <div className="loading"></div>
                  Generating...
                </>
              ) : (
                <>📄 Download PDF</>
              )}
            </button>
          </div>
        </div>

        {/* Statement Card */}
        <div className="statement-card">
          {/* Account Information */}
          <div className="account-info">
            <div className="account-details">
              <div className="detail-group">
                <h3>Account Holder</h3>
                <p>{user.split('@')[0] || user}</p>
              </div>
              <div className="detail-group">
                <h3>Email Address</h3>
                <p>{user}</p>
              </div>
              <div className="detail-group">
                <h3>Account Number</h3>
                <p>{accountNumber}</p>
              </div>
              <div className="detail-group">
                <h3>Sort Code</h3>
                <p>{sortCode}</p>
              </div>
              <div className="detail-group">
                <h3>Statement Period</h3>
                <p>{dateRange === 'all' ? 'All Time' : dateRange}</p>
              </div>
              <div className="detail-group">
                <h3>Generated On</h3>
                <p>{new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="statement-summary">
            <div className="summary-item">
              <div className="summary-label">Total Credits</div>
              <div className="summary-value positive">
                {formatCurrency(summary.totalCredits)}
              </div>
              <div className="summary-label">{summary.creditCount} transactions</div>
            </div>
            <div className="summary-item">
              <div className="summary-label">Total Debits</div>
              <div className="summary-value negative">
                {formatCurrency(summary.totalDebits)}
              </div>
              <div className="summary-label">{summary.debitCount} transactions</div>
            </div>
            <div className="summary-item">
              <div className="summary-label">Net Amount</div>
              <div className={`summary-value ${summary.netAmount >= 0 ? 'positive' : 'negative'}`}>
                {formatCurrency(summary.netAmount)}
              </div>
              <div className="summary-label">Total {filteredTransactions.length} transactions</div>
            </div>
          </div>

          {/* Transactions */}
          <div className="transactions-section">
            <div className="section-header">
              <h3>Transaction History</h3>
            </div>
            
            {filteredTransactions.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📭</div>
                <h3>No transactions found</h3>
                <p>There are no transactions for the selected period.</p>
              </div>
            ) : (
              <table className="transactions-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>From/To</th>
                    <th>Type</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((transaction, index) => (
                    <tr key={transaction.id || index}>
                      <td>{formatDate(transaction.date)}</td>
                      <td>{transaction.description}</td>
                      <td>{transaction.type === 'credit' ? transaction.from : transaction.to}</td>
                      <td>
                        <span className={`transaction-type ${transaction.type}`}>
                          {transaction.type === 'credit' ? '📈' : '📉'} {transaction.type}
                        </span>
                      </td>
                      <td className={`amount ${transaction.type}`}>
                        {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Download Progress */}
      {isDownloading && (
        <>
          <div className="progress-backdrop"></div>
          <div className="download-progress">
            <div className="loading" style={{ margin: '0 auto 1rem' }}></div>
            <h3>Generating PDF Statement</h3>
            <p>Please wait while we prepare your statement...</p>
          </div>
        </>
      )}
    </div>
  );
}

export default AccountStatement;