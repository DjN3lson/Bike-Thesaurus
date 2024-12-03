import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import './css/manage.css';


interface Bicycle {
    id: number;
    model: string;
    brand: string;
    model_id: string;
    bicycle_pdf: string;
}

function Manage() {
    const [bicycles, setBicycles] = useState<Bicycle[]>([]);
    const [windowOpen, setWindowOpen] = useState(false);

    const allowedExtensions = ['pdf', 'png', 'jpg','doc', 'docx', 'txt']

    const navigate = useNavigate();
    const openWindow = () => {
        setWindowOpen(true);
    }
    const closePopup = () => {
        setWindowOpen(false)
    }

    // const editBicycle = async (event: React.FormEvent) => {
    //     event.preventDefault();
    // }

    const addBicycle = async (event: React.FormEvent) => {
        event.preventDefault();
        const form = event.target as HTMLFormElement;

        const bicycleData = new FormData();
        const pdfInput = form.elements.namedItem("bicycle_pdf") as HTMLInputElement | null;

        bicycleData.append("brand", (form.elements.namedItem("brand") as HTMLInputElement).value)
        bicycleData.append("model", (form.elements.namedItem("brand") as HTMLInputElement).value)
        bicycleData.append("model_id", (form.elements.namedItem("model_id") as HTMLInputElement).value);
       
        if(pdfInput && pdfInput.files){
        bicycleData.append("bicycle_pdf", pdfInput.files[0])}
        else{
        console.error("PDF input is missing or has no files")}

            try {
                const response = await axios.post("http://localhost:5000/api/addBicycles", bicycleData, {
                    headers:{
                        'Content-Type': 'multipart/form-data'
                    }
                });

                const new_bicycle = response.data.bicycle;
                setBicycles(prevBicycles => [...prevBicycles, new_bicycle.data]);
            }catch(error) {
                console.error("Error in adding bicycle to database", error);
            }
            closePopup();
            navigate("/manage");

    };

    useEffect(() => {
        const fetchBicycles = async () => {
            try {
                const bicycle = await axios.get("http://localhost:5000/api/bicycles");
                setBicycles(bicycle.data.bicycles);
            } catch (error) {
                console.error("Error fetching bicycles", error);
            }
        };

        fetchBicycles();
    }, [])

    return (
        <div className="manage-container">
            <h1>Bicycle List</h1>
            <div className="table-container">
                <div className="table-scroll">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Brand</th>
                                <th>Model</th>
                                <th>Model ID</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bicycles.map(bicycle => (
                                <tr key={bicycle.id}>
                                    <td>{bicycle.id}</td>
                                    <td>{bicycle.brand}</td>
                                    <td>{bicycle.model}</td>
                                    <td>{bicycle.model_id}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="button-container">
                    <button onClick={openWindow}>Add Bicycle</button>
                    <button>Edit Bicycle</button>
                </div>
            </div>

            {windowOpen && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <div className="popup-button-container">
                            <button className="button-popup" onClick={closePopup}>X</button>
                        </div>
                        <h2> Add Bicycle</h2>
                        <form onSubmit={addBicycle}>
                            <div>
                                <label>Brand: </label>
                                <input type="text" name="brand" id="brand" required />
                            </div>
                            <div>
                            <label>Model: </label>
                            <input type="text" name="model" id="model" required />
                            </div>
                            <div>
                            <label>Model id</label>
                            <input type="text" name="model_id" id="model_id"/>
                            </div>
                            <div>
                                <label> Upload PDF: </label>
                                <input type="file" name="bicycle_pdf" id="bicycle_pdf" accept={allowedExtensions.map(ext => `.${ext}`).join(',')} required />
                            </div>
                            <button type="submit" onClick={addBicycle}>Add Bicycle</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Manage;