import React from "react";
import farmer from "../farmer.png";

const Navbar = ({ account }) => {
  return (
    <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
      <div className="navbar-brand col-sm-3 col-md-2 mr-0">
        <img
          src={farmer}
          width="30"
          height="30"
          className="d-inline-block align-top"
          alt=""
        />
        &nbsp; DApp Token Farm
      </div>
      <p className="h1 text-white small">{account}</p>
    </nav>
  );
};

export default Navbar;
