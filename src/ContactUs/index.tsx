import React from "react";

const ContactUs = () => {
  const sendEmail = (e: any) => {
    e.preventDefault();
    alert(
      "Your Message has been successfully sent. BJIT admin will contact you Soon."
    );
    e.target.reset();
  };
  return (
    <>
      <h1>
        <span style={{ color: "orange" }}>BJIT Academy</span>
      </h1>

      <h2 style={{ marginTop: "30px" }}>Contact Us</h2>
      <div>
        <form onSubmit={sendEmail}>
          <div className="row pt-5 mx-auto">
            <div className="col-8 form-group mx-auto">
              <input
                type="text"
                className="form-control"
                placeholder="Name"
                name="name"
              />
            </div>
            <div className="col-8 form-group pt-2 mx-auto">
              <input
                type="email"
                className="form-control"
                placeholder="Email Address"
                name="email"
              />
            </div>
            <div className="col-8 form-group pt-2 mx-auto">
              <textarea
                className="form-control"
                id=""
                //   cols="30"
                //   rows="8"
                placeholder="Your message"
                name="message"
              ></textarea>
            </div>
            <div className="col-8 pt-3 mx-auto mb-3">
              <input
                type="submit"
                className="btn btn-info"
                value="Send Message"
              ></input>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default ContactUs;
