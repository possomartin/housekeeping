import React, { ReactElement } from "react";
import ChoreTrackerApp from "./choreTrackerAppA";
import HousemateApp from "./hoseMateApp";

export default function App() {
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex">
        <ChoreTrackerApp />
      </div>
      <div className="flex">
        <HousemateApp />
      </div>
    </div>
  );
}
