import {configureStore} from '@reduxjs/toolkit'
import {combineReducers} from "redux";
import {alertsReducer} from "chums-connected-components";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {default as repsReducer} from '../ducks/reps';
import {default as reportReducer} from '../ducks/report';

const rootReducer = combineReducers({
    alerts: alertsReducer,
    report: reportReducer,
    reps: repsReducer,
});

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: {
            ignoredActionPaths: ['payload.error'],
        }
    })
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;


export default store;
