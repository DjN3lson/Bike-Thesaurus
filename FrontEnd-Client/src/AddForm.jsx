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
        const data = { brand, model, model_id, bicycle_pdf };
        const url = "http://localhost:5000/addbicycles";
        const options = {
            method: "POST",
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            body: JSON.stringify(data)
        };
        const response = await fetch(url, options);
        if (response.status !== 201 && response.status !== 200) {
            const message = await response.json();
            alert(message.message);
        } else {
            // Successful addition logic
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