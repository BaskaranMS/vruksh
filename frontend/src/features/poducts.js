import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
    name : 'products',
    initialState : {
        value : []
    },
    reducers : {
        setProducts : ( state, action ) => {
            state.value = action.payload;
        },
        addCartToLocalStorage : ( state, action ) => {
            const newProduct = action.payload;
            let browserCart = JSON.parse(localStorage.getItem('cart')) || [];
            
            const existingProductIndex = browserCart.findIndex(p => p.productId === newProduct.productId);
            if (existingProductIndex > -1) {
                browserCart[existingProductIndex] = newProduct;
            } else {
                browserCart.push(newProduct);
            }

            localStorage.setItem('cart', JSON.stringify(browserCart));
        }
    }
});

export const { setProducts, addCartToLocalStorage } = productSlice.actions;
export default productSlice.reducer;