import { Suspense, useEffect } from 'react';
import Search from './Search';
import SearchSection from './SearchSection';
import { useDispatch, useSelector } from 'react-redux';
import { resetAction } from '../Redux/Reducer';
import TrySearch from './Search';
import Backup_Search from './Backup_Search';
const BANNER_TITLES = {
    all: <>Smart Travel <span>Planning</span></>,
    flights: <>Smart <span>Flight</span> Deals</>,
    hotels: <>Explore Best <span>Stays</span> </>,
    restaurants: <>Great Places <span>To eat</span></>,
};

const DEFAULT_BANNER_TITLE = <>Smarter <span> Travel Planning </span> for  Hotels <span>&</span> Flights</>;

export default function
    HomeBannerSection() {
    const dispatch = useDispatch()
    const selectAllKey = useSelector((state) => state.user.SelectAll);
    const bannerData = (selectAllKey && BANNER_TITLES[selectAllKey]) || DEFAULT_BANNER_TITLE;
    useEffect(() => {
        dispatch(resetAction());
    }, [dispatch]);
    return (
        <>
            <section className='mp-s mp-e'>
                <div className="section_home_banner rounded-3xl flex items-center">
                    {/* *************************** box title */}
                    <div className="container">
                        <div className="row justify-center">
                            <div className="col-lg-12">
                                <div className="banner_box home_banner">
                                    <div className="title text-center">
                                        <h1 className='capitalize'>
                                            {bannerData}
                                        </h1>
                                        {/* <div className="col-lg-9 m-auto">
                                            <p className='supporting_text'>
                                                Plan trips confidently with verified hotel and flight options from trusted travel partners.
                                            </p>
                                        </div> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* ************************************************ */}
                    {/* ************************ search Box */}
                </div>
            </section>
            {/* <SearchSection /> */}
            <Search />
            {/* <Backup_Search /> */}
            {/* <TrySearch /> */}

        </>

    )
}
