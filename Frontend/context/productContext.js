import React,{createContext, useState, useEffect} from "react";
import axios from "axios";

//context
const ProductContext = createContext()

//provider
const ProductProvider =({children}) => {
    //Global state
    const [products, setProducts] = useState([]);

    const fetchProducts = async () => {
        try {
            const res = await axios.get('/get-products');
            if (res.data.success) {
                setProducts(res.data.products);
            }
        } catch (error) {
            console.error('Failed to fetch products:', error);
        }
    };

    useEffect(() => {
            fetchProducts();
    }, []);
    
    return (
        <ProductContext.Provider value ={[products, setProducts, fetchProducts]}>
            {children}
        </ProductContext.Provider>
    )
};

export {ProductContext, ProductProvider}

