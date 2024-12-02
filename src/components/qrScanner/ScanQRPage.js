
import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Image } from "react-native";
import QRScanner from "./QrScanner";
const dWidth = Dimensions.get("window").width;

const clr1 = "mediumseagreen";

const ScanQRPage = ({ navigation, route }) => {
  // const { onScanSuccess } = route.params;  // Retrieve the callback function from route params
  const [showQR, setShowQR] = useState(false);
  const [qrCode, setQrCode] = useState("");

  const openQRscanner = () => {
    setShowQR(true);
  };



  const onQrRead = (qrtext) => {
    setQrCode(qrtext);
    setShowQR(false); 

    const { onScanSuccess } = route.params;

    if (onScanSuccess) {
      onScanSuccess(qrtext);
    }

    navigation.goBack();
  };

  return (
    <View style={styles.page}>
      {/* {qrCode ? (
        <Text style={{ fontSize: 16, color: "black" }}>
          {"QR Value \n" + qrCode}
        </Text>
      ) : null}
      <Image source={require('../../../assets/images/png/scan.png')} style={{
        height: 40,
        width: 40,
      }} />
      <TouchableOpacity onPress={() => openQRscanner()} style={styles.btn}>
        <Text style={{ color: clr1 }}>Scan Barcode</Text>
      </TouchableOpacity>
      {showQR ?  */}
      <QRScanner onRead={onQrRead} /> 
      {/* : null} */}
    </View>
  );
};

export default ScanQRPage;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  btn: {
    backgroundColor: "transparent",
    alignItems: "center",
    borderRadius: 10,
    paddingVertical: "3%",
    width: "50%",
    borderWidth: 2,
    borderColor: clr1,
  },
  btnText: {
    color: clr1,
  },
});
