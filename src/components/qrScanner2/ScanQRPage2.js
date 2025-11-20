
// import React, { useState } from "react";
// import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Image } from "react-native";
// import QRScanner2 from "./QrScanner2";
// const dWidth = Dimensions.get("window").width;

// const clr1 = "mediumseagreen";

// const ScanQRPage2 = ({ navigation, route }) => {
//   // const { onScanSuccess } = route.params;  // Retrieve the callback function from route params
//   const [showQR, setShowQR] = useState(false);
//   const [qrCode, setQrCode] = useState("");

//   const openQRscanner = () => {
//     setShowQR(true);
//   };

//   const onQrRead = (qrtext) => {
//     setQrCode(qrtext);
//     setShowQR(false); 

//     const { onScanSuccess } = route.params;

//     if (onScanSuccess) {
//       onScanSuccess(qrtext);
//     }

//     navigation.goBack();
//   };

//   return (
//     <View style={styles.page}>
//       {/* {qrCode ? (
//         <Text style={{ fontSize: 16, color: "black" }}>
//           {"QR Value \n" + qrCode}
//         </Text>
//       ) : null}
//       <Image source={require('../../../assets/images/png/scan.png')} style={{
//         height: 40,
//         width: 40,
//       }} />
//       <TouchableOpacity onPress={() => openQRscanner()} style={styles.btn}>
//         <Text style={{ color: clr1 }}>Scan Barcode</Text>
//       </TouchableOpacity>
//       {showQR ?  */}
//       <QRScanner2 onRead={onQrRead} /> 
//       {/* : null} */}
//     </View>
//   );
// };

// export default ScanQRPage2;

// const styles = StyleSheet.create({
//   page: {
//     flex: 1,
//     backgroundColor: "white",
//     alignItems: "center",
//     justifyContent: "space-evenly",
//   },
//   btn: {
//     backgroundColor: "transparent",
//     alignItems: "center",
//     borderRadius: 10,
//     paddingVertical: "3%",
//     width: "50%",
//     borderWidth: 2,
//     borderColor: clr1,
//   },
//   btnText: {
//     color: clr1,
//   },
// });

//ui
import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import QRScanner2 from "./QrScanner2";

const clr1 = "mediumseagreen";

const ScanQRPage2 = ({ navigation, route }) => {
  const [showQR, setShowQR] = useState(false);

  // const onQrRead = (qrtext) => {
  //   setShowQR(false);

  //   const { onScanSuccess } = route.params;
  //   if (onScanSuccess) onScanSuccess(qrtext);

  //   navigation.goBack();
  // };

  const onQrRead = async (qrtext) => {
  if (qrtext === null) {
    // user pressed close
    navigation.goBack();
    return;
  }

  const { onScanSuccess } = route.params;
  return await onScanSuccess(qrtext);
};


  return (
    <View style={{ flex: 1 }}>
      {showQR ? (
        <QRScanner2 onRead={onQrRead} />
      ) : (
        <View style={styles.page}>
          <Image
            source={require("../../../assets/images/png/scan.png")}
            style={{ height: 60, width: 60 }}
          />

          <TouchableOpacity onPress={() => setShowQR(true)} style={styles.btn}>
            <Text style={{ color: clr1, fontSize: 15 }}>Start Scanning</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default ScanQRPage2;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  btn: {
    borderWidth: 2,
    borderColor: clr1,
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
});
