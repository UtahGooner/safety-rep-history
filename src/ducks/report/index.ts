import {SalespersonLookupResult} from "chums-types";
import {endOfMonth, startOfMonth} from 'date-fns';
import {createAction, createAsyncThunk, createReducer} from "@reduxjs/toolkit";
import {repKey, setCurrentRep} from "../reps";
import {RootState} from "../../app/configureStore";
import {
    Customer,
    CustomerAddress,
    CustomerInvoiceList,
    CustomerItemsList,
    RepInvoiceReportData,
    RepItemReportData
} from "./types";
import {fetchInvoiceReportData, fetchItemData} from "../../api";
import {SortProps} from "chums-connected-components";


export interface ReportState {
    invoices: RepInvoiceReportData[];
    customerInvoices: CustomerInvoiceList,
    items: RepItemReportData[],
    customerItems: CustomerItemsList;
    loading: boolean;
    loaded: boolean;
    minDate: string;
    maxDate: string;
    rep: SalespersonLookupResult | null;
}

const defaultReportState: ReportState = {
    invoices: [],
    customerInvoices: {},
    items: [],
    customerItems: {},
    loading: false,
    loaded: false,
    minDate: startOfMonth(new Date()).toISOString(),
    maxDate: endOfMonth(new Date()).toISOString(),
    rep: null,
}

export const repReportKey = 'rep-report';

export interface ReportSortProps extends SortProps {
    field: keyof RepInvoiceReportData,
}


export const customerKey = (row: Customer) => `${row.ARDivisionNo}-${row.CustomerNo}`.toUpperCase();
export const accountKey = (row: Customer) => (`${row.ARDivisionNo}-${row.CustomerNo}` + (row.ShipToCode ? ` [${row.ShipToCode}]` : '')).toUpperCase();
export const accountAddress = (row: CustomerAddress) => `${row.City ?? ''}, ${row.State} ${row.ZipCode}`;
export const itemDetailKey = (row: RepItemReportData) => `${row.InvoiceNo}:${row.DetailSeqNo}`;

export const reportDataSorter = ({
                                     field,
                                     ascending
                                 }: ReportSortProps) => (a: RepInvoiceReportData, b: RepInvoiceReportData) => {
    switch (field) {
    case 'ARDivisionNo':
    case 'CustomerNo':
    case 'ShipToCode':
        return (
            accountKey(a) === accountKey(b)
                ? (a.InvoiceNo > b.InvoiceNo ? 1 : -1)
                : (accountKey(a) > accountKey(b) ? 1 : -1)
        ) * (ascending ? 1 : -1)
    case 'BillToName':
    case 'ShipToName':
    case 'City':
    case 'State':
    case 'ZipCode':
        return (
            (a[field] || '').toUpperCase() === (b[field] || '').toUpperCase()
                ? (a.InvoiceNo > b.InvoiceNo ? 1 : -1)
                : ((a[field] || '').toUpperCase() > (b[field] || '').toUpperCase() ? 1 : -1)
        ) * (ascending ? 1 : -1)
    }

}

export const setMinDate = createAction<string | null>('report/setMinDate');
export const setMaxDate = createAction<string | null>('report/setMaxDate');
export const loadInvoicesActionType = 'report/loadInvoices'
export const loadInvoiceReportData = createAsyncThunk<{ data: RepInvoiceReportData[], clearContext?: string }>(
    loadInvoicesActionType,
    async (asd, thunkApi) => {
        try {
            const state = thunkApi.getState() as RootState;
            const rep = selectCurrentRep(state);
            if (!rep) {
                return thunkApi.rejectWithValue({error: new Error('Invalid rep.'), context: loadInvoicesActionType});
            }
            const minDate = selectMinDate(state);
            const maxDate = selectMaxDate(state);
            const data = await fetchInvoiceReportData(repKey(rep), minDate, maxDate);
            return {data, clearContext: loadInvoicesActionType}
        } catch (err: unknown) {
            if (err instanceof Error) {
                return thunkApi.rejectWithValue({error: err, context: loadInvoicesActionType});
            }
            return {data: []};
        }
    })

