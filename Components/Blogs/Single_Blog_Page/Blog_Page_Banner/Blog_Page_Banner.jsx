import React from "react";
import Blog_Search_Secction from "../Blog_Search_Section/Blog_Search_Secction";
import Blog_Tabs from "../Blog_Search_Tabs/Blog_Tabs";
import Footer from "@/component/Footer";

export default function Blog_Page_Banner() {
  return (
    <>
      <section className="section_home_banner ">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              {/* ********************* */}
              <div className="banner_box home_banner">
                <div className="title text-center">
                  <h1 className="capitalize">
                    Discover the <span> Latest Blog</span>
                  </h1>
                  {/* <h5 className="capitalize">
                    <strong className="g_color"> JustBuyTravel</strong> Your
                    Easy Way to Book Flights and Hotels
                  </h5> */}
                </div>
              </div>
              {/* ********************* */}
            </div>
          </div>
        </div>
      </section>

      <Blog_Search_Secction />
      <Blog_Tabs />
      <Footer />
    </>
  );
}
