import {fetchJSON} from 'chums-components';
import {SalespersonLookupResult} from 'chums-types'
import {default as format} from 'date-fns/formatISO9075'
import {RepInvoiceReportData, RepItemReportData} from "./ducks/report/types";

export async function fetchRepList():Promise<SalespersonLookupResult[]> {
    try {
        const url = '/api/search/rep/chums/?active=all';
        const {result} = await fetchJSON<{result: SalespersonLookupResult[]}>(url);
        return result;
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.warn("loadRepList()", err.message);
            return Promise.reject(err);
        }
        console.warn("loadRepList()", err);
        return Promise.reject(new Error('Error in loadRepList()'));
    }
}


export async function fetchInvoiceReportData(repKey: string, from:string, to: string):Promise<RepInvoiceReportData[]> {
    try {
        const url = '/api/sales/rep/safety/invoices/chums/{rep}/{from-date}/{to-date}'
            .replace('{rep}', encodeURIComponent(repKey))
            .replace('{from-date}', encodeURIComponent(format(new Date(from), {representation: 'date'})))
            .replace('{to-date}', encodeURIComponent(format(new Date(to), {representation: 'date'})));
        const {invoices} = await fetchJSON<{invoices: RepInvoiceReportData[]}>(url);
        return invoices;
    } catch(err:unknown) {

        if (err instanceof Error) {
            console.warn("fetchInvoiceReportData()", err.message);
            return Promise.reject(err);
        }
        console.warn("fetchInvoiceReportData()", err);
        return Promise.reject(new Error('Error in fetchInvoiceReportData()'));
    }
}

export async function fetchItemData(repKey: string, from:string, to:string):Promise<RepItemReportData[]> {
    try {
        const url = '/api/sales/rep/chums/{rep}/{from-date}/{to-date}/items'
            .replace('{rep}', encodeURIComponent(repKey))
            .replace('{from-date}', encodeURIComponent(format(new Date(from), {representation: 'date'})))
            .replace('{to-date}', encodeURIComponent(format(new Date(to), {representation: 'date'})));
        const {result} = await fetchJSON<{result: RepItemReportData[]}>(url);
        return result;
    } catch(err:unknown) {

        if (err instanceof Error) {
            console.warn("fetchItemData()", err.message);
            return Promise.reject(err);
        }
        console.warn("fetchItemData()", err);
        return Promise.reject(new Error('Error in fetchItemData()'));
    }
}
