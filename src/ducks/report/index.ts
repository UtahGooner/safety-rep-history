import {SalespersonLookupResult} from "chums-types";
import {endOfMonth, startOfMonth} from 'date-fns';
import {createAction, createAsyncThunk, createReducer} from "@reduxjs/toolkit";
import {repKey, setCurrentRep} from "../reps";
import {RootState} from "../../app/configureStore";
import {CustomerList, ReportCustomer, RepReportData} from "./types";
import {fetchReportData} from "../../api";
import {SortableTableField, SortProps} from "chums-connected-components";


export interface ReportState {
    data: RepReportData[];
    customers: CustomerList,
    loading: boolean;
    loaded: boolean;
    minDate: string;
    maxDate: string;
    rep: SalespersonLookupResult | null;
}

const defaultReportState: ReportState = {
    data: [],
    customers: {},
    loading: false,
    loaded: false,
    minDate: startOfMonth(new Date()).toISOString(),
    maxDate: endOfMonth(new Date()).toISOString(),
    rep: null,
}

export const repReportKey = 'rep-report';

export interface ReportSortProps extends SortProps {
    field: keyof RepReportData,
}

export interface RepReportTableField extends SortableTableField {
    field: keyof RepReportData,
}

export const customerKey = (row: RepReportData | ReportCustomer) => `${row.ARDivisionNo}-${row.CustomerNo}`.toUpperCase();
export const accountKey = (row: RepReportData) => (`${row.ARDivisionNo}-${row.CustomerNo}` + (row.ShipToCode ? ` [${row.ShipToCode}]` : '')).toUpperCase();
export const accountAddress = (row: RepReportData) => `${row.ShipToCity ?? ''}, ${row.ShipToCity}`;

export const reportDataSorter = ({field, ascending}: ReportSortProps) => (a: RepReportData, b: RepReportData) => {
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
    case 'ShipToCity':
    case 'ShipToState':
        return (
            (a[field] || '').toUpperCase() === (b[field] || '').toUpperCase()
                ? (a.InvoiceNo > b.InvoiceNo ? 1 : -1)
                : ((a[field] || '').toUpperCase() > (b[field] || '').toUpperCase() ? 1 : -1)
        ) * (ascending ? 1 : -1)
    }

}

export const setMinDate = createAction<string | null>('report/setMinDate');
export const setMaxDate = createAction<string | null>('report/setMaxDate');
export const loadReportDataActionType = 'report/loadData'
export const loadReportData = createAsyncThunk<{ data: RepReportData[], clearContext?: string }>(
    loadReportDataActionType,
    async (asd, thunkApi) => {
        try {
            const state = thunkApi.getState() as RootState;
            const rep = selectCurrentRep(state);
            if (!rep) {
                return thunkApi.rejectWithValue({error: new Error('Invalid rep.'), context: loadReportDataActionType});
            }
            const minDate = selectMinDate(state);
            const maxDate = selectMaxDate(state);
            const data = await fetchReportData(repKey(rep), minDate, maxDate);
            return {data, clearContext: loadReportDataActionType}
        } catch (err: unknown) {
            if (err instanceof Error) {
                return thunkApi.rejectWithValue({error: err, context: loadReportDataActionType});
            }
            return {data: []};
        }
    })

export const selectMinDate = (state: RootState) => state.report.minDate;
export const selectMaxDate = (state: RootState) => state.report.maxDate;
export const selectCurrentRep = (state: RootState) => state.report.rep;
export const selectReportData = (state: RootState) => state.report.data;
export const selectReportLoading = (state: RootState) => state.report.loading;
export const selectReportLoaded = (state: RootState) => state.report.loaded;
export const selectReportCustomers = (state: RootState) => state.report.customers;


const reducer = createReducer(defaultReportState,
    (builder) => {
        builder
            .addCase(setCurrentRep, (state, action) => {
                state.rep = action.payload || null;
                state.data = [];
                state.loaded = false;
            })
            .addCase(setMinDate, (state, action) => {
                state.minDate = action.payload || startOfMonth(new Date()).toISOString();
            })
            .addCase(setMaxDate, (state, action) => {
                state.maxDate = action.payload || startOfMonth(new Date()).toISOString();
            })
            .addCase(loadReportData.pending, (state) => {
                state.loading = true;
            })
            .addCase(loadReportData.rejected, (state) => {
                state.loading = false;
                state.loaded = true;
            })
            .addCase(loadReportData.fulfilled, (state, action) => {
                state.loading = false;
                state.loaded = true;
                state.data = action.payload.data;

                state.customers = {};
                action.payload.data.forEach(row => {
                    const key = customerKey(row);
                    if (!state.customers[key]) {
                        const {ARDivisionNo, CustomerNo, BillToName} = row;
                        state.customers[key] = {ARDivisionNo, CustomerNo, BillToName, SalesTotal: 0, invoices: []};
                    }
                    state.customers[key].invoices.push(row);
                    state.customers[key].SalesTotal += row.SalesTotal;
                })
            });

    }
);

export default reducer;
