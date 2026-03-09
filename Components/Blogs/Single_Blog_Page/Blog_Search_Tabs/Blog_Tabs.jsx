"use client";
import { Get_Blog_category, Get_Blog_data } from "@/app/Route/endpoints";
import { useMutation, useQuery } from "@tanstack/react-query";
import moment from "moment";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ReactDOM from "react-dom";
import { useState, useEffect } from "react";
import { Tab } from "react-bootstrap";
import Tabs from "react-bootstrap/Tabs";
import ReactPaginate from "react-paginate";
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import { useRef } from "react";
export default function Blog_Tabs() {
  const blogRef = useRef(null);
  const searchParams = useSearchParams();
  const categorySlugFromUrl = searchParams.get("category");
  const [expandedId, setExpandedId] = useState(null);
  const [activeKey, setActiveKey] = useState("showall"); // default tab

  const { data: categories } = useQuery({
    queryKey: ["blog_category"],
    queryFn: () => Get_Blog_category(),
  });
  const [count, setcount] = useState(1);

  // When landing with ?category=slug, switch to that category tab
  useEffect(() => {
    if (!categorySlugFromUrl || !categories?.data?.length) return;
    const cat = categories.data.find(
      (c) => (c.slug || "").toLowerCase() === categorySlugFromUrl.toLowerCase(),
    );
    if (cat) {
      setActiveKey(String(cat.id));
      setcount(1);
    }
  }, [categorySlugFromUrl, categories?.data]);

  // Convert tab key to categoryId (showall = fetch all)
  const categoryId = activeKey === "showall" ? null : Number(activeKey);

  const { data: blog_data, isLoading } = useQuery({
    queryKey: ["blog_data", categoryId, count],
    queryFn: () => Get_Blog_data(categoryId, count),
    enabled: true,
    keepPreviousData: true,
  });

  console.log(
    blog_data,
    "data,..............",
    categories,
    ".......categories............",
  );

  // (*************************************************************** trim the wortds )
  // Helper: truncate first 30 words
  const truncateWords = (html, limit = 30) => {
    const text = html.replace(/<[^>]*>/g, "");
    const words = text.split(/\s+/).slice(0, limit).join(" ");
    return words + (text.split(/\s+/).length > limit ? "..." : "");
  };
  // ****************************************  pagination ...............................................................

  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    // ReactPaginate gives 0-based index
    const pageNumber = event.selected + 1;
    setcount(pageNumber);
    blogRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };
  // ******************................................ end og pagination ...........................................................
  // **************************************** shmmmer effect
  const BlogShimmerCard = () => {
    return (
      <div className="col-lg-4 mb-10">
        <div className="blog_card_box">
          <div className="blog_card shimmer-wrapper">
            {/* Image */}
            <div className="blog_card_img shimmer-bg shimmer-h-220" />

            {/* Body */}
            <div className="blog_card_body p-3">
              {/* Category + Date */}
              <div className="flex justify-between items-center mb-3">
                <div className="shimmer-line shimmer-90x26" />
                <div className="shimmer-line shimmer-110x16" />
              </div>

              {/* Title */}
              <div className="shimmer-line shimmer-100p-22 mb-2" />
              <div className="shimmer-line shimmer-80p-22 mb-3" />

              {/* Content */}
              <div className="shimmer-line shimmer-100p-14 mb-2" />
              <div className="shimmer-line shimmer-95p-14 mb-2" />
              <div className="shimmer-line shimmer-85p-14 mb-4" />

              {/* Author */}
              <div className="flex items-center gap-2">
                <div className="shimmer-circle" />
                <div className="shimmer-line shimmer-80x14" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const TotalPages = blog_data?.totalPages || 0;

  // **********************************************
  // Helper to get dynamic author name + image
  const getAuthorInfo = (post) => {
    const authorName = post?.yoast_head_json?.author || "JustBuyTravel";

    // Default generic blog avatar
    let authorImage = "/blog/blog_img.webp";

    const name = authorName?.toLowerCase() || "";

    // Specific avatar for Sulagna
    if (name.includes("sulagna")) {
      authorImage = "/blog/Sulagna.webp";
    }
    // Specific avatar for Mike
    else if (name.includes("mike")) {
      authorImage = "/blog/Mike.webp";
    }

    return { authorName, authorImage };
  };

  // For "Show all" tab: use post's first category in URL when available (category/slug instead of blogs/slug)
  const getPostHref = (post) => {
    const catId = post?.categories?.[0];
    const cat = categories?.data?.find((c) => c.id === catId);
    const catSlug = cat?.slug;
    return catSlug ? `/${catSlug}/${post?.slug}` : `/blog/${post?.slug}`;
  };

  const category_name = categories?.data?.map((item, i) => item?.name);

  return (
    <>
      <section className="" ref={blogRef}>
        <div className="container">
          <div className="row justify-center">
            <div className="col-lg-12">
              {/* **************** */}
              <div className="tab_head">
                <Tabs
                  id="controlled-tab-example"
                  activeKey={activeKey}
                  onSelect={(k) => setActiveKey(k)}
                  className="mb-3"
                >
                  {/************************************************************* ************************** show all    */}
                  <Tab eventKey="showall" title="Show All">
                    <div className="row">
                      {isLoading
                        ? Array.from({ length: 6 }).map((_, i) => (
                            <BlogShimmerCard key={i} />
                          ))
                        : blog_data?.posts?.slice(0, 9)?.map((item) => {
                            const rawText =
                              item.excerpt.rendered?.replace(/<[^>]*>/g, "") ||
                              "";
                            const shortText = rawText.slice(0, 120);
                            const isLong = rawText.length > 120;

                            // Find this post's primary category (first in the array)
                            const primaryCatId = item?.categories?.[0];
                            const primaryCat = categories?.data?.find(
                              (c) => c.id === primaryCatId,
                            );
                            const cat_name = primaryCat?.name || "Blog";

                            const { authorName, authorImage } =
                              getAuthorInfo(item);

                            const date_it = item?.date;
                            const formatted =
                              moment(date_it).format("MMMM D, YYYY");
                            // ******************* short title ...............
                            const truncateWords = (text, wordLimit) => {
                              if (!text) return "";

                              const plainText = text.replace(/<[^>]*>/g, ""); // remove HTML
                              const words = plainText.split(/\s+/);

                              if (words.length <= wordLimit) return plainText;

                              return (
                                words.slice(0, wordLimit).join(" ") + "..."
                              );
                            };
                            return (
                              <div className="col-lg-4" key={item.id}>
                                <div className="blog_card_box mb-10">
                                  <div className="blog_card">
                                    {/* ****************************** */}
                                    <div className="blog_card_img">
                                      <img
                                        src={
                                          item?.yoast_head_json?.og_image?.[0]
                                            ?.url
                                        }
                                        alt=""
                                      />
                                    </div>
                                    {/* ****************************** */}
                                    <div className="blog_card_body">
                                      <div className="card_body_blog_time flex justify-between items-center">
                                        <button className="button_bg2 px-3 py-1 bg-dark text-light">
                                          {cat_name}
                                        </button>
                                        <p className="m-0 g_color">
                                          {formatted}
                                        </p>
                                      </div>
                                      {/* ****************************** */}
                                      <div className="blog_card_heading">
                                        <h4 className="m-0">
                                          <Link href={getPostHref(item)}>
                                            {truncateWords(
                                              item?.title?.rendered,
                                              7,
                                            )}
                                          </Link>
                                        </h4>
                                      </div>
                                      {/* ****************************** */}
                                      <div
                                        className="blog_card_content"
                                        dangerouslySetInnerHTML={{
                                          __html:
                                            expandedId === item.id
                                              ? rawText
                                              : shortText +
                                                (isLong ? "..." : ""),
                                        }}
                                      />
                                      <div className="blog_card_user flex items-center gap-2">
                                        <span className="g_color">
                                          <img
                                            src={authorImage}
                                            alt={authorName}
                                            className="rounded-full"
                                            width={24}
                                            height={24}
                                          />
                                        </span>
                                        <span className="g_color capitalize">
                                          {authorName}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                    </div>
                  </Tab>
                  {/* ************************** ********************************************************************************************/}
                  {categories?.data?.map((item, i) => {
                    if (
                      item?.name == "Travel" ||
                      item?.name == "Flight" ||
                      item?.name == "Hotel" ||
                      item?.name == "Travel Tips" ||
                      item?.name == "Adventure" ||
                      item?.name == "Travel News"
                    ) {
                      const cat_name = item?.name;
                      const cat_slug = item?.slug;
                      return (
                        <Tab eventKey={item?.id} title={item?.name} key={i}>
                          <div className="container">
                            <div className="row">
                              {isLoading
                                ? Array.from({ length: 6 }).map((_, i) => (
                                    <BlogShimmerCard key={i} />
                                  ))
                                : blog_data?.posts?.map((post) => {
                                    const date_it = post?.date;
                                    const formatted =
                                      moment(date_it).format("MMMM D, YYYY");

                                    // Get plain text words from excerpt
                                    const text = post.excerpt.rendered
                                      ?.replace(/<[^>]*>/g, "")
                                      .split(" ");
                                    const fullText = text
                                      ?.slice(0, 30)
                                      .join(" "); // first 50 words

                                    const { authorName, authorImage } =
                                      getAuthorInfo(post);
                                    // *************************************
                                    return (
                                      <div className="col-lg-4" key={post.id}>
                                        <div className="blog_card_box mb-10">
                                          <div className="blog_card">
                                            {/* ****************************** */}
                                            <div className="blog_card_img">
                                              <img
                                                src={
                                                  post?.yoast_head_json
                                                    ?.og_image?.[0]?.url
                                                }
                                                alt=""
                                              />
                                            </div>
                                            {/* ****************************** */}
                                            <div className="blog_card_body">
                                              <div className="card_body_blog_time flex justify-between items-center">
                                                <button className="button_bg2 px-3 py-1 bg-dark text-light">
                                                  {cat_name}
                                                </button>
                                                <p className="m-0 g_color">
                                                  {formatted}
                                                </p>
                                              </div>
                                              {/* ****************************** */}
                                              <div className="blog_card_heading">
                                                <h4 className="m-0">
                                                  <Link
                                                    href={
                                                      cat_slug
                                                        ? `/${cat_slug}/${post?.slug}`
                                                        : `/blog/${post?.slug}`
                                                    }
                                                  >
                                                    {post?.title?.rendered}
                                                  </Link>
                                                </h4>
                                              </div>
                                              {/* ****************************** */}
                                              <div
                                                className="blog_card_content "
                                                dangerouslySetInnerHTML={{
                                                  __html:
                                                    fullText +
                                                    (text.length > 30
                                                      ? "..."
                                                      : ""),
                                                }}
                                              />

                                              <div className="blog_card_user flex items-center gap-2">
                                                <span className="g_color">
                                                  <img
                                                    src={authorImage}
                                                    alt={authorName}
                                                    className="rounded-full"
                                                    width={24}
                                                    height={24}
                                                  />
                                                </span>
                                                <span className="g_color capitalize">
                                                  {authorName}
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                            </div>
                          </div>
                        </Tab>
                        // *************************************
                      );
                    }
                  })}
                </Tabs>

                {/* ********************************** yav b more button ........... */}
                <div className="loadmore text-center flex justify-center padding_top  padding_bottom ">
                  {/* <button className="button_bg2" type="button" onClick={() => setcount(count + 1)}>
                    {isLoading ? <p className="m-0">..Loading</p> : <p className="m-0">Load More</p>}
                  </button> */}
                  <div className="pagination_section">
                    <ReactPaginate
                      breakLabel="..."
                      nextLabel={
                        <span className="paginate-icon">
                          <MdOutlineKeyboardArrowRight />
                        </span>
                      }
                      previousLabel={
                        <span className="paginate-icon">
                          <MdOutlineKeyboardArrowLeft />
                        </span>
                      }
                      onPageChange={handlePageClick}
                      pageCount={TotalPages}
                      pageRangeDisplayed={4} // desktop visible range
                      marginPagesDisplayed={1}
                      forcePage={count - 1}
                      containerClassName="pagination"
                      activeClassName="selected"
                      disabledClassName="disabled"
                      pageClassName={isLoading ? "page-loading" : ""}
                    />
                  </div>
                </div>
              </div>
              {/* **************** */}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
