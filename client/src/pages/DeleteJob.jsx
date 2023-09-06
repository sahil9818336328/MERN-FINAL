import { redirect } from 'react-router-dom'
import customFetch from '../utils/customFetch'
import { toast } from 'react-toastify'

export async function action({ params: { id } }) {
  try {
    const response = await customFetch.delete(`/jobs/${id}`)
    toast.success(response.data.msg)
  } catch (error) {
    toast.error(error.response.data.msg)
  }
  return redirect('/dashboard/all-jobs')
}
