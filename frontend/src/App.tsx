import Journal from "./pages/Journal"
import Home from "./pages/Home"
import Logout from "./pages/Logout"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { useEffect } from "react"
import { signout } from "./redux/userSlice"
import Timer from "./pages/Timer"
import { GoogleOAuthProvider } from "@react-oauth/google"
const App = () => {
  const { currentUser, loginTime } = useSelector((state: any) => state.user)
  const dispatch = useDispatch()
  const AUTO_LOGOUT_TIME = 2 * 24 * 60 * 60 * 1000
  useEffect(() => {
    if (currentUser && loginTime) {
      const currentTime = Date.now()
      const timeSinceLogin = currentTime - loginTime
      if (timeSinceLogin > AUTO_LOGOUT_TIME) {
        dispatch(signout())
      }
    }
  }, [currentUser, loginTime, dispatch])

  const GoogleAuthWrapper = () => {
    return (
      <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
        <Home />
      </GoogleOAuthProvider>
    )
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GoogleAuthWrapper />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="*" element={<div className="w-full h-screen flex justify-center items-center text-3xl font-semibold">404 Not Found</div>} />
        <Route path="/journal/timer/:habitId" element={<Timer />} />
      </Routes>

    </BrowserRouter>

  )
}

export default App
