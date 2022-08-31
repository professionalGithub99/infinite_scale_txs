import React, { useState, useEffect } from "react";
import "../style/main.css"

//material
import Box from "@mui/material/Box";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { makeStyles } from '@material-ui/core'

//assets
import Bitcoin from "../../assets/bitcoin.svg";
import ICPLogo from "../../assets/icpLogo.png";
import Close from "../../assets/close.png";

export default function SupplyModal(params) {

    const classes = useStyles()
    const [value, setValue] = useState('supply');
    const [ICPBalance, setICPBalance] = useState(null);
    const [supplyNumber, setSupplyNumber] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const verifyConnection = async () => {
        const connected = await window.ic.plug.isConnected();
        if(connected) {
            setConnected(true)
        } else {
            try {
                const publicKey = await window.ic.plug.requestConnect();
                const result = await window.ic.plug.requestBalance();
                setICPBalance(result[0].amount.toFixed(2));
                setConnected(true)
                } catch (e) {
                console.log(e);
            }
        }
      };
      
    //   useEffect(async () => {
    //     verifyConnection();
    //     const result = await window.ic.plug.requestBalance();
    //     setICPBalance(result[0].amount.toFixed(2));
    //   }, []);

      const setMax = (e) => {
          e.preventDefault();
          setSupplyNumber(ICPBalance)
      }
    
    return (
        <Box className="modal-wrap">
            <Box className="modal-close">
                <img src={Close} className="close-icon hover" onClick={() => {params.setSupplyModal(false)}} alt="close button" style={{height: '10px', width: '10px', display: 'flex', justifyContent: 'flex-end'}} />
            </Box>
            <Box className="modal-top">
                <img className="bitcoin-modal-title" src={Bitcoin} alt="bitcoin icon" />
                <h3 className="modal-title">Bitcoin (BTC) Token</h3>
            </Box>
            <Box sx={{display: 'flex', flexDirection: 'row'}}>
                <Box className="input-modal-box">

                </Box>
                <Box className="input-modal-box">
                    <input type="number" className="number-input-modal"  value={supplyNumber} placeholder="0" onChange={(e) => {setSupplyNumber(e.target.value)}} />
                </Box>
                <Box className="input-modal-box-right">
                    <Box className="icplogo-modal">
                        <img src={ICPLogo} alt="ICPLogo" />
                    </Box>
                    <h4 className="max-button-modal hover" onClick={setMax}>Max</h4>
                </Box>
            </Box>
            <Box sx={{ width: '100%' }}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    textColor="dark"
                    indicatorColor="primary"
                    fullWidth
                    TabIndicatorProps={{
                        style: {
                            backgroundColor: '#6BCB77',
                        },
                    }}
                    aria-label="secondary tabs example"
                >
                    <Tab sx={{width: '50%'}} label={<span className={ value === 'supply' ? classes.activeTab : classes.customStyleOnTab}>Supply</span>} />
                    <Tab sx={{width: '50%'}} label={<span className={ value === 'withdraw' ? classes.activeTab : classes.customStyleOnTab}> Withdraw</span>}/>
                </Tabs>
            </Box>
        </Box>
    )
}

const useStyles = makeStyles({
    customStyleOnTab:{
      fontSize:'15px',
      fontWeight: 500,
      color:'#3D3D3D',
      fontFamily: 'Red Hat Display'
    },
    activeTab:{
      fontSize:'15px',
      fontWeight:'500',
      color:'#3D3D3D',
    }
  })