import React, { useState, useContext } from "react";

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

//toasts
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {idlFactory } from "./dip20"
import { idlFactory as idlFactory2 } from "../transactions";
import { idlFactory as idlFactoryXTC } from "./xtc";
import { Principal } from '@dfinity/principal';

//context
import { ThemeContext } from "../../context/theme/index.js";

//assets
import USDCLogo from "../../../assets/usdcLogo.svg";
import Close from "../../../assets/closeNew.png";
import ICPLogo from "../../../assets/icpLogo.png";
import ViewIcon from "../../../assets/viewIcon.png";
import FinterestLogo from "../../../assets/finalLogo.svg";
import XTCLogo from "../../../assets/cyclesBottomDash.svg";

import {Actor, HttpAgent} from "@dfinity/agent";
import Swal from 'sweetalert2';

export default function USDCSupply(params) {


  const whitelist = [
    "jlq75-7aaaa-aaaah-ablna-cai",
    "aanaa-xaaaa-aaaah-aaeiq-cai",
  ]
  const host = "https://jlq75-7aaaa-aaaah-ablna-cai.ic0.app/"

  const E8S = 1_000_000_000_000

  const classes = useStyles();
  const { theme } = useContext(ThemeContext);

  const [supplyNumber, setSupplyNumber] = useState(0);
  const [value, setValue] = useState("supply");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const alertSuccessLend = () => {
    Swal.fire(
      'Congrats!',
      `You've successfully lent ICP!`,
      'success'
    )
  }

  const alertbadLend = () => {
    Swal.fire(
      'Woops!',
      `Something went wrong, please check your wallet`,
      'error'
    )
  }

  const alertSuccessWithdraw = () => {
    Swal.fire(
      'Congrats!',
      `Your withdraw of ICP was successful!`,
      'success'
    )
  }

  const alertbadWithdraw = () => {
    Swal.fire(
      'Uh oh!',
      `Something went wrong with your withdrawal!`,
      'error'
    )
  }

  const alertHistory = () =>
  toast("Added to Transaction History!", {
    position: toast.POSITION.BOTTOM_RIGHT,
    theme: "dark",
  });

  const submitWithdraw = async() => {
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
          action: String('Withdraw'),
          asset: String('XTC'),
          interest: Number(0.00).toString(),
          date: String(moment(Date.now()).format("MMMM Do YYYY")),
          fees: Number(0.0).toString(),
          timestamp: String(moment(Date.now())),
          price: Number(params.icpPrice).toString(), //price of ICP here
          amount: supplyNumber, //amount of lend goes here
        };
        let result = await anoactor.addTx(address, obj.principle, obj.date, obj.timestamp, obj.asset, obj.action, obj.amount, obj.price, obj.interest, obj.fees);
        console.log(result)
        alertHistory()
      } catch(e) {
        console.log(e)
      }
    }
  }

  const submitLend = async() => {
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
          action: String('Lend'),
          asset: String('XTC'),
          interest: Number(0.00).toString(),
          date: String(moment(Date.now()).format("MMMM Do YYYY")),
          fees: Number(0.0).toString(),
          timestamp: String(moment(Date.now())),
          price: Number(params.icpPrice).toString(), //price of ICP here
          amount: supplyNumber, //amount of lend goes here
        };
        let result = await anoactor.addTx(address, obj.principle, obj.date, obj.timestamp, obj.asset, obj.action, obj.amount, obj.price, obj.interest, obj.fees);
        console.log(result)
        alertHistory()
      } catch(e) {
        console.log(e)
      }
    }
  }

  const supply = async () => {
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
          let bentley = supplyNumber * E8S;
          console.log(bentley)
          let approve = await XTCActor.approve(Principal.fromText(whitelist[0]), bentley)
          console.log(approve)
          let topup = await Actor.topUp();
          console.log(topup)
          let mintres = await Actor.mint(bentley)
          console.log(mintres)
          let allowed = await XTCActor.allowance(await window.ic?.plug?.getPrincipal(), Principal.fromText(whitelist[0]))
          console.log('allowed  ', allowed)
          try {
            let princ = await window.ic?.plug?.getPrincipal();
            let fbal = await Actor.balanceOf(princ);
            console.log('you have ' + fbal.toString() + ' fxtc tokens' )
            submitLend();
            alertSuccessLend();
            params.supplyCloseXTC();
          } catch(error) {
            console.log(error)
            alertbadLend();
          }
      };
  };

  const withdraw = async () => {
    const isAuthenticated = await window.ic.plug.isConnected();
    if (isAuthenticated) {
      await window.ic.plug.createAgent({whitelist, host});
      const Actor = await window.ic.plug?.createActor({
          canisterId: whitelist[0],
          interfaceFactory: idlFactory,
        });
      let bentley = supplyNumber * E8S;
      console.log(bentley)
      let redeem = await Actor.reedem(bentley)
      console.log(redeem)
      try {
        let test = redeem.ok
        console.log(test)
        submitWithdraw();
        alertSuccessWithdraw();
        params.supplyCloseXTC();
      } catch(error) {
      }
    };
  };

