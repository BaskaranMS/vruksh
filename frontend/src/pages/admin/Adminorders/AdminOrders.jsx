import React, { useEffect, useState } from "react";
import NavbarComponent from "../../../components/AdminNavbar";
import "./AdminOrders.css";
import "../Adminproducts/AdminProducts.css";
import {
  ListGroup,
  Button,
  Modal,
  Spinner,
  Form,
  Table,
} from "react-bootstrap";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as XLSX from "xlsx";
import config from "../../../config";
import Alert from "../../../Alert";
import AdminFooter from "../../../components/adminFooter/AdminFooter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

function AdminOrders() {
  const generatePDF = async () => {
    try {
      const doc = new jsPDF("p", "pt", "a4");
      const input = document.getElementById("orderDetails");
      const canvas = await html2canvas(input);
      const imgData = canvas.toDataURL("image/png");
      const imgWidth = 560;
      const pageHeight = 841.89;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      doc.addImage(imgData, "PNG", 20, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(imgData, "PNG", 20, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      doc.save(
        `Order_${selectedOrder?.username}_${new Date(
          selectedOrder?.orderDate
        ).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })}.pdf`
      );
    } catch (error) {
      setErrorMsg("Error in downloading pdf.. Please try again later!");
    }
  };

  const exportOrderToExcel = (order) => {
    try {
      const worksheetData = [
        ["Order ID", order._id],
        ["User", order.username],
        ["Phone", order.phone],
        ["Status", order.status],
        ["Date", new Date(order.orderDate).toLocaleDateString("en-IN")],
        ["Total Price", order.totalPrice],
        [],
        ["#", "Product Name", "Size", "Quantity", "Price"],
      ];

      order.products.forEach((product, index) => {
        worksheetData.push([
          index + 1,
          product.name,
          product.size,
          product.quantity,
          product.price,
        ]);
      });

      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Order Details");

      XLSX.writeFile(
        workbook,
        `Order_${order.username}_${new Date(order.orderDate).toLocaleDateString(
          "en-IN",
          {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }
        )}.xlsx`
      );
    } catch (error) {
      setErrorMsg("Error in downloading Excel file... Please try again later!");
    }
  };

  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [showMarkDelivered, setShowMarkDelivered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [ordersByMonth, setOrdersByMonth] = useState({});
  const [months, setMonths] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetchOrders();
  }, [selectedDate]);

  useEffect(() => {
    const today = new Date();
    const currentMonthKey = `${today.getFullYear()}-${today.getMonth() + 1}`;
    const initialPage = months.indexOf(currentMonthKey);
    if (initialPage >= 0) {
      setCurrentPage(initialPage);
    }
  }, [months]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        `${config.serverUrl}/orders/getAllOrder`
      );

      let fetchedOrders = response.data.msg;

      if (selectedDate) {
        fetchedOrders = fetchedOrders.filter((order) => {
          const orderDate = new Date(order.orderDate);
          return orderDate.toDateString() === selectedDate.toDateString();
        });
      }

      fetchedOrders = fetchedOrders.sort((a, b) => {
        const dateA = new Date(a.orderDate);
        const dateB = new Date(b.orderDate);
        if (dateA < dateB) return -1;
        if (dateA > dateB) return 1;
        if (a.status === "delivered" && b.status !== "delivered") return 1;
        if (a.status !== "delivered" && b.status === "delivered") return -1;
        return 0;
      });

      const groupedOrders = groupOrdersByMonth(fetchedOrders);
      setOrdersByMonth(groupedOrders);
      setMonths(Object.keys(groupedOrders));
    } catch (error) {
      setErrorMsg("Internal Server Error.. Please try again later!");
    } finally {
      setLoading(false);
    }
  };

  const groupOrdersByMonth = (orders) => {
    return orders.reduce((groups, order) => {
      const date = new Date(order.orderDate);
      const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(order);
      return groups;
    }, {});
  };

  const formatMonthName = (monthKey) => {
    const [year, month] = monthKey.split("-");
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return `${monthNames[parseInt(month, 10) - 1]} ${year}`;
  };

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const handleCloseOrderDetails = () => {
    setShowOrderDetails(false);
    setSelectedOrder(null);
  };

  const handleMarkAsDeliveredClick = () => {
    setShowMarkDelivered(true);
  };

  const handleCloseMarkDelivered = () => {
    setShowMarkDelivered(false);
  };

  const handleMarkAsDelivered = async () => {
    try {
      await axios.put(`${config.serverUrl}/orders/updateOrder`, {
        _id: selectedOrder._id,
      });
      fetchOrders();
      handleCloseMarkDelivered();
      handleCloseOrderDetails();
    } catch (error) {
      setErrorMsg("Internal Server error.. Please try again later!");
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleClearFilter = () => {
    setSelectedDate(null);
  };

  const currentOrders = ordersByMonth[months[currentPage]] || [];

  const handleOrderEdit = async (order) => {
    console.log("order edit is clicked : ", order);
  };

  const handleOrderDelete = async (order) => {
    try {
      setLoading(true);
      console.log(order);
      const response = await axios.delete(
        `${config.serverUrl}/orders/deleteOrder/${order._id}`
      );
      fetchOrders();
      console.log("order is deleted successfully : ", response);
    } catch (error) {
      console.log("error in deleting order...", error);
      setErrorMsg("Internal Server error.. Please try again later!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavbarComponent />
      <div style={{ minHeight: "80vh" }}>
        <h1 className="admin raleway-title">Recent Orders</h1>
        <div className="container mt-4">
          <div className="d-flex justify-content-between mb-3">
            <Form.Group controlId="sortOrder">
              <div className="d-flex align-items-end">
                <DatePicker
                  selected={selectedDate}
                  placeholderText="Filter orders by Date"
                  onChange={(date) => setSelectedDate(date)}
                  dateFormat="dd/MM/yyyy"
                  className="form-control cu"
                />
                <Button
                  variant="dark"
                  onClick={handleClearFilter}
                  style={{ marginLeft: "10px" }}
                >
                  Clear Filter
                </Button>
              </div>
            </Form.Group>
          </div>

          {loading ? (
            <div className="text-center">
              <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
              </Spinner>
            </div>
          ) : (
            <>
              {currentOrders.length === 0 ? (
                <div className="text-center mt-4">No orders available</div>
              ) : (
                <>
                  <ListGroup>
                    {currentOrders.map((order) => (
                      <ListGroup.Item
                        key={order._id}
                        action
                        style={{
                          backgroundColor:
                            order.status === "delivered" ? "#d4edda" : "",
                          marginBottom: "5px",
                        }}
                      >
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <strong>Order ID:</strong> {order._id} <br />
                            <strong>Status:</strong> {order.status} <br />
                            <strong>User:</strong> {order.username} <br />
                            <strong>Date:</strong>{" "}
                            {new Date(order.orderDate).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              }
                            )}
                            <br />
                            <strong>Total Price</strong>{" "}
                            {order.totalPrice
                              ? order.totalPrice.toFixed(2)
                              : "Not Assigned"}
                          </div>
                          <div className="ordersButtons">
                            <Button
                              variant="primary"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOrderClick(order);
                              }}
                              className="me-2"
                            >
                              View Details
                            </Button>
                            <Button
                              variant="success"
                              className="me-2"
                              onClick={(e) => {
                                handleOrderEdit(order);
                              }}
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </Button>
                            <Button
                              variant="danger"
                              className="me-2"
                              onClick={(e) => {
                                handleOrderDelete(order);
                              }}
                            >
                              <FontAwesomeIcon icon={faTrashAlt} />
                            </Button>
                          </div>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                  <div className="d-flex justify-content-center mt-3">
                    <Button
                      variant="outline-primary"
                      disabled={currentPage === 0}
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      Previous
                    </Button>
                    <span className="mx-3 align-self-center">
                      {formatMonthName(months[currentPage])}
                    </span>
                    <Button
                      variant="outline-primary"
                      disabled={currentPage === months.length - 1}
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </>
              )}
            </>
          )}

          <Modal
            show={showOrderDetails}
            onHide={handleCloseOrderDetails}
            size="lg"
          >
            <Modal.Header closeButton>
              <Modal.Title>Order Details</Modal.Title>
            </Modal.Header>
            <Modal.Body id="orderDetails">
              {selectedOrder && (
                <div>
                  <p>
                    <strong>Order ID:</strong> {selectedOrder._id}
                  </p>
                  <p>
                    <strong>User:</strong> {selectedOrder.username}
                  </p>
                  <p>
                    <strong>Phone:</strong> {selectedOrder.phone}
                  </p>
                  <p>
                    <strong>Status:</strong> {selectedOrder.status}
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(selectedOrder.orderDate).toLocaleDateString(
                      "en-IN",
                      {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      }
                    )}
                  </p>
                  <p>
                    <strong>Total Price:</strong>{" "}
                    {selectedOrder.totalPrice
                      ? selectedOrder.totalPrice.toFixed(2)
                      : "Not Assigned"}
                  </p>

                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Product Name</th>
                        <th>Size</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Total Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.products.map((product, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{product.name}</td>
                          <td>{product.size}</td>
                          <td>{product.quantity}</td>
                          <td>{product.price || "NA"}</td>
                          <td>
                            {product.price
                              ? parseFloat(product.quantity) *
                                parseFloat(product.price)
                              : "NA"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan="5" className="text-right">
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
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="success"
                onClick={handleMarkAsDelivered}
                disabled={selectedOrder && selectedOrder.status === "delivered"}
              >
                Mark as Delivered
              </Button>
              <Button variant="secondary" onClick={generatePDF}>
                Download PDF
              </Button>
              <Button
                variant="secondary"
                onClick={() => exportOrderToExcel(selectedOrder)}
              >
                Export to Excel
              </Button>
              <Button variant="secondary" onClick={handleCloseOrderDetails}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
      <Alert errorMsg={errorMsg} setErrorMsg={setErrorMsg} />
      <AdminFooter />
    </>
  );
}

export default AdminOrders;
