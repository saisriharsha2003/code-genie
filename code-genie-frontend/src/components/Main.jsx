import React from "react";
import MainNav from "./MainNav";
import "../assets/styles/main.css";

const Main = () => {
  return (
    <div>
      <MainNav />
      <div className="bg1 mt-8">
        <div className="container" style={{ background: "black", opacity: 0.9 }}>
          <p className="homep1">
            Welcome to <span className="homep">CodeGenie</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Main;
