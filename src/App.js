import logo from "./logo.svg";
import "./App.css";
import { createContext } from "react";
import Header from "./components/Header/Header";
import Actions from "./components/Actions/Actions";
import UserTable from "./components/Table/UserTable";
import Canvas from "./components/Canvas/Canvas";

export const UserContext = createContext();

function App() {
    return (
        <UserContext.Provider value={null}>
            <div className="App">
              <Header/>
              <main>
                  <Actions/>
                  <UserTable/>
              </main>
            </div>
        </UserContext.Provider>
    );
}

export default App;
