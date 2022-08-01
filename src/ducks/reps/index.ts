import {createAction, createAsyncThunk, createReducer} from "@reduxjs/toolkit";
import {SalespersonLookupResult} from "chums-types";
import {fetchRepList} from "../../api";
import {SortProps} from "chums-connected-components";
import {RootState} from "../../app/configureStore";


export interface RepsState {
    list: SalespersonLookupResult[];
    loading: boolean;
    loaded: boolean;
    selected:SalespersonLookupResult|null;
}

export const defaultRepState: RepsState = {
    list: [],
    loading: false,
    loaded: false,
    selected: null,
}

export interface RepSortProps extends SortProps {
    field: keyof SalespersonLookupResult,
}

export const defaultRepSort:RepSortProps = ({field: 'SalespersonDivisionNo', ascending: true});

export const repKey = (rep: SalespersonLookupResult) => `${rep.SalespersonDivisionNo}-${rep.SalespersonNo}`.toUpperCase();
export const repSort = ({field, ascending}:RepSortProps) => (a:SalespersonLookupResult, b:SalespersonLookupResult) => {
    switch (field) {
    case "SalespersonNo":
    case "SalespersonName":
        return (
            a[field].toUpperCase() === b[field].toUpperCase()
            ?  (repKey(a) > repKey(b) ? 1 : -1)
            : (a[field].toUpperCase() > b[field].toUpperCase() ? 1 : -1)
        ) * (ascending ? 1 : -1);
    default:
        return (
            repKey(a) > repKey(b) ? 1 : -1
        ) * (ascending ? 1 : -1);
    }
}

export const loadRepsActionType = 'reps/load';
export const loadReps = createAsyncThunk<{ list: SalespersonLookupResult[], clearContext?: string }>(
    loadRepsActionType,
    async (asd, thunkAPI) => {
        try {
            const list = await fetchRepList();
            return {list, clearContext: loadRepsActionType};
        } catch (err: unknown) {
            if (err instanceof Error) {
                return thunkAPI.rejectWithValue({error: err, context: loadRepsActionType})
            }
            return {list: []}
        }
    }
);
export const selectRepList = (state:RootState) => state.reps.list;
export const selectRepListLoading = (state:RootState) => state.reps.loading;
export const selectRepListLoaded = (state:RootState) => state.reps.loaded;

export const setCurrentRep = createAction<SalespersonLookupResult|null>('reps/setCurrentRep');
export const selectCurrentRep = (state:RootState) => state.reps.selected;

const reducer = createReducer(defaultRepState, (builder) => {
    builder
        .addCase(loadReps.pending, (state) => {
            state.loading = true;
        })
        .addCase(loadReps.rejected, (state) => {
            state.loading = false;
        })
        .addCase(loadReps.fulfilled, (state, action) => {
            state.list = action.payload.list.sort(repSort(defaultRepSort));
            state.loaded = true;
            state.loading = false;
        })
        .addCase(setCurrentRep, (state, action) => {
            state.selected = action.payload || null;
        });
})

export default reducer;
