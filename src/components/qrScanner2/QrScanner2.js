// // import React, { useState, useEffect } from "react";
// // import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
// // import {
// //   Camera,
// //   useCameraDevice,
// //   useCodeScanner,
// // } from "react-native-vision-camera";

// // const QRScanner2 = ({ onRead }) => {
// //   const [hasPermission, setHasPermission] = useState(false);
// //   const [isProcessing, setIsProcessing] = useState(false);
// //   const device = useCameraDevice("back");

// //   useEffect(() => {
// //     Camera.requestCameraPermission().then(perm => {
// //       setHasPermission(perm === "granted");
// //     });
// //   }, []);

// //   const codeScanner = useCodeScanner({
// //     codeTypes: ["qr", "ean-13", "ean-8", "code-128", "code-39"],
// //     onCodeScanned: async (codes) => {

// //       if (isProcessing) return;

// //       if (codes && codes.length > 0) {
// //         const value = codes[0].value;

// //         setIsProcessing(true);  // hard lock scanner

// //         await onRead(value);    // your API logic runs

// //         setTimeout(() => {
// //           setIsProcessing(false); // restart scanner after processing
// //         }, 800);
// //       }
// //     },
// //   });

// //   if (!device || !hasPermission) {
// //     return (
// //       <View style={styles.noCam}>
// //         <Text>Camera unavailable</Text>
// //       </View>
// //     );
// //   }

// //   return (
// //     <View style={styles.container}>
// //       <Camera
// //         codeScanner={isProcessing ? null : codeScanner}
// //         style={StyleSheet.absoluteFill}
// //         device={device}
// //         isActive={true}
// //       />

// //       {isProcessing && (
// //         <View style={styles.loader}>
// //           <ActivityIndicator size="large" color="white" />
// //           <Text style={styles.loaderText}>Processing...</Text>
// //         </View>
// //       )}

// //       <TouchableOpacity
// //         style={styles.closeBtn}
// //         onPress={() => onRead(null)}
// //       >
// //         <Text style={styles.closeText}>Close Scanner</Text>
// //       </TouchableOpacity>
// //     </View>
// //   );
// // };

// // export default QRScanner2;

// // const styles = StyleSheet.create({
// //   container: { flex: 1, backgroundColor: "black" },
// //   noCam: { flex: 1, alignItems: "center", justifyContent: "center" },

// //   loader: {
// //     position: "absolute",
// //     top: 0, bottom: 0, left: 0, right: 0,
// //     backgroundColor: "rgba(0,0,0,0.6)",
// //     justifyContent: "center",
// //     alignItems: "center",
// //   },

// //   loaderText: {
// //     marginTop: 10,
// //     color: "white",
// //     fontSize: 16,
// //   },

// //   closeBtn: {
// //     position: "absolute",
// //     bottom: 40,
// //     left: 40,
// //     right: 40,
// //     backgroundColor: "mediumseagreen",
// //     paddingVertical: 14,
// //     borderRadius: 12,
// //     alignItems: "center",
// //   },

// //   closeText: {
// //     color: "white",
// //     fontSize: 16,
// //     fontWeight: "600",
// //   },
// // });

// import React, { useState, useEffect, useRef } from "react";
// import {
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
//   ActivityIndicator,
//   Animated,
//   Easing
// } from "react-native";
// import {
//   Camera,
//   useCameraDevice,
//   useCodeScanner,
// } from "react-native-vision-camera";

// const QRScanner2 = ({ onRead }) => {
//   const [hasPermission, setHasPermission] = useState(false);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const device = useCameraDevice("back");

//   const scanLine = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     Camera.requestCameraPermission().then(perm => {
//       setHasPermission(perm === "granted");
//     });

//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(scanLine, {
//           toValue: 1,
//           duration: 1800,
//           easing: Easing.linear,
//           useNativeDriver: true,
//         }),
//         Animated.timing(scanLine, {
//           toValue: 0,
//           duration: 1800,
//           easing: Easing.linear,
//           useNativeDriver: true,
//         }),
//       ])
//     ).start();
//   }, []);

//   const codeScanner = useCodeScanner({
//     codeTypes: ["qr", "ean-13", "ean-8", "code-128", "code-39"],
//     onCodeScanned: async (codes) => {
//       if (isProcessing) return;

//       if (codes && codes.length > 0) {
//         const value = codes[0].value;

//         setIsProcessing(true);
//         await onRead(value);

//         setTimeout(() => setIsProcessing(false), 800);
//       }
//     },
//   });

//   if (!device || !hasPermission) {
//     return (
//       <View style={styles.noCam}>
//         <Text>Camera unavailable</Text>
//       </View>
//     );
//   }

//   const scanLineTranslate = scanLine.interpolate({
//     inputRange: [0, 1],
//     outputRange: [0, 230], // line move inside frame
//   });

//   return (
//     <View style={styles.container}>
//       <Camera
//         codeScanner={isProcessing ? null : codeScanner}
//         style={StyleSheet.absoluteFill}
//         device={device}
//         isActive={true}
//       />

//       {/* Dark overlay except scan area */}
//       <View style={styles.overlay} />

//       {/* Scan frame */}
//       <View style={styles.frame}>
//         <Animated.View
//           style={[
//             styles.scanLine,
//             { transform: [{ translateY: scanLineTranslate }] },
//           ]}
//         />
//       </View>

//       {/* Instructions */}
//       {!isProcessing && (
//         <Text style={styles.instruction}>Align QR inside the box</Text>
//       )}

