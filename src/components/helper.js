import React from 'react'
import { cilSend } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import PropTypes from 'prop-types'
import { CSpinner, CToast, CToastBody, CToastHeader } from '@coreui/react'
import axios from 'axios'
import Swal from 'sweetalert2'

export function SubmitButton({
  loading = false,
  disabled,
  text = 'Submit',
  variant = 'success',
  onClick = () => {},
  btnType = 'button',
  form = '',
  icon = <CIcon icon={cilSend} />,
}) {
  return (
    <button
      form={form}
      type={btnType}
      onClick={onClick}
      className={'btn btn-' + variant}
      disabled={disabled}
    >
      {loading ? <CSpinner size="sm" component="span" aria-hidden="true" /> : icon}
      <span className="ms-1">{text}</span>
    </button>
  )
}
SubmitButton.propTypes = {
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  text: PropTypes.string,
  icon: PropTypes.any,
  variant: PropTypes.string,
  btnType: PropTypes.oneOf(['button', 'submit']),
  form: PropTypes.string,
  onClick: PropTypes.func,
}
export const exampleToast = (
  <CToast>
    <CToastHeader closeButton>
      <svg
        className="rounded me-2"
        width="20"
        height="20"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        focusable="false"
        role="img"
      >
        <rect width="100%" height="100%" fill="#007aff"></rect>
      </svg>
      <strong className="me-auto">CoreUI for React.js</strong>
      <small>7 min ago</small>
    </CToastHeader>
    <CToastBody>Hello, world! This is a toast message.</CToastBody>
  </CToast>
)
export const getUser = (token) =>
  new Promise((res, rej) => {
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
      .then(({ data }) => res(data))
      .catch((e) => rej(e))
  })
export const logOut = (token) =>
  new Promise((res, rej) => {
    axios
      .post(process.env.REACT_APP_API_URL + '/logout')
      .then(({ data }) => {
        res(data)
      })
      .catch((e) => rej(e))
  })
export const errCatch = (e) => {
  if (e.response) {
    if (e.response.status === 422) {
      const ed = e.response.data
      let htm = ''
      Object.keys(ed.errors).map((key, index) => {
        let val = ed.errors[key]
        htm += '<div class="border-bottom-dashed border-gray-300">'
        htm += '<b>' + key + '</b> <ul><li>' + val.join('</li><li>') + '</li></ul>'
        htm += '</div>'
        return 1
      })
      htm += '</tbody></table>'
      Swal.fire({
        title: ed.message,
        icon: 'error',
        html: htm,
      })
    } else {
      Swal.fire('Error!', e.response.status, 'error')
    }
  } else {
    Swal.fire('Error!', 'check logs for detail', 'error')
    console.error(e)
  }
}
export function printDiv(divName) {
  var declaration = '<!DOCTYPE html>'
  var printContents = document.getElementById(divName).innerHTML
  var originalContents = document.documentElement.innerHTML

  var wd = window.open()
  wd.document.write(declaration + '<html>' + originalContents + '</html>')
  wd.document.body.innerHTML = printContents
  wd.print()
  wd.close()
}
