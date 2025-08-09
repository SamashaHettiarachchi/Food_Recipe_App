import React from "react"
import'./App.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Home from './pages/Home'
import MainNavigation from './components/MainNavigation'
import axios from 'axios'

const getAllRecipes = async () => {
  // Logic to fetch all recipes
  let getAllRecipes = [];
  await axios.get('http://localhost:5000/api/recipes').then(res=>{
    getAllRecipes = res.data;
  });
  return getAllRecipes;
}

const router = createBrowserRouter([
  {
    element: <MainNavigation />,
    children: [
      { path: "/", element: <Home /> },
    ]
  }
])

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}
