import { configureStore } from "@reduxjs/toolkit";
import user from "./features/user";
import products from './features/poducts';

const store = configureStore({
    reducer : {
        user : user,
        products : products
    }
});

export default store;