import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import './css/manage.css';


function Manage() {
    
    const [bicycles, setBicycles] = useState<{id:number, brand:string, model:string, model_id:number,bicycle_pdf:string}[]>([]);
    const [allBicycles, setAllBicycles] = useState<[]>([]);
    const [windowOpen, setWindowOpen] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [loadingState, setLoadingState] = useState();

    const allowedExtensions = ['pdf', 'png', 'jpg','doc', 'docx', 'txt']

    const navigate = useNavigate();
    const openWindow = () => {
        setWindowOpen(true);
    }
    const closePopup = () => {
        setWindowOpen(false);
        setMessage(null);
    }

    // const editBicycle = async (event: React.FormEvent) => {
    //     event.preventDefault();
    // }

    const addBicycle = async (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;

        const bicycleData = new FormData();
        const pdfInput = form.elements.namedItem("bicycle_pdf") as HTMLInputElement | null;

        bicycleData.append("brand", (form.elements.namedItem("brand") as HTMLInputElement).value)
        bicycleData.append("model", (form.elements.namedItem("model") as HTMLInputElement).value)
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
                setBicycles(prevBicycles => [...prevBicycles, new_bicycle]);
                setMessage(response.data.message);
            }catch(error) {
                console.error("Error in adding bicycle to database", error);
                setMessage("Error adding bicycle. please try again");
            }
            closePopup();
            navigate("/manage");

    };

    useEffect(() => {
        const fetchBicycles = async () => {
            try {
                const bicycle = await axios.get("http://localhost:5000/api/listbicycles");
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
            {message && <div className="notification">{message} </div>}
            <div className="table-container">
                <div className="table-scroll">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>PDF</th>
                                <th>Brand</th>
                                <th>Model</th>
                                <th>Model ID</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bicycles.map(bicycle => (
                                <tr key={bicycle.id}>
                                    <td>{bicycle.id}</td>
                                    <td>{bicycle.bicycle_pdf}</td>
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
                        <p>* means required</p>
                        <form onSubmit={addBicycle}>
                            <div>
                                <label>Brand:* </label>
                                <input type="text" name="brand" id="brand" required />
                            </div>
                            <div>
                            <label>Model:* </label>
                            <input type="text" name="model" id="model" required />
                            </div>
                            <div>
                            <label>Model id</label>
                            <input type="text" name="model_id" id="model_id"/>
                            </div>
                            <div>
                                <label> Upload PDF:* </label>
                                <input type="file" name="bicycle_pdf" id="bicycle_pdf" accept={allowedExtensions.map(ext => `.${ext}`).join(',')} required />
                            </div>
                            <button type="submit">Add Bicycle</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Manage;