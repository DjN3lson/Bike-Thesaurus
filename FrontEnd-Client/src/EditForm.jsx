import axios from "axios";
import React, { useEffect, useState } from "react";

const EditForm = ({closeModal, bicycle = {}}) => {
    const [brand, setBrand] = useState(bicycle.brand || "");
    const [model, setModel] = useState(bicycle.model || "");
    const [bicycle_pdf, setBicycle_pdf] = useState(bicycle.bicycle_pdf || "");
    const allowedExtensions = ['pdf', 'png', 'doc', 'jpg', 'docx', 'txt', 'jpeg'];

    const fetchBicycles = async () => {
        try {
            const bicycle = await axios.get("http://localhost:5000/bicycles");
            setBicycles(bicycle.data.bicycles);
        } catch (error) {
            console.error("Error fetching bicycles", error);
        }
    };

    useEffect(() => {
        setBrand(bicycle.brand || "")
        setModel(bicycle.model || "")
        setBicycle_pdf(bicycle.bicycle_pdf || "")
    }, [bicycle]);

    const editBicycle = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('brand', brand)
        formData.append('model', model)
        if(bicycle_pdf){
            formData.append('bicycle_pdf', bicycle_pdf)
        }else{
            formData.append('bicycle_pdf', null)
        }
        const url = `http://localhost:5000/editbicycle/${bicycle.id}`
        const options = {
            method: bicycle.id ? "PATCH" : "POST",
            body: formData
        };
        try{
            const response = await fetch(url, options);
            const message = await response.json();
            if(response.status !== 200){
                alert(message.message)
                console.log(message.message)
            }else{
                alert("Bicycle has been updated")
            }
        }catch(error){
            alert("Error: ", error)
        }
        closeModal();
        fetchBicycles();
    }
    return(
        <>
        <div className="popup-content">
            <div className="popup-button-container">
                <button className="button-popup" onClick={closeModal}>X</button>
            </div>
            <h2>Edit Bicycle</h2>
            <form onSubmit={editBicycle}>
                <div>
                    <label>Brand: </label>
                    <input type="text" name="brand" id="brand" value={brand} onChange={(e) => setBrand(e.target.value)} />
                </div>
                <div>
                    <label>Model: </label>
                    <input type="text" name="model" id="model" value={model} onChange={(e) => setModel(e.target.value)} />
                </div>
                <div>
                    <label>Upload PDF: </label>
                    <input type="file" name="bicycle_pdf" id="bicycle_pdf"  onChange={(e) => setBicycle_pdf(e.target.files[0])} accept={allowedExtensions.map(ext => `.${ext}`).join(',')}/>
                </div>
                <button type="submit">Update Bicycle</button>
            </form>
        </div>
        </>
    )
}

export default EditForm;