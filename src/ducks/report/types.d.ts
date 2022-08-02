export interface Customer {
    ARDivisionNo: string;
    CustomerNo: string;
    BillToName: string;
    ShipToCode?: string|null;
}

export interface CustomerAddress {
    City: string;
    State: string;
    ZipCode: string;
}


export interface RepInvoiceReportData extends Customer, CustomerAddress {
    ARDivisionNo: string;
    CustomerNo: string;
    BillToName: string;
    ShipToCode: string|null;
    ShipToName: string|null
    CustomerType: string|null;
    InvoiceNo: string;
    InvoiceDate: string;
    SalesTotal: number
}

export interface CustomerInvoices extends Customer {
    SalesTotal: number;
    invoices: RepInvoiceReportData[],
}

export interface CustomerInvoiceList {
    [key:string]: CustomerInvoices;
}


export interface RepItemReportData extends Customer, CustomerAddress  {
    ARDivisionNo: string;
    CustomerNo: string;
    ShipToCode: string|null;
    CustomerName: string;
    CustomerType: string;
    ShipToName: string|null;
    SalespersonDivisionNo: string;
    SalespersonNo: string;
    SalespersonName: string;
    InvoiceNo: string;
    DetailSeqNo: string;
    ItemCode: string;
    ItemCodeDesc: string;
    UnitOfMeasureConvFactor: number,
    QuantitySold: number;
    DollarsSold: number;
    UnitOfMeasure: string;
    ExplodedKitItem: 'Y'|'N'|'C'
}

export interface CustomerItems extends Customer{
    items: RepItemReportData[],
    TotalQuantitySold: number;
    TotalDollarsSold: number;
}

export interface CustomerItemsList {
    [key:string]: CustomerItems;
}
