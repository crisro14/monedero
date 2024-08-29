import React from "react";
import './App.css';
import "./index.css";
import "./tailwind.css";
import GestorFinanzas from "./components/finanzas";
import Header from "./components/Header";


function App() {
  return (
    <div className="App">
      <Header />
      <GestorFinanzas />
    </div>
  );
}

export default App;
