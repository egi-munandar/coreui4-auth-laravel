import { CCol, CContainer, CRow, CSpinner } from '@coreui/react'
import React from 'react'

export default function LoadingPage() {
  return (
    <div className="bg-white min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol className="d-flex justify-content-center" md={6}>
            <CSpinner color="primary" />
            <p className="h3 ms-2">LOADING APPLICATION...</p>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}
