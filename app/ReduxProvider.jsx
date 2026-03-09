"use client";

import { Provider } from "react-redux";

import { QueryClientProviderWrapper } from "./QueryClientProvider";
import { Suspense } from "react";
import RouteChangeLoader from "@/component/RouteChangeLoader";
import store, { persistor } from "@/Components/Redux/Store";
import { PersistGate } from "redux-persist/integration/react";

export default function ReduxProvider({ children }) {
    return <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <QueryClientProviderWrapper>
                <Suspense fallback={null}>
                    <RouteChangeLoader />
                </Suspense>
                {children}
            </QueryClientProviderWrapper>
        </PersistGate>
    </Provider>
}
