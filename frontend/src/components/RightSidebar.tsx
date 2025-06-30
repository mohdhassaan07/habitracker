import { ArrowRight, ArrowUp, Check, Pencil, X } from "lucide-react";
import { useEffect, useState, useRef } from "react";

const RightSidebar = () => {
  const [width, setWidth] = useState(345); // Initial width
  const isResizing = useRef(false);

  const handleMouseDown = () => {
    isResizing.current = true;
  };

  const handleMouseMove = (e: any) => {
    if (!isResizing.current) return;

    const newWidth = window.innerWidth - e.clientX;
    if (newWidth > 300 && newWidth < 650) {
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
    <div className="flex h-screen">
      {/* Resizable Right Sidebar */}
      <div style={{ width: `${width}px` }} className="relative">

        <div className=" flex justify-between border-b border-gray-300 px-2 py-[10px] items-center sticky top-0 bg-white">
          <h2 className="text-xl font-bold" >All Habits</h2>
          <button className="inline-flex relative border-1 border-gray-300 items-center  justify-center gap-x-1  px-2  text-sm font-semibold">
            <Pencil width={16} />
          </button>
        </div>

        <div className="p-3">
          <div className="box flex gap-2 p-4  border border-gray-300 rounded-lg " >
            <span className="text-4xl" >🔥</span>
            <div>
              <p className="text-[12px] font-semibold text-gray-500 " >CURRENT STREAK</p>
              <h4 className="text-xl font-semibold" >0 days</h4>
            </div>
          </div>

          <div className="grid grid-cols-2 w-full py-3 gap-3" >
            <div className="box min-w-30 flex  gap-2 p-2  border border-gray-300 rounded-lg " >
              <div className="flex flex-col " >
                <p className="text-[12px] font-semibold text-gray-500 flex items-center gap-1" ><Check width={17} /> COMPLETE</p>
                <h4 className="text-2xl font-semibold" >0 days</h4>
                <p className="text-sm font-semibold text-green-600 flex gap-0.5" ><ArrowUp width={16} /> 2 days</p>
              </div>
            </div>           
            <div className="box min-w-30 flex gap-2 p-2  border border-gray-300 rounded-lg " >
              <div className="flex flex-col " >
                <p className="text-[12px] font-semibold text-gray-500 flex items-center gap-1" ><X width={17} /> FAILED</p>
                <h4 className="text-2xl font-semibold" >0 days</h4>
                <p className="text-sm font-semibold text-red-600 flex gap-0.5" ><ArrowUp width={16} />1 day</p>
              </div>
            </div>           
            <div className="box min-w-30 flex gap-2 p-2  border border-gray-300 rounded-lg " >
              <div className="flex flex-col " >
                <p className="text-[12px] font-semibold text-gray-500 flex items-center gap-1" ><ArrowRight width={17} /> SKIPPED</p>
                <h4 className="text-2xl font-semibold" >0 days</h4>
                <p className="text-sm font-semibold text-red-600 flex gap-0.5" ><ArrowUp width={16} /> 2 days</p>
              </div>
            </div>           
            <div className="box min-w-30 flex gap-2 p-2  border border-gray-300 rounded-lg " >
              <div className="flex flex-col " >
                <p className="text-[12px] font-semibold text-gray-500 flex items-center gap-1" >TOTAL</p>
                <h4 className="text-2xl font-semibold" >0 times</h4>
                <p className="text-sm font-semibold text-green-600 flex gap-0.5" ><ArrowUp width={16} /> 2 times</p>
              </div>
            </div>           
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
