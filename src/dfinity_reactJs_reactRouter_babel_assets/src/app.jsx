import React from "react";
import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import History from "./components/History";
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home />}/>
        <Route path="/dashboard" element={<Dashboard />}/>
        <Route path="/history" element={<History />}/>
      </Routes>
    </Router>
    );
}

export default App;