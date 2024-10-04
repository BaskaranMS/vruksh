import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Modal } from "react-bootstrap";
import { formatDistanceToNow } from "date-fns";
import { useSelector } from "react-redux";
import config from "../../../../config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import "./OrderHistory.css";
import Alert from "../../../../Alert";

function OrderHistory({ navigation }) {
  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [isFetching, setIsFetching] = useState(false);

  const user = useSelector((state) => state.user.value.userId);

  useEffect(() => {
    setIsFetching(true);
    const fetchOrders = async () => {
      const userId = user;
      try {
        const response = await axios.get(
          `${config.serverUrl}/orders/getuserorders`,
          { params: { userId } }
        );
        setOrders(response.data.msg.orders);
      } catch (error) {
        setErrorMsg("Internal server errror.. Please try again later!");
      } finally {
        setIsFetching(false);
      }
    };

    fetchOrders();
  }, []);

  const handleShowModal = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  return (
    <div className="order-history overflow-x-auto ordersTableContainer">
      <h1 className="text-center pb-4  mt-4 raleway-title">Current Order</h1>
      {isFetching ? (
        <div
          className="spinner-border"
          role="status"
          style={{ color: "white" }}
        >
          <span className="visually-hidden"></span>
        </div>
      ) : orders?.length > 0 ? (
        <Table striped bordered hover className="ordersTable">
          <thead>
            <tr>
              <th>SI. No</th>
              <th>Order Date</th>
              <th>Time</th>
              <th>Time Ago</th>
              <th>No of Products</th>
              <th>Total Price</th>
              <th>Status</th>
              <th>View Details</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr
                key={order._id}
                className={order.status === "delivered" && "table-success"}
              >
                <td>{index + 1}</td>
                <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                <td style={{ minWidth: "120px" }}>
                  {new Date(order.orderDate).toLocaleTimeString()}
                </td>
                <td style={{ minWidth: "120px" }}>
                  {formatDistanceToNow(new Date(order.orderDate))} ago
                </td>
                <td>{order.products.length}</td>
                <td>
                  {order.totalPrice ? `₹${order.totalPrice}` : "Not Assigned"}
                </td>
                <td>{order.status}</td>
                <td>
                  <Button
                    variant="primary"
                    onClick={() => handleShowModal(order)}
                  >
                    View Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <div className="noOrdersUser text-center p-5">
          <h3 className="p-5">There are no Current order</h3>
          <Button
            variant="secondary"
            className="text-center"
            onClick={() => navigation("products")}
          >
            Go to products page
          </Button>
        </div>
      )}

      {selectedOrder && (
        <Modal show={showModal} onHide={handleCloseModal} size="lg">
          <Modal.Header>
            <Modal.Title>Order Details</Modal.Title>
            <Button
              variant="link"
              onClick={handleCloseModal}
              style={{ border: "none", background: "transparent" }}
            >
              <FontAwesomeIcon icon={faTimes} />
            </Button>
          </Modal.Header>
          <Modal.Body>
            <div className="overflow-x-auto ordersTableContainer">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Size</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total Price</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.products.map((product, index) => (
                    <tr key={index}>
                      <td>{product.name}</td>
                      <td>{product.size}</td>
                      <td>
                        {product.price ? `₹${product.price}` : "Not Assigned"}
                      </td>
                      <td>{product.quantity}</td>
                      <td>
                        {product.price
                          ? `₹${
                              parseFloat(product.price) *
                              parseFloat(product.quantity)
                            }`
                          : "NA"}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="4" className="text-right">
                      <strong>Total :</strong>
                    </td>
                    <td>
                      <strong>
                        {selectedOrder.totalPrice !== null &&
                        selectedOrder.totalPrice !== undefined
                          ? selectedOrder.totalPrice.toFixed(2)
                          : "Not Assigned"}
                      </strong>
                    </td>
                  </tr>
                </tfoot>
              </Table>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      <Alert errorMsg={errorMsg} setErrorMsg={setErrorMsg} />
    </div>
  );
}

export default OrderHistory;
