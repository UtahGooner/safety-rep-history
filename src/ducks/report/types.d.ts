export interface RepReportData {
    ARDivisionNo: string;
    CustomerNo: string;
    BillToName: string;
    ShipToCode: string|null;
    ShipToName: string|null
    ShipToCity: string|null;
    ShipToState: string|null;
    InvoiceNo: string;
    InvoiceDate: string;
    SalesTotal: number
}

export interface ReportCustomer {
    ARDivisionNo: string;
    CustomerNo: string;
    BillToName: string;
    SalesTotal: number;
    invoices: RepReportData[],
}

export interface CustomerList {
    [key:string]: ReportCustomer
}
