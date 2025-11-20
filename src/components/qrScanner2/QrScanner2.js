// import React, { useState, useEffect } from "react";
// import { Image, StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native";
// import {
//   Camera,
//   useCameraDevice,
//   useCodeScanner,
// } from "react-native-vision-camera";

// const QRScanner = (props) => {
//   const [hasPermission, setHasPermission] = useState(false);
//   const [latestScannedData, setLatestScannedData] = useState(null);
//   const [refresh, setRefresh] = useState(false);
//   const device = useCameraDevice("back");

//   const codeScanner = useCodeScanner({
//     codeTypes: ['qr', 'ean-13','ean-8', 'code-128', 'code-39'],
//     onCodeScanned: (codes) => {
//       try {
//         // Make sure we have valid data before proceeding
//         if (codes && codes.length > 0 && codes[0]?.value) {
//           setLatestScannedData(codes[0]?.value);
//           props.onRead(codes[0]?.value);
//         } else {
//           throw new Error("Invalid QR code data");
//         }
//       } catch (error) {
//         console.error("Scanning error: ", error.message);
//         Alert.alert("Error", "Failed to read the QR code. Please try again.");
//       }
//     },
//   });

//   useEffect(() => {
//     setRefresh(!refresh);
//   }, [device, hasPermission]);

//   useEffect(() => {
//     const requestCameraPermission = async () => {
//       try {
//         const permission = await Camera.requestCameraPermission();
//         console.log("Camera.requestCameraPermission ", permission);
//         setHasPermission(permission === "granted");
//       } catch (error) {
//         console.error("Permission error: ", error.message);
//         Alert.alert("Permission Error", "Failed to get camera permission. Please enable it in settings.");
//       }
//     };

//     requestCameraPermission();

//     // Timeout to close the scanner after a certain period if no scan happens
//     const timeout = setTimeout(() => {
//       props.onRead(null);
//     }, 15 * 1000);

//     return () => clearTimeout(timeout); // Cleanup the timeout on unmount
//   }, []);

//   if (device === null || !hasPermission) {
//     return (
//       <View style={styles.page2}>
//         <Text style={{ backgroundColor: "white" }}>
//           Camera not available or not permitted
//         </Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.page2}>
//       <Camera
//         codeScanner={codeScanner}
//         style={StyleSheet.absoluteFill}
//         device={device}
//         isActive={true}
//       />
//       <View style={styles.footer}>
//         <TouchableOpacity
//           style={{
//             paddingVertical: 8,
//             paddingHorizontal: 10,
//             borderWidth: 1,
//             borderRadius: 5,
//             borderColor: "snow",
//             alignItems: "center",
//           }}
//           onPress={() => {
//             props.onRead(null);
//           }}
//         >
//           {latestScannedData && (
//         <View style={styles.resultContainer}>
//           <Text style={styles.resultTitle}>Latest Scanned Code:</Text>
//           <Text style={styles.resultText}>{latestScannedData}</Text>
//         </View>
//       )}
//           <Text style={{ color: "snow", fontSize: 14 }}>Close</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };



// export default QRScanner;

// const styles = StyleSheet.create({
//   page2: {
//     flex: 1,
//     position: "absolute",
//     top: 0,
//     height: "100%",
//     width: "100%",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   backHeader: {
//     backgroundColor: "#00000090",
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     padding: "2%",
//     height: "5%",
//     width: "100%",
//     alignItems: "flex-start",
//     justifyContent: "center",
//   },
//   footer: {
//     backgroundColor: "#00000090",
//     position: "absolute",
//     bottom: 0,
//     left: 0,
//     right: 0,
//     padding: "10%",
//     height: "20%",
//     width: "100%",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   resultContainer: {
//     position: 'absolute',
//     bottom: 40, // Adjust the position to provide space between the camera view and the result container
//     left: 20,
//     right: 20,
//     backgroundColor: 'rgba(0, 0, 0, 0.8)',
//     padding: 10,
//     borderRadius: 5,
//   },
//   resultTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 5,
//     color: 'white',
//   },
//   resultText: {
//     fontSize: 14,
//     color: 'white',
//   },
// });

//only functionality

// import React, { useState, useEffect } from "react";
// import { Image, StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native";
// import {
//   Camera,
//   useCameraDevice,
//   useCodeScanner,
// } from "react-native-vision-camera";

// const QRScanner2 = (props) => {
//   const [hasPermission, setHasPermission] = useState(false);
//   const [latestScannedData, setLatestScannedData] = useState(null);
//   const device = useCameraDevice("back");

//   // 🔥 Continuous scanning — DO NOT close the screen
//   const codeScanner = useCodeScanner({
//     codeTypes: ['qr', 'ean-13','ean-8', 'code-128', 'code-39'],
//     onCodeScanned: (codes) => {
//       if (codes && codes.length > 0 && codes[0]?.value) {
//         setLatestScannedData(codes[0]?.value);   // Keep updating only
//       }
//     },
//   });

