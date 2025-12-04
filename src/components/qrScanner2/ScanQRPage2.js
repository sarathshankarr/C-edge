// import React, { useState } from "react";
// import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
// import QRScanner2 from "./QrScanner2";

// const clr1 = "mediumseagreen";

// const ScanQRPage2 = ({ navigation, route }) => {
//   const [showQR, setShowQR] = useState(false);

//   // const onQrRead = (qrtext) => {
//   //   setShowQR(false);

//   //   const { onScanSuccess } = route.params;
//   //   if (onScanSuccess) onScanSuccess(qrtext);

//   //   navigation.goBack();
//   // };

//   const onQrRead = async (qrtext) => {
//   if (qrtext === null) {
//     // user pressed close
//     navigation.goBack();
//     return;
//   }

//   const { onScanSuccess } = route.params;
//   return await onScanSuccess(qrtext);
// };


//   return (
//     <View style={{ flex: 1 }}>
//       {showQR ? (
//         <QRScanner2 onRead={onQrRead} />
//       ) : (
//         <View style={styles.page}>
//           <Image
//             source={require("../../../assets/images/png/scan.png")}
//             style={{ height: 60, width: 60 }}
//           />

//           <TouchableOpacity onPress={() => setShowQR(true)} style={styles.btn}>
//             <Text style={{ color: clr1, fontSize: 15 }}>Start Scanning</Text>
//           </TouchableOpacity>
//         </View>
//       )}
//     </View>
//   );
// };

// export default ScanQRPage2;

// const styles = StyleSheet.create({
//   page: {
//     flex: 1,
//     backgroundColor: "white",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 20,
//   },
//   btn: {
//     borderWidth: 2,
//     borderColor: clr1,
//     paddingVertical: 12,
//     paddingHorizontal: 40,
//     borderRadius: 10,
//   },
// });
import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import QRScanner2 from "./QrScanner2";

const clr1 = "mediumseagreen";

const ScanQRPage2 = ({ navigation, route }) => {
  const [showQR, setShowQR] = useState(false);

  const onQrRead = async (qrtext) => {
    if (qrtext === null) {
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