//       {isProcessing && (
//         <View style={styles.loader}>
//           <ActivityIndicator size="large" color="white" />
//           <Text style={styles.loaderText}>Processing...</Text>
//         </View>
//       )}

//       <TouchableOpacity style={styles.closeBtn} onPress={() => onRead(null)}>
//         <Text style={styles.closeText}>Close</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// export default QRScanner2;

// const FRAME_SIZE = 260;

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "black" },
//   noCam: { flex: 1, alignItems: "center", justifyContent: "center" },

//   overlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: "rgba(0,0,0,0.55)",
//   },

//   frame: {
//     width: FRAME_SIZE,
//     height: FRAME_SIZE,
//     borderRadius: 18,
//     borderWidth: 3,
//     borderColor: "mediumseagreen",
//     position: "absolute",
//     top: "25%",
//     left: "50%",
//     transform: [{ translateX: -FRAME_SIZE / 2 }],
//     backgroundColor: "transparent",
//     overflow: "hidden",
//   },

//   scanLine: {
//     width: "100%",
//     height: 3,
//     backgroundColor: "mediumseagreen",
//     position: "absolute",
//     top: 0,
//   },

//   instruction: {
//     position: "absolute",
//     top: "60%",
//     alignSelf: "center",
//     fontSize: 15,
//     color: "white",
//   },

//   loader: {
//     position: "absolute",
//     top: 0, bottom: 0, left: 0, right: 0,
//     backgroundColor: "rgba(0,0,0,0.6)",
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   loaderText: {
//     marginTop: 10,
//     color: "white",
//     fontSize: 16,
//     fontWeight: "500",
//   },

//   closeBtn: {
//     position: "absolute",
//     bottom: 60,
//     alignSelf: "center",
//     backgroundColor: "mediumseagreen",
//     paddingVertical: 14,
//     paddingHorizontal: 40,
//     borderRadius: 12,
//   },

//   closeText: {
//     color: "white",
//     fontSize: 16,
//     fontWeight: "600",
//   },
// });

import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Animated,
  Easing,
  Dimensions,
} from "react-native";
import {
  Camera,
  useCameraDevice,
  useCodeScanner,
} from "react-native-vision-camera";

const { width, height } = Dimensions.get("window");

// 🔥 Square made bigger
const FRAME_SIZE = width * 0.75;

const QRScanner2 = ({ onRead }) => {
  const [hasPermission, setHasPermission] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const device = useCameraDevice("back");

  const scanLine = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Camera.requestCameraPermission().then((perm) => {
      setHasPermission(perm === "granted");
    });

    Animated.loop(
      Animated.sequence([
        Animated.timing(scanLine, {
          toValue: 1,
          duration: 1500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(scanLine, {
          toValue: 0,
          duration: 1500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // 🔥 Scan ONLY within square region
  const codeScanner = useCodeScanner({
    codeTypes: ["qr", "ean-13", "ean-8", "code-128", "code-39"],
    regionOfInterest: {
      x: 0.5,   // center
       y: 0.25 + (FRAME_SIZE / height) / 2,
      width: FRAME_SIZE / width,
      height: FRAME_SIZE / height,
    },
    onCodeScanned: async (codes) => {
      if (isProcessing) return;
      if (!codes || codes.length === 0) return;

      const value = codes[0].value;
      if (!value) return;

      setIsProcessing(true);
      await onRead(value);
      setTimeout(() => setIsProcessing(false), 800);
    },
  });

  if (!device || !hasPermission) {
    return (
      <View style={styles.noCam}>
        <Text>Camera unavailable</Text>
      </View>
    );
  }

  const scanLineTranslate = scanLine.interpolate({
    inputRange: [0, 1],
    outputRange: [0, FRAME_SIZE - 10],
  });

  return (
    <View style={styles.container}>
      <Camera
        codeScanner={isProcessing ? null : codeScanner}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
      />

      <View style={styles.overlay} />

      {/* Big Scan Frame */}
      <View style={styles.frame}>
        <Animated.View
          style={[
            styles.scanLine,
            { transform: [{ translateY: scanLineTranslate }] },
          ]}
        />
      </View>

      {!isProcessing && (
        <Text style={styles.instruction}>Align QR inside the box</Text>
      )}

      {isProcessing && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="white" />
          <Text style={styles.loaderText}>Processing...</Text>
        </View>
      )}

      <TouchableOpacity style={styles.closeBtn} onPress={() => onRead(null)}>
        <Text style={styles.closeText}>Close</Text>
      </TouchableOpacity>
    </View>
  );
};

export default QRScanner2;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "black" },
  noCam: { flex: 1, alignItems: "center", justifyContent: "center" },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },

  frame: {
    width: FRAME_SIZE,
    height: FRAME_SIZE,
    borderRadius: 18,
    borderWidth: 3,
    borderColor: "mediumseagreen",
    position: "absolute",
    top: "25%",
    left: "50%",
    transform: [{ translateX: -FRAME_SIZE / 2 }],
    overflow: "hidden",
    zIndex: 10,
  },

  scanLine: {
    width: "100%",
    height: 3,
    backgroundColor: "mediumseagreen",
    position: "absolute",
    top: 0,
  },

  instruction: {
    position: "absolute",
    top: "65%",
    alignSelf: "center",
    fontSize: 16,
    color: "white",
    fontWeight: "500",
    zIndex: 20,
  },

  loader: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 99,
  },

  loaderText: {
    marginTop: 10,
    color: "white",
    fontSize: 16,
  },

  closeBtn: {
    position: "absolute",
    bottom: 60,
    alignSelf: "center",
    backgroundColor: "mediumseagreen",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    zIndex: 200,
  },

  closeText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