//   // Ask Permission
//   useEffect(() => {
//     const requestCameraPermission = async () => {
//       try {
//         const permission = await Camera.requestCameraPermission();
//         console.log("Camera.requestCameraPermission ", permission);
//         setHasPermission(permission === "granted");
//       } catch (error) {
//         console.error("Permission error: ", error.message);
//         Alert.alert("Permission Error", "Failed to get camera permission. Please enable it in settings.");
//       }
//     };

//     requestCameraPermission();
//   }, []);

//   if (device === null || !hasPermission) {
//     return (
//       <View style={styles.page2}>
//         <Text style={{ backgroundColor: "white" }}>
//           Camera not available or not permitted
//         </Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.page2}>
//       {/* Camera */}
//       <Camera
//         codeScanner={codeScanner}
//         style={StyleSheet.absoluteFill}
//         device={device}
//         isActive={true}
//       />

//       {/* Live Result */}
//       <View style={styles.resultContainer}>
//         <Text style={styles.resultTitle}>Latest Scanned Code:</Text>
//         <Text style={styles.resultText}>
//           {latestScannedData || "Scanning..."}
//         </Text>
//       </View>

//       {/* CLOSE BUTTON */}
//       <View style={styles.footer}>
//         <TouchableOpacity
//           style={styles.closeBtn}
//           onPress={() => props.onRead(latestScannedData || null)}
//         >
//           <Text style={{ color: "snow", fontSize: 14 }}>Close</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// export default QRScanner2;

// const styles = StyleSheet.create({
//   page2: {
//     flex: 1,
//     position: "absolute",
//     top: 0,
//     height: "100%",
//     width: "100%",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   footer: {
//     backgroundColor: "#00000090",
//     position: "absolute",
//     bottom: 0,
//     left: 0,
//     right: 0,
//     padding: "10%",
//     height: "20%",
//     width: "100%",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   closeBtn: {
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     borderWidth: 1,
//     borderRadius: 5,
//     borderColor: "snow",
//     alignItems: "center",
//   },
//   resultContainer: {
//     position: 'absolute',
//     bottom: 120,
//     left: 20,
//     right: 20,
//     backgroundColor: 'rgba(0, 0, 0, 0.8)',
//     padding: 10,
//     borderRadius: 5,
//   },
//   resultTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 5,
//     color: 'white',
//   },
//   resultText: {
//     fontSize: 14,
//     color: 'white',
//   },
// });

//functionality + UI

// import React, { useState, useEffect } from "react";
// import { StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native";
// import {
//   Camera,
//   useCameraDevice,
//   useCodeScanner,
// } from "react-native-vision-camera";
// import Icon from "react-native-vector-icons/Ionicons";

// const QRScanner2 = ({ onRead }) => {
//   const [hasPermission, setHasPermission] = useState(false);
//   const [latestScannedData, setLatestScannedData] = useState(null);
//   const device = useCameraDevice("back");

//   const codeScanner = useCodeScanner({
//     codeTypes: ["qr", "ean-13", "ean-8", "code-128", "code-39"],
//     onCodeScanned: (codes) => {
//       if (codes && codes.length > 0 && codes[0]?.value) {
//         setLatestScannedData(codes[0]?.value);
//       }
//     },
//   });

//   useEffect(() => {
//     const requestCameraPermission = async () => {
//       try {
//         const permission = await Camera.requestCameraPermission();
//         setHasPermission(permission === "granted");
//       } catch {
//         Alert.alert("Permission Error", "Enable camera permission in settings.");
//       }
//     };

//     requestCameraPermission();
//   }, []);

//   if (!device || !hasPermission) {
//     return (
//       <View style={styles.noCamContainer}>
//         <Text>Camera not available or not permitted</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>

//       <Camera
//         codeScanner={codeScanner}
//         style={StyleSheet.absoluteFill}
//         device={device}
//         isActive={true}
//       />

//       {/* Screen Overlay */}
//       <View style={styles.overlay} />

//       {/* Header */}
//       <View style={styles.topHeader}>
//         <TouchableOpacity onPress={() => onRead(null)} style={styles.backBtn}>
//           <Icon name="arrow-back" size={24} color="white" />
//         </TouchableOpacity>
//         <Text style={styles.headerText}>Scan QR Code</Text>
//       </View>

//       {/* Scanning Frame */}
//       <View style={styles.frameWrapper}>
//         <View style={styles.scanFrame}>
//           <View style={styles.cornerTopLeft} />
//           <View style={styles.cornerTopRight} />
//           <View style={styles.cornerBottomLeft} />
//           <View style={styles.cornerBottomRight} />
//         </View>
//         <Text style={styles.instructionText}>Align the QR code inside the frame</Text>
//       </View>

//       {/* Scanned Result */}
//       <View style={styles.resultCard}>
//         <Text style={styles.resultLabel}>Latest Scan</Text>
//         <Text style={styles.resultValue}>{latestScannedData || "Scanning..."}</Text>
//       </View>

