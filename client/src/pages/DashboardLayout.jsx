/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useState } from 'react'
import { Outlet, redirect, useNavigate, useNavigation } from 'react-router-dom'
import customFetch from '../utils/customFetch'
import Wrapper from '../assets/wrappers/Dashboard'
import { BigSidebar, Navbar, SmallSidebar, Loading } from '../components'
import { checkDefaultTheme } from '../App'
import { toast } from 'react-toastify'
import { useQuery } from '@tanstack/react-query'

const userQuery = {
  queryKey: ['user'],
  queryFn: async () => {
    const { data } = await customFetch('/users/current-user')
    return data
  },
}

// PRE-FETCHING DATA USING LOADER
export const loader = (queryClient) => async () => {
  try {
    const response = await queryClient.ensureQueryData(userQuery)
    return response
  } catch (error) {
    return redirect('/')
  }
}

const DashboardContext = createContext()
const DashboardLayout = () => {
  // eslint-disable-next-line no-unsafe-optional-chaining
  const { user } = useQuery(userQuery)?.data

  const navigate = useNavigate()
  const navigation = useNavigation()
  const isPageLoading = navigation.state === 'loading'
  const [showSidebar, setShowSidebar] = useState(false)
  const [isDarkTheme, setIsDarkTheme] = useState(checkDefaultTheme())
  const [isAuthError, setIsAuthError] = useState(false)

  const toggleDarkTheme = () => {
    const newDarkTheme = !isDarkTheme
    setIsDarkTheme(newDarkTheme)
    document.body.classList.toggle('dark-theme', newDarkTheme)
    localStorage.setItem('darkTheme', newDarkTheme)
  }

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar)
  }

  const logoutUser = async () => {
    const response = await customFetch.get('/auth/logout')
    toast.success(response.data.msg)
    navigate('/')
  }

  customFetch.interceptors.response.use(
    (response) => {
      return response
    },
    (error) => {
      if (error?.response?.status === 401) {
        setIsAuthError(true)
      }
      return Promise.reject(error)
    }
  )
  useEffect(() => {
    if (!isAuthError) return
    logoutUser()
  }, [isAuthError])

  return (
    <DashboardContext.Provider
      value={{
        user,
        showSidebar,
        isDarkTheme,
        toggleDarkTheme,
        toggleSidebar,
        logoutUser,
      }}
    >
      <Wrapper>
        <main className='dashboard'>
          <BigSidebar />
          <SmallSidebar />
          <div>
            <Navbar />
            <div className='dashboard-page'>
              {isPageLoading ? <Loading /> : <Outlet context={{ user }} />}
            </div>
          </div>
        </main>
      </Wrapper>
    </DashboardContext.Provider>
  )
}

export const useDashboardContext = () => useContext(DashboardContext)

export default DashboardLayout
