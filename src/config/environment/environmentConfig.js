// @flow
//import { getBundleId } from '../../utils/device.info';

//"https://demo.codeverse.co/stitch/"
//"https://vistar.codeverse.co/stitch/"
//"https://krishnacorp.codeverse.co/stitch/"
//http://uat.codeverse.co/stitch/
//http://cta.codeverse.co/stitch/
// export const DEV = {
//     uri: "https://cta.codeverse.co/stitch/",//"https://demo.codeverse.co/stitch/",
// };

// export const UAT = {
//   uri: "https://demo.codeverse.co/stitch/",
// };

// //"https://icx.codeverse.co/stitch/",//"https://uat.codeverse.co/stitch/",

//   const bundleId = 'DEV';
//   // const bundleId = 'UAT';

//   export let env = "";
//   if (bundleId === "DEV") {
//     env = "DEV";
//   } else if (bundleId === "UAT") {
//     env = "UAT";
//   } 
  
let envioramet = {
  uri: "",  // Default URI
};

export function setUrlInGlobal(URL) {
  envioramet.uri = URL+"stitch/";
  console.log("Setted global url==========", envioramet);
}

export function getEnvironment() {
  return envioramet;  
}

  export const CUSTOMER_URL="https://crm.codeverse.co/cedge/get-customer-url/erp/"

  const Base = {
    Environment: function() {
      return JSON.stringify(getEnvironment());
    },
  };
  
  export default Base;