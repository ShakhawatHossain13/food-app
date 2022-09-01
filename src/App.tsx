import React from "react";
import { Routes, Route } from "react-router-dom";
import { CRUD } from "./database/crud";

const App: React.FC = () => {
  return (
    <React.Fragment>
      <CRUD />
      <h1>Hello</h1>
      <h1>Hello From Imriaz</h1>
      <h1>Hello From Tasnuba</h1>
      <h1>Hello from mernOJT</h1>
      <h1>Hello from Tasnuba-mernOJT</h1>
      <h1>Hello From Shaks</h1>
    </React.Fragment>
  );
};

export default App;
