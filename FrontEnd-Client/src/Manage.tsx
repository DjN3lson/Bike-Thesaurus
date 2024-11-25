import React, { useEffect, useState } from "react";
import axios from "axios";

import Register from "./Register";

interface Bicycle {
    id:number;
    model:string;
    brand:string;
    model_id:number;
}

function Manage(){
    const [bicycles, setBicycles] = useState<Bicycle[]>([]);
    

    useEffect(() => {
        const fetchBicycles = async () => {
            try {
                const bicycle = await axios.get("http://localhost:5000/api/bicycles");
                setBicycles(bicycle.data.bicycles);
            }catch(error){
                console.error("Error fetching bicycles", error);
            }
        };

        fetchBicycles();
    }, [])

    return(
        <>
        {/* Manage Manual Files... CRUD of Bicycles Manuals */}
            <h1>Bicycle List</h1>
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
        </>
    )
}

export default Manage;