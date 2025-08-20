import React from "react";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import AddRecipe from "./pages/AddRecipe";
import EditRecipe from "./pages/EditRecipe";
import RecipeDetails from "./pages/RecipeDetails";
import MainNavigation from "./components/MainNavigation";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import axios from "axios";
import { API_BASE_URL } from "./config";

const getAllRecipes = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/recipe`);
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
const getMyRecipes = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return [];
    }
    const response = await axios.get(`${API_BASE_URL}/api/recipe/my-recipes`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching my recipes:", error);
    return [];
  }
};

const getFavoriteRecipes = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return [];
    }
    const response = await axios.get(`${API_BASE_URL}/api/recipe/favorites`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching favorite recipes:", error);
    return [];
  }
};

const getRecipeById = async ({ params }) => {
  try {
    console.log("Fetching recipe with ID:", params.id);
    const response = await axios.get(`${API_BASE_URL}/api/recipe/${params.id}`);
    console.log("Recipe data received:", response.data);
    return { recipe: response.data };
  } catch (error) {
    console.error("Error fetching recipe:", error);
    return { recipe: null, error: "Recipe not found" };
  }
};

const router = createBrowserRouter([
  {
    element: <MainNavigation />,
    children: [
      { path: "/", element: <Home />, loader: getAllRecipes },
      { path: "/myRecipes", element: <Home />, loader: getMyRecipes },
      { path: "/favourite", element: <Home />, loader: getFavoriteRecipes },
      { path: "/addRecipe", element: <AddRecipe /> },
      {
        path: "/editRecipe/:id",
        element: <EditRecipe />,
        loader: getRecipeById,
      },
      {
        path: "/recipe/:id",
        element: <RecipeDetails />,
        loader: getRecipeById,
      },
    ],
  },
]);

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <RouterProvider router={router} fallbackElement={<LoadingSpinner />} />
      </ToastProvider>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </AuthProvider>
  );
}
