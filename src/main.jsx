import { Stats } from "@react-three/drei"
import React from "react"
import ReactDOM from "react-dom/client"
// import App from "./App.jsx"
import AppEmpty from "./AppEmpty"
import AppTextureGenerator from "./AppTextureGenerator"
import AppRapier from "./AppRapier"
let App
// App = AppTextureGenerator
// App = AppRapier
App = AppEmpty
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
    <Stats />
  </React.StrictMode>
)
