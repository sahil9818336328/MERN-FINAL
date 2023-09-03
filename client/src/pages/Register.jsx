import { Link } from 'react-router-dom'
import Wrapper from '../assets/wrappers/RegisterAndLoginPage'
import { FormRow, Logo } from '../components'

const Register = () => {
  return (
    <Wrapper>
      <form className='form'>
        <Logo />
        <h4>Register</h4>
        <FormRow type='text' name='name' defaultValue='sahil' />
        <FormRow
          type='text'
          name='lastName'
          labelText='last name'
          defaultValue='khatri'
        />
        <FormRow type='text' name='location' defaultValue='india' />
        <FormRow type='email' name='email' defaultValue='sahil@gmail.com' />

        <FormRow type='password' name='password' defaultValue='secret' />

        <button type='submit' className='btn btn-block'>
          submit
        </button>
        <p>
          Already a member?
          <Link to='/login' className='member-btn'>
            Login
          </Link>
        </p>
      </form>
    </Wrapper>
  )
}
export default Register
