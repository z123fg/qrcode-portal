import "./App.css";
import React, { createContext, useState } from "react"
import Header from "./components/Header/Header";
import Actions from "./components/Actions/Actions";
import UserTable from "./components/Table/UserTable";
import { getGlobalUserDataList } from "./services/userData";
import GlobalUserTable from "./components/GlobalTable/GlobalTable";

export const PortalContext = createContext();


function App() {
    const [globalUserDataList, setGlobalUserDataList] = useState([]);
    const refreshGlobalUserDataList = async () => {
        const result = await getGlobalUserDataList();
        console.log("globaluserdatalist", result)
        setGlobalUserDataList(result);
    }

    return (
<PortalContext.Provider value={{refreshGlobalUserDataList}}>
    <div className="App">
            <Header />
            <main>
                <Actions />
                <GlobalUserTable userDataList={globalUserDataList}/>
            </main>
        </div>
</PortalContext.Provider>
        

    );
}

export default App;
