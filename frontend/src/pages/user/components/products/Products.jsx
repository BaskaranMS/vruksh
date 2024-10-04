import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Button, Form, Spinner, Modal } from "react-bootstrap";
import { addCartToLocalStorage } from "../../../../features/poducts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretDown,
  faShoppingCart,
  faTimes,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import config from "../../../../config";
import "./Products.css";
import Alert from "../../../../Alert";
import { Helmet } from "react-helmet";

function Products({ navigation }) {
  const storeProducts = useSelector((state) => state.products.value);
  const user = useSelector((state) => state.user.value);

  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [newProductClicked, setNewProductClicked] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    sizes: [{ size: "", price: null }],
    unit: "",
    category: "customer requested",
    startOfMonth: null,
    endOfMonth: null,
  });
  const [cartFunctionIndex, setCartFunctionIndex] = useState(null);
  const [addToCartLoading, setAddCartLoading] = useState(false);
  const [addProductLoading, setAddProductLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  //update 1
  const [placeOrderModalShow, setPlaceOrderModalShow] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [isCartFetching, setIsCartFetching] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  //update 1
  const getCartProducts = async () => {
    setIsCartFetching(true);
    try {
      const response = await axios.get(`${config.serverUrl}/users/getcart`, {
        params: { username: user.name },
      });
      setCartItems(response.data.msg || []);
      console.log(response);
      console.log("update 1 cart Items : ", cartItems);
      localStorage.setItem("cart", JSON.stringify(response.data.msg || []));
    } catch (error) {
      setErrorMsg("Internal server error.. Please try again later!");
    } finally {
      setIsCartFetching(false);
    }
  };

  //update 1
  const handlePlaceOrder = async () => {
    setIsFetching(true);
    try {
      const response = await axios.post(
        `${config.serverUrl}/orders/placeOrder`,
        {
          userId: user.userId,
          products: cartItems,
        }
      );
      if (response.data.success) {
        setCartItems([]);
        setShowSuccessModal(true);
        setShowConfirmationModal(false);
        localStorage.setItem("cart", JSON.stringify([]));
      } else {
        setShowConfirmationModal(false);
        setErrorMsg("Please try again later!");
      }
    } catch (error) {
      setShowConfirmationModal(false);
      setErrorMsg("Internal server error.. Please try again later");
    }
  };

  const unitOptions = ["PACKET", "L", "G", "KG", "ML"];

  const dispatch = useDispatch();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${config.serverUrl}/products/getallproduct`
      );
      if (response.data.success) {
        const products = response.data.msg;
        const cart = JSON.parse(localStorage.getItem("cart")) || [];

        const updatedProducts = products.map((product) => {
          const cartItem = cart.find((item) => item.productId === product._id);
          return {
            ...product,
            selectedSize: cartItem ? cartItem.size : product.sizes[0].size, // Updated for new structure
            quantity: cartItem ? cartItem.quantity : 1,
            isAddedToCart: !!cartItem,
          };
        });

        setProducts(updatedProducts);

        const uniqueCategories = new Set([
          "All",
          ...products.map((product) => product.category),
        ]);
        setCategories([...uniqueCategories]);

        dispatch(setProducts(updatedProducts));

        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      // setErrorMsg('Internal server error.. Please try again later!')
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [dispatch]);

  const handleQuantityChange = (productId, change) => {
    const updatedProducts = products.map((product) => {
      if (product._id === productId && !product.isAddedToCart) {
        const newQuantity = Math.max(1, (product.quantity || 1) + change);
        return {
          ...product,
          quantity: newQuantity,
        };
      }
      return product;
    });
    setProducts(updatedProducts);
  };

  const handleAddToCart = async (product, index) => {
    setCartFunctionIndex(index);
    setAddCartLoading(true);
    const userData = { name: user.name };
    const productData = {
      productId: product._id,
      name: product.name,
      size: product.selectedSize,
      price: product.price,
      quantity: product.quantity,
    };
    1;
    try {
      const response = await axios.put(`${config.serverUrl}/users/addtocart`, {
        userData,
        productData,
      });
      if (response.data.success) {
        const updatedProducts = products.map((p) =>
          p._id === product._id ? { ...p, isAddedToCart: true } : p
        );
        dispatch(addCartToLocalStorage(productData));
        setProducts(updatedProducts);
      }
    } catch (error) {
      setErrorMsg(
        "An error occured while adding to cart.. Please try again later!"
      );
    } finally {
      setCartFunctionIndex(null);
      setAddCartLoading(false);
    }
  };

  const handleRemoveFromCart = async (product, index) => {
    setCartFunctionIndex(index);
    setAddCartLoading(true);
    const userData = { name: user.name };
    const productData = { productId: product._id };

    try {
      const response = await axios.put(
        `${config.serverUrl}/users/removefromcart`,
        { userData, productData }
      );
      if (response.data.success) {
        let browserCart = JSON.parse(localStorage.getItem("cart")) || [];
        browserCart = browserCart.filter(
          (item) => item.productId !== product._id
        );
        localStorage.setItem("cart", JSON.stringify(browserCart));

        const updatedProducts = products.map((p) =>
          p._id === product._id ? { ...p, isAddedToCart: false } : p
        );
        setProducts(updatedProducts);
      }
    } catch (error) {
      setErrorMsg(
        "An error occured while adding to cart.. Please try again later!"
      );
    } finally {
      setCartFunctionIndex(null);
      setAddCartLoading(false);
    }
  };

  const handleSizeChange = (productId, size) => {
    const updatedProducts = products.map((product) => {
      if (product._id === productId) {
        return {
          ...product,
          selectedSize: size,
        };
      }
      return product;
    });
    setProducts(updatedProducts);
  };

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (
        a.category === "customer requested" &&
        b.category === "customer requested"
      ) {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (a.category === "customer requested") return -1;
      if (b.category === "customer requested") return 1;
      if (a.name.toLowerCase() === "sakthi turmaric powder") return -1;
      if (b.name.toLowerCase() === "sakthi turmaric powder") return 1;

      const filteredCategories = categories.filter((category) => {
        category !== "Pulses" &&
          category !== "Spices" &&
          category !== "Edible Oil" &&
          category !== "Flours" &&
          category !== "Groceries";
      });
      const categoryOrder = [
        "Pulses",
        "Spices",
        "Edible Oil",
        "Flours",
        "Groceries",
        ...filteredCategories,
      ];
      const indexA = categoryOrder.indexOf(a.category);
      const indexB = categoryOrder.indexOf(b.category);

      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      } else if (indexA !== -1) {
        return -1;
      } else if (indexB !== -1) {
        return 1;
      } else {
        return a.category.localeCompare(b.category);
      }
    });

  const handleNewProductClosed = () => setNewProductClicked(false);

  const handleAddNewProduct = async () => {
    setAddProductLoading(true);
    try {
      const productToSend = {
        ...newProduct,
        sizes: newProduct.sizes.map((sizeObj) => ({
          ...sizeObj,
          price: null,
        })),
      };

      const response = await axios.post(
        `${config.serverUrl}/products/createproduct`,
        productToSend
      );
      if (response.data.success) {
        fetchProducts();
      }
    } catch (error) {
      setErrorMsg("Error adding new product.. Please try again later!");
    } finally {
      setAddProductLoading(false);
      setNewProductClicked(false);
      setNewProduct({
        name: "",
        sizes: [{ size: "", price: null }],
        unit: "",
        category: "customer requested",
        startOfMonth: null,
        endOfMonth: null,
      });
    }
  };

  const handleSizePriceChange = (index, field, value) => {
    const updatedSizes = [...newProduct.sizes];

    // Convert price to number without changing its value
    updatedSizes[index] = {
      ...updatedSizes[index],
      [field]: field === "price" ? String(value) : String(value),
    };

    setNewProduct({
      ...newProduct,
      sizes: updatedSizes,
      startOfMonth: localStorage.getItem("startDate"),
      endOfMonth: localStorage.getItem("endDate"),
    });
  };

  const handlePlaceOrderModalClose = () => {
    setPlaceOrderModalShow(false);
  };

  const handlePlaceOrderModalShow = () => {
    getCartProducts();
    setPlaceOrderModalShow(true);
  };

  return (
    <div className="productsComponentContainer p-3">
      <div className="userHomeHeader text-center mt-4">
        <h3>
          <b>Welcome, </b>
          <span className="capitalize">{user.name}</span>
        </h3>
      </div>
      <h1 className="text-center pb-4 mt-2 raleway-title">
        Vruksh Store Products
      </h1>
      <Form className="productsTop">
        <Form.Control
          type="text"
          placeholder="Search for products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
          className="productsSearch"
        />
        <Form.Group className="productsCategory">
          <Form.Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="All">
              All Categories <FontAwesomeIcon icon={faCaretDown} />
            </option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      </Form>
      <Helmet>
        <title>Products - Vruksh Store</title>
        <meta
          name="description"
          content="Browse our range of products. Find categories such as Pulses, Spices, Edible Oils, and more. Shop now to get the best deals!"
        />
        <meta
          name="keywords"
          content="products, shopping, pulses, spices, edible oils, groceries"
        />
      </Helmet>
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <div className="overflow-x-auto productsTableContainer">
          <Table striped bordered hover className="productsTable p-2">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Category</th>
                <th>Size</th>
                <th>Quantity</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product, index) => (
                <tr
                  key={product._id}
                  className={product.isAddedToCart ? "table-success" : ""}
                >
                  <td style={{ minWidth: "150px" }}>{product.name}</td>
                  <td>{product.category}</td>
                  <td>
                    <Form.Group className="sizeProducts">
                      <Form.Select
                        style={{ minWidth: "110px" }}
                        disabled={product.isAddedToCart}
                        value={
                          product.selectedSize
                            ? product.selectedSize
                            : product.sizes[0].size === null
                            ? " "
                            : product.sizes[0].size
                        }
                        onChange={(e) =>
                          handleSizeChange(product._id, e.target.value)
                        }
                      >
                        {product.sizes.map((size, index) => (
                          <option key={index} value={size.size}>
                            {size.size === null ? "" : size.size}{" "}
                            <FontAwesomeIcon icon={faCaretDown} />
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </td>
                  <td>
                    <div className="quantity-controls">
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => handleQuantityChange(product._id, -1)}
                        disabled={product.isAddedToCart}
                      >
                        -
                      </Button>
                      <Form.Control
                        type="number"
                        value={product.quantity || 1}
                        min={1}
                        className="mx-2 quantity"
                        style={{
                          width: "60px",
                          marginTop: "0px",
                          textAlign: "center",
                        }}
                        readOnly
                      />
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => handleQuantityChange(product._id, 1)}
                        disabled={product.isAddedToCart}
                      >
                        +
                      </Button>
                    </div>
                  </td>
                  <td className="letters">
                    {product.isAddedToCart ? (
                      <Button
                        variant="danger"
                        onClick={() => handleRemoveFromCart(product, index)}
                        style={{ width: "auto" }}
                      >
                        {addToCartLoading && cartFunctionIndex === index ? (
                          <div className="text-center">
                            <Spinner animation="border" variant="primary" />
                          </div>
                        ) : (
                          "Remove from Cart"
                        )}
                      </Button>
                    ) : (
                      <Button
                        variant="primary"
                        onClick={() => handleAddToCart(product, index)}
                        style={{ width: "auto" }}
                      >
                        {addToCartLoading && cartFunctionIndex === index ? (
                          <div className="text-center">
                            <Spinner animation="border" variant="primary" />
                          </div>
                        ) : (
                          "Add to Cart"
                        )}
                      </Button>
                    )}
                  </td>
                  <td className="icons">
                    {product.isAddedToCart ? (
                      <Button
                        variant="danger"
                        onClick={() => handleRemoveFromCart(product, index)}
                        style={{ width: "auto" }}
                      >
                        {addToCartLoading && cartFunctionIndex === index ? (
                          <div className="text-center">
                            <Spinner animation="border" variant="primary" />
                          </div>
                        ) : (
                          <FontAwesomeIcon icon={faTrashAlt} />
                        )}
                      </Button>
                    ) : (
                      <Button
                        variant="primary"
                        onClick={() => handleAddToCart(product, index)}
                        style={{ width: "auto" }}
                      >
                        {addToCartLoading && cartFunctionIndex === index ? (
                          <div className="text-center">
                            <Spinner animation="border" variant="primary" />
                          </div>
                        ) : (
                          <FontAwesomeIcon icon={faShoppingCart} />
                        )}
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <div className="userNewProducts text-center p-3">
            <div className="userNewProductsContainer">
              <h5>
                Can't find the product you want? <b>Add a new product!</b>
              </h5>
              <p>We will get them for you...</p>
              <button
                className="btn btn-dark"
                onClick={() => setNewProductClicked(true)}
              >
                Request New Product
              </button>
            </div>
            <div className="userPlaceOrder">
              <h5 style={{ fontWeight: "700" }}>Ready to place order?</h5>
              <button
                className="btn btn-danger"
                onClick={handlePlaceOrderModalShow}
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      )}

      <Modal show={newProductClicked} onHide={handleNewProductClosed}>
        <Modal.Header>
          <Modal.Title>Add new product</Modal.Title>
          <Button
            variant="link"
            onClick={handleNewProductClosed}
            style={{ border: "none", background: "transparent" }}
          >
            <FontAwesomeIcon icon={faTimes} />
          </Button>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label className="mb-1">Product Name</Form.Label>
              <Form.Control
                style={{ marginTop: "10px", marginBottom: "10px" }}
                type="textarea"
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, name: e.target.value })
                }
                placeholder="Enter product name"
                required
              />
            </Form.Group>

            {/* Iterate over sizes and prices */}
            {newProduct.sizes.map((sizeObj, idx) => (
              <div key={idx}>
                <Form.Group>
                  <Form.Label className="mb-0">Size</Form.Label>
                  <Form.Control
                    style={{ marginTop: "10px", marginBottom: "10px" }}
                    type="text"
                    value={sizeObj.size}
                    onChange={(e) =>
                      handleSizePriceChange(idx, "size", e.target.value)
                    }
                    placeholder="Enter size... Ex : 100g or 250ml or small"
                    required
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label className="mb-0">Price</Form.Label>
                  <Form.Control
                    style={{ marginTop: "10px", marginBottom: "10px" }}
                    disabled={true}
                    type="text"
                    placeholder="price"
                    required
                  />
                </Form.Group>
              </div>
            ))}

            <Form.Group className="mb-3 mt-3">
              <Form.Label>Unit</Form.Label>
              <Form.Select
                value={newProduct.unit}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, unit: e.target.value })
                }
                required
              >
                <option value="">Select unit</option>
                {unitOptions.map((unit, idx) => (
                  <option key={idx} value={unit}>
                    {unit}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="mb-0">Category</Form.Label>
              <Form.Control
                style={{ marginTop: "10px" }}
                type="text"
                disabled={true}
                value={newProduct.category}
              />
            </Form.Group>

            <Button variant="secondary" onClick={handleNewProductClosed}>
              Cancel
            </Button>

            <Button
              variant="danger"
              onClick={handleAddNewProduct}
              type="submit"
              className="ml-2"
              style={{ width: "auto", height: "40px" }}
            >
              {addProductLoading ? (
                <div className="text-center">
                  <Spinner animation="border" variant="primary" />
                </div>
              ) : (
                "Add product"
              )}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      <Alert errorMsg={errorMsg} setErrorMsg={setErrorMsg} />

      <Modal show={placeOrderModalShow} onHide={handlePlaceOrderModalClose}>
        <Modal.Header>
          <Modal.Title>Order Details</Modal.Title>
          <Button
            variant="link"
            onClick={handlePlaceOrderModalClose}
            style={{ border: "none", background: "transparent" }}
          >
            <FontAwesomeIcon icon={faTimes} />
          </Button>
        </Modal.Header>
        <Modal.Body>
          {isCartFetching ? (
            <div className="text-center">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : cartItems?.length > 0 ? (
            <div className="overflow-x-auto ordersTableContainer">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Size</th>
                    <th>Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((product, index) => (
                    <tr key={index}>
                      <td>{product.name}</td>
                      <td>{product.size}</td>
                      <td>{product.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          ) : (
            <div className="noCartItems">
              <h2>No items added to cart</h2>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handlePlaceOrderModalClose}>
            cancel
          </Button>

          <Button
            variant="danger"
            disabled={cartItems?.length < 1}
            onClick={() => {
              setShowConfirmationModal(true);
              setPlaceOrderModalShow(false);
            }}
          >
            Place Order
          </Button>
        </Modal.Footer>
      </Modal>
      {/* are your sure modal */}
      <Modal
        show={showConfirmationModal}
        onHide={() => setShowConfirmationModal(false)}
      >
        <Modal.Header>
          <Modal.Title>Confirm Order</Modal.Title>
          <Button
            variant="link"
            onClick={() => {
              setShowConfirmationModal(false);
              setPlaceOrderModalShow(true);
            }}
            style={{ border: "none", background: "transparent" }}
          >
            <FontAwesomeIcon icon={faTimes} />
          </Button>
        </Modal.Header>
        <Modal.Body>Are you sure you want to place this order?</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShowConfirmationModal(false);
              setPlaceOrderModalShow(true);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handlePlaceOrder}
            disabled={isFetching}
          >
            {isFetching ? (
              <div
                className="spinner-border"
                role="status"
                style={{ color: "white" }}
              >
                <span className="visually-hidden"></span>
              </div>
            ) : (
              "Place Order"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
      {/* confirmation image modal */}
      <Modal
        show={showSuccessModal}
        onHide={() => {
          setShowSuccessModal(false);
          navigation("orderhistory");
        }}
      >
        <Modal.Body>
          <img
            src="/image1.gif"
            alt="Order Placed"
            style={{ width: "100%", height: "auto" }}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Products;
