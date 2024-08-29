import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  constructor() { }

  exportToExcel(data: any[], fileName: string): void {

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);

    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    XLSX.writeFile(workbook, fileName + '.xlsx');
  }

  exportToCSV(data: any[], fileName: string): void {
    const csvData = this.convertToCSV(data);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", fileName + ".csv");
    document.body.appendChild(link);
    link.click();
  }

  private convertToCSV(data: any[]): string {
    const header = Object.keys(data[0]);
    const csv = [
      header.join(','),
      ...data.map(row => header.map(fieldName => JSON.stringify(row[fieldName])).join(','))
    ].join('\n');
    return csv;
  }

  exportToJson(data: any[], fileName: string): void {
    const txtData = JSON.stringify(data, null, 2);
    const blob = new Blob([txtData], { type: 'text/plain;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", fileName + ".txt");
    document.body.appendChild(link);
    link.click();
  }
}

