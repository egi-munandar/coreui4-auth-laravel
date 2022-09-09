import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { CSidebar, CSidebarBrand, CSidebarNav, CSidebarToggler, CImage } from '@coreui/react'

import { AppSidebarNav } from './AppSidebarNav'

import logoNegative from 'src/assets/brand/invoice-dark.png'
import sygnet from 'src/assets/brand/invoice.svg'

import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'

// sidebar nav config
import navigation from '../_nav'
import { toggleSidebar, toggleUnfoldable } from 'src/reducer-slices/themeSlice'
import { can } from './helper'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.theme.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.theme.sidebarShow)
  const user = useSelector((state) => state.auth.user)
  const [navlist, setNavlist] = useState([])
  useEffect(() => {
    let lst = []
    navigation.map((v) => {
      if (v.permission) {
        if (can('Administrator', user)) lst.push(v)
      } else {
        lst.push(v)
      }
      setNavlist(lst)
      return 1
    })
  }, [user])

  return (
    <CSidebar
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch(toggleSidebar(visible))
      }}
    >
      <CSidebarBrand className="d-none d-md-flex" to="/">
        <CImage src={logoNegative} className="sidebar-brand-full" height={35} />
        <CImage className="sidebar-brand-narrow" src={sygnet} height={35} />
      </CSidebarBrand>
      <CSidebarNav>
        <SimpleBar>
          <AppSidebarNav items={navlist} />
        </SimpleBar>
      </CSidebarNav>
      <CSidebarToggler
        className="d-none d-lg-flex"
        onClick={() => dispatch(toggleUnfoldable(!unfoldable))}
      />
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
