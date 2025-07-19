import React,{createContext, useState, useEffect} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

//context
const AuthContext = createContext()

//provider
const AuthProvider =({children}) => {
    //Global state
    const [state, setState] = useState({
        user : null,
        token : "",
    });

    const [loading, setLoading] = useState(true);

    // BaseURL Settingr
    // axios.defaults.baseURL = "http://192.168.0.106:8080"   //home
    // axios.defaults.baseURL = "http://192.168.0.105:8080"   //home 5G
    axios.defaults.baseURL = "http://192.168.29.251:8080"  //office

    const getLocalStorageData = async () => {
        let data = await AsyncStorage.getItem('@auth')
        let loginData = JSON.parse(data)
        setState({...state, user: loginData?.user, token: loginData?.token})
        console.log('localdata',state)
        setLoading(false);
    };

    //initial local storage data
    useEffect(() => {
        getLocalStorageData();
    }, []);
    
    return (
        <AuthContext.Provider value ={[state, setState, getLocalStorageData, loading]}>
            {children}
        </AuthContext.Provider>
    )
};

export {AuthContext, AuthProvider}