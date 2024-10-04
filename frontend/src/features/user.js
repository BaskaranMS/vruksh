import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name : 'user',
    initialState : {
        value : {
            userId: '',
            userType : '',
            name : '',
            phoneNumber : '',
            cartProducts : [],
            purchaseHistory : [],
            token : ''
        }
    },
    reducers : {
        createUser : ( state, action ) => {
            localStorage.setItem('user', JSON.stringify(action.payload));
            state.value = action.payload;
        },
    }
});

export const { createUser } = userSlice.actions;
export default userSlice.reducer;
