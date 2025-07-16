import React, { useState } from "react";
import PdfViewer from "./FileViewer";



const BicycleList = ({ bicycles }) => {

    const [window, setWindow] = useState(false)
    const [selectBicyclePdf, setSelectedBicyclePdf] = useState(null)
    const [dropdownVisible, setDropdownVisible] = useState({})


    const openModal = (bicycle_pdf) => {
        setSelectedBicyclePdf(bicycle_pdf)
        setWindow(true);
    }
    const closeModal = () => {
        setSelectedBicyclePdf(null)
        setWindow(false)
    }

    const toggleDropdown = (bicycleId) => {
        setDropdownVisible((prevState) => ({
            ...prevState,
            [bicycleId]: !prevState[bicycleId],
        }))
    }

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Bicycle PDFs</th>
                        <th>Brand</th>
                        <th>Model</th>
                    </tr>
                </thead>
                <tbody>
                    {bicycles.map((bicycle) => (
                        <tr key={bicycle.id}>
                            <td>
                                <span
                                    onClick={() => toggleDropdown(bicycle.id)}
                                    style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
                                >
                                    View PDFs
                                </span>
                                {dropdownVisible[bicycle.id] && (
                                    <ul style={{ listStyleType: "none", padding: 0, marginTop: "10px" }}>
                                        {bicycle.pdfs && bicycle.pdfs.length > 0 ? (
                                            bicycle.pdfs.map((pdf, index) => (
                                                <li key={index}>
                                                    <a
                                                        href={`http://127.0.0.1:5000/uploads/${pdf}`} // Adjust the URL to match your backend
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        style={{
                                                            color: "black",
                                                            textDecoration: "none",
                                                            cursor: "pointer",
                                                        }}
                                                        onMouseOver={(e) => (e.currentTarget.style.textDecoration = "underline")}
                                                        onMouseOut={(e) => (e.currentTarget.style.textDecoration = "none")}
                                                    >
                                                        {pdf.split(/[/\\]/).pop()} {/* Extract the file name */}
                                                    </a>
                                                    {/* Hacer un mensaje de error si no hay pdf */}
                                                </li>
                                            ))
                                        ) : (
                                            <li>No PDFs Available</li>
                                        )}
                                    </ul>
                                )}
                            </td>
                            <td>{bicycle.brand}</td>
                            <td>{bicycle.model}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {window && selectBicyclePdf && (
                <PdfViewer closeModal={closeModal} bicycle_pdf={selectBicyclePdf} />
            )}
        </div>
    );
};

export default BicycleList;