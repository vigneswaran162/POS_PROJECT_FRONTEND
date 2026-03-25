import { Component, OnInit } from '@angular/core';
import { OrdermasterService } from '../../Services/ordermaster.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx-js-style';

@Component({
  selector: 'app-report',
  imports: [FormsModule,CommonModule],
  templateUrl: './report.component.html',
  styleUrl: './report.component.css'
})
export class ReportComponent implements OnInit {

  constructor (private service:OrdermasterService){}

  fromDate:any;
  toDate:any;


  allData: any[] = [];
  filteredData: any[] = [];
  paginatedData: any[] = [];

  searchText: string = '';

  currentPage = 1;
  pageSize = 5;
  totalPages = 0;


  
  ngOnInit(): void {
}



onsubmit(){
  if(this.fromDate == undefined || this.toDate == undefined){
    alert("Please select both From Date and To Date")
    return;
  }
  if(this.fromDate > this.toDate){
    alert("From Date cannot be greater than To Date")
    return;
  }
  this.GetReport(this.fromDate,this.toDate)
}

async GetReport(FromDate:any, ToDate:any){
  let response: any = await this.service.SalesReport(FromDate,ToDate).catch(err => {
    alert(err.message)
  })
  if (response != undefined) {
    console.log(response)
     this.allData = response;
      this.filteredData = [...this.allData];
    this.calculatePagination();
  } else {
    alert(response.error)
  }

}

 onSearch() {
    const search = this.searchText.toLowerCase();

  this.filteredData = this.allData.filter(item =>
    (item.OrderNo?.toString().toLowerCase().includes(search)) ||
    (item.OrderDate ? new Date(item.OrderDate).toLocaleDateString().toLowerCase().includes(search) : false) ||
    (item.OrderType?.toLowerCase().includes(search)) ||
    (item.PaymentType?.toLowerCase().includes(search)) ||
    (item.ItemCount?.toString().includes(search)) ||
    (item.TotalAmount?.toString().includes(search))
  );

  this.currentPage = 1;
  this.calculatePagination();
  }

  // 📄 Pagination Logic
  calculatePagination() {
    this.totalPages = Math.ceil(this.filteredData.length / this.pageSize);

    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;

    this.paginatedData = this.filteredData.slice(start, end);
  }

  changePage(page: number) {
    this.currentPage = page;
    this.calculatePagination();
  }

  exportToExcel() {

  const data = this.filteredData.map(item => ({
    OrderNo: item.OrderNo,
    OrderDate: this.formatDate(item.OrderDate),
    OrderType: item.OrderType,
    PaymentType: item.PaymentType,
    ItemCount: item.ItemCount,
    TotalAmount: item.TotalAmount
  }));

  // 👉 Date Range
  const fromDate = this.formatDate(this.fromDate);
  const toDate = this.formatDate(this.toDate);

  // 👉 Grand Total
  const grandTotal = data.reduce((sum, item) => sum + Number(item.TotalAmount || 0), 0);

  // 👉 Create empty sheet
  const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([]);

  // 👉 Row 1: Heading
  XLSX.utils.sheet_add_aoa(worksheet, [['Sales Report']], { origin: 'A1' });

  // 👉 Row 2: Subheading
  XLSX.utils.sheet_add_aoa(worksheet, [[`From: ${fromDate}  To: ${toDate}`]], { origin: 'A2' });

  // 👉 Data (Row 3 onwards)
  XLSX.utils.sheet_add_json(worksheet, data, { origin: 'A3' });

  const colCount = Object.keys(data[0]).length;

  // 👉 Grand Total Row
  const totalRowIndex = data.length + 3;

  XLSX.utils.sheet_add_aoa(worksheet, [[
    'Grand Total', '', '', '', '', grandTotal
  ]], { origin: `A${totalRowIndex}` });

  // 👉 Merge Heading & Subheading
  worksheet['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: colCount - 1 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: colCount - 1 } }
  ];

  // 👉 Heading Style
  if (worksheet['A1']) {
    worksheet['A1'].s = {
      font: { bold: true, sz: 15 },
      alignment: { horizontal: 'center' },
      color: { rgb: '1F497D' }
    };
  }

  // 👉 Subheading Style
  if (worksheet['A2']) {
    worksheet['A2'].s = {
      alignment: { horizontal: 'center' },
            font: { bold: true, sz: 12 },
    };
  }

  // 👉 Column Headers Bold (Row 3)
  for (let i = 0; i < colCount; i++) {
    const cell = XLSX.utils.encode_cell({ r: 2, c: i });
    if (worksheet[cell]) {
      worksheet[cell].s = {
        font: { bold: true }
      };
    }
  }

  // 👉 Grand Total Bold
  for (let i = 0; i < colCount; i++) {
    const cell = XLSX.utils.encode_cell({ r: totalRowIndex - 1, c: i });
    if (worksheet[cell]) {
      worksheet[cell].s = {
        font: { bold: true }
      };
    }
  }

  // 👉 Column Width (~150px)
  worksheet['!cols'] = new Array(colCount).fill({ wch: 22 });

  // 👉 Workbook
  const workbook: XLSX.WorkBook = {
    Sheets: { 'Sales Report': worksheet },
    SheetNames: ['Sales Report']
  };

  // 👉 Generate Excel
  const excelBuffer: any = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'array'
  });

  this.saveExcelFile(excelBuffer, 'Sales_Report');
}

saveExcelFile(buffer: any, fileName: string) {
  const data: Blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
  });

  FileSaver.saveAs(data, fileName + '_' + new Date().getTime() + '.xlsx');
}

formatDate(date: any): string {
  const d = new Date(date);
  const day = ('0' + d.getDate()).slice(-2);
  const month = ('0' + (d.getMonth() + 1)).slice(-2);
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

onclear(){
  this.searchText = '';
  this.filteredData = [...this.allData];
  this.currentPage = 1;
  this.calculatePagination();
}
}