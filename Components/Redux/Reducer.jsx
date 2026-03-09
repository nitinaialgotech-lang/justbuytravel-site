
import { createSlice } from '@reduxjs/toolkit'


const initialState = {
    SelectAll: "all",
    searchTriggered: false,
    SearchDetail: {
        lat: "",
        long: "",
        name: ""
    },
    SearchFlight: {
        startfrom: "",
        endto: "",
        startDate: "",
        endDate: "",
    },
    type: 2,
    travelClass: "1",
    passen_count: "1",
    children_count: "0",
    infant_count: "0",
    multi_flight_city: [
        { departure_id: "", arrive_id: "", dateTime: "" }
    ]


}

// *****************************************
const counterSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        SetSelectAll: (state, action) => {
            state.SelectAll = action.payload;
        },
        setLat: (state, action) => {
            state.SearchDetail.lat = action.payload
        },
        setLong: (state, action) => {
            state.SearchDetail.long = action.payload
        },
        nameCity: (state, action) => {
            state.SearchDetail.name = action.payload
        },
        resetSearchFlight: (state) => {
            state.SearchFlight = initialState.SearchFlight;
            state.searchTriggered = false;
        },
        // ********
        SetFlightType: (state, action) => {
            state.type = action.payload
        },
        SetTravelClass: (state, action) => {
            state.travelClass = action.payload
        },
        Setpassen_count: (state, action) => {
            state.passen_count = action.payload
        },
        SetPassengers: (state, action) => {
            const { adults, children = "0", infants = "0" } = action.payload;
            if (adults !== undefined) state.passen_count = String(adults);
            if (children !== undefined) state.children_count = String(children);
            if (infants !== undefined) state.infant_count = String(infants);
        },
        // *******************
        setSearchFlight: (state, action) => {
            if (action.payload.triggerSearch === true) {
                state.searchTriggered = true;
            }
            state.SearchFlight = {
                ...state.SearchFlight,
                startfrom: action.payload.startfrom !== undefined ? action.payload.startfrom : state.SearchFlight.startfrom,
                endto: action.payload.endto !== undefined ? action.payload.endto : state.SearchFlight.endto,
                startDate: action.payload.startDate !== undefined ? action.payload.startDate : state.SearchFlight.startDate,
                endDate: action.payload.endDate !== undefined ? action.payload.endDate : state.SearchFlight.endDate,
            };
            if (action.payload.passen_count !== undefined) {
                state.passen_count = action.payload.passen_count;
            }
            if (action.payload.children_count !== undefined) {
                state.children_count = action.payload.children_count;
            }
            if (action.payload.infant_count !== undefined) {
                state.infant_count = action.payload.infant_count;
            }
            if (action.payload.type !== undefined) {
                state.type = action.payload.type;
            }
            if (action.payload.travelClass !== undefined) {
                state.travelClass = action.payload.travelClass;
            }
        },
        setMultiCity: (state, action) => {
            state.multi_flight_city = action.payload;
        },

        resetAction: () => initialState,
    }
})
export const { SetSelectAll, setLat, setLong, nameCity, setSearchFlight, resetAction, resetSearchFlight, SetFlightType, SetTravelClass, Setpassen_count, SetPassengers, setMultiCity } = counterSlice.actions;
export default counterSlice.reducer
