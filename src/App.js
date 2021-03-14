import logo from './logo.svg';
import './App.css';
import Search from "./search";
import Portfolio from "./portfolio";
import React, { useState, useEffect } from 'react';

function App() {
  const [currentWallet, setCurrentWallet] = useState([]);
  const [currentPortfolio, setCurrentPortfolio] = useState([]);

  const fetchWallet = async () => {
    const res = await fetch(`http://localhost:3000/api/v1/wallet`);
    let json = await res.json();
    console.log(json);
    setCurrentWallet(json);
  };

  const fetchPortfolio = async () => {
    const res = await fetch(`http://localhost:3000/api/v1/portfolio`);
    let json = await res.json();
    console.log(json);
    setCurrentPortfolio(json);
    
  };

  //runs on component load
  useEffect(() => {
    fetchWallet()
    fetchPortfolio()
  }, [])

  return (
    <>

      <div className={'w-full p-5 bg-blue-200 border-b-2 border-blue-400'}>
        <h1 className={'text-xl font-bold text-center text-blue-600 tracking-wider uppercase'}>Paper Trader</h1>

      </div>

      <div className="grid grid-cols-2">
        <Search cash={currentWallet} port={currentPortfolio} refresh={fetchPortfolio}/>
        <Portfolio cash={currentWallet} port={currentPortfolio}/>

      </div>


    </>
  );
}

export default App;
