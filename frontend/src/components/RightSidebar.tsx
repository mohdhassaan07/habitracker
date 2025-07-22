import api from "@/utils/api";
import { ArrowRight, ArrowUp, Check, Pencil, X } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { BarChart } from '@mui/x-charts/BarChart';
import HeatMap from '@uiw/react-heat-map';
import Tooltip from '@uiw/react-tooltip';
import EditHabit from "./EditHabit";

const RightSidebar = ({ habit }: any) => {
  const [width, setWidth] = useState(850); // Initial width
  const isResizing = useRef(false);
  const [completed, setcompleted] = useState(0)
  const [failed, setfailed] = useState(0)
  const [skipped, setskipped] = useState(0)
  const [failedCount, setfailedCount] = useState(0)
  const [skippedCount, setskippedCount] = useState(0)
  const [datesValues, setdatesValues] = useState<any>([])
  const [isModalOpen, setisModalOpen] = useState(false)
  const [quote, setquote] = useState("")
  let date = new Date()
  const [xAxisData, setxAxisData] = useState<any>([`${date.toISOString().slice(0, 7)}`, `${date.toISOString().slice(0, 7)}`])
  const [seriesData, setseriesData] = useState([5])
  const dates: any = []
  const data: any = []
  //checking the logs of the habit for this week
  const checkThisWeek = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const endOfWeek = new Date();
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    if (habit.logs && habit.logs.length > 0) {
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
  const quotes: string[] = [
      "Success usually comes to those who keep moving forward.",
      "Stay patient and trust your journey every single day.",
      "Hard work beats talent when talent doesn't work hard.",
      "A positive mindset brings positive things into your life.",
      "Dream big, work hard, and never ever give up.",
      "You are stronger than you think, keep pushing forward.",
      "Discipline is the bridge between goals and real achievement.",
      "Progress, not perfection, is the key to growth.",
      "Success is built on consistency, not occasional effort.",
      "Work in silence, let success make the noise.",
      "Don’t watch the clock; do what it does—move.",
      "Start where you are. Use what you have. Begin.",
      "Small steps each day lead to great accomplishments eventually.",
      "The future depends on what you do today.",
      "Your only limit is the one you set yourself.",
      "Growth begins at the end of your comfort zone.",
      "It always seems impossible until it is finally done.",
      "Push yourself, because no one else is going to.",
      "Believe in yourself even when no one else does.",
      "The harder you work, the luckier you get, always.",
      "Great things take time, so be patient and persistent.",
      "Winners are not people who never fail but try.",
      "Take risks now and live your dreams every day.",
      "Turn your wounds into wisdom and your pain into power.",
      "Success is no accident, it’s hard work and dedication.",
      "Make each day your masterpiece with effort and gratitude.",
      "Doubt kills more dreams than failure ever could try.",
      "Strive for progress, not perfection, in every little step.",
      "Every day is a fresh start—make it worthwhile.",
      "Fall seven times, stand up eight, and keep going.",
      "Create the life you can’t wait to wake up to.",
      "Big journeys begin with small, consistent and determined steps.",
      "Let your hustle be louder than your complaints daily.",
      "You don’t need perfect conditions to start, just begin.",
      "Focus on your goals, not the obstacles ahead, always.",
      "Discomfort is the price of admission to a meaningful life.",
      "You were born to stand out, not to fit in.",
      "Discipline outlasts motivation every single day, especially long term.",
      "One step at a time gets you somewhere eventually.",
      "Don’t be afraid to start over, it builds strength.",
      "A goal without a plan is just a wish.",
      "Learn something new today that helps you grow tomorrow.",
      "If you’re tired, learn to rest, not to quit.",
      "Keep going, because you did not come this far.",
      "Sometimes later becomes never. Do it now instead.",
      "Be stubborn about goals, flexible about your methods always.",
      "Don’t limit your challenges—challenge your limits with confidence.",
      "Turn your can'ts into cans and dreams into plans.",
      "Do something today your future self will thank you for.",
      "Motivation gets you started, but habits keep you going strong.",
      "Your dreams don’t work unless you do the work.",
      "Consistency builds trust, momentum, and lasting long-term success.",
      "Distractions destroy action. Stay focused on what really matters."
    ];
  useEffect(() => {
    const fetchLoggedData = async () => {
      try {
        const res = await api.get(`/habit/loggedData/${habit.id}`);
        if (res.status === 200) {
          const loggedData = res.data.groupedLogs;
          const datesData = res.data.groupedByDate
          setdatesValues(res.data.groupedByDate)
          await datesData.forEach((log: any) => {
            let date = new Date(log.date)
            dates.push(formatDateToDisplayString(date).slice(0, 6))
            data.push(log.totalValue)
          })
          setxAxisData(dates.slice(dates.length > 6 ? dates.length - 6 : 0, dates.length))
          setseriesData(data.slice(dates.length > 6 ? dates.length - 6 : 0, dates.length))
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
    // Generate a random quote from the quotes array
    const generateRandomQuote = () => {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      setquote(quotes[randomIndex]);
    }
    fetchLoggedData()
    checkThisWeek()
    generateRandomQuote()
  }, [habit])

  const values: any = []
  datesValues.length > 0 && (
    datesValues.forEach((data: any) => {
      values.push({ date: data.date.split('T')[0], count: data.totalValue > 0 ? data.totalValue : -1 })
    })
  )

  const value = [
    {}
  ];

  const handleMouseDown = () => {
    isResizing.current = true;
  };

  const handleMouseMove = (e: any) => {
    if (!isResizing.current) return;

    const newWidth = window.innerWidth - e.clientX;
    if (newWidth > 800 && newWidth < 1200) {
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

  if (!habit || Object.keys(habit).length === 0) {
    return (
      <div className="quote w-[650px] text-gray-400 flex-col p-3 m-2 max-h-screen  bg-white rounded-2xl flex items-center justify-center">
        <div className="quote-box font-mono  text-2xl font-semibold text-center">
          <p className="mb-4">{quote}</p>
        </div>

      </div>
    )
  }

  return (
    <>
      <EditHabit isModalOpen={isModalOpen} setIsModalOpen={setisModalOpen} habitId={habit.id} />
      <div className="element flex rounded-2xl max-h-screen overflow-auto bg-white m-2 ">
        {/* Resizable Right Sidebar */}
        <div style={{ width: `${width}px` }} className="relative">
          <div className=" flex justify-between border-b border-gray-300 px-2 py-[10px] items-center sticky top-0 bg-white">
            <h2 className="text-xl font-bold" >{habit.name}</h2>
            <button onClick={() => setisModalOpen(true)} className="inline-flex relative border-1 border-gray-300 items-center  justify-center gap-x-1  px-2  text-sm font-semibold">
              <Pencil width={16} />
            </button>
          </div>

          <div className="p-3 flex flex-col gap-4">
            <div className="box flex gap-2 p-4 border border-gray-300 rounded-lg " >
              <span className="text-4xl" >🔥</span>
              <div>
                <p className="text-[12px] font-semibold text-gray-500 " >CURRENT STREAK</p>
                <h4 className="text-xl font-semibold" >{habit.streak} days</h4>
              </div>
            </div>

            <div className="grid grid-cols-2 w-full gap-3" >
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


            <div className="border p-2 border-gray-300 rounded-lg overflow-hidden">

              <HeatMap
                value={values.length > 0 ? values : value}
                width={390}
                rectSize={13}
                startDate={new Date(`2025/${date.getMonth() - 1}/01`)}
                endDate={new Date(`2025/${date.getMonth() + 4}/31`)}
                rectRender={(props, data) => {
                  // if (!data.count) return <rect {...props} />;
                  return (
                    <Tooltip placement="top" content={`count: ${data.count || 0}`}>
                      <rect {...props} />
                    </Tooltip>
                  );
                }}
              />
            </div>
            <div className="border border-gray-300 rounded-lg">
              <BarChart
                borderRadius={5}
                xAxis={[
                  {
                    id: 'barCategories',
                    data: xAxisData,
                  },
                ]}
                series={[
                  {
                    data: seriesData,
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
            className="absolute top-0 left-0 w-[1px] h-[53.5rem] cursor-ew-resize "
          />
        </div>
      </div>
    </>
  );
}

export default RightSidebar
