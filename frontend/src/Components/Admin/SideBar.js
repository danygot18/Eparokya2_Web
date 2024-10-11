import React from "react";
import { Link } from "react-router-dom";
import NavDropdown from "react-bootstrap/NavDropdown";
import Card from "react-bootstrap/Card";
import { Dropdown } from "react-bootstrap";

const SideBar = () => {

    return (
        <div className="sidebar" style={{ marginTop: "60px" }}>
          <nav id="sidebar">
            <ul className="list-unstyled components"> 
              <li>
                <Link to="/admin/users" className="sidebar-link">
                  Users
                </Link>
              </li>
    
            </ul>
          </nav>
        </div>
      );
    };


export default SideBar;