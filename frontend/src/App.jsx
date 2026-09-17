import Footer from "./components/Footer"
import Header from "./components/Header"
import Login from "./components/Login"
import Main from "./components/Main"
import About from "./components/About"
import Register from "./components/Register"
import "./main.css"
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from "./components/Dashboard"
import UploadResume from "./components/UploadResume"
import UploadJd from "./components/UploadJd"
import AuthProvider from "./AuthProvider"
import PublicRoute from "./PublicRoute"
import PrivateRoute from "./PrivateRoute"
import Result from "./components/Result"
import RecentHistory from "./components/RecentHistory"
import ResumeBuilder from "./components/builder/ResumeBuilder"

function App() {
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Header></Header>
          <Routes>
            <Route path="/" element={<PublicRoute> <Main/> </PublicRoute>} />
            <Route path="/register" element={<PublicRoute> <Register/> </PublicRoute>} />
            <Route path="/login" element={<PublicRoute> <Login/> </PublicRoute>} />
            <Route path="/about" element={<About/>} />
            <Route path="/dashboard" element={<PrivateRoute> <Dashboard/> </PrivateRoute>} />
            <Route path="/upload-resume" element={<PrivateRoute> <UploadResume/> </PrivateRoute>} />
            <Route path="/upload-jd" element={<PrivateRoute> <UploadJd/> </PrivateRoute>} />
            <Route path="/result" element={ <PrivateRoute><Result/></PrivateRoute> } />
            <Route path="/recent-history" element={ <PrivateRoute><RecentHistory/></PrivateRoute> } />
            <Route path="/resume-builder" element={<PrivateRoute> <ResumeBuilder/> </PrivateRoute> } />
          </Routes>
          <Footer></Footer>
        </BrowserRouter>
      </AuthProvider>
    </>
  )
}

export default App
