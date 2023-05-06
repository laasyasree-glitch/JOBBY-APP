import {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import {IoMdClose} from 'react-icons/io'

import Cookies from 'js-cookie'

import './index.css'

class Header extends Component {
  state = {
    menuOpen: false,
  }

  handleMenuOpen = () => {
    this.setState(ps => ({menuOpen: !ps.menuOpen}))
  }

  onClickLogout = () => {
    const {history} = this.props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  render() {
    const {menuOpen} = this.state
    return (
      <div className="main">
        <Link to="/">
          <img
            className="logo"
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
          />
        </Link>
        <button
          type="button"
          className={`hamburger-icon ${menuOpen ? 'open' : ''}`}
          onClick={this.handleMenuOpen}
        >
          <div className="line" />
          <div className="line" />
          <div className="line" />
        </button>
        {menuOpen && (
          <div className={`menu-content ${menuOpen ? 'open' : ''}`}>
            <div className="dropD">
              <button
                type="button"
                className="trigger-button"
                onClick={this.handleMenuOpen}
              >
                <IoMdClose className="icon" />
              </button>
              <ul>
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
                    onClick={this.onClickLogout}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    )
  }
}

export default withRouter(Header)
