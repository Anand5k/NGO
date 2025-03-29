import './Navbar.css';

const Navhome = () => {
    return(
        <header className='header'>
        <a href="#" className='logo'>NGO</a>
        
        <nav className='navbar'>
            
            <a href="/register">REGISTER</a>
            <a href="/login">USER</a>
            <a href="/adlogin">NGO</a>
            <a href="/siteAdmin">ADMIN</a>
            </nav></header>

    )

}
export default Navhome;