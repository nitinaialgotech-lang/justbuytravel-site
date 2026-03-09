"use client"
import React from 'react'
import Search from '../HomePage/Search'
import TopHotels from './TopHotels'
import Footer from '@/component/Footer'
import IconicPlaces from './Hotel_IconicPlaces'
import GuideHotel from './GuideHotel'
import Blogs from '../HomePage/Blog/Blogs'
import Book_Hotel_Guide_Section from './Book_HotelGuide_Section'
import Book_Hotel_Faq_section from './Book_Hotel_Faq_section'
import Trust_Guide_Section from '../Aboutus/Trust_Guide_Section'
import { useSelector } from 'react-redux'
import Recomended from '../HomePage/RecommendedSection/Recomended'
import ExperienceExploreSection from '../HomePage/ExpereinceExploreSection/ExperienceExploreSection'

const BANNER_TITLES = {
  all: <>Smart Travel <span>Planning</span></>,
  flights: <>Smart <span>Flight</span> Deals</>,
  hotels: <>Explore Best <span>Stays</span> </>,
  restaurants: <>Great Places <span>To eat</span></>,
}

const DEFAULT_BANNER_TITLE = <>Compare &  <span>Book Hotels</span> Online </>

export default function BookHotels_Banner() {
  const selectAllKey = useSelector((state) => state.user.SelectAll)
  const bannerData = (selectAllKey && BANNER_TITLES[selectAllKey]) || DEFAULT_BANNER_TITLE

  return (
    <>
      <section>
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="book_hotel_banner_section book-flight-title">
                <div className="banner_box home_banner">
                  <div className="title text-center">
                    <h1 className='capitalize'>
                      {DEFAULT_BANNER_TITLE}
                    </h1>
                    <p className='capitalize'>
                      {/* Compare hotel prices, <strong className=''> find the best deals,</strong> and book hotels online securely with trusted travel platforms. */}
                      Find great hotel deals, explore trusted options, and book hotels online with ease.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Search />
      <Recomended />
      {/* <TopHotels /> */}
      {/* <IconicPlaces /> */}
      <GuideHotel />
      <ExperienceExploreSection />
      {/* <Trust_Guide_Section /> */}
      <Book_Hotel_Guide_Section />
      <Blogs />
      <Book_Hotel_Faq_section />


      <Footer />


    </>
  )
}
