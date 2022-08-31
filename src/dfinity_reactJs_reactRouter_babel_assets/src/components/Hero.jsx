import React, { useContext, useState } from "react";
import { ThemeContext } from "../context/theme/index.js";
import Box from "@mui/material/Box";
import Bubbles from './Bubbles.jsx'
import Arrow from "../../assets/arrow.svg";
import RedArrow from "../../assets/redArrow.svg";
import BlueArrow from "../../assets/blueArrow.svg";
import YellowArrow from "../../assets/yellowArrow.svg";
import GreyArrow from "../../assets/greyArrow.svg";
import Bucket from "../../assets/newbucket.svg";
import PurpleArrow from "../../assets/arrow-purple.svg";

//toasts
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//color picker
import { CirclePicker } from 'react-color';

export default function Hero() {

    //Color picker
    const {theme, toggleTheme} = useContext(ThemeContext);
    const [picking, setPicking] = useState(false);
    
    const themeSetter = color => {
        toggleTheme(color);
        setPicking(false);
    }

    const alertDocs = () => toast("Docs Coming Soon, Join Discord!", {
        position: toast.POSITION.BOTTOM_RIGHT,
        theme: 'dark'
    });

    return (
        <Box className="hero-wrap">
            <Box className="hero-bucket-box">
                {picking ? (
                    <Box className="color-wrap-nav-dash-bottom">
                        <CirclePicker width="10px" circleSize={20} colors={['#6BCB77', '#4D96FF', '#FF6B6B', '#8F6BCB', '#FFD93D', '#595959']} onChange={color => themeSetter(color)} />
                    </Box>
                ) : (
                    <Box className="theme-box-dash">
                        <img src={Bucket} className="hover bucket-dash" alt="bucket" onClick={() => {setPicking(true)}} />
                    </Box>
                )}
            </Box>

            <Box className="hero-top-wrap">
                <h1 className="hero-main-text">The first <span style={{color: theme, transition: 'var(--transition)'}}>crypto lending</span> protocol available on The Internet Computer</h1>
            </Box>
            <Box className="main-box-brand">
                <Box className="protocol-box">
                    <h2 className="hero-sub-text">Finterest is a truly decentralized borrow/lending protocol on The Internet Computer built to support Native Bitcoin borrow/lending.</h2>
                    <Box className="docs-arrow-box hover" onClick={alertDocs}>
                        <h5 className="protocol-text" style={{color: theme, transition: 'var(--transition)'}}>Protocol Docs</h5>
                        {theme === '#6bcb77' && (
                        <img style={{marginTop: '-.15%', marginLeft: '4px'}} src={Arrow} alt="arrow pointing forward" />
                        )}
                        {theme === '#ff6b6b' && (
                            <img style={{marginTop: '-.15%', marginLeft: '5px'}} src={RedArrow} alt="arrow pointing forward" />
                        )}
                        {theme === '#4d96ff' && (
                            <img style={{marginTop: '-.15%', marginLeft: '5px'}} src={BlueArrow} alt="arrow pointing forward" />
                        )}
                        {theme === '#ffd93d' && (
                            <img style={{marginTop: '-.15%', marginLeft: '5px'}} src={YellowArrow} alt="arrow pointing forward" />
                        )}
                        {theme === '#595959' && (
                            <img style={{marginTop: '-.15%', marginLeft: '5px'}} src={GreyArrow} alt="arrow pointing forward" />
                        )}
                        {theme === '#8f6bcb' && (
                            <img style={{marginTop: '-.15%', marginLeft: '5px'}} src={PurpleArrow} alt="arrow pointing forward" />
                        )}
                    </Box>
                </Box>
                <Box className="bubbles-wrap">
                    <Bubbles />
                </Box>
            </Box>
        </Box>
    )
}