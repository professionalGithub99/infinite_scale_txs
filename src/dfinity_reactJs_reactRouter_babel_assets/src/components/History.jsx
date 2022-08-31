import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { ThemeContext } from "../context/theme";
import { CirclePicker } from "react-color";
import {Actor, HttpAgent} from "@dfinity/agent";
//components
import Navbar from "../components/NavbarDash";

//material
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import { makeStyles } from '@material-ui/core/styles';
import Collapse from '@mui/material/Collapse';
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from '@mui/material/TablePagination';
import Arrow from "../../assets/dropArrow.svg";
import UpArrow from "../../assets/upArrow.svg";
import IconButton from '@mui/material/IconButton';

import CustomRow from "./Row";

//toasts
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


//assets
import Bucket from "../../assets/newbucket.svg";
import { TableFooter } from "semantic-ui-react";
import HistoryModal from "./modals/HistoryModal";
import { idlFactory } from "./transactions";

export default function History() {

    const alertSheets = () => toast("Sheets Export Coming Soon!", {
        position: toast.POSITION.BOTTOM_RIGHT,
        theme: 'dark'
      });

      const alertCSV = () => toast("CSV Export Coming Soon!", {
        position: toast.POSITION.BOTTOM_RIGHT,
        theme: 'dark'
      });

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [myTransactions, setMyTransactions] = useState([]);
    const [stateEffect, setStateEffect] = useState(null);

//     useEffect(() => {
//       axios.get(`https://finterest-backend.herokuapp.com/api/transactions`)
//       .then((res) => {
//         setMyTransactions(res.data)
//       })
//       .catch((err) => {
//         alert(err)
//       })
// }, [])

useEffect(async () => {
  const canisterId = "drlcr-5iaaa-aaaah-abkuq-cai";
  const address = await window.ic?.plug?.getPrincipal();

  const agent = new HttpAgent({
      host: "https://drlcr-5iaaa-aaaah-abkuq-cai.raw.ic0.app",
  });
  const anoactor = Actor.createActor(idlFactory, {
      agent,
      canisterId,
  });
  if(address) {
    try {
      let result = await anoactor.getTx(address);
      console.log(result[0])
      if(result[0] != undefined) {
        setMyTransactions(result[0])
      }
    } catch(e) {
      console.log(e)
    }
  }
  setStateEffect(!stateEffect)
}, [stateEffect]);
  
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    };
  const { theme, toggleTheme } = useContext(ThemeContext);

  function createData(date, asset, type, amount, price, interest, fees) {
    return { date, asset, type, amount, price, interest, fees };
  }

  
  const rows = [
    createData('05-19-2022', 'ICP', 'Lend', 100, '$8.50', '2 ICP', '.04 ICP'),
    createData('05-19-2022', 'BTC', 'Deposit', 1, '$30,500.45', '.04 BTC', '.000002 BTC'),
    createData('05-19-2022', 'BTC', 'Withdraw', 5, '$30,500.45', '.04 BTC', '.000002 BTC'),
    createData('05-19-2022', 'USDC', 'Borrow', 10000, '$1.00', '2 USDC', '5.00 USDC'),
    createData('05-19-2022', 'ICP', 'Borrow', 250, '$8.50', '2 ICP', '.04 ICP'),
    createData('05-19-2022', 'USDC', 'Deposit', 25000, '$1.00', '2 USDC', '5.00 USDC'),
    createData('05-19-2022', 'ICP', 'Lend', 100, '$8.50', '2 ICP', '.04 ICP'),
    createData('05-19-2022', 'USDC', 'Borrow', 1000, '$1.00', '2 USDC', '5.00 USDC'),
    createData('05-19-2022', 'BTC', 'Lend', 1, '$30,500.45', '.04 BTC', '.000002 BTC'),
    createData('05-19-2022', 'BTC', 'Deposit', 10, '$30,500.45', '.04 BTC', '.000002 BTC'),
    createData('05-19-2022', 'ICP', 'Lend', 100, '$8.50', '2 ICP', '.04 ICP'),
    createData('05-19-2022', 'BTC', 'Deposit', 1, '$30,500.45', '.04 BTC', '.000002 BTC'),
    createData('05-19-2022', 'ICP', 'Borrow', 500, '$8.50', '2 ICP', '.04 ICP'),
    createData('05-19-2022', 'USDC', 'Lend', 2500, '$1.00', '2 USDC', '5.00 USDC'),
    createData('05-19-2022', 'ICP', 'Deposit', 500, '$8.50', '2 ICP', '.04 ICP'),
    createData('05-19-2022', 'USDC', 'Borrow', 5000, '$1.00', '2 USDC', '5.00 USDC'),
  ];

  const [historyModal, setHistoryModal] = useState(false);

  const historyOpen = () => setHistoryModal(true);
  const historyClose = () => setHistoryModal(false);
  const [open, setOpen] = useState(false);
  const [selectedID, setSelectedID] = useState(null);

  //theme picker
  const [picking, setPicking] = useState(false);

  const themeSetter = (color) => {
    toggleTheme(color);
    setPicking(false);
  };



  return (
    <Box className="history-wrap">
              <ToastContainer
        progressStyle={{
          background: `${theme}`,
        }}
        closeOnClick
      />
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
      <Navbar />
      <Box className="historyTop-wrap">
        <h2 className="history-title">Transaction History</h2>
        <Box className="export-button-wrap">
            <Box className="export-button hover" onClick={alertCSV} style={{border: `1px solid ${theme}`, transition: 'var(--transition)'}}>
                <h2 className="export-text" style={{color: theme, transition: 'var(--transition)'}}>Export as CSV</h2>
            </Box>
            <Box className="export-button hover" onClick={alertSheets} style={{border: `1px solid ${theme}`, transition: 'var(--transition)'}}>
                <h2 className="export-text" style={{color: theme, transition: 'var(--transition)'}}>View in Sheets</h2>
            </Box>
        </Box>
      </Box>
      <Box className="table-wrap">
            {/* <h2 className="expand-text hover" style={{color: theme, transition: 'var(--transition)'}} onClick={() => setOpen(!open)}>{open ? 'Close All' : 'Expand All'}</h2> */}
        <TableContainer sx={{ width:'50%', margin: '0 auto', filter: 'drop-shadow(0px 12px 24px rgba(0, 0, 0, 0.1))', borderRadius: '15px',
    '@media screen and (min-width:901px) and (max-width:1100px)': {
        width: '70%'
    },
    '@media screen and (min-width:601px) and (max-width:900px)': {
        width: '80%'
    },
    '@media screen and (min-width:475px) and (max-width:600px)': {
        width: '80%'
    },
    '@media screen and (min-width:400px) and (max-width:474px)': {
        width: '90%'
    },
    '@media screen and (min-width: 340px) and (max-width:399px)': {
        width: '90%'
    }
     }} component={Paper}>
          <Table aria-label="simple table" sx={{"& th": {
          fontFamily: "Red Hat Display, sans-serif",
          }}}>
            <TableHead>
              <TableRow id="topRow" sx={{"& th": {
          fontFamily: "Red Hat Display, sans-serif",
          }}}>
                <TableCell sx={{color: '#9E9E9E', fontWeight: 400, fontSize: '12px', lineHeight: '16px', }} align="center">Date</TableCell>
                <TableCell sx={{color: '#9E9E9E', fontWeight: 400, fontSize: '12px', lineHeight: '16px'}} align="center">Asset</TableCell>
                <TableCell sx={{color: '#9E9E9E', fontWeight: 400, fontSize: '12px', lineHeight: '16px'}} align="center">Type</TableCell>
                <TableCell sx={{color: '#9E9E9E', fontWeight: 400, fontSize: '12px', lineHeight: '16px'}} align="center">Amount</TableCell>
                <TableCell sx={{color: '#9E9E9E', fontWeight: 600, fontSize: '12px', lineHeight: '16px'}} align="center"><span className="hover" style={{color: theme, transition: 'var(--transition)'}} onClick={() => setOpen(!open)}>{open ? 'Close All' : 'Expand All'}</span></TableCell>
              </TableRow>
            </TableHead>
            <TableBody sx={{ "& th": {
                    fontFamily: "Red Hat Display, sans-serif",
                    } }}>
              {myTransactions.map((tx, index) => (
                  <>
                <TableRow
                  hover
                  key={index}
                  id={open === false && selectedID !== index ? 'tableRow' : 'tableRowCustom'}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 }, "& th": {
                    fontFamily: "Red Hat Display, sans-serif",
                    } }}
                >
                    
                  <TableCell sx={{color: '#3D3D3D', fontWeight: 400, fontSize: '15px', lineHeight: '20px'}} component="th" scope="row" align="center">
                    {tx.date}
                  </TableCell>
                  <TableCell sx={{color: '#3D3D3D', fontWeight: 400, fontSize: '15px', fontFamily: 'Red Hat Display, sans-serif', lineHeight: '20px', }} align="center">{tx.asset}</TableCell>
                  <TableCell sx={{color: '#3D3D3D', fontWeight: 400, fontSize: '15px', fontFamily: 'Red Hat Display, sans-serif', lineHeight: '20px'}} align="center">{tx.action}</TableCell>
                  <TableCell sx={{color: '#3D3D3D', fontWeight: 400, fontSize: '15px', fontFamily: 'Red Hat Display, sans-serif', lineHeight: '20px'}} align="center">{tx.amount}</TableCell>
                  <TableCell sx={{color: '#3D3D3D', fontWeight: 400, fontSize: '15px', fontFamily: 'Red Hat Display, sans-serif', lineHeight: '20px'}} align="center">{open === false && selectedID !== index ? <img className="hover" onClick={() => {
                    setSelectedID(index);
                  }} style={{transition: 'var(--transition)'}} src={Arrow} alt="dropdown arrow" /> : <img className="hover" style={{transition: 'var(--transition)'}} src={UpArrow} alt="dropdown arrow" onClick={() => {
                    setOpen(false)
                    setSelectedID(null)
                  }} />}</TableCell>
                </TableRow>
                <TableRow id="tableRowTwo">
                <TableCell id="tableCellEdit" style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                  <Collapse id="collapseEdit" in={selectedID === index || open} timeout="auto" unmountOnExit>
                    <Box sx={{ margin: 0, height: '50px' }}>
                      <Table size="small" sx={{border: 'none'}}>
                        <TableHead sx={{border: 'none'}}>
                          <TableRow sx={{border: 'none'}}>
                          <TableCell sx={{ paddingTop: '2.5%', border: 'none', color: '#9E9E9E', fontWeight: 400, fontSize: '12px', lineHeight: '16px'}} component="th" scope="row" align="center">Price: {tx.price}</TableCell>
                            <TableCell sx={{ paddingTop: '2.5%',  border: 'none', color: '#9E9E9E', fontWeight: 400, fontSize: '12px', lineHeight: '16px'}} align="center">Interest: +{tx.interest}</TableCell>
                            <TableCell sx={{ paddingTop: '2.5%',  border: 'none', color: '#9E9E9E', fontWeight: 400, fontSize: '12px', lineHeight: '16px'}} align="center">Fees: -{tx.fees}</TableCell>
                          </TableRow>
                        </TableHead>
                      </Table>
                    </Box>
                  </Collapse>
                </TableCell>
              </TableRow>
              </>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {/* <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      /> */}
      </Box>
    </Box>
  );
}
