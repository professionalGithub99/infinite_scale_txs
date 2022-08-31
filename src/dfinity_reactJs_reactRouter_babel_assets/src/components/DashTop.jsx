import React, { useState, useContext, useEffect } from "react";
import Box from "@mui/material/Box";
import { ThemeContext } from "../context/theme/index.js";
import { CirclePicker } from "react-color";
import { dfinity_reactJs_reactRouter_babel as Finterest } from "../../../declarations/dfinity_reactJs_reactRouter_babel";
import Bucket from "../../assets/newbucket.svg";

import { Principal } from '@dfinity/principal';
import {Actor, HttpAgent} from "@dfinity/agent";
import {idlFactory} from "./finrisk";
import { set } from "./modals/ICPSupply.jsx";

export let setdash = (arg, arg2) => {
  wallet = arg
  princ = arg2
}


let wallet;
let princ;
export default function DashTop(params) {
  const [balance, setBalance] = useState(null);
  const [netapy, setApy] = useState(null);
  const [borrow, setB] = useState(null);
  const [lending, setL] = useState(null);
  const [stateEffect, setStateEffect] = useState(false);
  const [refreshState, setRefresh] = useState(false);

  const setStats = (apy, borr, len) => {
    setApy(apy)
    setB(borr)
    setL(len)
  }
  useEffect(async () => {
      const canisterId = "fggox-qyaaa-aaaah-abkbq-cai";
  
      const agent = new HttpAgent({
          host: "https://fggox-qyaaa-aaaah-abkbq-cai.raw.ic0.app",
      });
      const anoactor = Actor.createActor(idlFactory, {
          agent,
          canisterId,
      });
      try {
        let result = await anoactor.getStats(params.principal);
        let lent = Number(result.totalLent) / 100_000_000
        let borr = Number(result.totalBorr) / 100_000_000
        let apy = Number(result.netApy) / 10000000000000000000
        setStats(apy.toFixed(2).toString(), borr.toFixed(2).toString(), lent.toFixed(2).toString())
      } catch(e) {
        console.log(e)
      }
      setStateEffect(!stateEffect)
  }, [stateEffect]);


  const { theme, toggleTheme } = useContext(ThemeContext);
  const [picking, setPicking] = useState(false);

  const themeSetter = (color) => {
    toggleTheme(color);
    setPicking(false);
  };

  return (
    <Box className="dashtop-wrap">
      <Box className="hero-bucket-box">
        {picking ? (
          <Box className="color-wrap-nav-dash-bottom">
            <CirclePicker
              width="10px"
              circleSize={20}
              colors={[
                "#6BCB77",
                "#4D96FF",
                "#FF6B6B",
                "#8F6BCB",
                "#FFD93D",
                "#595959",
              ]}
              onChange={(color) => themeSetter(color)}
            />
          </Box>
        ) : (
          <Box className="theme-box-dash">
            <img
              src={Bucket}
              className="hover bucket-dash"
              alt="bucket"
              onClick={() => {
                setPicking(true);
              }}
            />
          </Box>
        )}
      </Box>

      <Box
        className="dashtop-box"
        sx={{
          "@media screen and (min-width:340px) and (max-width:399px)": {
            display: "none",
          },
        }}
      >
        <Box className="dashtop-miniwrap">
          <h3 className="supply-text">Supply Balance</h3>
          <h2 className="box-number">${lending}</h2>
        </Box>
      </Box>
      <Box
        className="dashtop-box"
        style={{ borderRadius: ".5rem" }}
        sx={{
          "@media (min-width:340px) and (max-width:399px)": {
            display: "none",
          },
        }}
      >
        <Box
          className="dashtop-miniwrap"
          style={{ border: `1px solid ${theme}`, borderRadius: ".5rem" }}
        >
          <h3 className="supply-text" style={{ color: "#3D3D3D" }}>
            Net APY
          </h3>
          <h2 className="box-number">{netapy}%</h2>
        </Box>
      </Box>
      <Box
        className="dashtop-box"
        sx={{
          "@media (min-width:340px) and (max-width:399px)": {
            display: "none",
          },
        }}
      >
        <Box className="dashtop-miniwrap">
          <h3 className="supply-text" style={{ color: "#4D96FF" }}>
            Borrow Balance
          </h3>
          <h2 className="box-number">${borrow}</h2>
        </Box>
      </Box>

      <Box
        sx={{
          width: "90%",
          "@media screen and (min-width:400px)": {
            display: "none",
          },
        }}
      >
        <Box sx={{ width: "50%", margin: "0 auto", marginTop: "0px" }}>
          <Box
            className="dashtop-miniwrap"
            style={{ border: `1px solid ${theme}`, borderRadius: ".5rem" }}
          >
            <h3
              className="supply-text"
              style={{ color: "#3D3D3D", marginTop: "25px" }}
            >
              Net APY
            </h3>
            <h2 className="box-number" style={{ marginBottom: "25px" }}>
              16.2%
            </h2>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-evenly",
          }}
        >
          <Box className="dashtop-miniwrap">
            <h3 className="supply-text">Supply Balance</h3>
            <h2 className="box-number">$10,863</h2>
          </Box>
          <Box className="dashtop-miniwrap">
            <h3 className="supply-text" style={{ color: "#4D96FF" }}>
              Borrow Balance
            </h3>
            <h2 className="box-number">$113,465</h2>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
