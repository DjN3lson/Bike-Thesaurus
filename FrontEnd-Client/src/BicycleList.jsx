import React, { useState } from "react";
import PdfViewer from "./FileViewer";



const BicycleList = ({ bicycles }) => {

    const [window, setWindow] = useState(false)
    const [selectBicyclePdf, setSelectedBicyclePdf] = useState(null)
    const [dropdownVisible, setDropdownVisible] = usetState(false)


    const openModal = (bicycle_pdf) => {
        setSelectedBicyclePdf(bicycle_pdf)
        setWindow(true);
    }
    const closeModal = () => {
        setSelectedBicyclePdf(null)
        setWindow(false)
    }

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible)
    }
    return <div>
        <table>
            <thead>
                <tr>
                    <th>
                        <span onClick={toggleDropdown} style={{ cursor: 'pointer' }}>Bicycle PDF</span>
                        {dropdownVisible && (
                            <ul style={{ listStyleType: 'none', padding: 0 }}>
                                {bicycles.map((bicycle) => (
                                    <li key={bicycle.id}>
                                        <a href="#" onClick={(e) => {
                                            e.preventDefault();
                                            openModal(bicycle.bicycle_pdf);
                                        }}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                color: "black",
                                                textDecoration: 'none'
                                            }}
                                        >{bicycle.bicycle_pdf.split(/[/\\]/).pop()}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </th>
                    <th>Brand</th>
                    <th>Model</th>

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