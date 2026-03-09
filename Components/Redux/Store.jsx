// import counterSlice from "./Reducer";

// const { configureStore } = require("@reduxjs/toolkit");
// const store = configureStore({
//     reducer: {
//         user: counterSlice
//     }
// })
// export default store;

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import counterSlice from "./Reducer";

const rootReducer = combineReducers({
    user: counterSlice,
});

const persistConfig = {
    key: "user",
    storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // 👈 REQUIRED for redux-persist
        }),
});

export const persistor = persistStore(store);
export default store;
