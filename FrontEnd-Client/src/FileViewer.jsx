import React, { useEffect, useState } from "react";
// import ReactPDF from "react-pdf";

import './css/fileviewer.css'

const FileViewer = ({closeModal, bicycle_pdf}) => {

    return (
        <>
            <div className="pdf-page">
                <div className="pdf-container">
                    <span className="close" onClick={closeModal}>&times;</span>
                    <iframe
                    src={`./{bicycle_pdf}`}
                    width="100%"
                    height="600px"
                    title="PDF Viewer"
                    onError={(e) => {
                        e.target.contentDocument.body.innerHTML = "Failed to load PDF"
                    }}
                />
                </div>
            </div>
        </>
    )
}

export default FileViewer;