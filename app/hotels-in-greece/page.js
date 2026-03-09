import Header from '@/component/Header'
import Greece_Banner from '@/Components/InnerPages/Greece/Greece_Banner'
import PuntaCana_Banner from '@/Components/InnerPages/Punta-cana/PuntaCana_Banner'
import React, { Suspense } from 'react'



export default function page() {



    return (
        <>


            <Suspense >
                <Header />
                <Greece_Banner />
            </Suspense>
        </>
    )
}
