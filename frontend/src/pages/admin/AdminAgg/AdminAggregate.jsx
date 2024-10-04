// import React, { useState, useEffect, useRef } from "react";
// import { Table, Spinner, Button } from "react-bootstrap";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import axios from "axios";
// import NavbarComponent from "../../../components/AdminNavbar";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
// import * as XLSX from "xlsx";
// import {
//   Document,
//   Packer,
//   Table as DocxTable,
//   TableRow,
//   TableCell,
//   Paragraph,
// } from "docx";
// import { saveAs } from "file-saver";
// import "./AdminAggreate.css";
// import config from "../../../config";
// import Alert from "../../../Alert";
// import AdminFooter from "../../../components/adminFooter/AdminFooter";

// export default function AdminAggregate() {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [errorMsg, setErrorMsg] = useState("");
//   const tableRef = useRef(null);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       setLoading(true);
//       try {
//         const month = selectedDate.getMonth() + 1;
//         const year = selectedDate.getFullYear();

//         const response = await axios.get(
//           `${config.serverUrl}/products/aggregate`,
//           {
//             params: {
//               month,
//               year,
//             },
//           }
//         );
//         setProducts(response.data.data);
//       } catch (error) {
//         setErrorMsg("Internal server error.. Please try again later!");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProducts();
//   }, [selectedDate]);

//   const downloadPDF = async () => {
//     try {
//       if (tableRef.current) {
//         const canvas = await html2canvas(tableRef.current);
//         const imgData = canvas.toDataURL("image/png");
//         const doc = new jsPDF();
//         const imgWidth = 210; // A4 width in mm
//         const pageHeight = 295; // A4 height in mm
//         const imgHeight = (canvas.height * imgWidth) / canvas.width;
//         let heightLeft = imgHeight;

//         let position = 0;

//         doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
//         heightLeft -= pageHeight;

//         while (heightLeft >= 0) {
//           position = heightLeft - imgHeight;
//           doc.addPage();
//           doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
//           heightLeft -= pageHeight;
//         }
//         doc.save(
//           `${new Date().toLocaleDateString("en-IN", {
//             day: "2-digit",
//             month: "2-digit",
//             year: "numeric",
//           })}.pdf`
//         );
//       }
//     } catch (error) {
//       setErrorMsg("Error in downloading pdf.. Please try again later!");
//     }
//   };

//   const downloadExcel = () => {
//     try {
//       const worksheet = XLSX.utils.json_to_sheet(
//         products.map((product, index) => ({
//           "#": index + 1,
//           Name: product.name,
//           Size: product.size,
//           "Total Quantity": product.totalQuantity,
//         }))
//       );
//       const workbook = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
//       XLSX.writeFile(
//         workbook,
//         `${new Date().toLocaleDateString("en-IN", {
//           day: "2-digit",
//           month: "2-digit",
//           year: "numeric",
//         })}.xlsx`
//       );
//     } catch (error) {
//       setErrorMsg("Error in downloading excel file.. Please try again later!");
//     }
//   };

//   const downloadDocument = async () => {
//     try {
//       const tableRows = [
//         new TableRow({
//           children: [
//             new TableCell({ children: [new Paragraph("#")] }),
//             new TableCell({ children: [new Paragraph("Name")] }),
//             new TableCell({ children: [new Paragraph("Size")] }),
//             new TableCell({ children: [new Paragraph("Total Quantity")] }),
//           ],
//         }),
//       ];

//       products.forEach((product, index) => {
//         const {
//           name = "N/A",
//           size = "null",
//           totalQuantity = 0,
//         } = product || {};

//         tableRows.push(
//           new TableRow({
//             children: [
//               new TableCell({ children: [new Paragraph(String(index + 1))] }),
//               new TableCell({ children: [new Paragraph(name)] }),
//               new TableCell({ children: [new Paragraph(size || " ")] }),
//               new TableCell({
//                 children: [new Paragraph(String(totalQuantity))],
//               }),
//             ],
//           })
//         );
//       });

