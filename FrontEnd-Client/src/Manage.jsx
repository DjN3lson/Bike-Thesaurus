import React, { useEffect, useState } from "react";
import axios from "axios";
import AddForm from './AddForm';
import EditForm from './EditForm';

import './css/manage.css';


function Manage() {

    const [bicycles, setBicycles] = useState([]);
    const [brand, setBrand] = useState();
    const [model, setModel] = useState("");
    const [bicycle_pdf, setBicycle_pdf] = useState("");

    const [addFormOpen, setAddFormOpen] = useState(false)
    const [editFormOpen, setEditFormOpen] = useState(false)
    const [selectedBicycle, setSelectedBicycle] = useState(null)
    

    const openEditForm = (bicycle) => {
        setSelectedBicycle(bicycle)
        setEditFormOpen(true)
    }
    const closeEditForm = () => {
        setEditFormOpen(false);
        setSelectedBicycle(null)
    }

    const openAddForm = () => {
        setAddFormOpen(true);
    }
    const closeAddForm = () => {
        setAddFormOpen(false);
        fetchBicycles();
    }

    const fetchBicycles = async () => {
        try {
            const bicycle = await axios.get("http://localhost:5000/bicycles");
            setBicycles(bicycle.data.bicycles);
        } catch (error) {
            console.error("Error fetching bicycles", error);
        }
    };

    useEffect(() => {
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
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bicycles.map((bicycle) => (
                                <tr key={bicycle.id}>
                                    <td>{bicycle.id}</td>
                                    <td>{bicycle.bicycle_pdf.split(/[/\\]/).pop()}</td>
                                    <td>{bicycle.brand}</td>
                                    <td>{bicycle.model}</td>
                                    <td>
                                        <button onClick={() => openEditForm(bicycle)}>Edit</button>
                                        <button onClick={() => deleteBicycle(bicycle)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="button-container">
                    <button onClick={openAddForm}>Add Bicycle</button>

                </div>
            </div>
            {addFormOpen && (
                <div className="popup-overlay">
                    <AddForm closeModal={closeAddForm} />
                </div>
            )}
            {editFormOpen && selectedBicycle && (
                <div className="popup-overlay">
                    <EditForm closeModal={closeEditForm} bicycle={selectedBicycle} />
                </div>
            )}
        </div>
    );
}

export default Manage;