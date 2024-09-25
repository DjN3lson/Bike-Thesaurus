import { React, useState } from 'react';
import data from "./ListData.json";

function List(props) {
    const filteredData = data.filter((el) =>{
        if(props.input===''){
            return el;
        }else{
            return el.text && el.text.toLowerCase().includes(props.input);
        }
    })
    return (
        <div className="list">
        <ul>
            {filteredData.map((item) => (
                <li key={item.id}>{item.model} -- {item.manual}
                <br />-------</li>
            ))}
        </ul>
        </div>
    )
}

export default List;