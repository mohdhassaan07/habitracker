import { useSelector } from "react-redux"

const ThemeProvider = ({children}: any) => {
    const { theme } = useSelector((state: any) => state.theme);
    return (
        <div className={theme}>
            <div className="bg-white text-black dark:text-white dark:bg-[rgb(16,23,42)] ">
                {children}
            </div>
        </div>
    )
}

export default ThemeProvider
