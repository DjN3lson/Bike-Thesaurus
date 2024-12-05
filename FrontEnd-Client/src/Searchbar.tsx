import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import axios from 'axios';

import './css/Searchbar.css';

interface Bicycle {
    id: number;
    model: string;
    brand: string;
    model_id: number;
    bicycle_pdf: string;
}

function Searchbar() {
    const [allBicycles, setAllBicycles] = useState<Bicycle[]>([]);
    const [filteredBicycles, setFilteredBicycles] = useState<Bicycle[]>([]);
    const [message, setMessage] = useState<string | null>(null);

    const fecthAPI = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/listbicycles");
            console.log("Fetched Bicycles", response.data)
            setAllBicycles(response.data);
            setFilteredBicycles(response.data);
            setMessage(null); 
        } catch (error: unknown) { 
            if (axios.isAxiosError(error)) { 
                if (error.response && error.response.status === 404) {
                    setMessage("No bicycles found in the database."); 
                } else {
                    console.error("Error fetching bicycles", error.message); 
                }
            } else {
                console.error("Unexpected error", error); 
            }
        }
    };

    useEffect(() => {
        fecthAPI();
    }, [])

    const inputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const lowerCase = e.target.value.toLowerCase();
        const filtered = allBicycles.filter((bicycle: { id: number, brand: string; model: string, model_id: number, bicycle_pdf: string; }) =>
            bicycle.brand.toLowerCase().includes(lowerCase) || bicycle.model.toLowerCase().includes(lowerCase)
        );
        setFilteredBicycles(filtered);
    }

    return (
        <>
            <div className="SearchContent">
                <div className="search">
                    <TextField
                        id="outlined-basic"
                        onChange={inputHandler}
                        variant="outlined"
                        fullWidth
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderWidth: '2px', // Set the desired border thickness
                                    borderColor: 'black', // Set the desired border color
                                },
                                '&:hover fieldset': {
                                    borderColor: 'black', // Set border color on hover
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: 'black', // Set border color when focused
                                },
                            },
                        }}
                    />
                </div>
                {message && <div className="notification">{message}</div>}
                {filteredBicycles.map((bicycle, index) => (
                    <div key={index} className="searchbarList">
                        <span>{bicycle.bicycle_pdf} -- {bicycle.model} {bicycle.brand} {bicycle.model_id}</span> <br />
                    </div>
                ))}
            </div>
        </>
    )
}

export default Searchbar;