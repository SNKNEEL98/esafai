import React, { Component } from 'react';
// import { Link } from 'react-router-dom'

class Navbar extends Component {
  render() {
    return (
      <nav className="navbar navbar-light fixed-top flex-md-nowrap esafai_color">
        <div className="container">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0 text-light"
            href="http://localhost:3000"
            target="_blank"
            rel="noopener noreferrer"
          >
            E-SAFAI
          </a>
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block text-light">
              Signed in as: <small className="esafai_bg"><span id="account">{this.props.account}</span></small>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}

export default Navbar;