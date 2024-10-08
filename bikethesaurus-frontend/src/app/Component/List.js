import { React, useState } from 'react';
import data from "./ListData.json";

function List(props) {
    const filteredData = data.filter((el) =>{
        const searchTerm = props.input.toLowerCase();
        return(
            el.brand.toLowerCase().includes(searchTerm) ||
            el.model.toLowerCase().includes(searchTerm)
        )
    })
    return (
        <div className="list">
        <ul>
            {filteredData.map((item) => (
                <li key={item.id}>{item.brand} {item.model}</li>
            ))}
        </ul>
        </div>
    )
}

export default List;