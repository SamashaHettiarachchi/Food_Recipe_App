import React, { useState, useEffect } from 'react'
import axios from 'axios'
import foodImg from '../assets/Cake_image.jpg'
import { BsFillStopwatchFill } from "react-icons/bs";
import { FaHeart } from "react-icons/fa";

const RecipeItems = () => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                setLoading(true);
                const response = await axios.get('http://localhost:5000/api/recipe');
                console.log('API Response:', response.data);
                setRecipes(response.data.recipes || []);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching recipes:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchRecipes();
    }, []);

    if (loading) return <div style={{ color: "black", padding: "20px", textAlign: "center" }}>Loading recipes...</div>;
    if (error) return <div style={{ color: "red", padding: "20px", textAlign: "center" }}>Error: {error}</div>;

    return (
        <div className='card-container' style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", 
            gap: "20px", 
            padding: "20px",
            maxWidth: "1200px",
            margin: "0 auto"
        }}>
            {recipes.length === 0 ? (
                <div style={{ color: "black", padding: "20px", textAlign: "center" }}>No recipes found</div>
            ) : (
                recipes.map((item, index) => {
                    return (
                        <div className='card' key={item._id || index} style={{ 
                            border: "1px solid #ddd", 
                            borderRadius: "8px", 
                            margin: "10px", 
                            padding: "15px",
                            backgroundColor: "white",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                        }}>
                            <img src={foodImg} width='120px' height="100px" alt={item.title} style={{ borderRadius: "4px" }} />
                            <div className='card-body'>
                                <div className='title' style={{ 
                                    color: "black", 
                                    fontSize: "18px", 
                                    fontWeight: "bold", 
                                    marginBottom: "10px" 
                                }}>
                                    {item.title}
                                </div>
                                <div className='icons' style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <div className='timer' style={{ 
                                        color: "black", 
                                        display: "flex", 
                                        alignItems: "center", 
                                        gap: "5px" 
                                    }}>
                                        <BsFillStopwatchFill style={{ color: "#666" }} /> 
                                        {item.time || item.cookingTime || 'N/A'} mins
                                    </div>
                                    <div className='love' style={{ color: "red", cursor: "pointer" }}>
                                        <FaHeart />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })
            )}
        </div>
    )
}

export default RecipeItems
