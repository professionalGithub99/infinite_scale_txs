import React from "react";

//material
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

export default function(params) {

    return (
        <Modal
        open={params.supernovaOpen}
        onClose={params.supernovaClose}
        BackdropProps={{ style: { backgroundColor: "#3D3D3D", opacity: 0.7 } }}
      >
        <Box className="supernova-wrap">
            <Box className="supernova-box">
                <h2 className="supernova-title">WARNING!</h2>
                <h2 className="supernova-subtitle">This is a test for the Supernova Hackathon. Any real funds deposited should be considered lost.</h2>
                <Box className="supernova-button" onClick={() => params.setSupernovaModal(false)}><h2 className="supernova-buttonText">I Understand</h2></Box>
            </Box>
        </Box>
        </Modal>
    )
}