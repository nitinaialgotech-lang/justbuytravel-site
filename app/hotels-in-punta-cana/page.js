import Header from '@/component/Header'
import PuntaCana_Banner from '@/Components/InnerPages/Punta-cana/PuntaCana_Banner'
import React, { Suspense } from 'react'



export default function page() {



    return (
        <>


            <Suspense >
                <Header />
                <PuntaCana_Banner />
            </Suspense>
        </>
    )
}
