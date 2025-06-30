import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LeftSidebar from "../components/LeftSidebar";
import Habits from "../components/Habits";
import DayTime from "../components/DayTime";
import { useSelector } from "react-redux";

const Journal = () => {
  const location = useLocation();
  //@ts-ignore
  const [tab, setTab] = useState("allHabits");
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

  const renderContent = () => {
    if (!location.search || tab === "" || tab === "allHabits") {
      return <Habits />;
    }

    const validTabs = ["Morning", "Afternoon", "Evening"];
    if (validTabs.includes(tab)) {
      return <DayTime tab={tab} />;
    }
    else {
      return <Habits />;
    }
  };

  return (
    <>
      {currentUser && (
        <div className="flex h-screen ">
          <LeftSidebar />
          {/* <Habits/> */}
          {renderContent()}
        </div>
      )}
    </>
  );
};

export default Journal;
