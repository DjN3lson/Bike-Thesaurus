import React, { useState } from "react";
import axios from "axios";

const AddForm = ({ closeModal }) => {
    const [brand, setBrand] = useState("");
    const [model, setModel] = useState("");
    const [model_id, setModel_id] = useState("");
    const [bicycle_pdf, setBicycle_pdf] = useState("");
    const allowedExtensions = ['pdf', 'png', 'doc', 'jpg', 'docx', 'txt', 'jpeg'];

    const addBicycle = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('brand', brand)
        formData.append('model', model)
        formData.append('model_id', model_id)
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
                console.log(message);
            } else {
                console.error(`HTTP error! status: ${response.status}`);
                
                if (response.status === 400) {
                  try {
                    const errorData = await response.json();
                    console.error("Server Error Details:", errorData);
                  } catch (error) {
                    console.error("Failed to parse error response:", error);
                  }
                }
            }
        } catch (error) {
            console.error("Error in addition of bicycle", error);
        }
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
                    <label>Model Id</label>
                    <input type="text" name="model_id" id="model_id" value={model_id} onChange={(e) => setModel_id(e.target.value)} />
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