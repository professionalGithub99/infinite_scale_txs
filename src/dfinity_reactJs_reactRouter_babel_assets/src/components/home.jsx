import React, { useState, useEffect, useContext } from "react";
import Box from "@mui/material/Box";
import { useParams } from "react-router";


import Navbar from "./Navbar";
import Hero from "./Hero";
import Roadmap from "./Roadmap";
import Mint from "./Mint";
import Team from "./Team";

//toasts
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//context
import { ThemeContext } from "../context/theme/index.js";

export default function Home(params) {

  const {theme} = useContext(ThemeContext);

    return (
      <>
          <ToastContainer progressStyle={{
              background: `${theme}`
          }} closeOnClick />
        <Box>
            <Navbar />
            <Hero />
            <Roadmap />
            <Team />
            <Mint />
        </Box>
      </>

    )
}