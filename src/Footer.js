import React, { Component } from 'react';

class Footer extends Component {

  render() {
    return (
      <div className="esafai_footer">
        <p>&copy; Copyright {new Date().getFullYear()}, ESAFAI. All rights reserved.</p>
      </div>
    );
  }
}

export default Footer;
