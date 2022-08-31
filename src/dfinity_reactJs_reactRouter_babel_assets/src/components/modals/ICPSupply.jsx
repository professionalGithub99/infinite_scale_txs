import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import moment from 'moment';
//ficp
import {idlFactory } from "./ficp";
import { idlFactory as idlFactory2 } from "../transactions";

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
import {Actor, HttpAgent} from "@dfinity/agent";



//toasts
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//sweetalert
import Swal from 'sweetalert2';

//context
import { ThemeContext } from "../../context/theme/index.js";
//assets
import Close from "../../../assets/closeNew.png";
import ICPLogo from "../../../assets/icpLogo.png";
import ViewIcon from "../../../assets/viewIcon.png";
import FinterestLogo from "../../../assets/finalLogo.svg";
import ICPLogoCircle from "../../../assets/icpLogoCircle.svg";


export default function ICPSupply(params) {

  const classes = useStyles();
  const { theme } = useContext(ThemeContext);

  const [supplyNumberICP, setSupplyNumberICP] = useState(0);
  const [value, setValue] = useState("supply");
  const [isLoading, setIsLoading] = useState(false);

  const ONE_ICP_IN_E8S = 100_000_000;
  const mantissa = 1_000_000_000_000_000_000;
  const fee = 10_000;

  useEffect(() => {
    console.log(moment(Date.now()).format("MMMM Do YYYY, h:mm:ss a"))
  }, [])

  const whitelist = [
    "demt4-4aaaa-aaaah-abkxa-cai",
    "ryjl3-tyaaa-aaaaa-aaaba-cai",
  ]
  const host = "https://demt4-4aaaa-aaaah-abkxa-cai.raw.ic0.app/"

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const alertWait = () =>
    toast("Please connect wallet or wait a moment!", {
      position: toast.POSITION.BOTTOM_RIGHT,
      theme: "dark",
    });

    const alertHistory = () =>
    toast("Added to Transaction History!", {
      position: toast.POSITION.BOTTOM_RIGHT,
      theme: "dark",
    });

    const alertHistoryError = () =>
    toast("ERROR adding to Transaction History!", {
      position: toast.POSITION.BOTTOM_RIGHT,
      theme: "dark",
    });

    const supply = async () => {
      setIsLoading(true)
        const isAuthenticated = await window.ic.plug.isConnected();
        if (isAuthenticated) {
          await window.ic.plug.createAgent({whitelist, host});
          const Actor = await window.ic.plug?.createActor({
              canisterId: whitelist[0],
              interfaceFactory: idlFactory,
            });
          let bentley = supplyNumberICP * ONE_ICP_IN_E8S;
          let invoice = await Actor.create_invoice(bentley, "Mint");
          console.log(invoice);
          let destination = invoice.ok
          let destinationInvoice = destination.invoice
          let unpaidinvoicedest = destinationInvoice.destination['text'];
          const requestTransferArg = {
            to: unpaidinvoicedest,
            amount: bentley + fee,
          };
          const transfer = await window.ic?.plug?.requestTransfer(requestTransferArg);
          if (transfer['height'] !== undefined) {
            let verifiedinvoice = await Actor.verify_invoice(destinationInvoice.id);
            setIsLoading(false)
            try {
              let test = verifiedinvoice.ok;
              console.log(test)
              console.log('you supplied ' + bentley.toString() + ' toPool');
              let princ = await window.ic?.plug?.getPrincipal();
              let ficpbal = await Actor.balanceOf(princ);
              console.log('you have ' + ficpbal.toString() + ' ficp tokens' )
              submitLend()
              params.supplyCloseICP()
              alertSuccessLend()
            } catch(error) {
              console.log(error)
              alertbadLend()
            }
          };
        };
    };

  const withdraw = async () => {
    setIsLoading(true);
    const isAuthenticated = await window.ic.plug.isConnected();
    if (isAuthenticated) {
      await window.ic.plug.createAgent({whitelist, host});
      const Actor = await window.ic.plug?.createActor({
          canisterId: whitelist[0],
          interfaceFactory: idlFactory,
        });
      let bentley = supplyNumberICP * mantissa;
      console.log(bentley)
      let redeem = await Actor.reedem(bentley)
      console.log(redeem)
      setIsLoading(false)
      try {
        let test = redeem.ok
        console.log(test)
        submitWithdraw()
        params.supplyCloseICP();
        alertSuccessWithdraw()
      } catch(error) {
        alertbadWithdraw()
      }
    };
  };

  const setMax = (e) => {
    e.preventDefault();
    if (params.connected && params.ICPBalance) {
      setSupplyNumberICP(params.ICPBalance);
    } else {
      alertWait();
    }
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

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

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
          asset: String('fICP'),
          interest: Number(0.00).toString(),
          date: String(moment(Date.now()).format("MMMM Do YYYY")),
          fees: Number(0.0).toString(),
          timestamp: String(moment(Date.now())),
          price: Number(params.icpPrice).toString(), //price of ICP here
          amount: supplyNumberICP, //amount of lend goes here
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
          asset: String('ICP'),
          interest: Number(0.00).toString(),
          date: String(moment(Date.now()).format("MMMM Do YYYY")),
          fees: Number(0.0).toString(),
          timestamp: String(moment(Date.now())),
          price: Number(params.icpPrice).toString(), //price of ICP here
          amount: supplyNumberICP, //amount of lend goes here
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
        open={params.supplyModalICP}
        onClose={params.supplyCloseICP}
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
                src={ICPLogoCircle}
                alt="icp icon"
              />
              <h2 className="modal-title">Internet Computer (ICP)</h2>
            </Box>
            <Box className="close-icon-box">
              <img
                className="hover"
                onClick={params.supplyCloseICP}
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
                value={supplyNumberICP}
                placeholder="0"
                onChange={(e) => {
                  setSupplyNumberICP(e.target.value);
                }}
              />
            </Box>
            <Box className="input-modal-box-right">
              <Box className="icplogo-modal">
                <img className="icp-logo-image" src={ICPLogo} alt="ICPLogo" />
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
                          src={ICPLogoCircle}
                          alt="icp icon"
                        />
                      </Box>
                      <h3 className="supply-apy-text">Supply APY</h3>
                    </Box>
                    <Box className="bar-modal-right">
                      {params.supplyApy != null && params.supplyApy != undefined ? (
                        <h3 className="supply-apy-number">{params.supplyApy}%</h3>
                      ) : (
                        <Skeleton style={{ width: "50px" }} />
                      )}
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
                      <h3 className="supply-apy-number">TBD</h3>
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
                      {params.borrowLimit && params.currentDollarAmount ? (
                      <h3 className="supply-apy-number">
                        ${params.currentDollarAmount.toFixed(2)} <span style={{ color: "#6BCB77" }}>{">"}</span>{" "}
                        ${params.borrowLimit}
                      </h3>
                      ) : (
                        <Skeleton style={{ width: "50px" }} />
                      )}
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
                      {params.currentBorrowPercentage ? (
                        <h3 className="supply-apy-number">{params.currentBorrowPercentage}%</h3>
                      ) : (
                        <Skeleton style={{width: '50px'}} />
                      )}
                    </Box>
                  </Box>

                  <Box className="progress-progressbarTwo">
                    {/* <ProgressBar bsPrefix={theme === '#6bcb77' ? 'progress progress-green' : theme === '#ff6b6b' ? 'progress-red' : theme === '#4d96ff' ? 'progress-blue' : theme === '#ffd93d' ? 'progress-yellow' : theme === '#595959' ? 'progress-grey' : ''} now={80} /> */}
                    <div className="Loading"></div>
                  </Box>

                  {supplyNumberICP != 0 ? (
                    <Box
                      className="supply-button hover"
                      onClick={supply}
                      style={{
                        borderRadius: "25px",
                        backgroundColor: `${theme}`,
                      }}
                    >
                      <h3 className="supply-button-text">{isLoading ? (<><div className="dots-bars-10"></div></>) : 'Supply'}</h3>
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

                    {params.ICPBalance ? (
                      <Box className="box-balance">
                        <h3 className="balance-text-new">{params.ICPBalance}</h3>
                        <Box sx={{ marginTop: "7px" }}>
                          <img
                            style={{ height: "12px", width: "22px" }}
                            src={ICPLogo}
                            alt="icp branding"
                          />
                        </Box>
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
                          src={ICPLogoCircle}
                          alt="icp icon"
                        />
                      </Box>
                      <h3 className="supply-apy-text">Supply APY</h3>
                    </Box>
                    <Box className="bar-modal-right">
                      {params.supplyApy != null && params.supplyApy != undefined ? (
                        <h3 className="supply-apy-number">{params.supplyApy}%</h3>
                      ) : (
                        <Skeleton style={{ width: "50px" }} />
                      )}
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
                      <h3 className="supply-apy-number">TBD</h3>
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
                      {params.borrowLimit && params.currentDollarAmount ? (
                      <h3 className="supply-apy-number">
                        ${params.currentDollarAmount.toFixed(2)} <span style={{ color: "#6BCB77" }}>{">"}</span>{" "}
                        ${params.borrowLimit}
                      </h3>
                      ) : (
                        <Skeleton style={{ width: "50px" }} />
                      )}
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
                      {params.currentBorrowPercentage ? (
                        <h3 className="supply-apy-number">{params.currentBorrowPercentage}%</h3>
                      ) : (
                        <Skeleton style={{width: '50px'}} />
                      )}
                    </Box>
                  </Box>

                  <Box className="progress-progressbarTwo">
                    {/* <ProgressBar bsPrefix={theme === '#6bcb77' ? 'progress progress-green' : theme === '#ff6b6b' ? 'progress-red' : theme === '#4d96ff' ? 'progress-blue' : theme === '#ffd93d' ? 'progress-yellow' : theme === '#595959' ? 'progress-grey' : ''} now={80} /> */}
                    <div className="Loading"></div>
                  </Box>

                  {supplyNumberICP != 0 ? (
                    <Box
                      className="supply-button hover"
                      onClick={withdraw}
                      style={{
                        borderRadius: "25px",
                        backgroundColor: `${theme}`,
                      }}
                    >
                      <h3 className="supply-button-text">{isLoading ? (<><div className="dots-bars-10"></div></>) : 'Withdraw'}</h3>
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
                          {params.supplyingAmount} ICP
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
