import { Form, Link, redirect } from 'react-router-dom'
import Wrapper from '../assets/wrappers/RegisterAndLoginPage'
import { FormRow, Logo, SubmitBtn } from '../components'
import customFetch from '../utils/customFetch'
import { toast } from 'react-toastify'

// FORM HANDLING USING ACTION
export const action = async ({ request }) => {
  const formData = await request.formData()
  const data = Object.fromEntries(formData)
  try {
    const response = await customFetch.post('/auth/register', data)
    console.log(response)
    toast.success(response.data.msg)
    return redirect('/login')
  } catch (error) {
    toast.error(error?.response?.data?.msg)
    return error
  }
}

const Register = () => {
  return (
    <Wrapper>
      <Form method='post' className='form'>
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

        <FormRow type='password' name='password' defaultValue='secret123' />

        <SubmitBtn />
        <p>
          Already a member?
          <Link to='/login' className='member-btn'>
            Login
          </Link>
        </p>
      </Form>
    </Wrapper>
  )
}
export default Register
