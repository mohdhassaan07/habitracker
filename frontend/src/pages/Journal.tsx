import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LeftSidebar from "../components/LeftSidebar";
import Habits from "../components/Habits";
import DayTime from "../components/DayTime";
import { useSelector } from "react-redux";
import ManageHabits from "../components/MangeHabits";
const Journal = () => {
  const location = useLocation();
  //@ts-ignore
  const [tab, setTab] = useState("allHabits");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const currentUser = useSelector((state: any) => state.user.currentUser);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to home page if currentUser is not present
    if (!currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate])

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const renderContent = () => {
    if (!location.search || tab === "" || tab === "allHabits") {
      return <Habits toggleSidebar={toggleSidebar} />;
    }

    const validTabs = ["Morning", "Afternoon", "Evening"];
    if (validTabs.includes(tab)) {
      return <DayTime tab={tab} toggleSidebar={toggleSidebar} />;
    }
    else if (tab === "manageHabits") {
      return <ManageHabits toggleSidebar={toggleSidebar} />;
    }
    else {
      return <Habits toggleSidebar={toggleSidebar} />;
    }
  };

  return (
    <>
      {currentUser && (
        <div className="flex flex-col lg:flex-row h-screen dark:bg-gray-700 bg-gray-100">
          {/* Always show on desktop, toggle on mobile */}
          <div className="hidden lg:block">
            <LeftSidebar />
          </div>
          {sidebarOpen && (
            <div className="lg:hidden">
              <LeftSidebar />
            </div>
          )}
          {/* <Habits/> */}
          {renderContent()}
        </div>
      )}
    </>
  );
};

export default Journal;
