import React, { useState, useContext } from "react";
import { useNavigate } from "react-router";
import { ThemeContext } from '../context/theme'
import Logo from "../../assets/newLogo.svg";
import "../style/main.css"
import Bucket from "../../assets/bucket.svg";
import Discord from "../../assets/discordFinal.svg";
import Twitter from "../../assets/twitterFinal.svg";

//color picker
import { CirclePicker } from 'react-color';

//material
import Box from "@mui/material/Box";

//toasts
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function Navbar() {
  const {theme, toggleTheme} = useContext(ThemeContext);
  const [picking, setPicking] = useState(false);

  const themeSetter = color => {
    toggleTheme(color);
    setPicking(false);
  }

    const comingSoon = () => toast("Lending/Borrowing Coming Soon!", {
        position: toast.POSITION.BOTTOM_RIGHT,
        theme: 'dark'
    });

    let navigate = useNavigate();

    return (
        <>
        <Box className="nav-wrap" style={{background: '#F3F3F4'}}>
            <img onClick={() => {navigate('/')}} className="logo-nav" src={Logo} alt="brand logo for finterest" />
            <Box className="nav-wrap-right">
            <Box className="community-box">
            <img src={Twitter} alt="twitter icon" className="community-text hover" style={{marginRight: '15px'}} onClick={() => {window.open('https://twitter.com/finterestICP')}} />
                <img src={Discord} alt="discord icon" className="community-text hover" onClick={() => {window.open('https://discord.gg/rnGcw3MB4N')}} />
            </Box>
            {/* {picking ? (
                <Box className="color-wrap-nav">
                    <CirclePicker className="colorpicker" colors={['#6BCB77', '#4D96FF', '#FF6B6B', '#FFD93D', '#595959']} onChange={color => themeSetter(color)} />
                </Box>
            ) : (
                <Box>
                <img className="hover bucket" alt="bucket" src={Bucket} onClick={() => {setPicking(true)}} />
                </Box>
            )} */}
            <Box className="app-button" style={{border: `2px solid ${theme}`, transition: 'var(--transition)', borderRadius: '25px'}} onClick={() => {
                    navigate('/dashboard')
                }}>
                <h3 className="app-button-text" style={{color: `${theme}`, transition: 'var(--transition)'}}>App</h3>
            </Box>
            </Box>
        </Box>
        </>
    )
}