// import { useEffect, useState } from "react";
// import NetInfo from "@react-native-community/netinfo";

// const useOnlineStatus = () => {
//   const [onlineStatus, setOnlineStatus] = useState(false);

//   useEffect(() => {
//     const unsubscribe = NetInfo.addEventListener(state => {
//       setOnlineStatus(state.isConnected);
//       console.log("Is connected?", state.isConnected);
//     });

//     return () => {
//       unsubscribe();
//     };
//   }, []);

//   return onlineStatus;
// };

// export default useOnlineStatus;

import { useEffect, useState, useCallback } from "react";
import NetInfo from "@react-native-community/netinfo";

const useOnlineStatus = () => {
  const [onlineStatus, setOnlineStatus] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setOnlineStatus(state.isConnected);
      console.log("Is connected?", state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Function to manually fetch and update the status
  const refreshStatus = useCallback(async () => {
    const state = await NetInfo.fetch();
    setOnlineStatus(state.isConnected);
  }, []);

  return { onlineStatus, refreshStatus };
};

export default useOnlineStatus;



