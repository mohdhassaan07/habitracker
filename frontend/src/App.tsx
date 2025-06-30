import Journal from "./pages/Journal"
import Home from "./pages/Home"
import Logout from "./pages/Logout"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { useEffect } from "react"
import { signout } from "./redux/userSlice"

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
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>

    </BrowserRouter>

  )
}

export default App
