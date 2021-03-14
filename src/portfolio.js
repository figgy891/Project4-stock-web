import React, { useState, useEffect } from 'react';

function Portfolio(props) {

    const [currentStock, setStock] = useState();
    //const [ticker, setTicker] = useState('');
    const [buyQuantity, setBuyQuantity] = useState(0);
    const [setTask, setStatusTask] = useState(0);

    let balance = props.cash.value;

    const onBuyChange = async (ev) => {
        setBuyQuantity(ev.currentTarget.value);
    }

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

        //updateWallet();
        //console.log(balance);

        //window.location.reload();

    };

    const fetchQuote = async (ev) => {
        const res = await fetch(`http://localhost:3000/api/v1/portfolio/search/${ev}`);
        let json = await res.json();
        console.log(json);
        setStock(json);
        console.log("I was here!!!")
        console.log(setTask)
    };

    // const fetchPortfolio = async () => {
    //     const res = await fetch(`http://localhost:3000/api/v1/portfolio`);
    //     let json = await res.json();
    //     console.log(json);
    //     setStock(json);
    //     //setTicker(inputText);

    // };


    const buyStock = async () => {

        // check if the quantity is not 0
        // check if the user has enough cash in the wallet to be able to make a purchase
        // if not show an error
        // if yes, make a purchase and add a field in the portfolio table
        //tickerExists()
        console.log(currentStock.data.price)
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


        if (props.port.find(item => item.symbol === setTask)) {
            // make the purchase
            // making a field in the database table
            console.log('I was here!!!!!!!')
            const q = props.port.filter(item => item.symbol === setTask).map(item => item.quantity);
            const newQuantity = Number(q) + Number(buyQuantity);
            const p = props.port.filter(item => item.symbol === setTask).map(item => item.price);
            const newPrice = Number(p) + currentStock.data.price;
            const id = props.port.filter(item => item.symbol === setTask).map(item => item.id);
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

            //setPurchase(cashNeeded);

            //console.log("I was here!!!")
            balance = props.cash.value - cashNeeded;

            updateWallet();
            setBuyQuantity(0)

            //alert('Success!')


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

        // //window.location.reload();
    };

    return (
        <div className={'border-2 p-5'}>
            <h1 className={'text-xl font-bold'}>Portfolio</h1>
            {props.port && <table className={'w-full'}>
                <thead className={'bg-gray-200'}>
                    <th className={'border border-black'}>Stock</th>
                    <th className={'border border-black'}>Quantity</th>
                    <th className={'border border-black'}>Value</th>
                </thead>
                <tbody>
                    {props.port.map((item, idx) => {
                        return <tr key={idx}>
                            <td className={'border border-black text-center'}>{item.symbol}
                                <input type="checkbox" value={item.symbol}
                                    className={'mr-3 float-right '}
                                    onChange={(e) => {setStatusTask(e.target.checked); fetchQuote()}} />
                            </td>
                            <td className={'border border-black text-center'}>{item.quantity}</td>
                            <td className={'border border-black text-center'}>{item.price}</td>
                        </tr>

                    })}


                </tbody>
                <tbody>
                    <td className={'border border-black text-center'}>Cash</td>
                    <td className={'border border-black text-center'}></td>
                    {props.cash && <td className={'border border-black text-center'}>${props.cash.value}</td>}
                </tbody>
            </table>}

            {!props.port && <h1>Loading...</h1>}

            <br />
            
            {/* {props.cash && <h1 className={'text-xl font-bold'}>${props.cash.value}</h1> */}
            {setTask && <div>
                <input type="number" value={buyQuantity} className={'border border-black '} onChange={onBuyChange} />&nbsp;&nbsp;
            <button onClick={buyStock} className={'bg-red-600 cursor-pointer rounded text-white text-l pl-5 pr-5'}>Sell</button>
            </div> }  
        </div>
    );
}

export default Portfolio;
