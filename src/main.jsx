import { Stats } from "@react-three/drei"
import React from "react"
import ReactDOM from "react-dom/client"
// import App from "./App.jsx"
import AppTextureGenerator from "./AppTextureGenerator"
import AppRapier from "./AppRapier"
let App = AppTextureGenerator

App = AppRapier

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
    <Stats />
  </React.StrictMode>
)
