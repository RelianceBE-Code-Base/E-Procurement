import * as React from 'react';
import { useState } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Area, AreaChart } from 'recharts';
import {  Search, Filter, Download, RefreshCw, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Clock, Users, Building, DollarSign, ShoppingCart, FileText, Calendar, Eye, Edit, MoreHorizontal } from 'lucide-react';
import styles from '../EProcurement.module.scss';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useRef } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';


interface IReports {
    stages?: any
    setSelectedStage?: any;
    sampleRequests: any
}
const Reports: React.FC<IReports> = ({ sampleRequests }) => {

    const [selectedPeriod, setSelectedPeriod] = useState('2019');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedDepartment, setSelectedDepartment] = useState('all');
    const [supplierFilter, setSupplierFilter] = useState('all');
    const reportRef = useRef<HTMLDivElement>(null);
  
    // Sample data based on your reference
    const summaryMetrics = {
      totalSpend: 182.06,
      suppliers: 2792,
      transactions: 18960,
      poCount: 6209,
      prCount: 6811,
      invoices: 10387,
      contractValue: 245.8,
      savings: 12.4
    };
  
    const categorySpendData = [
      { name: 'Works', value: 85.56, percentage: 46.98, color: '#3B82F6' },
      { name: 'Services', value: 37.91, percentage: 20.82, color: '#10B981' },
      { name: 'IT & Telecoms', value: 23.89, percentage: 13.12, color: '#F59E0B' },
      { name: 'Goods', value: 17.69, percentage: 9.71, color: '#EF4444' },
      { name: 'Human Resources', value: 11.43, percentage: 6.28, color: '#8B5CF6' },
      { name: 'Travel', value: 5.58, percentage: 3.06, color: '#06B6D4' }
    ];
  
    const departmentData = [
      { name: 'Engineering', spend: 47.8, transactions: 3245, suppliers: 234, compliance: 94, trend: 'up' },
      { name: 'Manufacturing', spend: 85.6, transactions: 5632, suppliers: 456, compliance: 89, trend: 'up' },
      { name: 'IT Services', spend: 23.9, transactions: 1876, suppliers: 123, compliance: 96, trend: 'down' },
      { name: 'Facilities', spend: 37.9, transactions: 2134, suppliers: 189, compliance: 92, trend: 'up' },
      { name: 'Marketing', spend: 17.7, transactions: 987, suppliers: 87, compliance: 88, trend: 'up' },
      { name: 'HR', spend: 11.4, transactions: 654, suppliers: 76, compliance: 91, trend: 'down' }
    ];
  
    const categoryLevel3Data = [
      { category: 'Gas System Components', spend: 16810785, transactions: 1685, suppliers: 8, risk: 'low' },
      { category: 'Control Boards', spend: 16033564, transactions: 134, suppliers: 1, risk: 'medium' },
      { category: 'Printed Publications', spend: 14361685, transactions: 579, suppliers: 151, risk: 'high' },
      { category: 'Knobs, Bezels & Endcaps', spend: 9913795, transactions: 1463, suppliers: 3, risk: 'low' },
      { category: 'Harness', spend: 8307556, transactions: 2477, suppliers: 3, risk: 'low' },
      { category: 'Educational Supplies', spend: 7198050, transactions: 163, suppliers: 32, risk: 'medium' },
      { category: 'Stationery', spend: 6522287, transactions: 777, suppliers: 215, risk: 'high' }
    ];
  
    const supplierPerformanceData = [
      { name: 'ELAN INDUSTRIAL', spend: 19.19, performance: 95, contracts: 23, rating: 'A' },
      { name: 'ECI ELECTRICAL', spend: 8.88, performance: 89, contracts: 15, rating: 'B+' },
      { name: 'ROBERTSHAW', spend: 7.20, performance: 92, contracts: 8, rating: 'A-' },
      { name: 'ACME CORP', spend: 5.45, performance: 87, contracts: 12, rating: 'B' },
      { name: 'GLOBAL TECH', spend: 4.32, performance: 94, contracts: 18, rating: 'A' }
    ];
  
    const monthlyTrendData = [
      { month: 'Jan', spend: 12.5, transactions: 1234, savings: 0.8 },
      { month: 'Feb', spend: 14.2, transactions: 1456, savings: 1.2 },
      { month: 'Mar', spend: 16.8, transactions: 1687, savings: 1.4 },
      { month: 'Apr', spend: 13.9, transactions: 1523, savings: 1.1 },
      { month: 'May', spend: 15.6, transactions: 1678, savings: 1.3 },
      { month: 'Jun', spend: 18.3, transactions: 1892, savings: 1.6 },
      { month: 'Jul', spend: 19.1, transactions: 1956, savings: 1.8 },
      { month: 'Aug', spend: 17.4, transactions: 1834, savings: 1.5 },
      { month: 'Sep', spend: 16.2, transactions: 1723, savings: 1.4 },
      { month: 'Oct', spend: 18.7, transactions: 1897, savings: 1.7 },
      { month: 'Nov', spend: 20.1, transactions: 2034, savings: 1.9 },
      { month: 'Dec', spend: 21.3, transactions: 2156, savings: 2.1 }
    ];
  
    const complianceData = [
      { category: 'Contract Compliance', value: 89, target: 95, status: 'warning' },
      { category: 'Supplier Verification', value: 94, target: 90, status: 'good' },
      { category: 'PO Authorization', value: 96, target: 95, status: 'good' },
      { category: 'Invoice Matching', value: 87, target: 92, status: 'warning' },
      { category: 'Budget Adherence', value: 92, target: 88, status: 'good' }
    ];
  
    const riskAssessmentData = [
      { supplier: 'ELAN INDUSTRIAL', risk: 'Low', score: 85, factors: ['Financial Stability', 'Delivery Performance'] },
      { supplier: 'ECI ELECTRICAL', risk: 'Medium', score: 65, factors: ['Geographic Concentration', 'Quality Issues'] },
      { supplier: 'ROBERTSHAW', risk: 'Low', score: 80, factors: ['Long-term Partnership', 'Consistent Quality'] },
      { supplier: 'ACME CORP', risk: 'High', score: 45, factors: ['Recent Delays', 'Price Volatility'] }
    ];
  
    const getRiskColor = (risk: string) => {
      switch(risk) {
        case 'low': return 'text-green-600 bg-green-100';
        case 'medium': return 'text-yellow-600 bg-yellow-100';
        case 'high': return 'text-red-600 bg-red-100';
        default: return 'text-gray-600 bg-gray-100';
      }
    };
  
    const getComplianceColor = (status: string) => {
      switch(status) {
        case 'good': return 'text-green-600 bg-green-100';
        case 'warning': return 'text-yellow-600 bg-yellow-100';
        case 'danger': return 'text-red-600 bg-red-100';
        default: return 'text-gray-600 bg-gray-100';
      }
    };

    const handleExportPDF = async () => {
        if (!reportRef.current) return;
      
        const canvas = await html2canvas(reportRef.current, {
          scale: 2,
          useCORS: true,
        });
      
        const imgData = canvas.toDataURL('image/png');
      
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
      
        const ratio = pdfWidth / canvas.width;
        const imgHeight = canvas.height * ratio;
      
        let position = 0;
        let pageCount = 0;
        let heightLeft = imgHeight;
      
        while (heightLeft > 0) {
          pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
          
          // Footer
          pageCount++;
          pdf.setFontSize(10);
          pdf.text(`Page ${pageCount}`, pdfWidth - 30, pdfHeight - 10);
      
          heightLeft -= pdfHeight;
          position -= pdfHeight;
      
          if (heightLeft > 0) pdf.addPage();
        }
      
        const today = new Date().toISOString().slice(0, 10);
        pdf.save(`eprocurement-report-${today}.pdf`);
      };

      const handleExportExcel = () => {
        const workbook = XLSX.utils.book_new();
      
        // Helper to format a worksheet
        const createStyledSheet = (data: any[], sheetName: string) => {
          const sheet = XLSX.utils.json_to_sheet(data, { skipHeader: false });
      
          // Set header bold manually
          const range = XLSX.utils.decode_range(sheet['!ref'] || '');
          for (let C = range.s.c; C <= range.e.c; ++C) {
            const cell = sheet[XLSX.utils.encode_cell({ r: 0, c: C })];
            if (cell) {
              cell.s = {
                font: { bold: true },
                alignment: { horizontal: 'center' }
              };
            }
          }
      
          XLSX.utils.book_append_sheet(workbook, sheet, sheetName);
        };
      
        // Prepare and map all your sheets
        createStyledSheet(
          categoryLevel3Data.map(item => ({
            Category: item.category,
            Spend: `₦${item.spend.toLocaleString()}`,
            Transactions: item.transactions,
            Suppliers: item.suppliers,
            Risk: item.risk.toUpperCase()
          })),
          'Category Level'
        );
      
        createStyledSheet(
          departmentData.map(item => ({
            Department: item.name,
            Spend: `₦${item.spend}M`,
            Transactions: item.transactions,
            Suppliers: item.suppliers,
            Compliance: `${item.compliance}%`,
            Trend: item.trend
          })),
          'Department Spend'
        );
      
        createStyledSheet(
          supplierPerformanceData.map(item => ({
            Supplier: item.name,
            Spend: `₦${item.spend}M`,
            Performance: `${item.performance}%`,
            Contracts: item.contracts,
            Rating: item.rating
          })),
          'Supplier Performance'
        );
      
        createStyledSheet(
          complianceData.map(item => ({
            Metric: item.category,
            Current: `${item.value}%`,
            Target: `${item.target}%`,
            Status: item.status
          })),
          'Compliance'
        );
      
        createStyledSheet(
          riskAssessmentData.map(item => ({
            Supplier: item.supplier,
            Risk: item.risk,
            Score: item.score,
            Factors: item.factors.join(', ')
          })),
          'Risk Assessment'
        );
      
        // Export
        const today = new Date().toISOString().slice(0, 10);
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(blob, `eprocurement-detailed-report-${today}.xlsx`);
      };
      
      
      
  
    // const formatCurrency = (amount: number) => {
    //   return new Intl.NumberFormat('en-US', {
    //     style: 'currency',
    //     currency: 'USD',
    //     minimumFractionDigits: 0,
    //     maximumFractionDigits: 2
    //   }).format(amount);
    // };
  
    const formatNumber = (num: number) => {
      return new Intl.NumberFormat('en-US').format(num);
    };

    return (
        
        <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <div className="bg-gray-150 text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Building className="h-8 w-8 text-gray-400" />
                <h1 className="text-2xl font-bold">Analytics Console</h1>
              </div>
              <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                    <select className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-primary focus:border-primary text-sm text-gray-700"
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    >
                        <option>Last 30 Days</option>
                        <option selected>Quarter to Date</option>
                        <option>Last Quarter</option>
                        <option>Year to Date</option>
                        <option>Custom Date</option>
                    </select>
                    <Calendar className="h-5 w-5 absolute left-3 top-3.5 text-gray-400" />
                </div>
                <button className="bg-indigo-700 hover:bg-indigo-600 px-4 py-2 rounded flex items-center space-x-2" onClick={handleExportPDF}>
                  <Download className="h-4 w-4" />
                  <span>Export Report PDF</span>
                </button>
                <button
                onClick={handleExportExcel}
                className="bg-green-700 hover:bg-green-600 px-4 py-2 rounded flex items-center space-x-2"
                >
                <Download className="h-4 w-4" />
                <span>Export Report Excel</span>
                </button>
                <button className="bg-indigo-700 hover:bg-indigo-600 px-4 py-2 rounded flex items-center space-x-2">
                  <RefreshCw className="h-4 w-4" />
                  <span>Refresh</span>
                </button>
              </div>
            </div>
          </div>
          <div ref={reportRef}>
          {/* Filter Bar */}
          <div className="bg-white border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Filter className="h-5 w-5 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Filters:</span>
                </div>
                <select 
                  className="border border-gray-300 rounded px-3 py-1 text-sm"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  <option value="production">Production Parts</option>
                  <option value="facilities">Facilities</option>
                  <option value="it">IT & Telecoms</option>
                </select>
                <select 
                  className="border border-gray-300 rounded px-3 py-1 text-sm"
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                >
                  <option value="all">All Departments</option>
                  <option value="engineering">Engineering</option>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="it">IT Services</option>
                </select>
                <select 
                  className="border border-gray-300 rounded px-3 py-1 text-sm"
                  value={supplierFilter}
                  onChange={(e) => setSupplierFilter(e.target.value)}
                >
                  <option value="all">All Suppliers</option>
                  <option value="diverse">Diverse Suppliers</option>
                  <option value="contracted">Contracted</option>
                  <option value="addressable">Addressable</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search suppliers, categories..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>
    
          <div className="p-6">
            {/* Key Metrics */}
            <div className={`grid grid-cols-8 gap-4 mb-6 ${styles['no-after']} ${styles['no-before']}`}>
              <div className="bg-white p-4 rounded-lg shadow border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Spend</p>
                    <p className="text-2xl font-bold text-green-600">₦{summaryMetrics.totalSpend}M</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Suppliers</p>
                    <p className="text-2xl font-bold text-blue-600">{formatNumber(summaryMetrics.suppliers)}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Transactions</p>
                    <p className="text-2xl font-bold text-purple-600">{formatNumber(summaryMetrics.transactions)}</p>
                  </div>
                  <ShoppingCart className="h-8 w-8 text-purple-600" />
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">PO Count</p>
                    <p className="text-2xl font-bold text-orange-600">{formatNumber(summaryMetrics.poCount)}</p>
                  </div>
                  <FileText className="h-8 w-8 text-orange-600" />
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">PR Count</p>
                    <p className="text-2xl font-bold text-red-600">{formatNumber(summaryMetrics.prCount)}</p>
                  </div>
                  <Clock className="h-8 w-8 text-red-600" />
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Invoices</p>
                    <p className="text-2xl font-bold text-indigo-600">{formatNumber(summaryMetrics.invoices)}</p>
                  </div>
                  <FileText className="h-8 w-8 text-indigo-600" />
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Contract Value</p>
                    <p className="text-2xl font-bold text-emerald-600">₦{summaryMetrics.contractValue}M</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-emerald-600" />
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Savings</p>
                    <p className="text-2xl font-bold text-green-600">₦{summaryMetrics.savings}M</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
              </div>
            </div>
    
            {/* Main Content Grid */}
            <div className={`grid grid-cols-12 gap-6 ${styles['no-after']} ${styles['no-before']}`}>
              {/* Category Spend Distribution */}
              <div className="col-span-4 bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Spend by Category</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categorySpendData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {categorySpendData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: any) => [`₦${value}M`, 'Spend']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2">
                  {categorySpendData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full`} style={{backgroundColor: item.color}}></div>
                        <span>{item.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-medium">₦{item.value}M</span>
                        <span className="text-gray-500 ml-2">({item.percentage}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
    
              {/* Category Level 3 Details */}
              <div className="col-span-8 bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Spend by Category Level </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Category</th>
                        <th className="text-right py-2">Spend</th>
                        <th className="text-right py-2">Transactions</th>
                        <th className="text-right py-2">Suppliers</th>
                        <th className="text-center py-2">Risk Level</th>
                        <th className="text-center py-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categoryLevel3Data.map((item, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="py-3 font-medium">{item.category}</td>
                          <td className="py-3 text-right">₦{formatNumber(item.spend)}</td>
                          <td className="py-3 text-right">{formatNumber(item.transactions)}</td>
                          <td className="py-3 text-right">{item.suppliers}</td>
                          <td className="py-3 text-center">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(item.risk)}`}>
                              {item.risk.toUpperCase()}
                            </span>
                          </td>
                          <td className="py-3 text-center">
                            <div className="flex justify-center space-x-2">
                              <button className="text-blue-600 hover:text-blue-800">
                                <Eye className="h-4 w-4" />
                              </button>
                              <button className="text-gray-600 hover:text-gray-800">
                                <Edit className="h-4 w-4" />
                              </button>
                              <button className="text-gray-600 hover:text-gray-800">
                                <MoreHorizontal className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
    
              {/* Department Analysis */}
              <div className="col-span-6 bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Top Department Spend Analysis</h3>
                <div className="space-y-4">
                  {departmentData.map((dept, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{dept.name}</h4>
                        <div className="flex items-center space-x-2">
                          {dept.trend === 'up' ? (
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-600" />
                          )}
                          <span className="text-sm text-gray-600">{dept.trend === 'up' ? 'Increasing' : 'Decreasing'}</span>
                        </div>
                      </div>
                      <div className={`grid grid-cols-4 gap-4 text-sm ${styles['no-after']} ${styles['no-before']}`}>
                        <div>
                          <p className="text-gray-600">Spend</p>
                          <p className="font-semibold">₦{dept.spend}M</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Transactions</p>
                          <p className="font-semibold">{formatNumber(dept.transactions)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Suppliers</p>
                          <p className="font-semibold">{dept.suppliers}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Compliance</p>
                          <p className="font-semibold">{dept.compliance}%</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
    
              {/* Supplier Performance */}
              <div className="col-span-6 bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Top Supplier Performance</h3>
                <div className="space-y-4">
                  {supplierPerformanceData.map((supplier, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-medium">{supplier.name}</h4>
                          <p className="text-sm text-gray-600">Rating: {supplier.rating}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">₦{supplier.spend}M</p>
                          <p className="text-sm text-gray-600">{supplier.contracts} contracts</p>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{width: `${supplier.performance}%`}}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Performance: {supplier.performance}%</p>
                    </div>
                  ))}
                </div>
              </div>
    
              {/* Monthly Spend Trend */}
              <div className="col-span-8 bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Monthly Spend Trend & Savings</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="spend" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                      <Area type="monotone" dataKey="savings" stackId="2" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
    
              {/* Compliance Dashboard */}
              <div className="col-span-4 bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Compliance Dashboard</h3>
                <div className="space-y-4">
                  {complianceData.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{item.category}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getComplianceColor(item.status)}`}>
                          {item.value}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${item.status === 'good' ? 'bg-green-500' : item.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'}`}
                          style={{width: `${item.value}%`}}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>Target: {item.target}%</span>
                        <span>{item.value >= item.target ? 'On Track' : 'Below Target'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
    
              {/* Risk Assessment */}
              <div className="col-span-12 bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Supplier Risk Assessment</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Supplier</th>
                        <th className="text-center py-2">Risk Level</th>
                        <th className="text-center py-2">Risk Score</th>
                        <th className="text-left py-2">Key Risk Factors</th>
                        <th className="text-center py-2">Last Assessment</th>
                        <th className="text-center py-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {riskAssessmentData.map((item, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="py-3 font-medium">{item.supplier}</td>
                          <td className="py-3 text-center">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRiskColor(item.risk.toLowerCase())}`}>
                              {item.risk}
                            </span>
                          </td>
                          <td className="py-3 text-center">
                            <div className="flex items-center justify-center space-x-2">
                              <span className="font-medium">{item.score}</span>
                              <div className="w-16 bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full ${item.score >= 70 ? 'bg-green-500' : item.score >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                  style={{width: `${item.score}%`}}
                                ></div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3">
                            <div className="flex flex-wrap gap-1">
                              {item.factors.map((factor, idx) => (
                                <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                                  {factor}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="py-3 text-center text-sm text-gray-600">
                            {new Date().toLocaleDateString()}
                          </td>
                          <td className="py-3 text-center">
                            <div className="flex justify-center space-x-2">
                              <button className="text-blue-600 hover:text-blue-800">
                                <Eye className="h-4 w-4" />
                              </button>
                              <button className="text-yellow-600 hover:text-yellow-800">
                                <AlertTriangle className="h-4 w-4" />
                              </button>
                              <button className="text-green-600 hover:text-green-800">
                                <CheckCircle className="h-4 w-4" />
                              </button> 

                              </div>
                              </td>
                              </tr>
                            ))}
                              </tbody>
                              </table>
                              </div>
                              </div>

                    </div>
                    </div>
        </div>
        </div>
);    
    
}
export default Reports