import RepSelect from "../ducks/reps/RepSelect";
import {useSelector} from "react-redux";
import {
    loadReportData,
    selectMaxDate,
    selectMinDate,
    selectReportLoading,
    setMaxDate,
    setMinDate
} from "../ducks/report";
import {useAppDispatch} from "../app/configureStore";
import {FormEvent} from "react";
import {DateInput, SpinnerButton} from 'chums-components';


const ReportFilter = () => {
    const dispatch = useAppDispatch();
    const minDate = useSelector(selectMinDate);
    const maxDate = useSelector(selectMaxDate);
    const loading = useSelector(selectReportLoading);

    const onChangeMinDate = (date: Date | null) => {
        dispatch(setMinDate(date?.toISOString() || null));
    }
    const onChangeMaxDate = (date: Date | null) => {
        dispatch(setMaxDate(date?.toISOString() || null));
    }

    const submitHandler = (ev: FormEvent) => {
        ev.preventDefault();
        dispatch(loadReportData());
    }

    return (
        <form className="row g-3" onSubmit={submitHandler}>
            <div className="col-auto">
                <RepSelect required/>
            </div>
            <div className="col-auto">
                <div className="input-group">
                    <span className="input-group-text">From</span>
                    <DateInput type="date" className="form-control" required date={minDate}
                               onChangeDate={onChangeMinDate}/>
                </div>
            </div>
            <div className="col-auto">
                <div className="input-group">
                    <span className="input-group-text">To</span>
                    <DateInput type="date" className="form-control" required date={maxDate}
                               onChangeDate={onChangeMaxDate}/>
                </div>
            </div>
            <div className="col-auto">
                <SpinnerButton type="submit" color="primary" spinning={loading}>Submit</SpinnerButton>
            </div>
        </form>
    )
}

export default ReportFilter;
