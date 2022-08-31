import React, { useState, useEffect, useContext } from "react";
import { ThemeContext } from '../context/theme';
import Box from "@mui/material/Box";
import NavbarDash from "./NavbarDash";
import DashTop from "./DashTop";
import DashBottom from "./DashBottom";
import Progress from "./Progress";

export default function Dashboard() {

    const {theme} = useContext(ThemeContext);

    const [selectedPrincipal, setSelectedPrincipal] = useState(null);
    const [stateEffect, setStateEffect] = useState(false);
    const [netapy, setNetapy] = useState(null);
    const [currentBorrow, setCurrentBorrow] = useState(null);

    // useEffect(async () => {
    //     const canisterId = "fggox-qyaaa-aaaah-abkbq-cai";
    //     const address = await window.ic?.plug?.getPrincipal();
    
    //     const agent = new HttpAgent({
    //         host: "https://fggox-qyaaa-aaaah-abkbq-cai.raw.ic0.app",
    //     });
    //     const anoactor = Actor.createActor(idlFactory, {
    //         agent,
    //         canisterId,
    //     });
    //     if(address != null) {
    //         try {
    //           let result = await anoactor.getStats(address);
    //           let apy = (Number(result.netApy) / 1000000000000000000).toFixed(2).toString();
    //           setNetapy(apy);
    //         } catch(e) {
    //           console.log(e)
    //         }
    //     }
    //     setStateEffect(!stateEffect)
    // }, [stateEffect]);

    return (
        <Box>
            <Box className={theme === '#6bcb77' ? 'dash-wrap-whole' : theme === '#ff6b6b' ? 'dash-wrap-whole-red' : theme === '#4d96ff' ? 'dash-wrap-whole-blue' : theme === '#ffd93d' ? 'dash-wrap-whole-yellow' : theme === '#595959' ? 'dash-wrap-whole-gray' : theme === '#8f6bcb' ? 'dash-wrap-whole-purple' : ''}>
                <NavbarDash />
                <DashTop principal={selectedPrincipal} />
                <Progress currentBorrow={currentBorrow} />
                <DashBottom setSelectedPrincipal={setSelectedPrincipal} setCurrentBorrow={setCurrentBorrow} />
            </Box>
        </Box>
    )
}