import Link from 'next/link';
import { usePathname } from 'next/navigation';
import FlightQuickLinks from './FlightQuickLinks';
import HotelQuickLinks from './HotelQuickLinks';
export default function QuickLinks() {
    const route = usePathname();
    return (

        <>
            <section className={`padding_bottom  bg_brown md_padding md_pbtop `} >
                <div className="container  ">
                    <div className="row">
                        {/* <div className="section_title relative m-0 ">
                            <h2 className="m-0 link_title">Quick Links</h2>
                        </div> */}
                        <div className={`col-lg-6`}>
                            {/* ******hotel */}
                            <HotelQuickLinks />


                        </div>
                        {/* ************************** */}
                        <div className={` col-lg-6 `}>
                            {/* **********  flight */}
                            <FlightQuickLinks />
                        </div>
                    </div>
                </div>
            </section>

        </>
    )
}
