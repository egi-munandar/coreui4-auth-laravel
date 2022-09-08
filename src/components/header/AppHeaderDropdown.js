import React, { useEffect, useState } from 'react'
import {
  CAvatar,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import { cilLockLocked, cilSettings, cilUser } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

import { useDispatch, useSelector } from 'react-redux'
import { errCatch, logOut } from '../helper'
import axios from 'axios'
import { authLogout } from 'src/reducer-slices/authSlice'
import Swal from 'sweetalert2'

const AppHeaderDropdown = () => {
  axios.defaults.baseURL = process.env.REACT_APP_BACKEND_URL
  const auth = useSelector((state) => state.auth)
  const [user, setUser] = useState(auth.user)
  const dispatch = useDispatch()
  useEffect(() => {
    setUser(auth.user)
  }, [auth])

  const logout = () => {
    Swal.fire({
      icon: 'question',
      showCancelButton: true,
      title: 'Logout?',
      showLoaderOnConfirm: true,
      allowOutsideClick: false,
      preConfirm: () =>
        logOut()
          .then(() => {
            dispatch(authLogout())
          })
          .catch((e) => errCatch(e)),
    })
  }
  if (user) {
    return (
      <CDropdown variant="nav-item">
        <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>
          <CAvatar
            src={process.env.REACT_APP_BACKEND_URL + '/storage/photos/' + user.username + '.JPG'}
            size="md"
          />
        </CDropdownToggle>
        <CDropdownMenu className="pt-0" placement="bottom-end">
          <CDropdownHeader className="bg-light fw-semibold py-2">{user.name}</CDropdownHeader>
          <CDropdownItem href="#">
            <CIcon icon={cilUser} className="me-2" />
            Profile
          </CDropdownItem>
          <CDropdownItem href="#">
            <CIcon icon={cilSettings} className="me-2" />
            Settings
          </CDropdownItem>
          <CDropdownDivider />
          <CDropdownItem onClick={logout} style={{ cursor: 'pointer' }}>
            <CIcon icon={cilLockLocked} className="me-2" />
            Logout
          </CDropdownItem>
        </CDropdownMenu>
      </CDropdown>
    )
  } else {
    return <div></div>
  }
}

export default AppHeaderDropdown
