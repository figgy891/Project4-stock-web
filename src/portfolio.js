import React, { useState, useEffect } from 'react';

function Portfolio(props) {

    const [currentWallet, setCurrentWallet] = useState([]);
    const [currentPortfolio, setCurrentPortfolio] = useState([]);
    const [setId, setCurrentId] = useState();
    const [setTask, setStatusTask] = useState();
    const [buyQuantity, setBuyQuantity] = useState(0);
    const [currentStock, setStock] = useState();
    const [currentQuantity, setCurrentQuantity] = useState(0);
    const [ticker, setTicker] = useState();

    const fetchQuote = async (name) => {
        const res = await fetch(`http://localhost:3000/api/v1/portfolio/search/${name}`);
        let json = await res.json();
        console.log(json);
        setStock(json);
        setTicker(name);
        //setInputText('');



    };


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


    const sellStock = async (id) => {
        console.log('selling the stock with the id number', id);

        await fetch(`http://localhost:3000/api/v1/portfolio/${id}`, { method: 'DELETE' })
        alert('Success!');
        window.location.reload();
    };
      
    const onBuyChange = async (ev) => {
        setBuyQuantity(ev.currentTarget.value);
    }


    return (
        <div className={'border-2 p-5'}>
            <h1 className={'text-xl font-bold'}>Portfolio</h1>
            {currentPortfolio && <table className={'w-full'}>
                <thead className={'bg-gray-200'}>
                    <th className={'border border-black'}>Stock</th>
                    <th className={'border border-black'}>Quantity</th>
                    <th className={'border border-black'}>Value</th>
                    <th className={'border border-black'}>Sell</th>
                </thead>
                <tbody>
                    {currentPortfolio.map((item, idx) => {
                        return <tr key={idx}>
                            <td className={'border border-black text-center'}>{item.symbol}</td>
                            <td className={'border border-black text-center'}>{item.quantity}</td>
                            <td className={'border border-black text-center'}>{item.price}</td>
                            <td className={'border border-black text-center'}>
                                <input type="checkbox" id={item.id} value={item.quantity} name={item.symbol}
                                    className={'mr-3 float-right '}
                                    onChange={(e) => {setStatusTask(e.target.checked); setCurrentId(e.target.id); setCurrentQuantity(e.target.value);
                                    fetchQuote(e.target.name)}} />
                            </td>
                        </tr>

                    })}


                </tbody>
                <tbody>
                    <td className={'border border-black text-center'}>Cash</td>
                    <td className={'border border-black text-center'}></td>
                    {currentWallet && <td className={'border border-black text-center'}>${currentWallet.value}</td>}
                </tbody>
            </table>}

            {!currentPortfolio && <h1>Loading...</h1>}

            <br />

            {setTask && <div>
                <h1 className={'text-2xl'}>{ticker}: {currentStock && <span>you have {currentQuantity} shares at ${currentStock.data.price} per share.</span>}</h1>
                {/* <input type="number" value={buyQuantity} className={'border border-black '} onChange={onBuyChange} />&nbsp;&nbsp; */}
            <button onClick={() => { sellStock(setId); }} className={'bg-red-600 cursor-pointer rounded text-white text-l pl-5 pr-5'}>Sell</button>
            </div>}
        </div>
    );
}

export default Portfolio;
