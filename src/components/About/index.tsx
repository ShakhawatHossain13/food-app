import React from "react";
import Footer from "../Footer";

const About = () => {
  return (
    <>
      <div style={{ height: "100vh" }}>
        <h1
          style={{
            margin: "50px 10px 0",
            textAlign: "center",
            color: "#dc3545",
          }}
        >
          Red Onion
        </h1>
        <p
          style={{
            padding: "10px 15%",
            textAlign: "justify",
          }}
        >
          Since our modest beginnings in 2005 with a little space in Toronto’s
          stylish Yorkville locale, Red Onion ‘s development has been enlivened
          with the energy to cook and serve solid, Indian-roused takeout food.
          In contrast to other Indian eateries, ‘Organization Name’ was made
          with the explicit expectation to appear as something else. We realize
          numerous individuals love Indian sustenance, yet a large number of
          them loathe or are unconscious of the regularly unfortunate fixings
          that make run-of-the-mill Indian nourishment taste so great.
        </p>
        <p
          style={{
            margin: "5px 0 50px 0",
            padding: "10px 15%",
            textAlign: "justify",
          }}
        >
          Our menu highlights things that utilization the sound and fragrant
          flavors, however, forgets the stuffing ghee, spread, oil, and
          overwhelming cream. Red Onion has developed to incorporate four superb
          takeout areas in Toronto with additional to come sooner rather than
          later. Our group takes pride in the way that we can furnish our new
          and faithful clients with extraordinary tasting Indian-roused
          nourishment that is not normal for that at some other Indian eatery
          you visit.
        </p>
      </div>
      <Footer />
    </>
  );
};

export default About;
