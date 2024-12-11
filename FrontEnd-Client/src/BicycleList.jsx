import React, { useState } from "react";
import PdfViewer from "./FileViewer";



const BicycleList = ({ bicycles }) => {
    
    const [window, setWindow] = useState(false)
    const [selectBicyclePdf, setSelectedBicyclePdf] = useState(null)
    
    
    const openModal = (bicycle_pdf) => {
        setSelectedBicyclePdf(bicycle_pdf)
        setWindow(true);
    }
    const closeModal = () => {
        setSelectedBicyclePdf(null)
        setWindow(false)
    }
    return <div>
        <table>
            <thead>
                <tr>
                    <th>Bicycle PDF</th>
                    <th>Brand</th>
                    <th>Model</th>
                    <th>Model_id</th>

                </tr>
            </thead>
            <tbody>
                {bicycles.map((bicycle) => (
                    <tr key={bicycle.id}>
                        <td>
                            <a
                            href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    openModal(bicycle.bicycle_pdf)
                                }}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    color: 'black', // Set font color to black
                                    cursor: 'pointer', // Change cursor to pointer
                                    textDecoration: 'none' // Remove default underline
                                }}
                                onMouseOver={(e) => e.currentTarget.style.textDecoration = 'underline'}
                                onMouseOut={(e) => e.currentTarget.style.textDecoration = 'none'}
                            >
                                {bicycle.bicycle_pdf.split(/[/\\]/).pop()}
                            </a>
                        </td>
                        <td>{bicycle.brand}</td>
                        <td>{bicycle.model}</td>
                        <td>{bicycle.model_id}</td>

                    </tr>
                ))}
            </tbody>
        </table>
        {window && selectBicyclePdf && (
            <PdfViewer closeModal={closeModal} bicycle_pdf={selectBicyclePdf} />
        )}
    </div>
}

export default BicycleList;