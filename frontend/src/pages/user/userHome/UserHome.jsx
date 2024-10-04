import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar/Navbar";
import Products from "../components/products/Products";
import Cart from "../components/cart/Cart";
import OrderHistory from "../components/orderHistory/OrderHistory";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import config from "../../../config";
import { setProducts } from "../../../features/poducts";
import Footer from "../components/footer/Footer";
import "./UserHome.css";
import Alert from "../../../Alert";
import { Helmet } from "react-helmet";

function UserHome() {
  const user = useSelector((state) => state.user.value);
  const dispatch = useDispatch();

  const [navItemClicked, setNavItemClicked] = useState({
    products: false,
    cart: false,
    orderhistory: false,
    logout: false,
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [isFetching, setIsFetching] = useState(false);

  const handleNavItemClicked = (item) => {
    setNavItemClicked({
      products: item === "products",
      cart: item === "cart",
      orderhistory: item === "orderhistory",
      logout: item === "logout",
    });
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `${config.serverUrl}/products/getallproduct`
      );

      if (response.data.success) {
        const products = response.data.msg;
        const cart = JSON.parse(localStorage.getItem("cart"));

        const updatedProducts = products.map((product) => {
          // Find the cart item corresponding to this product
          const cartItem = cart?.find((item) => item.productId === product._id);

          // If the cart item exists, find the corresponding size and price
          const selectedSize = cartItem ? cartItem.size : product.sizes[0].size;
          const selectedPrice =
            product.sizes.find((size) => size.size === selectedSize)?.price ||
            0;

          return {
            ...product,
            selectedSize: selectedSize,
            quantity: cartItem ? cartItem.quantity : 1,
            price: selectedPrice,
            isAddedToCart: !!cartItem,
          };
        });

        dispatch(setProducts(updatedProducts));
      }
    } catch (error) {
      setErrorMsg("Internal server error.. Please try again later!");
    }
  };

  useEffect(() => {
    fetchProducts();
    setNavItemClicked({
      ...navItemClicked,
      products: true,
    });
  }, []);

  useEffect(() => {
    setIsFetching(true);
    if (navItemClicked.logout) {
      const userData = {
        userId: "",
        userType: "",
        name: "",
        phoneNumber: "",
        cartProducts: [],
        purchaseHistory: [],
        token: "",
      };
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("cart", JSON.stringify([]));
      localStorage.setItem("orders", JSON.stringify([]));
    }
    setIsFetching(false);
  }, [navItemClicked]);

  return (
    <>
      <Helmet>
        <title>Vruksh Store - Home</title>
        <meta
          name="description"
          content="Welcome to Vruksh Store, your one-stop shop for all your grocery needs."
        />
        <meta name="keywords" content="groceries, Vruksh Store" />
        <meta property="og:title" content="Vruksh Store - Home" />
        <meta
          property="og:description"
          content="Welcome to Vruksh Store, your one-stop shop for all your grocery needs  and more!"
        />
        <meta property="og:image" content="/path/to/your/image.jpg" />
        <script type="application/ld+json">
          {`
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Vruksh Store",
        "url": "https://www.vrukshstore.vercel.com",
        "description": "Find groceries, and more at Vruksh Store."
      }
    `}
        </script>
      </Helmet>

      <div className="userHomeContainer">
        <div className="userHomeNavbar">
          <Navbar handleClick={handleNavItemClicked} />
        </div>
        {/* <div className="userHomeBody">
          {navItemClicked.products && <div className="userHomeProducts"> <Products /></div>}
          {navItemClicked.cart && <div className="userHomeCart"> <Cart navigation={handleNavItemClicked} /></div>}
          {navItemClicked.orderhistory && <div className="userHomeOrderHistory"> <OrderHistory navigation={handleNavItemClicked} /></div>}
        </div> */}
        <div className="userHomeBody">
          {navItemClicked.products && (
            <section className="userHomeProducts">
              <Products navigation={handleNavItemClicked} />
            </section>
          )}
          {navItemClicked.cart && (
            <section className="userHomeCart">
              <Cart navigation={handleNavItemClicked} />
            </section>
          )}
          {navItemClicked.orderhistory && (
            <section className="userHomeOrderHistory">
              <OrderHistory navigation={handleNavItemClicked} />
            </section>
          )}
        </div>
        <div className="userHomeFooter">
          <Footer />
        </div>
        <Alert errorMsg={errorMsg} setErrorMsg={setErrorMsg} />
        {isFetching && (
          <div className="spinner-container">
            <div
              className="spinner-border"
              role="status"
              style={{ color: "black" }}
            >
              <span className="visually-hidden"></span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default UserHome;
