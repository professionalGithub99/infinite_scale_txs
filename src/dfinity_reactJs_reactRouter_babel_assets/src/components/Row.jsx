import React, { useState, useEffect } from "react";

//material
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import Collapse from '@mui/material/Collapse';
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

export default function CustomRow (params) {

    return (
        <Box>
            
            <TableRow
                  hover
                  key={params.identifier}
                  selected={params.selectedID}
                  id="tableRow"
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                    
                  <TableCell sx={{color: '#3D3D3D', fontFamily: 'Red Hat, sans-serif', fontWeight: 400, fontSize: '15px', lineHeight: '20px'}} component="th" scope="row" align="center">
                    {row.date}
                  </TableCell>
                  <TableCell sx={{color: '#3D3D3D', fontFamily: 'Red Hat, sans-serif', fontWeight: 400, fontSize: '15px', lineHeight: '20px'}} align="center">{row.asset}</TableCell>
                  <TableCell sx={{color: '#3D3D3D', fontFamily: 'Red Hat, sans-serif', fontWeight: 400, fontSize: '15px', lineHeight: '20px'}} align="center">{row.type}</TableCell>
                  <TableCell sx={{color: '#3D3D3D', fontFamily: 'Red Hat, sans-serif', fontWeight: 400, fontSize: '15px', lineHeight: '20px'}} align="center">{row.amount}</TableCell>
                  <TableCell sx={{color: '#3D3D3D', fontFamily: 'Red Hat, sans-serif', fontWeight: 400, fontSize: '15px', lineHeight: '20px'}} align="center">{open === false ? <img className="hover"                   onClick={() => {
                    setSelectedID(row.id);
                  }} style={{transition: 'var(--transition)'}} src={Arrow} alt="dropdown arrow" /> : <img className="hover" style={{transition: 'var(--transition)'}} src={UpArrow} alt="dropdown arrow" />}</TableCell>
                </TableRow>
                <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                  <Collapse in={selectedID} timeout="auto" unmountOnExit>
                    <Box sx={{ margin: 2 }}>
                      <Table size="small" aria-label="purchases">
                        <TableHead>
                          <TableRow>
                          <TableCell sx={{color: '#9E9E9E', fontFamily: 'Red Hat, sans-serif', fontWeight: 400, fontSize: '12px', lineHeight: '16px'}}>Price</TableCell>
                            <TableCell sx={{color: '#9E9E9E', fontFamily: 'Red Hat, sans-serif', fontWeight: 400, fontSize: '12px', lineHeight: '16px'}}>Asset</TableCell>
                            <TableCell sx={{color: '#9E9E9E', fontFamily: 'Red Hat, sans-serif', fontWeight: 400, fontSize: '12px', lineHeight: '16px'}} align="left">Interest</TableCell>
                            <TableCell sx={{color: '#9E9E9E', fontFamily: 'Red Hat, sans-serif', fontWeight: 400, fontSize: '12px', lineHeight: '16px'}} align="left">Fees</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                        <TableRow>
                          <TableCell sx={{color: '#3D3D3D', fontFamily: 'Red Hat, sans-serif', fontWeight: 400, fontSize: '15px', lineHeight: '20px'}}>{row.price}</TableCell>
                            <TableCell sx={{color: '#3D3D3D', fontFamily: 'Red Hat, sans-serif', fontWeight: 400, fontSize: '15px', lineHeight: '20px'}}>{row.asset}</TableCell>
                            <TableCell sx={{color: '#3D3D3D', fontFamily: 'Red Hat, sans-serif', fontWeight: 400, fontSize: '15px', lineHeight: '20px'}} align="left">{row.interest}</TableCell>
                            <TableCell sx={{color: '#3D3D3D', fontFamily: 'Red Hat, sans-serif', fontWeight: 400, fontSize: '15px', lineHeight: '20px'}} align="left">{row.fees}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </Box>
                  </Collapse>
                </TableCell>
              </TableRow>
         
        </Box>
    )
} 