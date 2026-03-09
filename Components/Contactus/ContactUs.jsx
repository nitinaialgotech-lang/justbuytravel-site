import React from "react";
import Contact_Form from "./Contact_Form";
import Contact_Location from "./Contact_Location";

export default function ContactUs() {
  return (
    <>
      <section className="contact_us_section padding_top padding_bottom">
        <div className="container">
          <div className="row">
            {/* *************************** */}
            <div className="col-lg-7">
              <div className="contact_form ">
                <div className="contact_form_title">
                  <div className="section_title">
                    <h2 className="uppercase">send us a message</h2>
                  </div>

                  <Contact_Form />
                </div>
              </div>
            </div>
            {/* ****************************** */}

            <div className="col-lg-5">
              <div className="contact_location">
                <Contact_Location />
              </div>
            </div>
            {/* ****************************** */}
          </div>
        </div>
      </section>
    </>
  );
}
