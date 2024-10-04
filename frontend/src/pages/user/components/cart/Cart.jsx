import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Table, Button, Modal, Form } from "react-bootstrap";
import axios from "axios";
import config from "../../../../config";
import "./cart.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTimes, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import Alert from "../../../../Alert";

function Cart({ navigation }) {
  const user = useSelector((state) => state.user.value);
  const storeProducts = useSelector((state) => state.products.value);
  const [cartItems, setCartItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [modalData, setModalData] = useState({
    userId: "",
    productId: "",
    cartId: "",
    size: "",
    quantity: 1,
    name: "",
    sizeOptions: [],
  });
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get(`${config.serverUrl}/users/getcart`, {
          params: { username: user.name },
        });
        setCartItems(response.data.msg || []);
        localStorage.setItem("cart", JSON.stringify(response.data.msg || []));
      } catch (error) {
        setErrorMsg('Internal server error.. Please try again later!');
      }
    };
    fetchCartItems();
  }, [user.name]);

  const handleRemoveFromCart = async (productId) => {
    try {
      const response = await axios.put(
        `${config.serverUrl}/users/removefromcart`,
        { userData: { name: user.name }, productData: { productId } }
      );
      if (response.data.success) {
        const updatedCartItems = cartItems.filter(
          (item) => item.productId !== productId
        );
        setCartItems(updatedCartItems);
        localStorage.setItem("cart", JSON.stringify(updatedCartItems));
      }
    } catch (error) {
      setErrorMsg("Internal server error.. Please try again later!");
    }
  };

  const handleUpdateCart = async () => {
    if (!modalData.productId) return;

    try {
      const response = await axios.put(`${config.serverUrl}/users/updatecart`, {
        modalData,
      });
      if (response.data.success) {
        setCartItems((prevItems) => {
          const updatedItems = prevItems.map((item) =>
            item.productId === modalData.productId
              ? { ...item, size: modalData.size, quantity: modalData.quantity }
              : item
          );
          localStorage.setItem("cart", JSON.stringify(updatedItems));
          return updatedItems;
        });
        setShowModal(false);
      } else {
        setErrorMsg('Please try again later!');
      }
    } catch (error) {
      setErrorMsg('Internal server error.. Please try again later!');
    }
  };

  const handleShowModal = (product) => {
    const foundProduct = storeProducts.find((p) => p._id === product.productId);
    if (foundProduct) {
      setSelectedProduct(foundProduct);
      setModalData({
        userId: user.userId,
        productId: product.productId,
        cartId: product._id,
        size: product.size,
        quantity: product.quantity,
        name: product.name,
        sizeOptions: foundProduct.sizes.map((size) => size.size),
      });
      setShowModal(true);
    }
  };

  const handleCloseModal = () => setShowModal(false);

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
        setIsFetching(false);
        setShowSuccessModal(true);
        setCartItems([]);
        localStorage.setItem("cart", JSON.stringify([]));
        setShowConfirmationModal(false);
      } else {
        setIsFetching(false);
        setErrorMsg('Please try again later!');
      }
    } catch (error) {
      setIsFetching(false);
      setErrorMsg('Internal server error.. Please try again later!');
    }
  };

  return (
    <div className="cartComponentContainer p-3 text-center">
      <h3 className="text-success p-2">
        <h1 className="raleway-title">Cart Products</h1>
      </h3>
      {cartItems.length > 0 ? (
        <div className="overflow-x-auto productsTableContainer">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Size</th>
                <th>Quantity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.productId}>
                  <td>{item.name}</td>
                  <td>{item.size}</td>
                  <td>{item.quantity}</td>
                  <td className="letters">
                    <Button
                      variant="secondary"
                      onClick={() => handleShowModal(item)}
                    >
                      Update
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleRemoveFromCart(item.productId)}
                      className="ml-2 mt-auto addToCartButton"
                    >
                      Remove from Cart
                    </Button>
                  </td>
                  <td className="icons">
                    <Button
                      variant="secondary"
                      onClick={() => handleShowModal(item)}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleRemoveFromCart(item.productId)}
                      className="ml-2 mt-auto addToCartButton"
                    >
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      ) : (
        <h6 className="p-5">No products added to Cart</h6>
      )}
      {cartItems.length > 0 ? (
        <Button
          variant="primary"
          className="text-center"
          onClick={() => setShowConfirmationModal(true)}
        >
          Place Order
        </Button>
      ) : (
        <Button
          variant="secondary"
          className="text-center"
          onClick={() => navigation("products")}
        >
          Go to products page
        </Button>
      )}

      <Modal
        show={showConfirmationModal}
        onHide={() => setShowConfirmationModal(false)}
      >
        <Modal.Header>
          <Modal.Title>Confirm Order</Modal.Title>
          <Button
            variant="link"
            onClick={() => setShowConfirmationModal(false)}
            style={{ border: "none", background: "transparent" }}
          >
            <FontAwesomeIcon icon={faTimes} />
          </Button>
        </Modal.Header>
        <Modal.Body>Are you sure you want to place this order?</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowConfirmationModal(false)}
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

      {selectedProduct && (
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header>
            <Modal.Title>Edit Product</Modal.Title>
            <Button
              variant="link"
              onClick={handleCloseModal}
              style={{ border: "none", background: "transparent" }}
            >
              <FontAwesomeIcon icon={faTimes} />
            </Button>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formProductName">
                <Form.Label
                  style={{
                    marginTop: "0px",
                  }}
                >
                  Product Name
                </Form.Label>
                <Form.Control
                  type="text"
                  value={modalData.name}
                  readOnly
                  style={{
                    marginTop: "0px",
                  }}
                />
              </Form.Group>
              <Form.Group controlId="formSize">
                <Form.Label
                  style={{
                    marginTop: "10px",
                  }}
                >
                  Size
                </Form.Label>
                <Form.Control
                  as="select"
                  value={modalData.size}
                  style={{
                    marginTop: "0px",
                  }}
                  onChange={(e) =>
                    setModalData((prev) => ({ ...prev, size: e.target.value }))
                  }
                >
                  {modalData.sizeOptions.map((size, index) => (
                    <option key={index} value={size}>
                      {size}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="formQuantity">
                <Form.Label
                  style={{
                    marginTop: "10px",
                  }}
                >
                  Quantity
                </Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  style={{
                    marginTop: "0px",
                  }}
                  value={modalData.quantity}
                  onChange={(e) =>
                    setModalData((prev) => ({
                      ...prev,
                      quantity: parseInt(e.target.value, 10),
                    }))
                  }
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleUpdateCart}>
              Update
            </Button>
          </Modal.Footer>
        </Modal>
      )}
            <Alert errorMsg={errorMsg} setErrorMsg={setErrorMsg} />
    </div>
  );
}

export default Cart;
