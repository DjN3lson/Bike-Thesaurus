import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AddForm from './AddForm';

import './css/manage.css';


function Manage() {

    const [bicycles, setBicycles] = useState([]);
    const [brand, setBrand] = useState();
    const [model, setModel] = useState("");
    const [model_id, setModel_id] = useState();
    const [bicycle_pdf, setBicycle_pdf] = useState("");

    const [windowOpen, setWindowOpen] = useState(false);
    const [addFormOpen, setAddFormOpen] = useState(false);


    const allowedExtensions = ['pdf', 'png', 'doc', 'jpg', 'docx', 'txt', 'jpeg']

    const navigate = useNavigate();
    const openWindow = () => {
        setWindowOpen(true);
    }
    const closePopup = () => {
        setWindowOpen(false);

    }
    const changeManage = (bicycle) => {
        setBrand(bicycle.brand);
        setModel(bicycle.model);
        setModel_id(bicycle.model_id);
        setBicycle_pdf(bicycle.bicycle_pdf);
        setWindowOpen(true); 
    }

    const editBicycle = async (e) => {
        e.preventDefault();
        const data = {
            brand, model, model_id, bicycle_pdf
        }
        const url = "http://localhost:5000/editbicycle/<int:bicycle_id>"
        const options = {
            method:"PATCH"
        }
    }

    const openAddForm = () => {
        setAddFormOpen(true);
    }

    const closeAddForm = () => {
        setAddFormOpen(false);
    }

    useEffect(() => {
        const fetchBicycles = async () => {
            try {
                const bicycle = await axios.get("http://localhost:5000/bicycles");
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
                                <th>PDF</th>
                                <th>Brand</th>
                                <th>Model</th>
                                <th>Model ID</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bicycles.map((bicycle) => (
                                <tr key={bicycle.id}>
                                    <td>{bicycle.id}</td>
                                    <td>{bicycle.bicycle_pdf.split(/[/\\]/).pop()}</td>
                                    <td>{bicycle.brand}</td>
                                    <td>{bicycle.model}</td>
                                    <td>{bicycle.model_id}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="button-container">
                    <button onClick={openAddForm}>Add Bicycle</button>
                    <button onClick={() => changeManage(bicycles[0])}>Edit Bicycle</button>
                </div>
            </div>

            {addFormOpen && (
                <div className="popup-overlay">
                    <AddForm closeModal={closeAddForm} />
                </div>
            )}

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
                                <input type="text" name="brand" id="brand" value={brand} onChange={(e) => setBrand(e.target.value)}required />
                            </div>
                            <div>
                                <label>Model:* </label>
                                <input type="text" name="model" id="model" value={model} onChange={(e) => setModel(e.target.value)} required />
                            </div>
                            <div>
                                <label>Model Id</label>
                                <input type="text" name="model_id" id="model_id" value={model_id} onChange={(e) => setModel_id(e.target.value)}/>
                            </div>
                            <div>
                                <label> Upload PDF:* </label>
                                <input type="file" name="bicycle_pdf" id="bicycle_pdf" value={bicycle_pdf} onChange={(e) => setBicycle_pdf(e.target.value)} accept={allowedExtensions.map(ext => `.${ext}`).join(',')} required />
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