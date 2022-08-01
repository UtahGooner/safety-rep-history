import React, {ChangeEvent, SelectHTMLAttributes, useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../app/configureStore";
import {
    loadReps,
    repKey,
    selectCurrentRep,
    selectRepList,
    selectRepListLoaded,
    selectRepListLoading,
    setCurrentRep
} from "./index";
import classNames from "classnames";


export interface RepSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    labelId?: string,
}

const RepSelect = ({labelId, value, onChange, className, ...props}: RepSelectProps) => {
    const dispatch = useAppDispatch();
    const list = useAppSelector(selectRepList)
    const selected = useAppSelector(selectCurrentRep);
    const loading = useAppSelector(selectRepListLoading);
    const loaded = useAppSelector(selectRepListLoaded);

    const [filtered, setFiltered] = useState(true);
    useEffect(() => {
        if (!loaded && !loading) {
            dispatch(loadReps());
        }
    }, []);

    const changeHandler = (ev: ChangeEvent<HTMLSelectElement>) => {
        const [rep] = list.filter(rep => repKey(rep) === ev.target.value);
        dispatch(setCurrentRep(rep || null));
        if (onChange) {
            onChange(ev);
        }
    }
    if (!labelId) {
        labelId = React.useId();
    }

    return (
        <div className="input-group">
            <select className={classNames("form-select", className)}
                    value={selected ? repKey(selected) : ''}
                    onChange={changeHandler} {...props}>
                <option value="">Select Salesperson</option>
                {list.filter(rep => !filtered || (rep.active && !!rep.Customers && !!rep.ShipToAccounts))
                    .map(rep => <option value={repKey(rep)} className={classNames({'text-danger': !rep.active})}
                                        key={repKey((rep))}>{repKey(rep)} - {rep.SalespersonName}</option>)
                }
            </select>
            <div className="input-group-text">
                <div className="form-check form-check-inline">
                    <input type="checkbox" className="form-check-input" id={labelId} checked={filtered}
                           onChange={() => setFiltered(!filtered)}/>
                    <label htmlFor={labelId} className="form-check-label">
                        <span className="bi-funnel-fill"></span>
                        <span className="visually-hidden">Filter Active</span>
                    </label>
                </div>
            </div>
        </div>
    )
}

export default RepSelect;