//       const doc = new Document({
//         sections: [
//           {
//             children: [
//               new Paragraph({
//                 text: "Vruksh Store",
//                 heading: "Title", // This will make it a prominent heading
//                 alignment: "center",
//               }),
//               new Paragraph({
//                 text: "Product Aggregation",
//                 heading: "Heading1",
//                 alignment: "center",
//               }),
//               new Paragraph({
//                 text: `Total Number of Products: ${products.length}`,
//                 heading: "Heading2", // Smaller than the main heading
//                 alignment: "center",
//               }),
//               new Paragraph({
//                 text: `Date: ${selectedDate.toLocaleDateString("en-IN", {
//                   day: "2-digit",
//                   month: "2-digit",
//                   year: "numeric",
//                 })}`,
//                 alignment: "center",
//               }),
//               new Paragraph({ text: "" }), // Add an empty paragraph for spacing
//               new DocxTable({
//                 rows: tableRows,
//               }),
//             ],
//           },
//         ],
//       });

//       const blob = await Packer.toBlob(doc);
//       saveAs(
//         blob,
//         `${new Date().toLocaleDateString("en-IN", {
//           day: "2-digit",
//           month: "2-digit",
//           year: "numeric",
//         })}.docx`
//       );
//     } catch (error) {
//       setErrorMsg("Error in downloading document.. Please try again later!");
//     }
//   };

//   return (
//     <>
//       <NavbarComponent />
//       <div className="container" style={{ minHeight: "80vh" }}>
//         <h1 className="admin raleway-title" style={{ marginBottom: "20px" }}>
//           Product Aggregation
//         </h1>

//         <div
//           className="date-div d-flex justify-content-between align-items-center "
//           style={{ marginBottom: "15px" }}
//         >
//           <div className="d-flex align-items-end">
//             <label
//               style={{
//                 marginRight: "10px",
//                 marginBottom: "0",
//               }}
//             >
//               <b>Select Month and Year</b>
//             </label>
//             <DatePicker
//               selected={selectedDate}
//               onChange={(date) => setSelectedDate(date)}
//               dateFormat="MM/yyyy"
//               showMonthYearPicker
//               className="form-control  mb-0 cu"
//             />
//           </div>
//           <div
//             className="d-flex align-items-center"
//             style={{ placeContent: "start" }}
//           >
//             <Button variant="dark" onClick={downloadDocument}>
//               Select Date
//             </Button>
//             <Button
//               variant="primary"
//               // add a onClick and view a date model and click on okay to continue
//               className="responsive-margin"
//               style={{ marginLeft: "10px" }}
//             >
//               Download PDF
//             </Button>
//             <Button
//               variant="success"
//               onClick={downloadExcel}
//               style={{ marginLeft: "10px" }}
//             >
//               Download Excel
//             </Button>
//             <Button
//               variant="info"
//               onClick={downloadDocument}
//               style={{ marginLeft: "10px" }}
//             >
//               Download Document
//             </Button>
//           </div>
//         </div>

//         {loading ? (
//           <div
//             className="d-flex justify-content-center align-items-center"
//             style={{ height: "50vh" }}
//           >
//             <Spinner animation="border" role="status">
//               <span className="visually-hidden">Loading...</span>
//             </Spinner>
//           </div>
//         ) : (
//           <div ref={tableRef}>
//             <Table striped bordered hover>
//               <thead>
//                 <tr>
//                   <th>#</th>
//                   <th>Name</th>
//                   <th>Size</th>
//                   <th>Total Quantity</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {products.map((product, index) => (
//                   <tr key={index}>
//                     <td>{index + 1}</td>
//                     <td>{product.name}</td>
//                     <td>{product.size}</td>
//                     <td>{product.totalQuantity}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </Table>
//           </div>
//         )}
//       </div>
//       <Alert errorMsg={errorMsg} setErrorMsg={setErrorMsg} />
//       <AdminFooter />
//     </>
//   );
// }

import React, { useState, useEffect, useRef } from "react";
import { Table, Spinner, Button, Modal } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import NavbarComponent from "../../../components/AdminNavbar";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as XLSX from "xlsx";
import {
  Document,
  Packer,
  Table as DocxTable,
  TableRow,
  TableCell,
  Paragraph,
} from "docx";
import { saveAs } from "file-saver";
import "./AdminAggreate.css";
import config from "../../../config";
import Alert from "../../../Alert";
import AdminFooter from "../../../components/adminFooter/AdminFooter";

