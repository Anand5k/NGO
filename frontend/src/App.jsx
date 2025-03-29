
import './App.css'
import Home from './Components/Loginform/Home'
import Loginform from './Components/Loginform/Loginform';
import { Route, Routes } from "react-router-dom";
import ForgetPassword from './Components/Loginform/ForgetPassword';
import Registerform from './Components/Loginform/Registerform'
import Adlogin from './Components/Loginform/Adlogin'
import Logres from './Components/Loginform/Logres'
import Regres from './Components/Loginform/Regres'
import UserDetails from './Components/Loginform/UserDetails'
import UserManuals from './Components/Loginform/UserManuals'
import AdManuals from './Components/Loginform/AdManuals'
import AdAttendence from './Components/Loginform/AdAttendence'
import UserUpdatePhoneno from './Components/Loginform/UserUpdatePhoneno'
import UserAddPhoneno from './Components/Loginform/UserAddPhoneno'
import AdManualInsert from './Components/Loginform/AdManualInsert';
import AdVolunteersDetails from './Components/Loginform/AdVolunteersDetails';
import SiteAdmin from './Components/Loginform/SiteAdmin';
import SiteInfo from './Components/Loginform/SiteInfo';
import Regres2 from './Components/Loginform/Regres2';
import AdUpdate from './Components/Loginform/AdUpdate';



function App() {
  return (
    <div className="full">
      <Routes>
        <Route key={1} index path='/' element={<Home/>}></Route>
        <Route key={2} index path='/register' element={< Registerform/>}></Route>
        <Route key={3} index path='/login' element={<Loginform/>}></Route>
        <Route key={4} index path='/adlogin' element={<Adlogin/>}></Route>
        <Route key={5} index path='/logres' element={<Logres/>}></Route>
        <Route key={6} index path='/regres' element={<Regres/>}></Route> 
        <Route key={7} index path='/forgetPassword' element={<ForgetPassword/>}></Route>
        <Route key={8} index path='/user/details' element={<UserDetails/>}></Route>
        <Route key={9} index path='/user/manuals' element={<UserManuals/>}></Route>
        <Route key={10} index path='/Ad/manuals' element={<AdManuals/>}></Route>
        <Route key={11} index path='/Ad/attendence' element={<AdAttendence/>}></Route>
        <Route key={12} index path='/user/updatePhoneno' element={<UserUpdatePhoneno/>}></Route>
        <Route key={13} index path='/user/addPhoneno' element={<UserAddPhoneno/>}></Route>
        <Route key={14} index path='/Ad/insertManual' element={<AdManualInsert/>}></Route>
        <Route key={15} index path='/Ad/volunteersDetails' element={<AdVolunteersDetails/>}></Route>
        <Route key={16} index path='/siteAdmin' element={<SiteAdmin/>}></Route>
        <Route key={17} index path='/siteInfo' element={<SiteInfo/>}></Route> 
        <Route key={18} index path='/regres2' element={<Regres2/>}></Route>
        <Route key={19} index path='/Ad/update' element={<AdUpdate/>}></Route>
         
      </Routes>
    </div>
  );
}


export default App
