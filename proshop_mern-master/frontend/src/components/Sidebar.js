import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getHighestRatingProducts } from './../actions/productActions';

function Sidebar() {
    const dispatch = useDispatch();
    const state = useSelector((state) => state);
    console.log('State',state);
    const { highestRatingProducts } = state;
    const { products } = highestRatingProducts;

    useEffect(() => {
        dispatch((getHighestRatingProducts()))
    }, [dispatch]);

    return (
        <div className="sidebar">
            <h2>HIGHEST RATING</h2>
            <ul className="highest-rating-products">
                {products.map(product => (<li key={product._id}>{product.name}</li>))}  
            </ul>
        </div>
    )
}

export default Sidebar
