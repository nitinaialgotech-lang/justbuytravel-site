import Link from "next/link";
import React from "react";
import { CiSearch } from "react-icons/ci";

export default function Blog_Search_Secction() {
  return (
    <>
      <section className="Search_section padding_bottom pb-md-0">
        <div className="container">
          <div className="search_container blog_search_contain">
            <div className="search_container_box  rounded-2xl w-full">
              <div className="search_box_input d-none d-lg-block">
                <form className="px-15 mx-auto">
                  <div className="relative search_box">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none icon_search">
                      <CiSearch />
                    </div>
                    <input
                      type="text"
                      // value={searchContent}
                      //   onChange={(e) => setSearchContent(e.target.value)}
                      className="block w-full bg-neutral-secondary-medium border capitalize border-default-medium text-heading text-sm rounded-base focus:outline-none focus:ring-0 placeholder:text-body "
                      placeholder="Search blog, ebook, webinar, guides etc."
                    />
                    <button
                      type="submit"
                      className="absolute top-2 end-3 bg-brand hover:bg-brand-strong box-border border border-transparent shadow-xs font-medium leading-5 text-xs  focus:outline-none button_bg2 search_full_button_padding"
                    >
                      Search
                    </button>
                  </div>
                </form>
              </div>

              {/* ********************************** on mobile vooiw show form  */}
              <div className="mobile_search_box  d-block d-lg-none">
                <div className="mobole_boxs relative">
                  <form>
                    <input
                      type="text"
                      // value={location}
                      //   onChange={(e) => setSearchContent(e.target.value)}
                      className="block relative w-full bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:outline-none focus:ring-0 placeholder:text-body"
                      placeholder="Places to go, things to do, hotels..."
                    />
                    <div className="absolute start-0 flex items-center ps-4 pointer-events-none icon_search">
                      <CiSearch />
                    </div>
                    <button
                      type="submit"
                      className="  z-10 mt-2  bg-brand hover:bg-brand-strong box-border border border-transparent shadow-xs font-medium leading-5 text-xs  focus:outline-none button_bg2 w-full w-100 "
                    >
                      Search
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