export default function AdminAggregate() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [errorMsg, setErrorMsg] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [dateOption, setDateOption] = useState("month");
  const [isExpanded, setIsExpanded] = useState("false");
  const [isExpandedId, setIsExpandedId] = useState(null);
  const [expandedDetails, setExpandedDetails] = useState(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const tableRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const month = selectedDate.getMonth() + 1;
        const year = selectedDate.getFullYear();

        const response = await axios.get(
          `${config.serverUrl}/products/aggregate`,
          {
            params: {
              month,
              year,
            },
          }
        );
        setProducts(response.data.data);
      } catch (error) {
        setErrorMsg("Internal server error.. Please try again later!");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedDate]);

  const handleDownloadRequest = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${config.serverUrl}/products/aggregate`,
        {
          params: {
            startDate: startDate.toISOString().split("T")[0],
            endDate: endDate.toISOString().split("T")[0],
          },
        }
      );
      setProducts(response.data.data);
      setShowModal(false);
    } catch (error) {
      setErrorMsg("Failed to fetch products for the selected date range.");
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    try {
      if (tableRef.current) {
        const canvas = await html2canvas(tableRef.current);
        const imgData = canvas.toDataURL("image/png");
        const doc = new jsPDF();
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 295; // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;

        let position = 0;

        doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          doc.addPage();
          doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
        doc.save(
          `${new Date().toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}.pdf`
        );
      }
    } catch (error) {
      setErrorMsg("Error in downloading pdf.. Please try again later!");
    }
  };

  const downloadExcel = () => {
    try {
      const worksheet = XLSX.utils.json_to_sheet(
        products.map((product, index) => ({
          "#": index + 1,
          Name: product.name,
          Size: product.size,
          "Total Quantity": product.totalQuantity,
        }))
      );
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
      XLSX.writeFile(
        workbook,
        `${new Date().toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })}.xlsx`
      );
    } catch (error) {
      setErrorMsg("Error in downloading excel file.. Please try again later!");
    }
  };

  const downloadDocument = async () => {
    try {
      const tableRows = [
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("#")] }),
            new TableCell({ children: [new Paragraph("Name")] }),
            new TableCell({ children: [new Paragraph("Size")] }),
            new TableCell({ children: [new Paragraph("Total Quantity")] }),
          ],
        }),
      ];

      products.forEach((product, index) => {
        const {
          name = "N/A",
          size = "null",
          totalQuantity = 0,
        } = product || {};

        tableRows.push(
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph(String(index + 1))] }),
              new TableCell({ children: [new Paragraph(name)] }),
              new TableCell({ children: [new Paragraph(size || " ")] }),
              new TableCell({
                children: [new Paragraph(String(totalQuantity))],
              }),
            ],
          })
        );
      });

      const doc = new Document({
        sections: [
          {
            children: [
              new Paragraph({
                text: "Vruksh Store",
                heading: "Title", // This will make it a prominent heading
                alignment: "center",
              }),
              new Paragraph({
                text: "Product Aggregation",
                heading: "Heading1",
                alignment: "center",
              }),
              new Paragraph({
                text: `Total Number of Products: ${products.length}`,
                heading: "Heading2", // Smaller than the main heading
                alignment: "center",
              }),
              new Paragraph({
                text: `Date: ${selectedDate.toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}`,
                alignment: "center",
              }),
              new Paragraph({ text: "" }), // Add an empty paragraph for spacing
              new DocxTable({
                rows: tableRows,
              }),
            ],
          },
        ],
      });

      const blob = await Packer.toBlob(doc);
      saveAs(
        blob,
        `${new Date().toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })}.docx`
      );
    } catch (error) {
      setErrorMsg("Error in downloading document.. Please try again later!");
    }
  };

  const handleProductClicked = async (product, index) => {
    // Toggle the expanded state
    if (isExpandedId === index) {
      setIsExpandedId(null);
      setExpandedDetails(null);
    } else {
      setIsExpandedId(index);
      setIsLoadingDetails(true);
      try {
        const details = {
          productId: product.productId,
          size: product.size,
          quantity: product.totalQuantity,
          month: selectedDate.getMonth() + 1,
          year: selectedDate.getFullYear(),
        };

        const response = await axios.post(
          `${config.serverUrl}/products/getAggregateDetails`,
          details
        );
        setExpandedDetails(response.data.data); // Store the aggregated details
      } catch (error) {
        setErrorMsg("Internal Server Error! Please try again later...");
      } finally {
        setIsLoadingDetails(false);
      }
    }
  };

  return (
    <>
      <NavbarComponent />
      <div className="container" style={{ minHeight: "80vh" }}>
        <h1 className="admin raleway-title" style={{ marginBottom: "20px" }}>
          Product Aggregation
        </h1>

        <div
          className="date-div d-flex justify-content-between align-items-center "
          style={{ marginBottom: "15px" }}
        >
          <div className="d-flex align-items-end">
            <label
              style={{
                marginRight: "10px",
                marginBottom: "0",
              }}
            >
              <b>Select Month and Year</b>
            </label>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => {
                setSelectedDate(date);
                setDateOption("month");
              }}
              dateFormat="MM/yyyy"
              showMonthYearPicker
              className="form-control  mb-0 cu"
            />
          </div>
          <div
            className="d-flex align-items-center"
            style={{ placeContent: "start" }}
          >
            <Button variant="dark" onClick={() => setShowModal(true)}>
              Select Date Range
            </Button>
            <Button
              variant="primary"
              onClick={downloadPDF}
              className="responsive-margin"
              style={{ marginLeft: "10px" }}
            >
              Download PDF
            </Button>
            <Button
              variant="success"
              onClick={downloadExcel}
              style={{ marginLeft: "10px" }}
            >
              Download Excel
            </Button>
            <Button
              variant="info"
              onClick={downloadDocument}
              style={{ marginLeft: "10px" }}
            >
              Download Document
            </Button>
          </div>
        </div>

        {loading ? (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "50vh" }}
          >
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : (
          <div ref={tableRef}>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Size</th>
                  <th>Total Quantity</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <React.Fragment key={index}>
                    <tr onClick={() => handleProductClicked(product, index)}>
                      <td>{index + 1}</td>
                      <td>{product.name}</td>
                      <td>{product.size}</td>
                      <td>{product.totalQuantity}</td>
                    </tr>
                    {isExpandedId === index && (
                      <tr>
                        <td colSpan={4}>
                          {/* Render the details of the expanded product */}
                          {isLoadingDetails ? ( // Show loader while loading details
                            <div
                              className="d-flex justify-content-center align-items-center"
                              style={{ height: "100px" }}
                            >
                              <Spinner animation="border" role="status">
                                <span className="visually-hidden">
                                  Loading...
                                </span>
                              </Spinner>
                            </div>
                          ) : (
                            expandedDetails && (
                              <Table striped bordered>
                                <thead>
                                  <tr>
                                    <th>SI.No</th>
                                    <th>User Name</th>
                                    <th>Quantity</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {expandedDetails.map((detail, idx) => (
                                    <tr key={idx}>
                                      <td>{idx + 1}</td>
                                      <td>{detail.userName}</td>
                                      <td>{detail.totalQuantity}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </Table>
                            )
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </div>

      {/* Modal for selecting date range */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Select Date Range</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex justify-content-between">
            <div>
              <label>Start Date:</label>
              <DatePicker
                selected={startDate}
                onChange={(date) => {
                  setStartDate(date);
                }}
                dateFormat="dd/MM/yyyy"
                className="form-control"
              />
            </div>
            <div>
              <label>End Date:</label>
              <DatePicker
                selected={endDate}
                onChange={(date) => {
                  setEndDate(date);
                }}
                dateFormat="dd/MM/yyyy"
                className="form-control"
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              handleDownloadRequest();
              setDateOption("range");
            }}
          >
            Apply
          </Button>
        </Modal.Footer>
      </Modal>

      <Alert errorMsg={errorMsg} setErrorMsg={setErrorMsg} />
      <AdminFooter />
    </>
  );
}
