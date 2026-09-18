// A drop-in replacement for React Native's Alert.alert(title, message,
// buttons) -- same call signature, so every call site elsewhere in
// GRN Checking swaps in with a plain rename, but it renders as this
// module's own themed <GrnAlertHost /> modal instead of the native OS
// dialog, so results/confirmations look consistent with the rest of the
// screen instead of stock Android/iOS chrome.
//
// Implemented as a tiny pub/sub (module-level listener) exactly like RN's
// own Alert.alert works globally without living in a specific component's
// tree -- callers (including plain hooks like useAiUploadJob.js, which
// can't render JSX themselves) just call showGrnAlert(...) from anywhere.
// Each GRN Checking screen mounts one <GrnAlertHost /> near its root; the
// most recently mounted host is the one that receives the next alert,
// which matches this module's screens never showing two at once.
let listener = null;

export function registerGrnAlertHost(fn) {
  listener = fn;
  return () => {
    if (listener === fn) listener = null;
  };
}

export function showGrnAlert(title, message, buttons) {
  const normalizedButtons = buttons && buttons.length ? buttons : [{text: 'OK'}];
  if (listener) listener({title, message, buttons: normalizedButtons});
}
