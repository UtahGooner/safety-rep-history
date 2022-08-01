import {useSelector} from "react-redux";
import {accountKey, customerKey, selectCurrentRep, selectReportCustomers} from "./index";
import {repKey} from "../reps";
import InvoiceLink from "../../components/InvoiceLink";

const Report = () => {
    const rep = useSelector(selectCurrentRep);
    const customers = useSelector(selectReportCustomers);


    if (!rep) {
        return (
            <div className="mt-3">
                <h2>Select Sales Rep</h2>
            </div>
        );
    }

    return (
        <div className="mt-3">
            <h2>{repKey(rep)} {rep.SalespersonName}</h2>
            <table className="table table-sm table-sticky report-content">
                <thead>
                <tr>
                    <th>Account</th>
                    <th>Name</th>
                    <th>City</th>
                    <th>Date</th>
                    <th>Invoices</th>
                    <th className="text-end">Sales Total</th>
                </tr>
                </thead>
                {Object.keys(customers).sort()
                    .map(key => (
                        <tbody>
                        <tr>
                            <th>{customerKey(customers[key])}</th>
                            <th colSpan={2}>{customers[key].BillToName}</th>
                            <th className="text-end">Total:</th>
                            <th>{customers[key].invoices.length}</th>
                            <th className="text-end">{customers[key].SalesTotal.toLocaleString(undefined, {
                                style: 'currency',
                                currency: 'USD'
                            })}</th>
                        </tr>
                        {customers[key].invoices.map(row => (
                            <tr>
                                <td>{accountKey(row)}</td>
                                <td>{row.ShipToName ?? row.BillToName}</td>
                                <td>{row.ShipToCity}, {row.ShipToCity}</td>
                                <td>{new Date(row.InvoiceDate).toLocaleDateString()}</td>
                                <td><InvoiceLink invoiceNo={row.InvoiceNo}/></td>
                                <td className="text-end">{row.SalesTotal.toLocaleString(undefined, {
                                    style: 'currency',
                                    currency: 'USD'
                                })}</td>
                            </tr>
                        ))}
                        </tbody>
                    ))}
                <tfoot>
                <tr>
                    <td colSpan={4}>Grand Total</td>
                    <td className="text-end">{Object.keys(customers).map(key => customers[key]).reduce((pv, cv) => pv + cv.invoices.length, 0).toLocaleString()}</td>
                    <td className="text-end">{Object.keys(customers).map(key => customers[key]).reduce((pv, cv) => pv + cv.SalesTotal, 0).toLocaleString(undefined, {
                        style: 'currency',
                        currency: 'USD'
                    })}</td>
                </tr>
                </tfoot>
            </table>
        </div>
    )
}

export default Report;
