import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Button,
  Form,
  Table,
  Modal,
  Spinner,
  Pagination,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import NavbarComponent from "../../../components/AdminNavbar";
import "./AdminProducts.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTags, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import config from "../../../config";
import { Navigate, useNavigate } from "react-router-dom";
import Alert from "../../../Alert";
import AdminFooter from "../../../components/adminFooter/AdminFooter";

export function DateModal({ show, handleClose, handleDateSubmit }) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSubmit = () => {
    handleDateSubmit(startDate, endDate);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Select Date Range</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="startDate">
            <Form.Label className="mb-0">Start Date</Form.Label>
            <Form.Control
              style={{ marginTop: "10px", marginBottom: "10px" }}
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="endDate">
            <Form.Label className="mb-0">End Date</Form.Label>
            <Form.Control
              style={{ marginTop: "10px", marginBottom: "10px" }}
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Save Dates
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default function AdminProducts() {
  const navigate = useNavigate();
  const [showDateModal, setShowDateModal] = useState(false);
  const [priceupdate, isPriceUpdate] = useState(false);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    sizes: [{ size: "", price: "" }],
    unit: "",
    category: "",
    startOfMonth: null,
    endOfMonth: null,
  });
  const [editIndex, setEditIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 25;
  const [errorMsg, setErrorMsg] = useState("");

  const unitOptions = ["PACKET", "L", "G", "KG", "ML"];

  const handleShowDateModal = () => setShowDateModal(true);
  const handleCloseDateModal = () => setShowDateModal(false);

  const handleDateSubmit = (startDate, endDate) => {
    const formattedStartDate = new Date(startDate).toISOString();
    const formattedEndDate = new Date(endDate).toISOString();

    localStorage.setItem("startDate", formattedStartDate);
    localStorage.setItem("endDate", formattedEndDate);

    isPriceUpdate(true);
  };

  const fetchProducts = async () => {
    setLoading(true);
    setLoadingText("Loading products...");
    try {
      const response = await axios.get(
        `${config.serverUrl}/products/getallproduct`
      );
      if (response.data.success) {
        setProducts(response.data.msg);
        setFilteredProducts(response.data.msg);
      }
    } catch (error) {
      setErrorMsg("Internal Server Error.. Please try again later!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filtered = products.filter(
      (product) =>
        (searchName
          ? product.name.toLowerCase().includes(searchName.toLowerCase())
          : true) &&
        (searchCategory
          ? product.category
              .toLowerCase()
              .includes(searchCategory.toLowerCase())
          : true)
    );
    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [searchName, searchCategory, products]);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSizePriceChange = (index, field, value) => {
    const updatedSizes = [...newProduct.sizes];

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

  const handleAddSize = () => {
    setNewProduct({
      ...newProduct,
      sizes: [...newProduct.sizes, { size: "", price: "" }],
    });
  };

  const handleShow = () => setShowModal(true);
  const handleClose = () => {
    setShowModal(false);
    setNewProduct({
      name: "",
      sizes: [{ size: "", price: "" }],
      unit: "",
      category: "",
    });
    setEditIndex(null);
  };

  const handleAddProduct = async () => {
    setLoading(true);
    setLoadingText("Adding product...");
    try {
      const productToSend = {
        ...newProduct,
        sizes: newProduct.sizes.map((sizeObj) => ({
          ...sizeObj,
          price: Number(sizeObj.price),
        })),
      };

      const response = await axios.post(
        `${config.serverUrl}/products/createproduct`,
        productToSend
      );

      if (response.data.success) {
        await fetchProducts();
        handleClose();
      } else {
        setErrorMsg("Failed to add product.. Please try again later!");
      }
    } catch (error) {
      setErrorMsg("Failed to adding product.. Please try again later!");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProduct = async () => {
    setLoading(true);
    setLoadingText("Updating product...");
    try {
      const productToUpdate = {
        _id: products[editIndex]._id,
        ...newProduct,
        startOfMonth: localStorage.getItem("startDate"),
        endOfMonth: localStorage.getItem("endDate"),
        sizes: newProduct.sizes.map((sizeObj) => ({
          ...sizeObj,
          price: Number(sizeObj.price),
        })),
      };

      const response = await axios.put(
        `${config.serverUrl}/products/alterproduct`,
        productToUpdate
      );

      if (response.data.success) {
        await fetchProducts();
        handleClose();
      } else {
        setErrorMsg("Failed to update product.. Please try again later!");
      }
    } catch (error) {
      setErrorMsg(
        "There was an error in updating product.. Please try again later!"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleProductUpdate = async () => {
    setLoading(true);
    try {
      const productToUpdate = {
        _id: products[editIndex]._id,
        ...newProduct,
        sizes: newProduct.sizes.map((sizeObj) => ({
          ...sizeObj,
          price: Number(sizeObj.price),
        })),
      };

      const response = await axios.put(
        `${config.serverUrl}/products/updateproduct`,
        productToUpdate
      );

      if (response.data.success) {
        await fetchProducts();
        handleClose();
      } else {
        setErrorMsg("Error in updating product.. Please try again later!");
      }
    } catch (error) {
      setErrorMsg(
        "Error happend in updating product.. Please try again later!"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async () => {
    setLoading(true);
    setLoadingText("Deleting product...");
    try {
      const response = await axios.delete(
        `${config.serverUrl}/products/deleteproduct`,
        {
          data: { _id: products[deleteIndex]._id },
        }
      );
      if (response.data.success) {
        await fetchProducts();
        setShowDeleteConfirm(false);
      } else {
        setErrorMsg("Failed to delete product.. Please try again later!");
      }
    } catch (error) {
      setErrorMsg(
        "There was an error in deleting producta.. Please try again later!"
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleStorageBtn = () => {
    isPriceUpdate(false);
    localStorage.removeItem("startDate");
    localStorage.removeItem("endDate");
  };

  return (
    <div>
      <NavbarComponent />
      <div style={{ minHeight: "80vh" }}>
        <h1 className="admin raleway-title">Welcome, Admin</h1>
        <div className="container mt-4">
          {loading ? (
            <div className="text-center mt-4">
              <Spinner animation="border" variant="primary" />
              <p>{loadingText}</p>
            </div>
          ) : (
            <>
              <div className="container" style={{ marginBottom: "25px" }}>
                <div className="row align-items-center">
                  <div>
                    <div className="searchs mb-3">
                      <Form className="d-flex flex-column flex-md-row ">
                        <Form.Control
                          type="text"
                          placeholder="Search by name"
                          value={searchName}
                          onChange={(e) => setSearchName(e.target.value)}
                          className="me-md-2 mb-2 mb-md-0 w-full"
                        />
                        <Form.Control
                          type="text"
                          placeholder="Search by category"
                          value={searchCategory}
                          onChange={(e) => setSearchCategory(e.target.value)}
                          className="me-md-2 mb-2 mb-md-0 w-full"
                        />
                      </Form>
                    </div>
                    <div
                      className="buttons"
                      style={{ justifyContent: "center", textAlign: "center" }}
                    >
                      <Button
                        variant="primary"
                        onClick={handleShow}
                        className="me-2 mb-2 mb-md-0 "
                        style={{ marginRight: "10px" }}
                      >
                        Add New Product
                      </Button>
                      {!priceupdate ? (
                        <Button
                          variant="primary"
                          onClick={handleShowDateModal}
                          className="mb-2 mb-md-0"
                          style={{ marginRight: "10px" }}
                        >
                          Update Price
                        </Button>
                      ) : (
                        <Button
                          variant="success"
                          onClick={handleStorageBtn}
                          className="mb-2 mb-md-0"
                          style={{ marginRight: "10px" }}
                        >
                          Finish updating price
                        </Button>
                      )}
                      <Button
                        variant="dark"
                        onClick={() => navigate("/price")}
                        className="me-2 mb-2 mb-md-0 "
                        style={{ marginRight: "10px" }}
                      >
                        Edit Price In Bulk
                      </Button>
                    </div>
                  </div>
                </div>

                <DateModal
                  show={showDateModal}
                  handleClose={handleCloseDateModal}
                  handleDateSubmit={handleDateSubmit}
                />
              </div>

              <div style={{ overflowX: "auto" }}>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Product Name</th>
                      <th>Sizes & Prices</th>
                      <th>Unit</th>
                      <th>Category</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentProducts.map((product, index) => (
                      <tr key={product._id}>
                        <td style={{ minWidth: "150px" }}>{product.name}</td>
                        <td>
                          <Form.Select
                            defaultValue=""
                            style={{ minWidth: "110px" }}
                          >
                            {product.sizes.map((sizeObj, idx) => (
                              <option key={idx} value={JSON.stringify(sizeObj)}>
                                {sizeObj.size != null
                                  ? `${sizeObj.size}  `
                                  : " "}
                                {sizeObj.price ? ` ₹${sizeObj.price}` : " "}
                              </option>
                            ))}
                          </Form.Select>
                        </td>
                        <td style={{ textTransform: "uppercase" }}>
                          {product.unit}
                        </td>
                        <td>{product.category}</td>
                        <td style={{ minWidth: "170px" }}>
                          <OverlayTrigger
                            overlay={
                              <Tooltip id={`tooltip-edit-price`}>
                                Edit Price
                              </Tooltip>
                            }
                          >
                            <div
                              className="d-inline-block"
                              style={{
                                cursor: priceupdate ? "pointer" : "not-allowed",
                              }}
                            >
                              <Button
                                disabled={!priceupdate}
                                variant="warning"
                                onClick={() => {
                                  setEditIndex(indexOfFirstProduct + index);
                                  setNewProduct(product);
                                  handleShow();
                                }}
                                className="me-2"
                              >
                                <FontAwesomeIcon icon={faTags} />
                              </Button>
                            </div>
                          </OverlayTrigger>

                          <OverlayTrigger
                            overlay={
                              <Tooltip id={`tooltip-edit-product`}>
                                Edit Product
                              </Tooltip>
                            }
                          >
                            <div
                              className="d-inline-block"
                              style={{
                                cursor: !priceupdate
                                  ? "pointer"
                                  : "not-allowed",
                              }}
                            >
                              <Button
                                disabled={priceupdate}
                                variant="warning"
                                onClick={() => {
                                  setEditIndex(indexOfFirstProduct + index);
                                  setNewProduct(product);
                                  handleShow();
                                }}
                                className="me-2"
                              >
                                <FontAwesomeIcon icon={faEdit} />
                              </Button>
                            </div>
                          </OverlayTrigger>

                          <OverlayTrigger
                            overlay={
                              <Tooltip id={`tooltip-delete`}>Delete</Tooltip>
                            }
                          >
                            <Button
                              variant="danger"
                              onClick={() => {
                                setDeleteIndex(indexOfFirstProduct + index);
                                setShowDeleteConfirm(true);
                              }}
                            >
                              <FontAwesomeIcon icon={faTrashAlt} />
                            </Button>
                          </OverlayTrigger>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "20px",
                }}
              >
                <Pagination>
                  {Array.from(
                    {
                      length: Math.ceil(
                        filteredProducts.length / productsPerPage
                      ),
                    },
                    (_, i) => (
                      <Pagination.Item
                        key={i + 1}
                        active={i + 1 === currentPage}
                        onClick={() => handlePageChange(i + 1)}
                      >
                        {i + 1}
                      </Pagination.Item>
                    )
                  )}
                </Pagination>
              </div>

              <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                  <Modal.Title>
                    {editIndex !== null
                      ? `Update Product ${priceupdate ? "Price" : ""}`
                      : "Add New Product"}
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form>
                    <Form.Group>
                      <Form.Label className="mb-1">Product Name</Form.Label>
                      <Form.Control
                        style={{ marginTop: "10px", marginBottom: "10px" }}
                        disabled={priceupdate}
                        type="textarea"
                        value={newProduct.name}
                        onChange={(e) =>
                          setNewProduct({ ...newProduct, name: e.target.value })
                        }
                        placeholder="Enter product name"
                        required
                      />
                    </Form.Group>

                    {newProduct.sizes.map((sizeObj, idx) => (
                      <div key={idx}>
                        <Form.Group>
                          <Form.Label className="mb-0">Size</Form.Label>
                          <Form.Control
                            style={{ marginTop: "10px", marginBottom: "10px" }}
                            disabled={priceupdate}
                            type="text"
                            value={sizeObj.size}
                            onChange={(e) =>
                              handleSizePriceChange(idx, "size", e.target.value)
                            }
                            placeholder="Enter size"
                            required
                          />
                        </Form.Group>

                        <Form.Group>
                          <Form.Label className="mb-0">Price</Form.Label>
                          <Form.Control
                            style={{ marginTop: "10px", marginBottom: "10px" }}
                            disabled={!priceupdate}
                            type="text"
                            value={sizeObj.price}
                            onChange={(e) =>
                              handleSizePriceChange(
                                idx,
                                "price",
                                e.target.value
                              )
                            }
                            placeholder="Enter price"
                            required
                          />
                        </Form.Group>

                        <Button
                          disabled={priceupdate}
                          variant="danger"
                          className="mt-2 mb-3"
                          onClick={() => {
                            const updatedSizes = newProduct.sizes.filter(
                              (_, i) => i !== idx
                            );
                            setNewProduct({
                              ...newProduct,
                              sizes: updatedSizes,
                            });
                          }}
                        >
                          Delete Size & Price
                        </Button>
                      </div>
                    ))}

                    <Button
                      variant="secondary"
                      className="mt-1"
                      onClick={handleAddSize}
                      disabled={priceupdate}
                    >
                      Add Size & Price
                    </Button>

                    <Form.Group className="mb-3 mt-3">
                      <Form.Label>Unit</Form.Label>
                      <Form.Select
                        disabled={priceupdate}
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
                        disabled={priceupdate}
                        value={newProduct.category}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            category: e.target.value,
                          })
                        }
                        placeholder="Enter product category"
                        required
                      />
                    </Form.Group>
                  </Form>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleClose}>
                    Close
                  </Button>
                  <Button
                    variant="primary"
                    onClick={
                      editIndex !== null
                        ? priceupdate
                          ? handleUpdateProduct
                          : handleProductUpdate
                        : handleAddProduct
                    }
                  >
                    {editIndex !== null
                      ? `Update Product ${priceupdate ? "Price" : ""}`
                      : "Add Product"}
                  </Button>
                </Modal.Footer>
              </Modal>

              <Modal
                show={showDeleteConfirm}
                onHide={() => setShowDeleteConfirm(false)}
              >
                <Modal.Header closeButton>
                  <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  Are you sure you want to delete this product?
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    variant="secondary"
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    Cancel
                  </Button>
                  <Button variant="danger" onClick={handleDeleteProduct}>
                    Delete
                  </Button>
                </Modal.Footer>
              </Modal>
            </>
          )}
        </div>
      </div>
      <Alert errorMsg={errorMsg} setErrorMsg={setErrorMsg} />
      <AdminFooter />
    </div>
  );
}
