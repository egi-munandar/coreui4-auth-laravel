import React, { Suspense, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { authSetLoading, authSetUser } from './reducer-slices/authSlice'
import axios from 'axios'
import './scss/style.scss'
import LoadingPage from './views/pages/LoadingPage'

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

function App() {
  const auth = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  useEffect(() => {
    const token = sessionStorage.getItem('token')
    axios
      .post(
        process.env.REACT_APP_API_URL + '/get-user',
        {},
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      )
      .then(({ data }) => {
        axios.defaults.headers = {
          Authorization: 'Bearer ' + token,
        }
        dispatch(authSetUser(data))
      })
      .catch((e) => {
        if (e.response) {
          if (e.response.status === 401) {
            dispatch(authSetLoading(false))
          }
        }
      })
  }, [dispatch])

  if (auth.loading) {
    return (
      <HashRouter>
        <Suspense fallback={loading}>
          <Routes>
            <Route path="*" name="Home" element={<LoadingPage />} />
          </Routes>
        </Suspense>
      </HashRouter>
    )
  } else {
    if (auth.loggedIn) {
      return (
        <HashRouter>
          <Suspense fallback={loading}>
            <Routes>
              <Route exact path="/404" name="Page 404" element={<Page404 />} />
              <Route exact path="/500" name="Page 500" element={<Page500 />} />
              <Route path="*" name="Home" element={<DefaultLayout />} />
            </Routes>
          </Suspense>
        </HashRouter>
      )
    } else {
      return (
        <HashRouter>
          <Suspense fallback={loading}>
            <Routes>
              <Route exact path="/login" name="Login Page" element={<Login />} />
              <Route path="*" name="Home" element={<Login />} />
            </Routes>
          </Suspense>
        </HashRouter>
      )
    }
  }
}

export default App
