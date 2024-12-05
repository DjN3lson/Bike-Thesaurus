import React from "react";



const BicycleList = ({ bicycles }) => {
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
                                style={{
                                    color: 'black', // Set font color to black
                                    cursor: 'pointer', // Change cursor to pointer
                                    textDecoration: 'none' // Remove default underline
                                }} 
                                onMouseOver={(e) => e.currentTarget.style.textDecoration = 'underline'} 
                                onMouseOut={(e) => e.currentTarget.style.textDecoration = 'none'}
                            >
                                {bicycle.bicycle_pdf}
                            </a>
                        </td>
                        <td>{bicycle.brand}</td>
                        <td>{bicycle.model}</td>
                        <td>{bicycle.model_id}</td>

                    </tr>
                ))}
            </tbody>
        </table>
    </div>
}

export default BicycleList;