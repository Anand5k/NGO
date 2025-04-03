import './Home.css';
import Navhome from './Navhome'
const Home = () => {
    return(
    <>
     <Navhome/> 
        <div className="hmbg">
            <h1>
            <span className='tt1'>Congrats! </span>
            <span className='tt2'>You are one step closer to <br/>serving the society.</span>
            </h1>
        </div>
    </>
    );
};
export default Home;