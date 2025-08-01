import React from "react";

import NameForm from "./components/NameForm";
import BlogList from "./components/BlogList";
import ExchangeRate from "./components/ExchangeRate";
import Settings from "./components/Settings";
import "./App.css";

function App() {
  return (
    <div className="App">
      <div className="App-header">
        <h2>Bema Skill Test ---MERN VERSION</h2>
      </div>

      <main>
        <div className="app-top">
          <NameForm />
          <ExchangeRate />
        </div>

        <Settings />
        <BlogList />
      </main>
    </div>
  );
}

export default App;
