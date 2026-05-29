import { createContext, useEffect, useState } from "react";
import { food_list, food_list as initialList } from "../assets/assets";
import axios from "axios";

export const StoreContext = createContext();

const StoreContextProvider = ({ children }) => {
    const [foodList, setFoodList] = useState(initialList);
    const [cartItems, setCartItems] = useState({});

    const url = import.meta.env.VITE_BACKEND_URL || "https://tomato-bite-backend.vercel.app";

    const addToCart = (itemId) => {
        if (!cartItems[itemId]) {
            setCartItems((prev) => ({ ...prev, [itemId]: 1 }))
        }
        else {
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1}))
        }
    }

    const removeFromCart = (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }))
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = foodList.find((product) => product._id === item) || food_list.find((product) => product._id === item);
                if (itemInfo) {
                    totalAmount += itemInfo.price * cartItems[item];
                }
            }
        }
        return totalAmount;
    }

    const fetchFoodList = async () => {
        try {
            const response = await axios.get(url + "/api/food/list");
            if (response.data.success && response.data.data && response.data.data.length > 0) {
                const backendFoods = response.data.data.map(item => ({
                    ...item,
                    image: url + "/images/" + item.image
                }));
                setFoodList(backendFoods);
            } else {
                setFoodList(initialList);
            }
        } catch (error) {
            console.log("Error fetching food list from backend:", error.message);
            setFoodList(initialList);
        }
    }

    useEffect(() => {
        fetchFoodList();
    }, []);

    const contextValue = {
        food_list: foodList,
        setFoodList,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;