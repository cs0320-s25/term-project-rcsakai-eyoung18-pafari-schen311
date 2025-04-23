import "../../styles/main.css";
import { useState } from "react";
import { HomePage } from "./homepage";
import { Progress } from "./progress";
import { Feedback } from "./feedback";
import { Home, ChartNoAxesCombined, MessageSquareText, ChartSpline } from "lucide-react";
import { Chart } from "chart.js";

/**
 * Controls overall view of the website.
 */
export function Select() {
  const [currentPage, setCurrentPage] = useState("home");

  // Explicit click handlers
  const handleHomeClick = () => setCurrentPage("home");
  const handleProgressClick = () => setCurrentPage("progress");
  const handleFeedbackClick = () => setCurrentPage("feedback");

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage/>;
      case "progress":
        return <Progress />;
      case "feedback":
        return <Feedback />;
      default:
        return null;
    }
  };

  return (
    <div className="select flex">
      {/* Sidebar */}
      <div className="sidebar">
        <ul className="flex flex-col space-y-8">
          <li
            className="flex items-center gap-4 cursor-pointer p-3 hover:bg-gray-200 rounded"
            onClick={handleHomeClick}
          >
            <Home size={50}/>
            <span className="text-lg">Home</span>
          </li>
          <li
            className="flex items-center gap-4 cursor-pointer p-3 hover:bg-gray-200 rounded"
            onClick={handleProgressClick}
          >
            <ChartNoAxesCombined size={50}/>
            <span className="text-lg">Progress</span>
          </li>
          <li
            className="flex items-center gap-4 cursor-pointer p-3 hover:bg-gray-200 rounded"
            onClick={handleProgressClick}
          >
            <ChartSpline size={50}/>
            <span className="text-lg">Personal Graphs</span>
          </li>
          <li
            className="flex items-center gap-4 cursor-pointer p-3 hover:bg-gray-200 rounded"
            onClick={handleFeedbackClick}
          >
            <MessageSquareText size={50}/>
            <span className="text-lg">Feedback</span>
          </li>
        </ul>
      </div>

      {/* Page Content */}
      <div className="flex-1 p-8">{renderPage()}</div>
    </div>
  );
}
