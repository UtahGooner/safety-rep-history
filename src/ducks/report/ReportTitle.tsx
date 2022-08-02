import {useSelector} from "react-redux";
import {selectCurrentRep} from "./index";
import {repKey} from "../reps";
import React from "react";


const ReportTitle = () => {
    const rep = useSelector(selectCurrentRep);

    if (!rep) {
        return <h2>Select Salesperson</h2>
    }

    return (
        <h2>{repKey(rep)} {rep.SalespersonName}</h2>
    )
}

export default ReportTitle;
