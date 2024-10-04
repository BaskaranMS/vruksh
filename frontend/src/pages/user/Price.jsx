import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Spinner, Form } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import config from '../../config';
import './Price.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import NavbarComponent from '../../components/AdminNavbar';
import AdminFooter from '../../components/adminFooter/AdminFooter';
import { useNavigate } from 'react-router-dom';
import Alert from '../../Alert';

function Price() {
  const [updatedProducts, setUpdatedProducts] = useState([]);
  const [changedProducts, setChangedProducts] = useState([]); 
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${config.serverUrl}/products/getallproduct`);
        if (response.data.success) {
          setUpdatedProducts(response.data.msg);
          setFilteredProducts(response.data.msg);
        }
      } catch (error) {
        setErrorMsg('Internal server error.. Please try again later!');
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const results = updatedProducts.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(results);
  }, [searchTerm, updatedProducts]);

  const handleUpdatePrices = async () => {
    setShowLoader(true);
    try {
      const response = await axios.post(`${config.serverUrl}/products/update-prices`, {
        products: changedProducts, // Send only changed products
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });
      if (response.data.success) {
        setShowSuccess(true);
      }
    } catch (error) {
      setShowError(true);
      setErrorMsg('Internal Server Error.. Please try again later!');
    } finally {
      setShowLoader(false);
    }
  };

  const handlePriceChange = (e, productId, sizeId) => {
    const newPrice = e.target.value;
    const updatedProductsCopy = updatedProducts.map((product) => {
      if (product._id === productId) {
        const updatedSizes = product.sizes.map((size) => {
          if (size._id === sizeId) {
            if (size.price !== newPrice) {
              setChangedProducts(prevState => {
                const existingProduct = prevState.find(p => p._id === productId);
                if (existingProduct) {
                  return prevState.map(p =>
                    p._id === productId
                      ? {
                        ...p,
                        sizes: p.sizes.map(s =>
                          s._id === sizeId ? { ...s, price: newPrice } : s
                        ),
                      }
                      : p
                  );
                } else {
                  return [...prevState, {
                    ...product,
                    sizes: product.sizes.map(s =>
                      s._id === sizeId ? { ...s, price: newPrice } : s
                    ),
                  }];
                }
              });
            }
            return { ...size, price: newPrice };
          }
          return size;
        });
        return { ...product, sizes: updatedSizes };
      }
      return product;
    });
    setUpdatedProducts(updatedProductsCopy);
  };

  const handleAddPriceClick = () => {
    setShowConfirmation(true);
  };

  const handleConfirmUpdate = () => {
    handleUpdatePrices();
    setShowConfirmation(false);
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
    
  }
  const handleCloseError = () => setShowError(false);
  const handleCloseSuccess = () => {
    setShowSuccess(false);
    navigate('/admin/orders');
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <>
      <NavbarComponent/>
    <div className="container-fluid">
      <h1 className="text-center">Update Prices</h1>

      <div className="search-bar mb-4">
        <Form.Control
          type="text"
          placeholder="Search products..."
          className="mx-auto search-input"
          onChange={handleSearch}
        />
      </div>

      <div className="date-picker mb-4 d-flex flex-wrap align-items-center">
        <label className="mr-2 text-center">Start Date: &nbsp;
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          dateFormat="yyyy-MM-dd"
          className="date-picker-input"
        /></label>
        <label className="ml-3 mr-2">End Date: &nbsp;
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          dateFormat="yyyy-MM-dd"
          className="date-picker-input"
        /></label>
      </div>

      <div className="table-responsive">
        <Table striped bordered hover  className="price-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Size</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <React.Fragment key={product._id}>
                <tr>
                  <td rowSpan={product.sizes.length}>{product.name}</td>
                  <td rowSpan={product.sizes.length}>{product.category}</td>
                  <td>{product.sizes[0].size}</td>
                  <td>
                    <input
                      type="text"
                      placeholder="Enter price"
                      value={product.sizes[0].price || ''}
                      onChange={(e) =>
                        handlePriceChange(e, product._id, product.sizes[0]._id)
                      }
                      className="price-input"
                    />
                  </td>
                </tr>
                {product.sizes.slice(1).map((size, index) => (
                  <tr key={index}>
                    <td>{size.size}</td>
                    <td>
                      <input
                        type="text"
                        placeholder="Enter price"
                        value={size.price || ''}
                        onChange={(e) =>
                          handlePriceChange(e, product._id, size._id)
                        }
                        className="price-input"
                      />
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </Table>
      </div>

      <div className="text-center mt-4">
        <Button variant="dark" onClick={handleAddPriceClick}>
          Save Changes
        </Button>
      </div>

      {/* Confirmation Modal */}
      <Modal show={showConfirmation} onHide={handleCloseConfirmation}>
        <Modal.Header>
          <Modal.Title>Confirm Changes</Modal.Title>
          <Button
            variant="link"
            onClick={handleCloseConfirmation}
            style={{ border: 'none', background: 'transparent' }}
          >
            <FontAwesomeIcon icon={faTimes} />
          </Button>
        </Modal.Header>
        <Modal.Body>
          The changes will reflect in the orders made between {startDate.toDateString()} and {endDate.toDateString()}.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseConfirmation}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirmUpdate}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Loader */}
      <Modal show={showLoader} centered>
        <Modal.Body className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden"></span>
          </Spinner>
          <p>Updating prices...</p>
        </Modal.Body>
      </Modal>

      {/* Error Modal */}
      <Modal show={showError} onHide={handleCloseError}>
        <Modal.Header>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Button
          variant="link"
          onClick={handleCloseError}
          style={{ border: 'none', background: 'transparent' }}
        >
          <FontAwesomeIcon icon={faTimes} />
        </Button>
        <Modal.Body>
          There was an error updating the prices. Please try again later.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseError}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showSuccess} onHide={handleCloseSuccess} centered>
        <Modal.Header>
          <Modal.Title className="text-center w-100">
            Prices Updated
          </Modal.Title>
          <Button
            variant="link"
            onClick={handleCloseSuccess}
            style={{ border: 'none', background: 'transparent' }}
          >
            <FontAwesomeIcon icon={faTimes} />
          </Button>
        </Modal.Header>
        <Modal.Body className="text-center">
          <img
            src="/image2.jpeg"
            alt="Done"
            className="img-fluid"
            style={{ maxWidth: '100%', height: '200px' }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleCloseSuccess} className="mx-auto">
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <Alert errorMsg={errorMsg} setErrorMsg={setErrorMsg} />
    </div>
      <AdminFooter/>
    </>
  );
}

export default Price;
