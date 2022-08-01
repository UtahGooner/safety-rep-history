import {fetchJSON} from 'chums-components';
import {SalespersonLookupResult} from 'chums-types'
import {default as format} from 'date-fns/formatISO9075'
import {RepReportData} from "./ducks/report/types";

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


export async function fetchReportData(repKey: string, from:string, to: string):Promise<RepReportData[]> {
    try {
        const url = '/node-sage/api/CHI/safety/invoices/{rep}/{from-date}/{to-date}'
            .replace('{rep}', encodeURIComponent(repKey))
            .replace('{from-date}', encodeURIComponent(format(new Date(from), {representation: 'date'})))
            .replace('{to-date}', encodeURIComponent(format(new Date(to), {representation: 'date'})));
        const res = await fetchJSON<{response: {result: RepReportData[]}}>(url);
        return res.response.result;
    } catch(err:unknown) {

        if (err instanceof Error) {
            console.warn("fetchReport()", err.message);
            return Promise.reject(err);
        }
        console.warn("fetchReport()", err);
        return Promise.reject(new Error('Error in fetchReport()'));
    }
}
