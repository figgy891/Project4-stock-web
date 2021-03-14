import React, { useState, useEffect } from 'react';
import '../node_modules/react-linechart/dist/styles.css';
import App from "./App";
// import yahooFinance from 'yahoo-finance';
// import yahooStockPrices from 'yahoo-stock-prices'



function Search(props) {
    
    const [inputText, setInputText] = useState('');
    const [currentStock, setStock] = useState();
    const [ticker, setTicker] = useState('');
    const [buyQuantity, setBuyQuantity] = useState();
    //const [tickerSymbol, setTickerSymbol] = useState([]);

    let balance = props.cash.value;
    // let tickerSymbol = '';

    //const [purchase, setPurchase] = useState(0);
    //const [currentBalance, setBalance] = useState(props.cash.value);

    //let wallet = (props.cash.value);

    // const currentWallet = (props.cash.value);
    //console.log(cashOnHand);
    // const fetchWallet = async () => {
    //     const res = await fetch(`http://localhost:3000/api/v1/wallet`);
    //     let json = await res.json();
    //     console.log(json);
    //     setCurrentWallet(json);
    // };



    const updateWallet = async () => {

        const res = await fetch("http://localhost:3000/api/v1/wallet/1", {
            method: "PUT",
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({
                value: balance
            })
        })
        let json = await res.json();
        console.log(json)
        console.log(balance)

        //window.location.reload();

    };

    const fetchQuote = async () => {
        const res = await fetch(`http://localhost:3000/api/v1/portfolio/search/${inputText}`);
        let json = await res.json();
        console.log(json);
        setStock(json);
        setTicker(inputText);
        setInputText('');
               


    };

    const onInputChange = async (ev) => {
        console.log(ev.currentTarget.value)
        setInputText(ev.currentTarget.value);
    };

    // User clicks on the buy button
    // on button click you trigger a function 
    // make a POST request to the API and update the Portfolio

    const buyStock = async () => {
        
        // check if the quantity is not 0
        // check if the user has enough cash in the wallet to be able to make a purchase
        // if not show an error
        // if yes, make a purchase and add a field in the portfolio table
        //tickerExists()

        if (buyQuantity == 0) {
            alert("Buy quantity needs to be greater than 0!")
            return null;
        }

        let cashNeeded = buyQuantity * currentStock.data.price;
        console.log('cashNeeded is', cashNeeded)
        //console.log(currentBalance)
        if (cashNeeded > props.cash.value) {
            alert("You don't have enough cash!");
            // return null;
        }

        if (props.port.find(item => item.symbol === ticker)) {
            // make the purchase
            // making a field in the database table
            console.log('I was here!!!!!!!')
            const q = props.port.filter(item => item.symbol === ticker).map(item => item.quantity);
            const newQuantity = Number(q) + Number(buyQuantity);
            const p = props.port.filter(item => item.symbol === ticker).map(item => item.price);
            const newPrice = Number(p) + currentStock.data.price;
            const id = props.port.filter(item => item.symbol === ticker).map(item => item.id);
            console.log("I was here first!!!")
            console.log(newQuantity)
            console.log(newPrice)
            //console.log(tickerSymbol)
            const res = await fetch(`http://localhost:3000/api/v1/portfolio/${id}`, {
                method: "PUT",
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json;charset=utf-8',
                },
                body: JSON.stringify({
                    quantity: newQuantity,
                    price: newPrice
                })
            })
            let json = await res.json();
            console.log(json)

            balance = props.cash.value - cashNeeded;
           
            updateWallet();
            setBuyQuantity(0)

            alert('Success!')

           
        } else {
            console.log("I was here second!!!")
            //console.log(props.port.symbol)
            //console.log(tickerSymbol)
            const res = await fetch("http://localhost:3000/api/v1/portfolio", {
                method: "POST",
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json;charset=utf-8',
                },
                body: JSON.stringify({
                    symbol: ticker,
                    quantity: buyQuantity,
                    price: currentStock.data.price
                })
            })
            let json = await res.json();
            console.log(json)

            //setPurchase(cashNeeded);
            //console.log(cashNeeded);

            //console.log("I was here!!!")
            balance = props.cash.value - cashNeeded;
            //setBalance(balance);
            updateWallet();
            setBuyQuantity(0)

            alert('Success!')
        }
        // const res = await fetch("http://localhost:3000/api/v1/wallet/3", {
        //     method: "PUT",
        //     headers: {
        //         'Accept': 'application/json, text/plain, */*',
        //         'Content-Type': 'application/json;charset=utf-8',
        //     },
        //     body: JSON.stringify({
        //         value: balance
        //     })
        // })
        // let json = await res.json();
        // console.log(json)
        // console.log(balance)

        // //updateWallet();
        // //console.log(balance);

        window.location.reload();
    };

    const onBuyChange = async (ev) => {
        setBuyQuantity(ev.currentTarget.value);
    }

    return (
        <div className={'border p-5'}>

            <div className="grid grid-cols-2">
                <div className={'border p-5'}>
                    <input value={inputText} onChange={onInputChange} type="text" className={'border w-full p-3 rounded-full border-gray-300'} />
                </div>
                <div className={'border p-5'}>
                    <span onClick={fetchQuote} className={'bg-gray-600 cursor-pointer p-2 rounded text-white text-xl pl-5 pr-5'}>Get Quote</span>
                </div>
            </div>

            {ticker && <div className="grid grid-cols-2">
                <div className={'border p-5'}>
                    <ul>
                        <h1 className={'text-2xl'}>{ticker}: {currentStock && <span>{currentStock.data.currency} {currentStock.data.price}</span>}</h1>
                        {/* {getQuote && <h1 className={'text-2xL'}>PRICE: </h1>} */}
                    </ul>

                </div>
                <div className={'border p-5'}>
                    {/* {()=> {buyStock(); window.location.reload()}} */}
                    <span className={'items-center flex justify-center'}>
                        <input type="number" value={buyQuantity} className={'border'} onChange={onBuyChange} />&nbsp;&nbsp;
                        <button onClick={buyStock} className={'bg-blue-600 cursor-pointer p-2 rounded text-white text-xl pl-5 pr-5'}>Buy</button>&nbsp;&nbsp;&nbsp;

                        <button className={'bg-red-600 cursor-pointer p-2 rounded text-white text-xl pl-5 pr-5'}>Sell</button>
                    </span>
                </div>
            </div>}

        </div>
    );
}

export default Search;