const alertNoBalance = () => toast("No balance!", {
  position: toast.POSITION.BOTTOM_RIGHT,
  theme: 'dark'
});

  const setMax = (e) => {
    e.preventDefault();
    alertNoBalance();
    // if(params.connected && params.ICPBalance) {
    //   setSupplyNumber(params.ICPBalance)
    // } else {
    //   alertWait()
    // }
  }

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  return (
    <Box>
      <Modal
        open={params.supplyModalXTC}
        onClose={params.supplyCloseXTC}
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
                alt="xtc icon"
              />
              <h2 className="modal-title">Cycles (XTC)</h2>
            </Box>
            <Box className="close-icon-box">
              <img
                className="hover"
                onClick={params.supplyCloseXTC}
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
                value={supplyNumber}
                placeholder="0"
                onChange={(e) => {
                  setSupplyNumber(e.target.value);
                }}
              />
            </Box>
            <Box className="input-modal-box-right">
              <Box className="icplogo-modal">
                <img className="icp-logo-image" src={XTCLogo} alt="cycles Logo" />
              </Box>
              <h4 className="max-button-modal hover" onClick={setMax}>
                Max
              </h4>
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
                  label={<span className={classes.tabLabel}>Supply</span>}
                  {...a11yProps(0)}
                />
                <Tab
                  sx={{ width: "50%" }}
                  value="withdraw"
                  label={<span className={classes.tabLabel}>Withdraw</span>}
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
                    <h3 className="supply-rates-text">Supply Rates</h3>
                    <Box className="view-icon-wrap">
                      <img
                        src={ViewIcon}
                        className="hover"
                        alt="view source icon"
                      />
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
                      <h3 className="supply-apy-text">Supply APY</h3>
                    </Box>
                    <Box className="bar-modal-right">
                      <h3 className="supply-apy-number">0.06%</h3>
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

                  {supplyNumber != 0 ? (
                    <Box
                      className="supply-button hover"
                      onClick={supply}
                      style={{
                        borderRadius: "25px",
                        backgroundColor: `${theme}`,
                      }}
                    >
                      <h3 className="supply-button-text">Supply</h3>
                    </Box>
                  ) : (
                    <Box
                      className="supply-button-grey"
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
                      <h3 className="wallet-balance">Your Wallet Balance</h3>
                    </Box>

                      <Box className="box-balance">
                        <h3 className="balance-text-new">0</h3>
                        <Box sx={{ marginTop: "7px" }}>
                          <img
                            style={{ height: "12px", width: "22px" }}
                            src={XTCLogo}
                            alt="cycles branding"
                          />
                        </Box>
                      </Box>
                  </Box>
                </Box>
              </TabPanel>

              <TabPanel
                value="withdraw"
                index={1}
                style={{ background: "#FFFFFF", borderRadius: ".5rem" }}
              >
                <Box>
                  <Box sx={{ display: "flex", flexDirection: "row" }}>
                    <h3 className="supply-rates-text">Supply Rates</h3>
                    <Box className="view-icon-wrap">
                      <img
                        src={ViewIcon}
                        className="hover"
                        alt="view source icon"
                      />
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
                      <h3 className="supply-apy-text">Supply APY</h3>
                    </Box>
                    <Box className="bar-modal-right">
                      <h3 className="supply-apy-number">3.36%</h3>
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

                  {supplyNumber != 0 ? (
                    <Box
                      className="supply-button hover"
                      onClick={withdraw}
                      style={{
                        borderRadius: "25px",
                        backgroundColor: `${theme}`,
                      }}
                    >
                      <h3 className="supply-button-text">Withdraw</h3>
                    </Box>
                  ) : (
                    <Box
                      className="supply-button-grey"
                      style={{ borderRadius: "25px" }}
                    >
                      <h3 className="supply-button-text">
                        No Balance to Withdraw
                      </h3>
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
                      <h3 className="wallet-balance">Currently Supplying</h3>
                    </Box>

                    {params.ICPBalance ? (
                      <Box className="box-balance">
                        <h3
                          className="balance-text-new"
                          style={{ marginRight: 0 }}
                        >
                          0 XTC
                        </h3>
                      </Box>
                    ) : (
                      <>
                        <Skeleton
                          variant="text"
                          style={{
                            marginTop: "5px",
                            width: "125px",
                            height: "30px",
                          }}
                        />
                      </>
                    )}
                  </Box>
                </Box>
              </TabPanel>
            </Box>
          </TabContext>
        </Box>
      </Modal>
    </Box>
  );
}

const useStyles = makeStyles({
  customStyleOnTab: {
    fontSize: "15px",
    fontWeight: 500,
    color: "#3D3D3D",
    fontFamily: "Red Hat Display",
  },
  activeTab: {
    fontSize: "15px",
    fontWeight: "500",
    color: "#3D3D3D",
  },
  tabLabel: {
    color: "#3D3D3D",
    fontSize: "15px",
    fontWeight: 500,
    lineHeight: "20px",
    fontFamily: "sans-serif",
  },
});
