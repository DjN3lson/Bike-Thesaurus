import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";

import './css/Searchbar.css';
import BicycleList from "./BicycleList";

function Searchbar() {
    const [bicycles, setBicycles] = useState([]);
    const [filteredBicycles, setFilteredBicycles] = useState([]);
    

    const fetchAPI = async () => {
        try {
            const response = await fetch("http://localhost:5000/bicycles");
            const data = await response.json()
            setBicycles(data.bicycles)
            setFilteredBicycles(data.bicycles)
            console.log(data.bicycles)
        } catch (error) {
            console.error("Error fetching bicycles", error)
        }

    }

    const inputHandler = (e) => {
        const lowerCase = e.target.value.toLowerCase();
        const filtered = bicycles.filter((bicycle) =>{
            const brandMatch = bicycle.brand ? bicycle.brand.toLowerCase().includes(lowerCase): false;
            const modelMatch = bicycle.model ? bicycle.model.toLowerCase().includes(lowerCase): false;
            const modelIdMatch = bicycle.model_id ? bicycle.model_id.toString().includes(lowerCase):false;

            return brandMatch || modelMatch || modelIdMatch;
        });
        setFilteredBicycles(filtered);
    }

    useEffect(() => {
        fetchAPI();
    }, [])

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
                <div className="searchbarList">
                    <BicycleList bicycles={filteredBicycles} />
                </div>

            </div>
        </>
    )
}

export default Searchbar;