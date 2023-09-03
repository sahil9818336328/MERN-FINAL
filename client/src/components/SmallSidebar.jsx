import Wrapper from '../assets/wrappers/SmallSidebar'
import { IoCloseOutline } from 'react-icons/io5'
import Logo from './Logo'
import Navlinks from './Navlinks'
import { useDashboardContext } from '../pages/DashboardLayout'

const SmallSidebar = () => {
  const { showSidebar, toggleSidebar } = useDashboardContext()
  return (
    <Wrapper>
      <div
        className={
          showSidebar ? 'sidebar-container show-sidebar' : 'sidebar-container'
        }
      >
        <div className='content'>
          <button type='button' className='close-btn' onClick={toggleSidebar}>
            <IoCloseOutline />
          </button>
          <header>
            <Logo />
          </header>
          <Navlinks />
        </div>
      </div>
    </Wrapper>
  )
}

export default SmallSidebar
