import './Navbar.css';

const Navad = () => {
    return(
        <header className='header'>
        <a href="#" className='logo'>NGO</a>
        
        <nav className='navbar'>
            <a href="/">HOME</a>
           
            <a href="/login">USER</a>
            <a href="/adminLogin">ADMIN</a>
            </nav></header>

    )

}
export default Navad;