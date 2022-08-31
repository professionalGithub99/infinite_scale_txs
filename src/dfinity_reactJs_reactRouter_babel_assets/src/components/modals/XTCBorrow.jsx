import React, { useState, useEffect, useContext } from "react";

//material
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Skeleton from "@mui/material/Skeleton";
import Modal from "@mui/material/Modal";
import Tab from "@mui/material/Tab";
import { makeStyles } from "@material-ui/core";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

import {idlFactory } from "./dip20"
import { idlFactory as idlFactory2 } from "../transactions";
import { idlFactory as idlFactoryXTC } from "./xtc";
import { Principal } from '@dfinity/principal';

//toasts
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//context
import { ThemeContext } from "../../context/theme/index.js";

//assets
import Bitcoin from "../../../assets/bitcoin.svg";
import Close from "../../../assets/closeNew.png";
import ViewIcon from "../../../assets/viewIcon.png";
import FinterestLogo from "../../../assets/finalLogo.svg";
import USDCLogo from "../../../assets/usdcLogo.svg";
import XTCLogo from "../../../assets/cyclesBottomDash.svg";

//swal
import {Actor, HttpAgent} from "@dfinity/agent";
import Swal from 'sweetalert2';

export default function USDCBorrow(params) {

    const classes = useStyles();
    const {theme} = useContext(ThemeContext);

    const whitelist = [
      "jlq75-7aaaa-aaaah-ablna-cai",
      "aanaa-xaaaa-aaaah-aaeiq-cai",
    ]
    const host = "https://jlq75-7aaaa-aaaah-ablna-cai.ic0.app/"

    const E8S = 1_000_000_000_000

    const [borrowNumber, setBorrowNumber] = useState(0);
    const [value, setValue] = useState('supply');
    const [tempTab, setTempTab] = useState(0);

    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

    function a11yProps(index) {
      return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
      };
    }

    const alertSuccessBorrow = () => {
      Swal.fire(
        'Congrats!',
        `You've successfully borrowed XTC!`,
        'success'
      )
    }
  
    const alertbadBorrow = () => {
      Swal.fire(
        'Something happened',
        `Your borrow request failed.`,
        'error'
      )
    }
    const alertSuccessRepay = () => {
      Swal.fire(
        'Congrats!',
        `You've successfully repaid your position!`,
        'success'
      )
    }
  
    const alertbadRepay = () => {
      Swal.fire(
        'Error!',
        `Your repay request failed, check your wallet`,
        'error'
      )
    }
    
    const borrow = async () => {
      const isAuthenticated = await window.ic.plug.isConnected();
      if (isAuthenticated) {
        await window.ic.plug.createAgent({whitelist, host});
        const Actor = await window.ic.plug?.createActor({
            canisterId: whitelist[0],
            interfaceFactory: idlFactory,
          });
          const XTCActor = await window.ic.plug?.createActor({
            canisterId: whitelist[1],
            interfaceFactory: idlFactoryXTC,
          });
          let bentley = borrowNumber * E8S;
          console.log(bentley)
          let approve = await XTCActor.approve(Principal.fromText(whitelist[0]), bentley)
          console.log(approve)
          let topup = await Actor.topUp();
          console.log(topup)
          let borrowres = await Actor.borrow(bentley);
          console.log(borrowres)
          try {
            let test = borrowres.ok
            console.log(test)
            submitBorrow()
            params.borrowCloseXTC()
            alertSuccessBorrow()
          } catch(error) {
            alertbadBorrow()
          }
      };
    };
  
    const repay = async () => {
      const isAuthenticated = await window.ic.plug.isConnected();
      if (isAuthenticated) {
        await window.ic.plug.createAgent({whitelist, host});
        const Actor = await window.ic.plug?.createActor({
            canisterId: whitelist[0],
            interfaceFactory: idlFactory,
          });
          const XTCActor = await window.ic.plug?.createActor({
            canisterId: whitelist[1],
            interfaceFactory: idlFactoryXTC,
          });
          let bentley = borrowNumber * E8S;
          const address = await window.ic?.plug?.getPrincipal();
          let topup = await Actor.topUp(bentley);
          console.log(topup)
          let repay = await Actor.repay(bentley);
          try {
            console.log(repay)
            console.log('You repaid ' + bentley.toString() + 'of your borrow');
            let ficpbal = await Actor.getBorrowBal(address);
            console.log('Your new outstanding borrow is' + ficpbal.toString())
            submitRepay();
            params.borrowCloseXTC();
            alertSuccessRepay();
          } catch(error) {
            console.log(error)
            alertbadRepay();
          }
      };
    };

    const alertHistory = () =>
    toast("Added to Transaction History!", {
      position: toast.POSITION.BOTTOM_RIGHT,
      theme: "dark",
    });

    const submitBorrow = async() => {
      const canisterId = "drlcr-5iaaa-aaaah-abkuq-cai";
      const address = await window.ic?.plug?.getPrincipal();
    
      const agent = new HttpAgent({
          host: "https://drlcr-5iaaa-aaaah-abkuq-cai.raw.ic0.app",
      });
      const anoactor = Actor.createActor(idlFactory2, {
          agent,
          canisterId,
      });
      if(address) {
        try {
          let obj = {
            principle: String(params.principal),
            action: String('Borrow'),
            asset: String('XTC'),
            interest: Number(0.00).toString(),
            date: String(moment(Date.now()).format("MMMM Do YYYY")),
            fees: Number(0.0).toString(),
            timestamp: String(moment(Date.now())),
            price: Number(params.icpPrice).toString(), //price of ICP here
            amount: borrowNumber, //amount of lend goes here
          };
          let result = await anoactor.addTx(address, obj.principle, obj.date, obj.timestamp, obj.asset, obj.action, obj.amount, obj.price, obj.interest, obj.fees);
          console.log(result)
          alertHistory()
        } catch(e) {
          console.log(e)
        }
      }
    }
    const submitRepay = async() => {
      const canisterId = "drlcr-5iaaa-aaaah-abkuq-cai";
      const address = await window.ic?.plug?.getPrincipal();
    
      const agent = new HttpAgent({
          host: "https://drlcr-5iaaa-aaaah-abkuq-cai.raw.ic0.app",
      });
      const anoactor = Actor.createActor(idlFactory2, {
          agent,
          canisterId,
      });
      if(address) {
        try {
          let obj = {
            principle: String(params.principal),
            action: String('Repay'),
            asset: String('XTC'),
            interest: Number(0.00).toString(),
            date: String(moment(Date.now()).format("MMMM Do YYYY")),
            fees: Number(0.0).toString(),
            timestamp: String(moment(Date.now())),
            price: Number(params.icpPrice).toString(), //price of ICP here
            amount: borrowNumber, //amount of lend goes here
          };
          let result = await anoactor.addTx(address, obj.principle, obj.date, obj.timestamp, obj.asset, obj.action, obj.amount, obj.price, obj.interest, obj.fees);
          console.log(result)
          alertHistory()
        } catch(e) {
          console.log(e)
        }
      }
    }

  return (
    <Box>
      <Modal
        open={params.borrowModalXTC}
        onClose={params.borrowCloseXTC}
        BackdropProps={{ style: { backgroundColor: "#3D3D3D", opacity: 0.9 } }}
      >
        <Box className="modal-wrap" style={{ borderRadius: ".5rem" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Box className="modal-top">
              <img
                className="bitcoin-modal-title"
                src={XTCLogo}
                alt="cycles icon"
              />
              <h2 className="modal-title">Cycles (XTC)</h2>
            </Box>
            <Box className="close-icon-box">
              <img
                className="hover"
                onClick={params.borrowCloseXTC}
                src={Close}
                alt="close button"
              />
            </Box>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "row" }}>
            <Box className="input-modal-box"></Box>
            <Box className="input-modal-box">
              <input
                type="number"
                className="number-input-modal"
                value={borrowNumber}
                min="0"
                maxLength="3"
                placeholder="0"
                onChange={(e) => {
                  setBorrowNumber(e.target.value);
                }}
              />
            </Box>
            <Box className="input-modal-box-right">
              <Box className="icplogo-modal"></Box>
              <h4 className="max-button-modal hover">80% Limit</h4>
            </Box>
          </Box>
          <TabContext value={value}>
            <Box sx={{ width: "100%" }}>
              <TabList
                onChange={handleChange}
                aria-label="lab API tabs example"
                TabIndicatorProps={{
                  style: {
                    backgroundColor: `${theme}`,
                    height: "5px",
                  },
                }}
              >
                <Tab
                  sx={{ width: "50%" }}
                  value="supply"
                  label={<span className={classes.tabLabel}>Borrow</span>}
                  {...a11yProps(0)}
                />
                <Tab
                  sx={{ width: "50%" }}
                  value="withdraw"
                  label={<span className={classes.tabLabel}>Repay</span>}
                  {...a11yProps(1)}
                />
              </TabList>
            </Box>
            <Box>
              <TabPanel
                style={{ backgroundColor: "#FFFFFF", borderRadius: ".5rem" }}
                value="supply"
                index={0}
              >
                <Box>
                  <Box sx={{ display: "flex", flexDirection: "row" }}>
                    <h3 className="supply-rates-text">Borrow Rates</h3>
                    <Box className="view-icon-wrap">
                      <img src={ViewIcon} alt="view source icon" />
                    </Box>
                  </Box>

                  <Box className="supply-wrap">
                    <Box className="bar-modal-left">
                      <Box>
                        <img
                          style={{ width: "35px", height: "35px" }}
                          src={XTCLogo}
                          alt="cycles icon"
                        />
                      </Box>
                      <h3 className="supply-apy-text">Borrow APY</h3>
                    </Box>
                    <Box className="bar-modal-right">
                      <h3 className="supply-apy-number">9.02%</h3>
                    </Box>
                  </Box>

                  <Divider style={{ marginTop: "10px" }} />

                  <Box className="supply-wrap">
                    <Box className="bar-modal-left">
                      <Box>
                        <img
                          style={{ width: "35px", height: "35px" }}
                          src={FinterestLogo}
                          alt="finterest icon"
                        />
                      </Box>
                      <h3 className="supply-apy-text">Distribution APY</h3>
                    </Box>
                    <Box className="bar-modal-right">
                      <h3 className="supply-apy-number">0.06%</h3>
                    </Box>
                  </Box>

                  <Box>
                    <h3 className="borrow-limit-text">Borrow Limit</h3>
                  </Box>

                  <Box className="supply-wrap">
                    <Box className="bar-modal-left">
                      <h3 className="supply-apy-text" style={{ marginLeft: 0 }}>
                        Borrow Limit
                      </h3>
                    </Box>
                    <Box className="bar-modal-right">
                      <h3 className="supply-apy-number">
                        $0 <span style={{ color: "#6BCB77" }}>{">"}</span>{" "}
                        $30,699
                      </h3>
                    </Box>
                  </Box>

                  <Divider style={{ marginTop: "10px" }} />

                  <Box className="supply-wrap">
                    <Box className="bar-modal-left">
                      <h3 className="supply-apy-text" style={{ marginLeft: 0 }}>
                        Borrow Limit Used
                      </h3>
                    </Box>
                    <Box className="bar-modal-right">
                      <h3 className="supply-apy-number">0%</h3>
                    </Box>
                  </Box>

                  <Box className="progress-progressbarTwo">
                    {/* <ProgressBar bsPrefix={theme === '#6bcb77' ? 'progress progress-green' : theme === '#ff6b6b' ? 'progress-red' : theme === '#4d96ff' ? 'progress-blue' : theme === '#ffd93d' ? 'progress-yellow' : theme === '#595959' ? 'progress-grey' : ''} now={80} /> */}
                    <div className="Loading"></div>
                  </Box>

                  {borrowNumber != 0 ? (
                    <Box
                      className="supply-button hover"
                      onClick={borrow}
                      style={{
                        borderRadius: "25px",
                        backgroundColor: `${theme}`,
                      }}
                    >
                      <h3 className="supply-button-text">Borrow</h3>
                    </Box>
                  ) : (
                    <Box
                      className="supply-button-grey hover"
                      style={{ borderRadius: "25px" }}
                    >
                      <h3 className="supply-button-text">Input Amount</h3>
                    </Box>
                  )}

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box className="wallet-balance-box">
                      <h3 className="wallet-balance">Currently Borrowing</h3>
                    </Box>

                      <Box className="box-balance">
                        <h3 className="balance-text-new-borrow">0 BTC</h3>
                      </Box>
                  </Box>
                </Box>
              </TabPanel>

              <TabPanel
                value="withdraw"
                index={1}
                style={{ background: "#FFFFFF", borderRadius: ".5rem" }}
              >
                {tempTab === 1 ? (
                  <Box>
                    <Box sx={{ display: "flex", flexDirection: "row" }}>
                      <h3 className="supply-rates-text">Borrow Rates</h3>
                      <Box className="view-icon-wrap">
                        <img src={ViewIcon} alt="view source icon" />
                      </Box>
                    </Box>

                    <Box className="supply-wrap">
                      <Box className="bar-modal-left">
                        <Box>
                          <img
                            style={{ width: "35px", height: "35px" }}
                            src={XTCLogo}
                            alt="cycles icon"
                          />
                        </Box>
                        <h3 className="supply-apy-text">Borrow APY</h3>
                      </Box>
                      <Box className="bar-modal-right">
                        <h3 className="supply-apy-number">9.02%</h3>
                      </Box>
                    </Box>

                    <Divider style={{ marginTop: "10px" }} />

                    <Box className="supply-wrap">
                      <Box className="bar-modal-left">
                        <Box>
                          <img
                            style={{ width: "35px", height: "35px" }}
                            src={FinterestLogo}
                            alt="finterest icon"
                          />
                        </Box>
                        <h3 className="supply-apy-text">Distribution APY</h3>
                      </Box>
                      <Box className="bar-modal-right">
                        <h3 className="supply-apy-number">302.6%</h3>
                      </Box>
                    </Box>

                    <Box>
                      <h3 className="borrow-limit-text">Borrow Limit</h3>
                    </Box>

                    <Box className="supply-wrap">
                      <Box className="bar-modal-left">
                        <h3
                          className="supply-apy-text"
                          style={{ marginLeft: 0 }}
                        >
                          Borrow Limit
                        </h3>
                      </Box>
                      <Box className="bar-modal-right">
                        <h3 className="supply-apy-number">
                          $0 <span style={{ color: "#6BCB77" }}>{">"}</span>{" "}
                          $30,699
                        </h3>
                      </Box>
                    </Box>

                    <Divider style={{ marginTop: "10px" }} />

                    <Box className="supply-wrap">
                      <Box className="bar-modal-left">
                        <h3
                          className="supply-apy-text"
                          style={{ marginLeft: 0 }}
                        >
                          Borrow Limit Used
                        </h3>
                      </Box>
                      <Box className="bar-modal-right">
                        <h3 className="supply-apy-number">45%</h3>
                      </Box>
                    </Box>

                    {borrowNumber != 0 ? (
                      <Box
                        className="supply-button hover"
                        onClick={repay}
                        style={{
                          borderRadius: "25px",
                          backgroundColor: `${theme}`,
                        }}
                      >
                        <h3 className="supply-button-text">Repay</h3>
                      </Box>
                    ) : (
                      <Box
                        className="supply-button-grey hover"
                        style={{ borderRadius: "25px" }}
                      >
                        <h3 className="supply-button-text">Input Amount</h3>
                      </Box>
                    )}

                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box className="wallet-balance-box">
                        <h3 className="wallet-balance">Currently Borrowing</h3>
                      </Box>

                        <Box className="box-balance">
                          <h3 className="balance-text-new-borrow">0 XTC</h3>
                        </Box>
                    </Box>
                  </Box>
                ) : (
                  <Box>
                    <Box sx={{ display: "flex", flexDirection: "row" }}>
                      <h3 className="supply-rates-text">Borrow Rates</h3>
                      <Box className="view-icon-wrap">
                        <img src={ViewIcon} alt="view source icon" />
                      </Box>
                    </Box>

                    <Box className="supply-wrap">
                      <Box className="bar-modal-left">
                        <Box>
                          <img
                            style={{ width: "35px", height: "35px" }}
                            src={XTCLogo}
                            alt="cycles icon"
                          />
                        </Box>
                        <h3 className="supply-apy-text">Borrow APY</h3>
                      </Box>
                      <Box className="bar-modal-right">
                        <h3 className="supply-apy-number">9.02%</h3>
                      </Box>
                    </Box>

                    <Divider style={{ marginTop: "10px" }} />

                    <Box className="supply-wrap">
                      <Box className="bar-modal-left">
                        <Box>
                          <img
                            style={{ width: "35px", height: "35px" }}
                            src={FinterestLogo}
                            alt="finterest icon"
                          />
                        </Box>
                        <h3 className="supply-apy-text">Distribution APY</h3>
                      </Box>
                      <Box className="bar-modal-right">
                        <h3 className="supply-apy-number">0.06%</h3>
                      </Box>
                    </Box>
                    <Box
                      className="supply-button hover"
                      onClick={() => {
                        setTempTab(1);
                      }}
                      style={{
                        borderRadius: "25px",
                        backgroundColor: `${theme}`,
                      }}
                    >
                      <h3 className="supply-button-text">Enable</h3>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box className="wallet-balance-box">
                        <h3 className="wallet-balance">Currently Borrowing</h3>
                      </Box>

                        <Box className="box-balance">
                          <h3 className="balance-text-new-borrow">0 XTC</h3>
                        </Box>
                    </Box>
                  </Box>
                )}
              </TabPanel>
            </Box>
          </TabContext>
        </Box>
      </Modal>
    </Box>
  );
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
  },
  tabLabel: {
      color: '#3D3D3D',
      fontSize: '15px',
      fontWeight: 500,
      lineHeight: '20px',
      fontFamily: 'sans-serif'
  },
})