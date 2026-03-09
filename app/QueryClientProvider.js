"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CurrencyProvider } from "@/context/CurrencyContext";

const queryClient = new QueryClient();

export function QueryClientProviderWrapper({ children }) {
    return (
        <QueryClientProvider client={queryClient}>
            <CurrencyProvider>
                {children}
            </CurrencyProvider>
        </QueryClientProvider>
    );
}

