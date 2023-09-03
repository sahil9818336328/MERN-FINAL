import StyledWrapper from '../assets/wrappers/LandingPage'
import main from '../assets/images/main.svg'
import { Link } from 'react-router-dom'
import { Logo } from '../components'
const Landing = () => {
  return (
    <StyledWrapper>
      <nav>
        <Logo />
      </nav>
      <div className='container page'>
        {/* info */}
        <div className='info'>
          <h2>
            A <span> simple </span> job management software
          </h2>
          <p>
            A simple job tracking software that allows you to filter jobs by
            there status, role, etc allowing you to edit your profile, view
            stats page and many more. Implemented server side pagination for
            smoother user experience. A full-stack MERN application.
          </p>
          <Link to='/register' className='btn register-link'>
            Register
          </Link>
          <Link to='/login' className='btn'>
            Login / Demo User
          </Link>
        </div>
        <img src={main} alt='job hunt' className='img main-img' />
      </div>
    </StyledWrapper>
  )
}
export default Landing
