import {AlertList} from "chums-connected-components";
import ReportFilter from "../components/ReportFilter";
import {ErrorBoundary, TabList, Tab} from 'chums-components'
import InvoiceReport from "../ducks/report/InvoiceReport";
import ItemReport from "../ducks/report/ItemReport";
import ReportTitle from "../ducks/report/ReportTitle";
import {useState} from "react";

const invoicesTab:Tab = {
    id: 'invoices',
    title: 'Customer Invoices'
};
const itemsTab:Tab = {
    id: 'items',
    title: 'Customer Items'
}
const tabs:Tab[] = [invoicesTab, itemsTab];

const App = () => {
    const [tab, setTab] = useState(invoicesTab.id);
    return (
        <div className="container">
            <AlertList />
            <ErrorBoundary>
                <ReportFilter />
                <ReportTitle />
                <TabList tabs={tabs} currentTabId={tab} onSelectTab={(t) => setTab(t.id)} />
                {tab === invoicesTab.id && (<InvoiceReport />)}
                {tab === itemsTab.id && (<ItemReport />)}
            </ErrorBoundary>
        </div>
    )
}

export default App;
