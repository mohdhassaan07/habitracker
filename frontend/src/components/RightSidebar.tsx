import api from "@/utils/api";
import { ArrowRight, ArrowUp, Check, Pencil, X } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { BarChart } from '@mui/x-charts/BarChart';

const RightSidebar = ({ habit }: any) => {
  const [width, setWidth] = useState(800); // Initial width
  const isResizing = useRef(false);
  const [completed, setcompleted] = useState(0)
  const [failed, setfailed] = useState(0)
  const [skipped, setskipped] = useState(0)
  const [failedCount, setfailedCount] = useState(0)
  const [skippedCount, setskippedCount] = useState(0)
  let date = new Date()
  const [seriesData, setseriesData] = useState<any>([`${date.toISOString().slice(0, 7)}`,`${date.toISOString().slice(0, 7)}`])
  const [x_axisData, setx_axisData] = useState([5])
  const dates: any = []
  const data: any = []
  //checking the logs of the habit for this week
  const checkThisWeek = () => {
    setskippedCount(0);
    setfailedCount(0);
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const endOfWeek = new Date();
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    habit.logs.forEach((log: any) => {
      const logDate = new Date(log.date);
      if (logDate >= startOfWeek && logDate <= endOfWeek) {
        if (log.status === "failed") {
          setfailedCount((prev: number) => prev + 1);
        } else if (log.status === "skipped") {
          setskippedCount((prev: number) => prev + 1);
        }
      }
    })
  }
  // convert "2025-07-06T00:00:00Z" to "6 July 2025"
  function formatDateToDisplayString(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    };

    return date.toLocaleDateString('en-GB', options);
  }

  useEffect(() => {
    const fetchLoggedData = async () => {
      try {
        const res = await api.get(`/habit/loggedData/${habit.id}`);
        if (res.status === 200) {
          const loggedData = res.data.groupedLogs;
          const datesData = res.data.groupedByDate

          await datesData.forEach((log: any) => {
            let date = new Date(log.date)
            dates.push(formatDateToDisplayString(date).slice(0, 6))
            data.push(log.totalValue)
          })
          setseriesData(dates)
          setx_axisData(data)
          // Process loggedData as needed
          console.log("Logged Data:", res);
          loggedData.forEach((log: any) => {
            if (log.status === "completed") {
              setcompleted(log._count.status);
            } else if (log.status === "failed") {
              setfailed(log._count.status);
            } else if (log.status === "skipped") {
              setskipped(log._count.status);
            }
          })
        }
      } catch (error) {
        console.error("Error fetching logged data:", error);
      }
    }
    fetchLoggedData()
    checkThisWeek()
  }, [habit])

  const handleMouseDown = () => {
    isResizing.current = true;
  };

  const handleMouseMove = (e: any) => {
    if (!isResizing.current) return;

    const newWidth = window.innerWidth - e.clientX;
    if (newWidth > 500 && newWidth < 1000) {
      setWidth(newWidth);
    }
  };

  const handleMouseUp = () => {
    isResizing.current = false;
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);
  return (
    <div className="element flex h-screen overflow-auto">
      {/* Resizable Right Sidebar */}
      <div style={{ width: `${width}px` }} className="relative">

        <div className=" flex justify-between border-b border-gray-300 px-2 py-[10px] items-center sticky top-0 bg-white">
          <h2 className="text-xl font-bold" >{habit.name}</h2>
          <button className="inline-flex relative border-1 border-gray-300 items-center  justify-center gap-x-1  px-2  text-sm font-semibold">
            <Pencil width={16} />
          </button>
        </div>

        <div className="p-3">
          <div className="box flex gap-2 p-4  border border-gray-300 rounded-lg " >
            <span className="text-4xl" >🔥</span>
            <div>
              <p className="text-[12px] font-semibold text-gray-500 " >CURRENT STREAK</p>
              <h4 className="text-xl font-semibold" >{habit.streak} days</h4>
            </div>
          </div>

          <div className="grid grid-cols-2 w-full py-3 gap-3" >
            <div className="box min-w-30 flex  gap-2 p-2  border border-gray-300 rounded-lg " >
              <div className="flex flex-col " >
                <p className="text-[12px] font-semibold text-gray-500 flex items-center gap-1" ><Check width={17} /> COMPLETE</p>
                <h4 className="text-2xl font-semibold" >{completed} days</h4>
                <p className="text-sm font-semibold text-green-600 flex gap-0.5" ><ArrowUp width={16} /> {habit.streak} days</p>
              </div>
            </div>
            <div className="box min-w-30 flex gap-2 p-2  border border-gray-300 rounded-lg " >
              <div className="flex flex-col " >
                <p className="text-[12px] font-semibold text-gray-500 flex items-center gap-1" ><X width={17} /> FAILED</p>
                <h4 className="text-2xl font-semibold" >{failed} days</h4>
                <p className="text-sm font-semibold text-red-600 flex gap-0.5" ><ArrowUp width={16} />{failedCount} days</p>
              </div>
            </div>
            <div className="box min-w-30 flex gap-2 p-2  border border-gray-300 rounded-lg " >
              <div className="flex flex-col " >
                <p className="text-[12px] font-semibold text-gray-500 flex items-center gap-1" ><ArrowRight width={17} /> SKIPPED</p>
                <h4 className="text-2xl font-semibold" >{skipped} days</h4>
                <p className="text-sm font-semibold text-red-600 flex gap-0.5" ><ArrowUp width={16} /> {skippedCount} days</p>
              </div>
            </div>
            <div className="box min-w-30 flex gap-2 p-2  border border-gray-300 rounded-lg " >
              <div className="flex flex-col " >
                <p className="text-[12px] font-semibold text-gray-500 flex items-center gap-1" >TOTAL</p>
                <h4 className="text-2xl font-semibold" >{habit.totalValue} {habit.unitType === "times" ? "times" : "minutes"}</h4>
                <p className="text-sm font-semibold text-green-600 flex gap-0.5" ><ArrowUp width={16} /> {habit.currentValue} {habit.unitType === "times" ? "times" : "minutes"}</p>
              </div>
            </div>
          </div>

          <div className="border border-gray-300 rounded-lg">
            <BarChart
              borderRadius={5}
              xAxis={[
                {
                  id: 'barCategories',
                  data: seriesData,
                },
              ]}
              series={[
                {
                  data: x_axisData,
                  color: '#4c8eff',
                },
              ]}
              height={300}
            />
          </div>
        </div>
        {/* Resizer Handle on the LEFT edge */}
        <div
          onMouseDown={handleMouseDown}
          className="absolute top-0 left-0 w-[1px] h-full cursor-ew-resize bg-gray-300"
        />
      </div>
    </div>
  );
}

export default RightSidebar
