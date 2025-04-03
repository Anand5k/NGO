
import './App.css'
import Home from './Components/Loginform/Home'
import Loginform from './Components/Loginform/Loginform';
import { Route, Routes } from "react-router-dom";
import ForgetPassword from './Components/Loginform/ForgetPassword';
import Registerform from './Components/Loginform/Registerform'
import Adlogin from './Components/Loginform/Adlogin'
import Logres from './Components/Loginform/Logres'
// import Regres from './Components/Loginform/Regres'
import UserNewApplication from './Components/Loginform/UserNewApplication';
import UserCheckStatus from './Components/Loginform/UserCheckStatus';
import UserPreviousHistory from './Components/Loginform/UserPreviousHistory';
import NgoInfo from './Components/Loginform/NgoInfo';
import NgoNotifications from './Components/Loginform/NgoNotifications';
import NgoUpdateStatus from './Components/Loginform/NgoUpdateStatus';
import SiteAdmin from './Components/Loginform/SiteAdmin';
import AdminLogin from './Components/Loginform/AdminLogin';
// import SiteAdmin from './Components/Loginform/SiteAdmin';




function App() {
  return (
    <div className="full">
      <Routes>
        <Route key={1} index path='/' element={<Home/>}></Route>
        <Route key={2} index path='/register' element={< Registerform/>}></Route>
        <Route key={3} index path='/login' element={<Loginform/>}></Route>
        <Route key={4} index path='/adlogin' element={<Adlogin/>}></Route>
        <Route key={5} index path='/logres' element={<Logres/>}></Route>
        {/* <Route key={6} index path='/regres' element={<Regres/>}></Route>  */}
        <Route key={7} index path='/forgetPassword' element={<ForgetPassword/>}></Route>
        <Route key={8} index path='/user/new-application' element={<UserNewApplication/>}></Route>
        <Route key={9} index path='/user/check-status' element={<UserCheckStatus/>}></Route>
        <Route key={10} index path='/user/previous-history' element={<UserPreviousHistory/>}></Route>
        <Route key={11} index path='/ngo/info' element={<NgoInfo/>}></Route>
        <Route key={12} index path='/ngo/notifications' element={<NgoNotifications/>}></Route>
        <Route key={13} index path='/ngo/update-status' element={<NgoUpdateStatus/>}></Route>
        <Route key={14} index path='/siteAdmin' element={<SiteAdmin/>}></Route>
        <Route key={15} index path='/adminLogin' element={<AdminLogin/>}></Route>
               
      </Routes>
    </div>
  );
}


export default App
