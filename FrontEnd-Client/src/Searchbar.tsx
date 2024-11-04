import React, { useState, useEffect } from "react";

import TextField from "@mui/material/TextField";
import axios from 'axios';


import './css/Searchbar.css';

function Searchbar() {
    // const [inputText, setInputText] = useState('');
    const [allBicycles, setAllBicycles] = useState([]);
    const [filteredBicycles, setFilteredBicycles] = useState([]);

    const inputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const lowerCase = e.target.value.toLowerCase();
        const filtered = allBicycles.filter((bicycle:string) =>
            bicycle.toLowerCase().includes(lowerCase)
    );
    setFilteredBicycles(filtered);
    }



    const fecthAPI = async () => {
        const response = await axios.get("http://localhost:8000/api/bicycles");
        setAllBicycles(response.data.bicycles);
        setFilteredBicycles(response.data.bicycles);
    }

    useEffect(() => {
        fecthAPI();
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
                {filteredBicycles.map((bicycles, index) => (
                    <div key={index} className="searchbarList">
                        <span>{bicycles}</span> <br />
                    </div>
                ))}
            </div>
        </>
    )
}

export default Searchbar;