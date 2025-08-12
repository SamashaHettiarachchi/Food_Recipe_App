import React from "react";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import AddRecipe from "./pages/AddRecipe";
import MainNavigation from "./components/MainNavigation";
import axios from "axios";

const getAllRecipes = async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/recipe");
    return response.data;
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return []; // Return empty array if there's an error
  }
};

const LoadingSpinner = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      background: "linear-gradient(135deg, #f8f9fa 0%, #fff 50%)",
      fontFamily: "Arial, sans-serif",
    }}
  >
    <div
      style={{
        textAlign: "center",
        color: "#333",
      }}
    >
      <div
        style={{
          width: "50px",
          height: "50px",
          border: "4px solid #e9ecef",
          borderTop: "4px solid #ffc107",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
          margin: "0 auto 20px",
        }}
      ></div>
      <h2>Loading FoodieHub...</h2>
    </div>
  </div>
);
const getMyRecipe=async()=>{
  let user = JSON.parse(localStorage.getItem("user"));
  let getAllRecipes=await getAllRecipes()
  return getAllRecipes.filter(recipe => recipe.createdBy === user._id);
}

const router = createBrowserRouter([
  {
    element: <MainNavigation />,
    children: [
      { path: "/", element: <Home />, loader: getAllRecipes },
      { path: "/myRecipes", element: <Home /> , loader: getMyRecipe },
      { path: "/favourite", element: <Home /> },
      { path: "/addRecipe", element: <AddRecipe /> },
    ],
  },
]);

export default function App() {
  return (
    <>
      <RouterProvider router={router} fallbackElement={<LoadingSpinner />} />
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
