import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'

import './index.css'

const Header = props => {
  const onClickLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <div className="main">
      <Link to="/">
        <img
          className="logo"
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
        />
      </Link>
      <ul className="navbarMainDesign">
        <li>
          <Link to="/">
            <button className="navItems" type="button">
              Home
            </button>
          </Link>
        </li>
        <li>
          <Link to="/jobs">
            <button className="navItems" type="button">
              Jobs
            </button>
          </Link>
        </li>
        <li>
          <button
            className="navItems logout-button"
            type="button"
            onClick={onClickLogout}
          >
            Logout
          </button>
        </li>
      </ul>
    </div>
  )
}

export default withRouter(Header)
