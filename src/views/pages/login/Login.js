import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilLockUnlocked, cilUser } from '@coreui/icons'
import { errCatch, getUser, SubmitButton } from 'src/components/helper'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { authSetUser } from 'src/reducer-slices/authSlice'

const Login = () => {
  axios.defaults.baseURL = process.env.REACT_APP_API_URL
  const [loginForm, setLoginForm] = useState({})
  const [loginLoading, setLoginLoading] = useState(false)
  const dispatch = useDispatch()
  const submitLogin = (e) => {
    e.preventDefault()
    setLoginLoading(true)
    axios
      .post('/login', loginForm)
      .then(({ data }) => {
        getUser(data.api_token)
          .then((d) => {
            dispatch(authSetUser(d))
            console.log(d)
          })
          .catch((e) => errCatch(e))
        sessionStorage.setItem('token', data.api_token)
      })
      .finally(() => setLoginLoading(false))
      .catch((e) => {
        errCatch(e)
      })
  }
  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={6}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm id="fLogin" onSubmit={submitLogin}>
                    <h1>Login</h1>
                    <p className="text-medium-emphasis">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                        placeholder="Username"
                        autoComplete="username"
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <SubmitButton
                          btnType="submit"
                          form="fLogin"
                          disabled={!loginForm.username || !loginForm.password || loginLoading}
                          loading={loginLoading}
                          text={'Login'}
                          variant="primary"
                          icon={<CIcon icon={cilLockUnlocked} className="me-1" />}
                        />
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <CButton color="link" className="px-0">
                          Forgot password?
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
