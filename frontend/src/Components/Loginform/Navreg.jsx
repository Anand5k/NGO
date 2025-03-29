import './Navbar.css';

const Navreg = () => {
    return(
        <header className='header'>
        <a href="#" className='logo'>NGO</a>
        
        <nav className='navbar'>
            <a href="/">HOME</a>
            <a href="/login">USER</a>
            <a href="/adlogin">NGO</a>
            <a href="/siteAdmin">ADMIN</a>
            </nav></header>

    )

}
export default Navreg;