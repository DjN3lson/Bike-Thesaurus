import axios from "axios";
import React, { useEffect, useState } from "react";

import './css/editform.css';

const EditForm = ({ closeModal, bicycle = {} }) => {
    const [brand, setBrand] = useState(bicycle.brand || "");
    const [model, setModel] = useState(bicycle.model || "");
    const [newPdf, setNewPdf] = useState(null);
    const [PDFs, setPDFs] = useState(bicycle.pdfs || []);
    const allowedExtensions = ['pdf', 'png', 'doc', 'jpg', 'docx', 'txt', 'jpeg'];

    /* ───────── setters cuando cambia la bicicleta ───────── */
    useEffect(() => {
        setBrand(bicycle.brand || "");
        setModel(bicycle.model || "");
        setPDFs(bicycle.pdfs || []); // Reset file input on bicycle change
        setNewPdf(null);
    }, [bicycle]);

    /* ───────── borrar PDF individual ───────── */
    const deletePdf = async (pdfId) => {
        if (!window.confirm("Delete this PDF?")) return;

        try {
            await axios.delete(`http://localhost:5000/delete_bicycle_pdf/${pdfId}`);
            setPDFs(prev => prev.filter(pdf => pdf.id !== pdfId));
        } catch (err) {
            alert("Error deleting PDF");
            console.error(err);
        }
    };

    const editBicycle = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('brand', brand);
        formData.append('model', model);
        if (newPdf) {
            formData.append('pdfs', newPdf); // 'pdfs' is the key expected by your backend
        }
        const url = `http://localhost:5000/editbicycle/${bicycle.id}`;
        try {
            const response = await fetch(url, {
                method: "PATCH",
                body: formData
            });
            const message = await response.json();
            if (response.status !== 200) {
                alert(message.message);
                console.log(message.message);
            } else {
                alert("Bicycle has been updated");
            }
        } catch (error) {
            alert("Error: " + error);
        }
        closeModal();
        // Optionally, trigger a refresh in parent
    };

    /* ───────── UI ───────── */
    return (
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
                <div className="PDFList">
                    <label>PDF List: </label>
                    <ul>
                        {PDFs.length ? PDFs.map(p => (
                            <li key={p.id}>
                                <a
                                    href={`http://localhost:5000/uploads/${p.bicycle_pdf}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {p.bicycle_pdf.split(/[/\\]/).pop()}
                                </a>
                                <button
                                    type="button"
                                    className="DeletePDFButton"
                                    onClick={() => deletePdf(p.id)}
                                >
                                    X
                                </button>
                            </li>
                        )) : <li>No PDFs</li>}
                    </ul>
                </div>
                <div>
                    <label>Upload PDF: </label>
                    <input
                        type="file"
                        name="bicycle_pdf"
                        id="bicycle_pdf"
                        onChange={(e) => setNewPdf(e.target.files[0])}
                        accept={allowedExtensions.map(ext => `.${ext}`).join(',')}
                    />
                </div>
                <button type="submit">Update Bicycle</button>
            </form>
        </div>
    );
};

export default EditForm;