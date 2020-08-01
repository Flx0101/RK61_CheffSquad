import React from 'react';
import {faHome, faGavel, faCalendarAlt, faBell, faPowerOff} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from 'react-router-dom';
// $(document).ready(function() {
//     $("ul.tabs li").click(function () {
//         $("ul.tabs li").removeClass("active");
//         $(this).addClass("active");
//         let activeTab = $(this).find("a>span+i").attr("href");
//         $(activeTab).fadeIn();
//         return false
//     });
// })

export default function SideBar(){

    return (
        <div>
           <nav className="main-menu fixed">
            <ul>
                <li className="anchor-link">
                    <i className="fa">
                        <FontAwesomeIcon icon={faHome} size="lg"/>
                    </i>
                    <span className="nav-text">
                        <Link to="/dashboard">Dashboard</Link>
                    </span>

                </li>
                {/* <li className="anchor-link">
                    <i className="fa">
                        <FontAwesomeIcon icon={faBell}  size="lg"/>
                    </i>
                    <span className="nav-text">
                        Notification
                    </span>
                </li> */}
                <li className="anchor-link">
                    <i className="fa">
                        <FontAwesomeIcon icon={faGavel}  size="lg"/>
                    </i>
                    <span className="nav-text">
                        <Link to="/listcase">Cases</Link>
                    </span>
                </li>
                
                {/* <li className="anchor-link">
                   
                    <i className="fa">
                            <FontAwesomeIcon icon={faCalendarAlt}  size="lg"/>
                        </i>
                        <span className="nav-text">
                            Schedule
                        </span>
                </li> */}
            </ul>

            <ul className="logout">
                <li className="anchor-link">
                    <i className="fa">
                        <FontAwesomeIcon icon={faPowerOff}  size="lg"/>
                    </i>
                    <span className="nav-text">
                        <Link to="/">Logout</Link>
                    </span>
                </li>  
            </ul>
        </nav>
        </div>
    );

}
