import React,{createContext, useState, useEffect} from "react";
import axios from "axios";

//context
const ProductContext = createContext()

//provider
const ProductProvider =({children}) => {
    //Global state
    const [products, setProducts] = useState([]);

    //BaseURL Setting
    // axios.defaults.baseURL = "http://192.168.0.106:8080"   //home
    // axios.defaults.baseURL = "http://192.168.0.105:8080"   //home 5G
    axios.defaults.baseURL = "http://192.168.29.251:8080"  //office
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
