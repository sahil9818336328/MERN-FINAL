import Wrapper from '../assets/wrappers/Navbar'
import { useDashboardContext } from '../pages/DashboardLayout'
import { RiMenu3Line } from 'react-icons/ri'
import Logo from './Logo'
import LogoutContainer from './LogoutContainer'
import ThemeToggle from './ToggleTheme'

const Navbar = () => {
  const { toggleSidebar } = useDashboardContext()
  return (
    <Wrapper>
      <div className='nav-center'>
        <button type='button' className='toggle-btn' onClick={toggleSidebar}>
          <RiMenu3Line />
        </button>
        <div>
          <Logo />
          <h4 className='logo-text'>dashboard</h4>
        </div>
        <div className='btn-container'>
          <ThemeToggle />
          <LogoutContainer />
        </div>
      </div>
    </Wrapper>
  )
}
export default Navbar
