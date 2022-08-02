import {useSelector} from "react-redux";
import {accountKey, customerKey, itemDetailKey, selectCustomerItems} from "./index";
import React, {useId, useState} from "react";
import classNames from "classnames";

const ItemsReport = () => {
    const items = useSelector(selectCustomerItems);
    const [showKitComponents, setShowKitComponents] = useState(false);
    const id = useId();

    return (
        <div className="mt-3">
            <h3>Customer Items</h3>
            <div className="form-check form-check-inline">
                <input type="checkbox" className="form-check-input" id={id} checked={showKitComponents}
                       onChange={(ev) => setShowKitComponents(ev.target.checked)}/>
                <label className="form-check-label" htmlFor={id}>Show Kit Components</label>
            </div>
            <table className="table table-sm table-sticky report-content">
                <thead>
                <tr>
                    <th>Account</th>
                    <th>Item</th>
                    <th>Description</th>
                    <th>UoM</th>
                    <th className="text-end">Quantity</th>
                    <th className="text-end">Item Total</th>
                </tr>
                </thead>
                {Object.keys(items).sort()
                    .map(key => (
                        <tbody key={key}>
                        <tr>
                            <th>{customerKey(items[key])}</th>
                            <th colSpan={2}>{items[key].BillToName}</th>
                            <th className="text-end">Total:</th>
                            <th className="text-end">{items[key].TotalQuantitySold.toLocaleString()} Pieces</th>
                            <th className="text-end">{items[key].TotalDollarsSold.toLocaleString(undefined, {
                                style: 'currency',
                                currency: 'USD'
                            })}</th>
                        </tr>
                        {items[key].items
                            .filter(row => showKitComponents || row.ExplodedKitItem !== 'C')
                            .map((row) => (
                                <tr key={itemDetailKey(row)}
                                    className={classNames({'text-info': row.ExplodedKitItem === 'C'})}>
                                    <td>{accountKey(row)}</td>
                                    <td>{row.ItemCode}</td>
                                    <td>{row.ItemCodeDesc}</td>
                                    <td className="text-end">{row.UnitOfMeasure}</td>
                                    <td className="text-end">{row.QuantitySold}</td>
                                    <td className="text-end">{row.DollarsSold.toLocaleString(undefined, {
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
                    <td className="text-end">{Object.keys(items).map(key => items[key]).reduce((pv, cv) => pv + cv.TotalQuantitySold, 0).toLocaleString()} Pieces</td>
                    <td className="text-end">
                        {Object.keys(items).map(key => items[key]).reduce((pv, cv) => pv + cv.TotalDollarsSold, 0).toLocaleString(undefined, {
                            style: 'currency',
                            currency: 'USD'
                        })}
                    </td>
                </tr>
                </tfoot>
            </table>
        </div>
    )
}

export default React.memo(ItemsReport);
