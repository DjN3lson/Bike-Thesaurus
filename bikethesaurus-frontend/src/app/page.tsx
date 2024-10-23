"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';

import './css/home.css';
import Navbar from './Navbar';
import Searchbar from './Searchbar';

interface Bicycle {
  model: string;
  manual: string;
}

export default function Home() {
  const MyComponent = () => {
    const [data, setData] = useState('');

    const fetchData = async () => {
      try {
        const response = await fetch('/app/bicycles');
        const result = await response.text();
        setData(result);
      } catch (error) {
        console.error('Error fetching data: ', error)
      }
    };
    useEffect(() => {
      fetchData();
    }, []);

    return <div>{data}</div>
  }
  const [searchTerm, setSearchTerm] = useState(''); //searchBar
  const [bicycles, setBicycles] = useState<Bicycle[]>([]); //bicycle db
  const [manualUrl, setManualUrl] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5328/app/bicycles')
      .then(response => {
        setBicycles(response.data)
      })
      .catch(error => {
        console.error("Error fetching bicycles: ", error);
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header"></header>
      <Navbar />
      <Searchbar />
      {/* <MyComponent /> */}
    </div>
  );
}
