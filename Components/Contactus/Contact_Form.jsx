import React from "react";

export default function Contact_Form() {
  return (
    <>
      <div className="form ">
        <form
          action="
        
        "
        >
          <div className="form_input ">
            {/* ************************* */}
            <div className="input">
              <input type="text" placeholder="Your Name here" />
            </div>
            {/* ********************* */}
            <div className="input">
              <input type="text" placeholder="Enter Your Email" />
            </div>
            {/* ********************* */}
            <div className="input">
              <input type="text" placeholder="Phone" />
            </div>
            {/* ********************* */}
            <div className="input">
              <textarea type="text" placeholder="Enter Your Message" rows={6} />
            </div>
            {/* ********************* */}
          </div>
          <div className="button mt-4">
            <button className="button_bg2  rounded-full bg-color-green color_bl">
              Book Now
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
