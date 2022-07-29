import React from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import LogoutButton from "../auth/LogoutButton";
import LoginFormModal from "../auth/LoginFormModal";
import SignUpFormModal from "../auth/SignupFormModal";

import "./splash.css";

export default function Splash() {

  const sessionUser = useSelector((state) => state.session.user);

  return (
    <>
      <div>
        {sessionUser &&
          <nav>
            <span>
              <NavLink
                id="splash-logo"
                to="/home"
                exact={true}
              >
                Go to Wecord
              </NavLink>
            </span>
            <span className="logoutBtn">
              <LogoutButton />
            </span>
          </nav>
        }
      </div>
      <div>
        {!sessionUser && (
          <>
            <NavLink id="splash-logo" to="/" exact={true}>
              Wecord
            </NavLink>
            <div>
              <span>
                <LoginFormModal />
              </span>
              <span className="">
                <SignUpFormModal />
              </span>
            </div>

          </>
        )}
      </div>

      <div className="splash-container">
        <div className="background-partition">
          <h1 id="splash-title">Imagine a place...</h1>
          <p id="splash-intro">
            ...where you can belong to any school club, any gaming group, or a
            worldwide art community.
            <div></div>
            <br />
            Where just you and anyone can spend time together.
            <div></div>
            <br />A place where strangers can become acquaintances...or maybe even
            friends.
          </p>
        </div>
        <div className="footer">
          <section className="dev-info">
            <img
              className="profile-pic"
              src="https://media-exp1.licdn.com/dms/image/C5603AQGWk2Gqsts5JA/profile-displayphoto-shrink_800_800/0/1563818007698?e=1664409600&v=beta&t=vVd1pvvenK9aSpDCYrZI9CSI6NZHXnAa4b6rjRPlnUk"
              alt="Ricky"
            ></img>
            <div className="profile-section">
              <div className="name">Ricky Cheung</div>

              <div className="git-in">
                <a href="https://github.com/WingNinCheung" target="popup">
                  <i className="fa-brands fa-github"></i>
                </a>
                <a
                  href="https://www.linkedin.com/in/wingnincheung/"
                  target="popup"
                >
                  <i className="fa-brands fa-linkedin-in"></i>
                </a>
                <a href="mailto:wingnin.cheung415@gmail.com">
                  <i className="fa-solid fa-envelope"></i>
                </a>
              </div>
            </div>
          </section>
          <section className="dev-info">
            <img className="profile-pic" src="https://media-exp1.licdn.com/dms/image/C5603AQGU_VDz-D81wg/profile-displayphoto-shrink_800_800/0/1622773943069?e=1664409600&v=beta&t=ksJ3ORRhPKG4qYtf8FdY6p9uhuRYOplJdrDSFfFEv_A" alt="Krista"></img>
            <div className="profile-section">
              <div className="name">Krista Strucke</div>

              <div className="git-in">
                <a href="https://github.com/kurikurichan" target="popup">
                  <i className="fa-brands fa-github"></i>
                </a>
                <a href="https://www.linkedin.com/in/krista-strucke-044b3369/" target="popup">
                  <i className="fa-brands fa-linkedin-in"></i>
                </a>
                <a href="mailto:developerkrista@gmail.com">
                  <i className="fa-solid fa-envelope"></i>
                </a>
              </div>
            </div>
          </section>
          <section className="dev-info">
            <img
              className="profile-pic"
              src="https://media-exp1.licdn.com/dms/image/C4E03AQF0fmknzYk1rA/profile-displayphoto-shrink_200_200/0/1580893094660?e=1664409600&v=beta&t=7f9AE6QP-kp8pWoW34enfUdyeN6AGSNwOTZtc-khsUc"
              alt="Brendan"
            ></img>
            <div className="profile-section">
              <div className="name">Brendan Lau</div>

              <div className="git-in">
                <a href="https://github.com/BrenLau" target="popup">
                  <i className="fa-brands fa-github"></i>
                </a>
                <a href="https://www.linkedin.com/in/brendan-lau-b6952919a/" target="popup">
                  <i className="fa-brands fa-linkedin-in"></i>
                </a>
                <a href="mailto:blau4000@gmail.com">
                  <i className="fa-solid fa-envelope"></i>
                </a>
              </div>
            </div>
          </section>
          <section className="dev-info">
            <img
              className="profile-pic"
              src="https://media-exp1.licdn.com/dms/image/C4D03AQGk5rQvlCZ_yA/profile-displayphoto-shrink_400_400/0/1654710587613?e=1664409600&v=beta&t=ZDV4dpaekhMtnq8dTWBKs02sAcnUTE_frRgSbE8OI7o"
              alt="Joyce"
            ></img>
            <div className="profile-section">
              <div className="name">Qiaoyi Liu</div>

              <div className="git-in">
                <a href="https://github.com/dalishuishou668" target="popup">
                  <i className="fa-brands fa-github"></i>
                </a>
                <a href="https://www.linkedin.com/in/qiaoyi-joyce-liu-623204241/" target="popup">
                  <i className="fa-brands fa-linkedin-in"></i>
                </a>
                <a href="">
                  <i className="fa-solid fa-envelope"></i>
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