//       {/* CLOSE Button */}
//       <TouchableOpacity
//         style={styles.closeButton}
//         onPress={() => onRead(latestScannedData || null)}
//       >
//         <Text style={styles.closeText}>Close Scanner</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// export default QRScanner2;

// const green = "mediumseagreen";

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "black",
//   },

//   noCamContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   overlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: "rgba(0,0,0,0.3)",
//   },

//   topHeader: {
//     position: "absolute",
//     top: 40,
//     left: 20,
//     flexDirection: "row",
//     alignItems: "center",
//   },

//   backBtn: {
//     padding: 10,
//   },

//   headerText: {
//     color: "white",
//     fontSize: 18,
//     marginLeft: 10,
//     fontWeight: "600",
//   },

//   frameWrapper: {
//     position: "absolute",
//     top: "22%",
//     left: 0,
//     right: 0,
//     alignItems: "center",
//   },

//   scanFrame: {
//     width: 260,
//     height: 260,
//     borderRadius: 18,
//     borderColor: "rgba(255,255,255,0.2)",
//     borderWidth: 1.5,
//   },

//   cornerTopLeft: {
//     position: "absolute",
//     top: -2,
//     left: -2,
//     width: 40,
//     height: 40,
//     borderLeftWidth: 4,
//     borderTopWidth: 4,
//     borderColor: green,
//     borderTopLeftRadius: 10,
//   },

//   cornerTopRight: {
//     position: "absolute",
//     top: -2,
//     right: -2,
//     width: 40,
//     height: 40,
//     borderRightWidth: 4,
//     borderTopWidth: 4,
//     borderColor: green,
//     borderTopRightRadius: 10,
//   },

//   cornerBottomLeft: {
//     position: "absolute",
//     bottom: -2,
//     left: -2,
//     width: 40,
//     height: 40,
//     borderLeftWidth: 4,
//     borderBottomWidth: 4,
//     borderColor: green,
//     borderBottomLeftRadius: 10,
//   },

//   cornerBottomRight: {
//     position: "absolute",
//     bottom: -2,
//     right: -2,
//     width: 40,
//     height: 40,
//     borderRightWidth: 4,
//     borderBottomWidth: 4,
//     borderColor: green,
//     borderBottomRightRadius: 10,
//   },

//   instructionText: {
//     color: "white",
//     marginTop: 14,
//     fontSize: 14,
//   },

//   resultCard: {
//     position: "absolute",
//     bottom: 140,
//     left: 20,
//     right: 20,
//     padding: 16,
//     backgroundColor: "rgba(0,0,0,0.55)",
//     borderRadius: 10,
//   },

//   resultLabel: {
//     color: "#bbb",
//     fontSize: 13,
//   },

//   resultValue: {
//     color: green,
//     fontSize: 18,
//     marginTop: 4,
//     fontWeight: "600",
//   },

//   closeButton: {
//     position: "absolute",
//     bottom: 40,
//     left: 40,
//     right: 40,
//     backgroundColor: green,
//     paddingVertical: 14,
//     borderRadius: 12,
//     alignItems: "center",
//   },

//   closeText: {
//     color: "white",
//     fontSize: 16,
//     fontWeight: "600",
//   },
// });

//Contious scan
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import {
  Camera,
  useCameraDevice,
  useCodeScanner,
} from "react-native-vision-camera";

const QRScanner2 = ({ onRead }) => {
  const [hasPermission, setHasPermission] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const device = useCameraDevice("back");

  useEffect(() => {
    Camera.requestCameraPermission().then(perm => {
      setHasPermission(perm === "granted");
    });
  }, []);

  const codeScanner = useCodeScanner({
    codeTypes: ["qr", "ean-13", "ean-8", "code-128", "code-39"],
    onCodeScanned: async (codes) => {

      if (isProcessing) return;

      if (codes && codes.length > 0) {
        const value = codes[0].value;

        setIsProcessing(true);  // hard lock scanner

        await onRead(value);    // your API logic runs

        setTimeout(() => {
          setIsProcessing(false); // restart scanner after processing
        }, 800);
      }
    },
  });

  if (!device || !hasPermission) {
    return (
      <View style={styles.noCam}>
        <Text>Camera unavailable</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        codeScanner={isProcessing ? null : codeScanner}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
      />

      {isProcessing && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="white" />
          <Text style={styles.loaderText}>Processing...</Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.closeBtn}
        onPress={() => onRead(null)}
      >
        <Text style={styles.closeText}>Close Scanner</Text>
      </TouchableOpacity>
    </View>
  );
};

export default QRScanner2;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "black" },
  noCam: { flex: 1, alignItems: "center", justifyContent: "center" },

  loader: {
    position: "absolute",
    top: 0, bottom: 0, left: 0, right: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },

  loaderText: {
    marginTop: 10,
    color: "white",
    fontSize: 16,
  },

  closeBtn: {
    position: "absolute",
    bottom: 40,
    left: 40,
    right: 40,
    backgroundColor: "mediumseagreen",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  closeText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