export const loadItemsActionType = 'report/loadItems'
export const loadItemReportData = createAsyncThunk<{ data: RepItemReportData[], clearContext?: string }>(
    loadItemsActionType,
    async (asd, thunkApi) => {
        try {
            const state = thunkApi.getState() as RootState;
            const rep = selectCurrentRep(state);
            if (!rep) {
                return thunkApi.rejectWithValue({error: new Error('Invalid rep.'), context: loadItemsActionType});
            }
            const minDate = selectMinDate(state);
            const maxDate = selectMaxDate(state);
            const data = await fetchItemData(repKey(rep), minDate, maxDate);
            return {data, clearContext: loadItemsActionType}
        } catch (err: unknown) {
            if (err instanceof Error) {
                return thunkApi.rejectWithValue({error: err, context: loadItemsActionType});
            }
            return {data: []};
        }
    })

export const selectMinDate = (state: RootState) => state.report.minDate;
export const selectMaxDate = (state: RootState) => state.report.maxDate;
export const selectCurrentRep = (state: RootState) => state.report.rep;
export const selectReportData = (state: RootState) => state.report.invoices;
export const selectReportLoading = (state: RootState) => state.report.loading;
export const selectReportLoaded = (state: RootState) => state.report.loaded;
export const selectCustomerInvoices = (state: RootState) => state.report.customerInvoices;
export const selectCustomerItems = (state: RootState) => state.report.customerItems;


const reducer = createReducer(defaultReportState,
    (builder) => {
        builder
            .addCase(setCurrentRep, (state, action) => {
                state.rep = action.payload || null;
                state.invoices = [];
                state.customerInvoices = {};
                state.customerItems = {};
                state.loaded = false;
            })
            .addCase(setMinDate, (state, action) => {
                state.minDate = action.payload || startOfMonth(new Date()).toISOString();
            })
            .addCase(setMaxDate, (state, action) => {
                state.maxDate = action.payload || startOfMonth(new Date()).toISOString();
            })
            .addCase(loadInvoiceReportData.pending, (state) => {
                state.loading = true;
            })
            .addCase(loadInvoiceReportData.rejected, (state) => {
                state.loading = false;
                state.loaded = true;
            })
            .addCase(loadInvoiceReportData.fulfilled, (state, action) => {
                state.loading = false;
                state.loaded = true;
                state.invoices = action.payload.data;

                state.customerInvoices = {};
                action.payload.data.forEach(row => {
                    const key = customerKey(row);
                    if (!state.customerInvoices[key]) {
                        const {ARDivisionNo, CustomerNo, BillToName} = row;
                        state.customerInvoices[key] = {
                            ARDivisionNo,
                            CustomerNo,
                            BillToName,
                            SalesTotal: 0,
                            invoices: []
                        };
                    }
                    state.customerInvoices[key].invoices.push(row);
                    state.customerInvoices[key].SalesTotal += row.SalesTotal;
                })
            })
            .addCase(loadItemReportData.fulfilled, (state, action) => {
                state.loading = false;
                state.loaded = true;
                state.items = action.payload.data;

                state.customerItems = {};
                action.payload.data.forEach(row => {
                    const key = customerKey(row);
                    if (!state.customerItems[key]) {
                        const {ARDivisionNo, CustomerNo, BillToName} = row;
                        state.customerItems[key] = {
                            ARDivisionNo,
                            CustomerNo,
                            BillToName,
                            TotalQuantitySold: 0,
                            TotalDollarsSold: 0,
                            items: []
                        };
                    }
                    state.customerItems[key].items.push(row);
                    state.customerItems[key].TotalDollarsSold += row.DollarsSold;
                    state.customerItems[key].TotalQuantitySold += row.QuantitySold * row.UnitOfMeasureConvFactor;
                })
            });

    }
);

export default reducer;
