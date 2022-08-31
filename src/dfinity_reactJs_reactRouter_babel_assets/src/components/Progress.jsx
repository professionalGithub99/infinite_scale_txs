import React, { useState, useEffect, useContext } from "react";
import "../style/main.css"
import { Principal } from '@dfinity/principal';
import {Actor, HttpAgent} from "@dfinity/agent";
import {idlFactory} from "./finrisk";
import { makeStyles } from '@mui/styles';
import Skeleton from "@mui/material/Skeleton";
//material
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";

import { ThemeContext } from '../context/theme'

//react-bootstrap
import ProgressBar from "react-bootstrap/ProgressBar";

export default function Progress(params) {

    const classes = useStyles();

    const {theme} = useContext(ThemeContext);
    const [limit, setLimit] = useState(null);
    const [borrowLimit, setBorrowLimit] = useState(null);

    useEffect(async () => {
        const connected = await window.ic.plug.isConnected();
        if(connected) {
          const address = await window.ic?.plug?.getPrincipal();
    
          const canisterId = "fggox-qyaaa-aaaah-abkbq-cai";
      
          const agent = new HttpAgent({
              host: "https://fggox-qyaaa-aaaah-abkbq-cai.raw.ic0.app",
          });
          const anoactor = Actor.createActor(idlFactory, {
              agent,
              canisterId,
          });
      
          let limit = await anoactor.getBorrowLimit(address);
          let limitok = Number(limit.ok.fiat.SingleMarket) * Number(limit.ok.liquidity) / 100000000
          setBorrowLimit((limitok / 10000000000000000000000000000).toFixed(2))
          console.log(limitok)
          setLimit(limitok.toString())
        } else {
        }
      });
    return (
        <Box className="progress-wrap">

            <Box className="progress-outerBox">
                <h2 className="progressBar-borrow-text">Borrow Limit</h2>
            </Box>

            <Box className="progress-progressbar">
                {params.currentBorrow ? (
                    <Slider
                        className={classes.root}
                        aria-label="Temperature"
                        defaultValue={params.currentBorrow}
                        color="success"
                        />
                ) : (
                    <Skeleton style={{width: '350px', margin: ' 0 auto '}} />
                )}
            </Box>

            <Box className="progress-outerBox">
                {borrowLimit ? (
                    <h2 className="progressBar-borrow-text">${borrowLimit}</h2>
                ) : (
                    <Skeleton style={{width: '50px'}} />
                )}
            </Box>

        </Box>
    )
}

  const useStyles = makeStyles({
    root: {
    color: '#6bcb77',
      border: 0,
      borderRadius: 1,
      height: 5,
    },
  });