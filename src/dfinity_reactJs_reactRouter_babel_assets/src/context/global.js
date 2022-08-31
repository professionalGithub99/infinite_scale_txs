// import React, { createContext, useState, useEffect } from 'react'

// export const globalContext = createContext()

// const GlobalContextProvider = ({children}) => {
//     const [isCnnected, setIsConnected] = useState(false);
//     const [ICPBalance, setICPBalance] = useState(null);

//     const verifyConnection = async () => {
//         const connected = await window.ic.plug.isConnected();
//         if (connected) {
//           setIsConnected(true);
//         } else {
//           try {
//             const publicKey = await window.ic.plug.requestConnect();
//             const result = await window.ic.plug.requestBalance();
//             setICPBalance(result[0].amount.toFixed(2));
//             setIsConnected(true);
//           } catch (e) {
//             console.log(e);
//           }
//         }
//       };
    
//       useEffect(async () => {
//         verifyConnection();
//         const result = await window.ic.plug.requestBalance();
//         setICPBalance(result[0].amount.toFixed(2));
//       }, []);
//     return (
//          <GlobalContext.Provider 
//             value={{
//                 isConnected,
//                 ICPBalance
//              }}>
//                {children}
//          </GlobalContext.Provider>
//     )
// }
// export default GlobalContextProvider;