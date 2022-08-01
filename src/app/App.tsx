import {AlertList} from "chums-connected-components";
import ReportFilter from "../components/ReportFilter";
import {ErrorBoundary} from 'chums-components'
import Report from "../ducks/report/Report";


const App = () => {
    return (
        <div className="container">
            <AlertList />
            <ErrorBoundary>
                <ReportFilter />
                <Report />
            </ErrorBoundary>
        </div>
    )
}

export default App;
