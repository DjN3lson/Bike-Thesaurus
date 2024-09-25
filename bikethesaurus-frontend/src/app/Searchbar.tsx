import React, { useState } from "react";

import './css/home.css';
import TextField from "@mui/material/TextField";
import List from './Component/List';
// Removed the import statement for List as it cannot be found

function Searchbar(){
    const [inputText, setInputText] = useState('');
    const inputHandler = (e: React.ChangeEvent<HTMLInputElement>) =>{
        const lowerCase = e.target.value.toLowerCase();
        setInputText(lowerCase);
    }


    return(
        <>
        <div className="search">
        <TextField
        id="outlined-basic"
        onChange={inputHandler}
        variant="outlined"
        fullWidth
        />
        </div>
        <div className="searchbarList">
            <List input={inputText}/>
        </div>
        </>
    )
}

export default Searchbar;