import React, { useState } from "react";
import axios from "axios";

import "./css/addform.css"

const AddForm = ({ closeModal }) => {
    const [brand, setBrand] = useState("");
    const [model, setModel] = useState("");
    const [bicycle_pdf, setBicycle_pdf] = useState("");
    const allowedExtensions = ['pdf', 'png', 'doc', 'jpg', 'docx', 'txt', 'jpeg'];

    const fetchBicycles = async () => {
        try {
            const bicycle = await axios.get("http://localhost:5000/bicycles");
            setBicycles(bicycle.data.bicycles);
        } catch (error) {
            console.error("Error fetching bicycles", error);
        }
    };

    const addBicycle = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('brand', brand)
        formData.append('model', model)
        formData.append('bicycle_pdf', bicycle_pdf)
        const url = "http://localhost:5000/addbicycle";
        const options = {
            method: "POST",
            body: formData
        };
        try {
            const response = await fetch(url, options);
            if (response.ok) { 
                const message = await response.json();
                alert(message.message)
            } else {
                console.error(`HTTP error! status: ${response.status}`);
                
                if (response.status === 400) {
                  try {
                    const errorData = await response.json();
                    alert("Server Error Details:", errorData);
                  } catch (error) {
                    alert("Failed to parse error response:", error);
                  }
                }
            }
        } catch (error) {
            alert("Error in addition of bicycle", error);
        }
        fetchBicycles();
        closeModal(); // Close the modal after submission
        
    };

    return (
        <div className="popup-content">
            <div className="popup-button-container">
                <button className="button-popup" onClick={closeModal}>X</button>
            </div>
            <h2>Add Bicycle</h2>
            <p>* means required</p>
            <form onSubmit={addBicycle}>
                <div>
                    <label>Brand:* </label>
                    <input type="text" name="brand" id="brand" value={brand} onChange={(e) => setBrand(e.target.value)} required />
                </div>
                <div>
                    <label>Model:* </label>
                    <input type="text" name="model" id="model" value={model} onChange={(e) => setModel(e.target.value)} required />
                </div>
                <div>
                    <label>Upload PDF:* </label>
                    <input type="file" name="bicycle_pdf" id="bicycle_pdf" onChange={(e) => setBicycle_pdf(e.target.files[0])} accept={allowedExtensions.map(ext => `.${ext}`).join(',')} required />
                </div>
                <button type="submit">Add Bicycle</button>
            </form>
        </div>
    );
}

export default AddForm;