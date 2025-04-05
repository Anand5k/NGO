import './Navbar.css';

const Navbar = () => {
    return(
        <header className='header'>
        <a href="#" className='logo'>Preservia</a>
        
        <nav className='navbar'>
            <a href="/">HOME</a>
            <a href="/register">REGISTER</a>
            <a href="/login">USER</a>
            <a href="/adlogin">NGO</a>
            <a href="/adminLogin">ADMIN</a>
            </nav></header>

    )

}
export default Navbar;