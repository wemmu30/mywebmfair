import React from "react";

export const Head = () => {
  return (
    <>
      <section className="head">
        <div className="container d_flex">
          <div className="left-row">
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="icon-flex phone-icon"
            >
              <i className="fa fa-phone"></i>
              <label className="phone-icon" htmlFor="">
                0930194789
              </label>
            </a>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://mail.google.com/mail/u/0/#inbox"
              className="icon-flex phone-icon"
            >
              <i className="fa fa-envelope"></i>
              <label className="phone-icon" htmlFor="">
                Mfairofficial@gmail.com
              </label>
            </a>
          </div>
          <div className="right-row">
            <span>
              <label htmlFor="">M fair</label>
            </span>
          </div>
        </div>
      </section>
    </>
  );
};

export default Head;
