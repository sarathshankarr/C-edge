import NetInfo from "@react-native-community/netinfo";
// import BuildEnv from './../../config/environment/environmentConfig';

// const Environment= JSON.parse(BuildEnv.Environment());
import { getEnvironment } from "./../../config/environment/environmentConfig";

const Environment = getEnvironment();

export async function internetCheck() {
    let netInfo = await NetInfo.fetch(null, true);
    return netInfo.isConnected;
};



export async function loginUserAPIService(jsonValue) {
    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;
    let internet = false;

    try {
        internet = await internetCheck();
        if (!internet) {
            obj = { logoutData, statusData, responseData, error: returnError, isInternet: internet };
            return obj;
        }

        console.log("Environment.uri ==> ", Environment.uri);
        console.log('loginUserAPIService Code ', jsonValue, Environment.uri + "logInManagement/logIn");

        const response = await fetch(Environment.uri + "logInManagement/logIn", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify(jsonValue),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        // console.log('loginUserAPIService Response ', data);

        if (data && data.passwordStatus) {
            statusData = data.passwordStatus;
            responseData = data;
        } else {
            statusData = undefined;
        }

    } catch (error) {
        console.log('loginUserAPIService Error ', error);
        returnError = error.message || error.toString();
        // Handle specific error cases if needed
        if (error instanceof TypeError && error.message === 'Network request failed') {
            returnError = "Network request failed. Please check your internet connection.";
        }
        throw returnError; // Re-throw the error to propagate it
    }

    console.log("returning here......");
    obj = { logoutData, statusData, responseData, error: returnError, isInternet: internet };
    return obj;
}
export async function updateUserInActive(jsonValue) {
    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;
    let internet = false;

    try {
        internet = await internetCheck();
        if (!internet) {
            obj = { logoutData, statusData, responseData, error: returnError, isInternet: internet };
            return obj;
        }

        console.log("Environment.uri ==> ", Environment.uri, jsonValue);
        console.log('loginUserAPIService Code ', Environment.uri + "logInManagement/updateUserInActive");

        const response = await fetch(Environment.uri + "logInManagement/updateUserInActive", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify(jsonValue),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('updateUserInActive ', data);

        if (data && data.passwordStatus) {
            statusData = data.passwordStatus;
            responseData = data;
        } else {
            statusData = undefined;
        }

    } catch (error) {
        console.log('loginUserAPIService Error ', error);
        returnError = error.message || error.toString();
        // Handle specific error cases if needed
        if (error instanceof TypeError && error.message === 'Network request failed') {
            returnError = "Network request failed. Please check your internet connection.";
        }
        throw returnError; // Re-throw the error to propagate it
    }
    obj = { logoutData, statusData, responseData, error: returnError, isInternet: internet };

    return obj;
}

export async function poApproveEditAPIService(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    console.log('Po Approval Code ', Environment.uri + "po/poedit")
    await fetch(Environment.uri + "po/poedit",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        // console.log('Po Approval Code1 ', data)

        if (data && data.status) {
            statusData = data.status;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('Po Approval Code Error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};

export async function poApproveAPIService(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    console.log('Po poApprove Code ', jsonValue, Environment.uri + "po/poApprove")
    await fetch(Environment.uri + "po/poApprove",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        console.log('Po poApprove Code1 ', data)

        if (data) {
            statusData = data;
            responseData = undefined
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('Po poApprove Code Error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};

export async function allPOAPIService(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    await fetch(Environment.uri + "po/loadAllPOs",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {

        // console.log('PO List ', data[0])

        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('Code1 ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};

export async function loadAllStylesAPI(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }

    try {
        console.log('Style Api ', Environment.uri + "styleapi/loadAllStyles")
        const response = await fetch(Environment.uri + "styleapi/loadAllStyles",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify(jsonValue),
            }
        )

        if (!response.ok) {
            throw new Error(`HTTP status ${response.status}`);
        }

        // console.log("RESponse after api call ========> ", response)
        const contentLength = response.headers.get("content-length");

        let data = [];

        // console.log("Content length ====> ", contentLength,  parseInt(contentLength));

        if (contentLength && parseInt(contentLength) > 0) {
            data = await response.json(); 
        } else {
            console.log("Empty response body.");
        }
        if (data?.length > 0) {
            responseData = data;
            statusData = true;
        } else {
            responseData = [];
            statusData = true;
        }
    } catch (error) {
        console.log('Style Api Error ', error)
        returnError = error;
    }


    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};

export async function stylesDetailsAPIByRecord(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    await fetch(Environment.uri + "styleapi/styleDetails",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        // console.log('listStylesAPIByRec ', data)

        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('styleDetails ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};

export async function viewProcessFlow(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    console.log('viewProcessFlow ', Environment.uri + "styleapi/viewProcessFlowByStyle")
    await fetch(Environment.uri + "styleapi/viewProcessFlowByStyle",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        // console.log('viewProcessFlow1 ', data)

        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log(' viewProcessFlow ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};

export async function vieTimeAction(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    console.log('viewTimeAndAction ', Environment.uri + "styleapi/viewTimeAndAction")
    await fetch(Environment.uri + "styleapi/viewTimeAndAction",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        // console.log('viewTimeAndAction ', data)

        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('viewTimeAndAction ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};

export async function allCuttingStyles(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    // console.log('allCuttingStyles ', jsonValue, Environment.uri + "cutting/loadAllCuttingStyles")
    await fetch(Environment.uri + "cutting/loadAllCuttingStyles",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then(async (response) => await response.json()).then(async (data) => {
        // console.log('allCuttingStyles11 ', data[0])

        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log(' allCuttingStyles', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};

export async function styleSizeDetails(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    console.log('styleSizeDetails ', Environment.uri + "styleapi/styleSizeDetails")
    await fetch(Environment.uri + "styleapi/styleSizeDetails",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        // console.log('styleSizeDetails1---> ', data)

        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log(' styleSizeDetails ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};

export async function getFabricDetails(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    console.log('getFabricDetails ', Environment.uri + "cutting/getFabricDetails")
    await fetch(Environment.uri + "cutting/getFabricDetails",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log(' getFabricDetails', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};

export async function loadFinishingDetails(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }

    await fetch(Environment.uri + "finishing/loadAllDataFinishing",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        console.log('loadFinishingDetails ', data[0])

        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('loadFinishingDetails error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};

export async function addFinishingDetails(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    console.log('addFinishingInDetails ', jsonValue, Environment.uri + "finishing/addFinishingInDetails")
    await fetch(Environment.uri + "finishing/addFinishingInDetails",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        console.log('addFinishingInDetails1 ', data)

        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log(' addFinishingDetails ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};

export async function addFinishingOutDetails(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    console.log('addFinishingOutDetails ', jsonValue, Environment.uri + "finishingout/addFinishingOutDetails")
    await fetch(Environment.uri + "finishingout/addFinishingOutDetails",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        console.log('addFinishingOutDetails1 ', data[0])

        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log(' addFinishingOutDetails ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};

export async function saveFinishingDetails(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    console.log('saveFinishingInDetails ', jsonValue, Environment.uri + "finishing/saveFinishingInDetails")
    await fetch(Environment.uri + "finishing/saveFinishingInDetails",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        console.log('saveFinishingInDetails ', data)

        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log(' saveFinishingInDetails', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};

export async function finishingOutStyleDetails(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }

    await fetch(Environment.uri + "finishingout/loadAllDataFinishingOut",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        console.log('loadFinishingOutDetails ', data[0])

        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('loadFinishingOutDetails error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};



export async function saveFinishingOutDetails(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    console.log('saveFinishingOutDetails ', jsonValue, Environment.uri + "finishingout/saveFinishingOutDetails")
    await fetch(Environment.uri + "finishingout/saveFinishingOutDetails",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        console.log('saveFinishingOutDetails---> ', data)

        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('saveFinishingOutDetails Error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};

export async function saveCuttingDetails(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    console.log('saveCuttingDetailsAPI ', jsonValue, Environment.uri + "cutting/saveCuttingDetails")
    await fetch(Environment.uri + "cutting/saveCuttingDetails",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        console.log('saveCuttingDetailsAPI1 ', data)

        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log(' Error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};

export async function addCuttingDetails(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    console.log('addCuttingDetails ', Environment.uri + "cutting/addCuttingDetails")
    await fetch(Environment.uri + "cutting/addCuttingDetails",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        // console.log('addCuttingDetails--- ', data)

        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('addCuttingDetails Error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};

export async function stichingOutDetails(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }

    // console.log("URL ==>", Environment.uri + "stitchingout/loadAllCTRRequestForCutting", "Json Object ==>", jsonValue)

    await fetch(Environment.uri + "stitchingout/loadAllCTRRequestForCutting",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        // console.log('stichingOutDetails list ', data[0])

        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('stichingOutDetails error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};

export async function saveStichingOutDetails(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }

    await fetch(Environment.uri + "stitchingout/saveStitchingOutDetails",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        console.log('saveStitchingOutDetails ', data)

        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('saveStitchingOutDetails error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};

export async function stichingInDetails(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }

    await fetch(Environment.uri + "stitching/loadAllStitchingIn",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        console.log('loadAllStitchingIn ', data[0])

        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('stichingOutDetails error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};


export async function editStichingInDetails(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    // console.log("url ==>", Environment.uri + "stitching/stitchingInEdit", "JSON VALUE ==>", jsonValue)
    await fetch(Environment.uri + "stitching/stitchingInEdit",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        console.log('stitchingInEdit', '', data)

        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('stitchingInEdit error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};

export async function addStitchingOutDetails(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    console.log('addStitchingOutDetails ', jsonValue, Environment.uri + "stitchingout/addStitchingOutDetails")
    await fetch(Environment.uri + "stitchingout/addStitchingOutDetails",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        // console.log('addStitchingOutDetails ', data)

        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log(' addStitchingOutDetails', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};

export async function saveStitchingOutDetails(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    console.log('saveStitchingOutDetails ', jsonValue, Environment.uri + "stitchingout/saveStitchingOutDetails")
    await fetch(Environment.uri + "stitchingout/saveStitchingOutDetails",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        console.log('saveStitchingOutDetails--- ', data)

        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('saveStitchingOutDetails error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};

export async function saveStitchingInDetails(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    // console.log('saveStitchingInDetails ', jsonValue, Environment.uri + "stitching/stitchingInsave")
    await fetch(Environment.uri + "stitching/stitchingInsave",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        // console.log('saveStitchingInDetails ', data)

        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log(' saveFinishingInDetails', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};

export async function bundlingDetails(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }

    await fetch(Environment.uri + "ctrbundlingapi/loadAllctrBundling",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        console.log('stichingOutDetails ', data)

        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('stichingOutDetails error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};

export async function stockApproveListDetails(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }

    await fetch(Environment.uri + "stockapprove/loadAllStyles",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        // console.log('stockApproveListDetails ', data)

        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('stockApproveListDetails error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};
export async function stockRequestListDetails(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }

    await fetch(Environment.uri + "stockapprove/loadAllStockRequests",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        // console.log('stockApproveListDetails ', data)

        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('stockApproveListDetails error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};

export async function styleLocationInvAPI(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }

    await fetch(Environment.uri + "inventory/styleLocationInv",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        console.log('styleLocationInv ', data[0])

        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('styleLocationInv error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};

export async function locationWiseRMFabInvAPI(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }

    await fetch(Environment.uri + "inventory/locationWiseRMFabInv",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        console.log('inventory/locationWiseRMFabInv ', data[0])

        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('inventory/locationWiseRMFabInv', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};

export async function locationStyleWiseRmFabInvAPI(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }

    await fetch(Environment.uri + "inventory/locationStyleWiseRmFabInv",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        console.log('locationStyleWiseRmFabInv ', data[0])

        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('locationStyleWiseRmFabInv', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};


export async function loadDesignDirectoryApprovalList(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }

    await fetch(Environment.uri + "designdirectory/loadAlldesignDirectory",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        // console.log('loadDesignDirectoryApprovalList ', data[0])

        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('loadDesignDirectoryApprovalList error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};
export async function loadAllFabricMastersList(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }

    console.log('url ', 'fabricmaster/loadAllFabrics');
    await fetch(Environment.uri + "fabricmaster/loadAllFabrics",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {

        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('loadAllFabricMastersList error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};
export async function loadAllVendorMastersList(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }

    console.log('url ', 'vendor/loadAllVendors');
    await fetch(Environment.uri + "vendor/loadAllVendors",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {

        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('loadAllVendorMastersList error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};
export async function loadVendorMasterStatesList(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }

    console.log('url ', 'vendor/loadStates');
    await fetch(Environment.uri + "vendor/loadStates",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {

        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('loadAllVendorMasterStatesList error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};
export async function LoadProductionProcessReport(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }

    await fetch(Environment.uri + "productionprocessreport/loadProdReport",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {

        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('LoadProductionProcessReport error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};
export async function loadgetSizesBasedOnScaleList(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }

    console.log('url ', 'styleapi/getSizesOnScale');
    await fetch(Environment.uri + "styleapi/getSizesOnScale",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {

        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('loadAllVendorMasterStatesList error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};
export async function loadScalesOnSizeGroup(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }

    console.log('url ', 'styleapi/loadScalesOnSizeGroup');
    await fetch(Environment.uri + "styleapi/loadScalesOnSizeGroup",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {

        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('loadAllVendorMasterStatesList error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};
export async function getcolorcode(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }

    console.log('url ', 'styleapi/getcolorcode');
    await fetch(Environment.uri + "styleapi/getcolorcode",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {

        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('loadAllVendorMasterStatesList error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};
export async function getColorBasedOnFabric(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }

    console.log('url ', 'styleapi/getcolorFabric');
    await fetch(Environment.uri + "styleapi/getcolorFabric",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {

        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('loadAllVendorMasterStatesList error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};

export async function EditDDA(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    // console.log("url ==>", Environment.uri + "designdirectory/editdesigndirectory", "JSON VALUE ==>", jsonValue)
    await fetch(Environment.uri + "designdirectory/editdesigndirectory",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        // console.log('EditDDA   ==>', '', data.designId)

        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('EditDDA error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};
export async function EditFabricMasters(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    await fetch(Environment.uri + "fabricmaster/editFabric",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        // console.log('EditDDA   ==>', '', data.designId)

        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('EditFabricMasters error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};
export async function EditVendorMasters(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    await fetch(Environment.uri + "vendor/editVendor",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        // console.log('EditVendorMasters   ==>', '', data.designId)

        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('EditVendorMasters error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};

export async function saveDDA(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    console.log('saveDDA  ', Environment.uri + "designdirectory/designDirectoryApprove")
    await fetch(Environment.uri + "designdirectory/designDirectoryApprove",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        console.log('saveDDA ', data)

        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('saveDDA', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};
export async function saveEditVendorMasters(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    console.log('saveEditVendorMasters  ', Environment.uri + "vendor/editSaveVendor")
    await fetch(Environment.uri + "vendor/editSaveVendor",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('saveEditVendorMasters', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};
export async function saveFabricEdit(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    console.log('saveFabricEdit  ', Environment.uri + "fabricmaster/editSaveFabric")
    await fetch(Environment.uri + "fabricmaster/editSaveFabric",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        console.log('saveFabricEdit ', data)

        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('saveDDA', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};

export async function saveEditStleDetails(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    console.log('saveFabricEdit  ', Environment.uri + "styleapi/editSaveStyle")
    await fetch(Environment.uri + "styleapi/editSaveStyle",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        console.log('saveFabricEdit ', data)

        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('saveDDA', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};


export async function loadAllNotifications(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    console.log("URL", Environment.uri + "logInManagement/getAllUnreadMessages");
    await fetch(Environment.uri + "logInManagement/getAllUnreadMessages",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        // console.log('getAllUnreadMessages ', data[0])

        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('getAllUnreadMessages error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};

export async function UpdateUnreadMessages(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    console.log('markAllAsRead ', jsonValue, Environment.uri + "logInManagement/markAllAsRead")
    await fetch(Environment.uri + "logInManagement/markAllAsRead",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        console.log('update unread Msgs  data', data)

        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('update unread Msgs Error', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};

export async function ClearAllNotifications(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    console.log('clearAllMsgs ', jsonValue, Environment.uri + "logInManagement/clearAllMsgs")
    await fetch(Environment.uri + "logInManagement/clearAllMsgs",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        console.log('clearAllMsgs ', data)

        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('clearAllMsgs', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};

export async function GetEditStockAprroveDetails(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    // console.log("url ==>", Environment.uri + "stockapprove/getStockDetails", "JSON VALUE ==>", jsonValue)
    await fetch(Environment.uri + "stockapprove/getStockDetails",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        // console.log('EditDDA   ==>', '', data.designId)

        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('EditDDA error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};

export async function saveStoreApproval(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    // console.log('saveStitchingInDetails ', jsonValue, Environment.uri + "stockapprove/saveStockApprove")
    await fetch(Environment.uri + "stockapprove/saveStockApprove",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        console.log('saveStockApprove ', data)

        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('saveStockApprove', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};

export async function stockRecieveListApi(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }

    await fetch(Environment.uri + "stockapprove/loadAllStockRec",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        // console.log('stockRecieveListApi ', data)

        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('stockRecieveListApi error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};

export async function GetEditStockRecieveDetails(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    // console.log("url ==>", Environment.uri + "stockapprove/getStockReceive", "JSON VALUE ==>", jsonValue)
    await fetch(Environment.uri + "stockapprove/getStockReceive",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        // console.log('Edit Receive Stock   ==>', '', data.designId)

        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('Edit Receive Stock error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};

export async function GetEditStockRequestDetails(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    // console.log("url ==>", Environment.uri + "stockapprove/editStockRequest", "JSON VALUE ==>", jsonValue)
    await fetch(Environment.uri + "stockapprove/editStockRequest",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        // console.log('Stock Request   ==>', '', data.designId)

        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('Stock Request error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};
export async function saveStockRequest(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    // console.log('saveStock request ', jsonValue, Environment.uri + "stockapprove/saveStockReq")
    await fetch(Environment.uri + "stockapprove/saveStockReq",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        console.log('saveStock request ', data)

        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('saveStockApprove', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};

export async function saveEditStockRequest(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    // console.log('saveStock request ', jsonValue, Environment.uri + "stockapprove/saveStockRequestEdit")
    await fetch(Environment.uri + "stockapprove/saveStockRequestEdit",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        console.log('saveStock request ', data)

        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('saveStockApprove', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};
export async function saveStockReceive(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    // console.log('save stock recieve ', jsonValue, Environment.uri + "stockapprove/saveStockReceive")
    await fetch(Environment.uri + "stockapprove/saveStockReceive",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        console.log('save stock recieve  ', data)

        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('save stock recieve ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};

export async function getStockFabrics(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }

    try {
        console.log("URL", Environment.uri + "stockapprove/getStockFabrics")
        const response = await fetch(Environment.uri + "stockapprove/getStockFabrics",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(jsonValue),
            }
        )

        if (!response.ok) {
            throw new Error(`HTTP status ${response.status}`);
        }

        const contentLength = response.headers.get("content-length");
        let data = [];

        if (contentLength && parseInt(contentLength) > 0) {
            data = await response.json(); // Parse only if content exists
        } else {
            console.log("Empty response body.");
        }


        if (data?.length > 0) {
            responseData = data;
            statusData = true;
        } else {
            responseData = [];
            statusData = true;
        }
    } catch (error) {
        console.log('getStockFabrics error ', error)
        returnError = error;
    };

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};
export async function getStockStyles(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    try {
        console.log("URL", Environment.uri + "stockapprove/getStockStyles")
        const response = await fetch(Environment.uri + "stockapprove/getStockStyles",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(jsonValue),
            }
        )


        if (!response.ok) {
            throw new Error(`HTTP status ${response.status}`);
        }

        const contentLength = response.headers.get("content-length");
        let data = [];

        if (contentLength && parseInt(contentLength) > 0) {
            data = await response.json(); // Parse only if content exists
        } else {
            console.log("Empty response body.");
        }


        if (data?.length > 0) {
            responseData = data;
            statusData = true;
        } else {
            responseData = [];
            statusData = true;
        }
    } catch (error) {
        console.log('getStockStyles error ', error)
        returnError = error;
    }


    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};
export async function getMenus(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    console.log("URL", Environment.uri + "stockapprove/getMenus")
    await fetch(Environment.uri + "stockapprove/getMenus",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {

        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('getMenus error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};
export async function getBatches(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    try {
        console.log("URL", Environment.uri + "stockapprove/getBatches");
        console.log("response just before api ===> ");

        const response = await fetch(Environment.uri + "stockapprove/getBatches",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(jsonValue),
            }
        )

        if (!response.ok) {
            throw new Error(`HTTP status ${response.status}`);
        }

        const contentLength = response.headers.get("content-length");
        let data = [];

        if (contentLength && parseInt(contentLength) > 0) {
            data = await response.json(); // Parse only if content exists
        } else {
            console.log("Empty response body.");
        }


        if (data?.length > 0) {
            responseData = data;
            statusData = true;
        } else {
            responseData = [];
            statusData = true;
        }




    } catch (error) {
        console.log('getBatches error===== ', error)
        returnError = error;
    }


    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};

export async function getCompanyLocations(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    console.log("URL", Environment.uri + "stockapprove/getCompanyLocations")
    await fetch(Environment.uri + "stockapprove/getCompanyLocations",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {

        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('getCompanyLocations error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};

export async function getFabricByStyleId(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    console.log("URL", Environment.uri + "stockapprove/getFabricAccStyle")
    await fetch(Environment.uri + "stockapprove/getFabricAccStyle",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {

        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('getFabricByStyleId error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};

export async function getFabricByfabricId(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    console.log("URL", Environment.uri + "stockapprove/getFabricByFabricId")
    await fetch(Environment.uri + "stockapprove/getFabricByFabricId",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {

        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('getFabricByFabricId error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};

export async function getTrimsByTypeId(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    console.log("URL", Environment.uri + "stockapprove/getTrimsByTypeId")
    await fetch(Environment.uri + "stockapprove/getTrimsByTypeId",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {

        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('getTrimsByTypeId error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};

export async function getStockQty(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    console.log("URL", Environment.uri + "stockapprove/getStockQty")
    await fetch(Environment.uri + "stockapprove/getStockQty",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {

        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('getStockQty error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};

export async function getRmQtyByLot(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    console.log("URL", Environment.uri + "stockapprove/getRmQtyByLot")
    await fetch(Environment.uri + "stockapprove/getRmQtyByLot",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {

        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('getRmQtyByLot error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};
export async function getRmQtyByLocation(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    console.log("URL", Environment.uri + "stockapprove/getRmQtyByLocation")
    await fetch(Environment.uri + "stockapprove/getRmQtyByLocation",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {

        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('getRmQtyByLocation error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};
export async function getFabQtyByLocation(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    console.log("URL", Environment.uri + "stockapprove/getFabQtyByLocation")
    await fetch(Environment.uri + "stockapprove/getFabQtyByLocation",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {

        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('getFabQtyByLocation error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};
export async function getStockTypes(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }

    try {
        console.log("URL", Environment.uri + "stockapprove/getStockTypes")
        const response = await fetch(Environment.uri + "stockapprove/getStockTypes",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(jsonValue),
            }
        )

        if (!response.ok) {
            throw new Error(`HTTP status ${response.status}`);
        }

        const contentLength = response.headers.get("content-length");
        let data = [];

        if (contentLength && parseInt(contentLength) > 0) {
            data = await response.json(); // Parse only if content exists
        } else {
            console.log("Empty response body.");
        }


        if (data?.length > 0) {
            responseData = data;
            statusData = true;
        } else {
            responseData = [];
            statusData = true;
        }
    } catch (error) {
        console.log('stock types error ', error)
        returnError = error;
    }



    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};
export async function loadStyleStatusLists(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    console.log("URL", Environment.uri + "styleapi/getStyleValues");
    await fetch(Environment.uri + "styleapi/getStyleValues",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('getAllUnreadMessages error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};
export async function GetStyleStatusFlow(jsonValue) {
    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    // console.log("url ==>", Environment.uri + "styleapi/getStyleProcessList");

    await fetch(Environment.uri + "styleapi/getStyleProcessList",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        // console.log('GetStyleStatusFlow  ==>', '', data.designId)

        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('GetStyleStatusFlow error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};
export async function loadAllFabricProcessInList(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    console.log("URL", Environment.uri + "fabricprocessinapi/apiProcessList");
    await fetch(Environment.uri + "fabricprocessinapi/apiProcessList",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('loadAllFabricProcessInList error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};
export async function loadAllUomMastersList(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    console.log("URL", Environment.uri + "uomapi/loadAllUoms");
    await fetch(Environment.uri + "uomapi/loadAllUoms",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('loadAllFabricProcessInList error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};
export async function loadAllRawMaterialMastersList(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    console.log("URL", Environment.uri + "rawmaterials/loadAllRawMaterials");
    await fetch(Environment.uri + "rawmaterials/loadAllRawMaterials",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('loadAllFabricProcessInList error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};
export async function loadAllRawMaterialTypeMastersList(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    console.log("URL", Environment.uri + "rawmaterialtype/loadAllRawMaterialType");
    await fetch(Environment.uri + "rawmaterialtype/loadAllRawMaterialType",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('loadAllFabricProcessInList error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};
export async function GetProcessList(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    console.log("URL", Environment.uri + "fabricprocessinapi/apiFabricProcessInAdd");
    await fetch(Environment.uri + "fabricprocessinapi/apiFabricProcessInAdd",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('GetProcessList error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};
export async function GetCreateDropdownsList(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    console.log("URL", Environment.uri + "rawmaterials/createRawMaterials");
    await fetch(Environment.uri + "rawmaterials/createRawMaterials",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('GetProcessList error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};
export async function GetCreateFabricMastersList(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    console.log("URL", Environment.uri + "fabricmaster/createFabrics");
    await fetch(Environment.uri + "fabricmaster/createFabrics",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('GetCreateFabricMastersList error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};
export async function GetCreateVendorsMastersList(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    console.log("URL", Environment.uri + "vendor/createVendor");
    await fetch(Environment.uri + "vendor/createVendor",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('GetCreateFabricMastersList error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};
export async function GetCreateStyleList(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    console.log("URL", Environment.uri + "styleapi/createStyle");
    await fetch(Environment.uri + "styleapi/createStyle",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('GetCreateStyleList error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};
export async function LoadAllPartsProcessingList(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    console.log("URL", Environment.uri + "partprocessing/partsProcessList");
    await fetch(Environment.uri + "partprocessing/partsProcessList",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('LoadAllPartsProcessingList error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};
export async function getBatchNoListByProcessId(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    console.log("URL", Environment.uri + "fabricprocessinapi/apiBatchNosByBatchId");
    await fetch(Environment.uri + "fabricprocessinapi/apiBatchNosByBatchId",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('getBatchNoListByProcessId error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};
export async function getBatchDetailsByBatchId(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    console.log("URL", Environment.uri + "fabricprocessinapi/apiBatchDetailsByBatchId");
    await fetch(Environment.uri + "fabricprocessinapi/apiBatchDetailsByBatchId",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('getBatchDetailsByBatchId error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};
export async function getBatchDetailsByBatchId2(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    console.log("URL", Environment.uri + "fabricprocessinapi/apiPrintingCompletedOrders");
    await fetch(Environment.uri + "fabricprocessinapi/apiPrintingCompletedOrders",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('getBatchDetailsByBatchId2 error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};
export async function getDesignNoListIfPrinting(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    console.log("URL", Environment.uri + "fabricprocessinapi/apiDesignNoByOrder");
    await fetch(Environment.uri + "fabricprocessinapi/apiDesignNoByOrder",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('getDesignNoListIfPrinting error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};
export async function getApiItemDetails(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    console.log("URL", Environment.uri + "fabricprocessinapi/apiItemDetails");
    await fetch(Environment.uri + "fabricprocessinapi/apiItemDetails",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('getApiItemDetails error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};
export async function getDesignNoListIfNotPrinting(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    console.log("URL", Environment.uri + "fabricprocessinapi/apiDesignNoByOrderFromPrinting");
    await fetch(Environment.uri + "fabricprocessinapi/apiDesignNoByOrderFromPrinting",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('getDesignNoListIfNotPrinting error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};
export async function getMatchingNoList(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    console.log("URL", Environment.uri + "fabricprocessinapi/apiMatchingDesignNoByPrinting");
    await fetch(Environment.uri + "fabricprocessinapi/apiMatchingDesignNoByPrinting",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('getMatchingNoList error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};
export async function getPartsProcessingCreateList(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    console.log("URL", Environment.uri + "partprocessing/partsProcessCreate");
    await fetch(Environment.uri + "partprocessing/partsProcessCreate",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('getPartsProcessingCreateList error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};
export async function saveCreateProcessIn(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    // console.log('saveCreateProcessIn ', jsonValue, Environment.uri + "fabricprocessinapi/apisaveFabricProcessIn")
    await fetch(Environment.uri + "fabricprocessinapi/apisaveFabricProcessIn",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        // console.log('apisaveFabricProcessIn ', data)

        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('apisaveFabricProcessIn', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};
export async function saveCreateRawMaterialMasters(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    // console.log('saveCreateProcessIn ', jsonValue, Environment.uri + "rawmaterials/saveRawMaterials")
    await fetch(Environment.uri + "rawmaterials/saveRawMaterials",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        // console.log('apisaveFabricProcessIn ', data)

        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('apisaveFabricProcessIn', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};
export async function saveCreateUomMasters(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    // console.log('saveCreateProcessIn ', jsonValue, Environment.uri + "uomapi/saveUoms")
    await fetch(Environment.uri + "uomapi/saveUoms",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        // console.log('apisaveFabricProcessIn ', data)

        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('apisaveFabricProcessIn', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};
export async function saveCreateFabricMasters(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    // console.log('saveCreateProcessIn ', jsonValue, Environment.uri + "fabricmaster/saveFabric")
    await fetch(Environment.uri + "fabricmaster/saveFabric",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        // console.log('saveCreateFabricMasters ', data)

        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('saveCreateFabricMasters', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};
export async function saveCreateVendorMasters(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    // console.log('saveCreateProcessIn ', jsonValue, Environment.uri + "vendor/saveVendor")
    await fetch(Environment.uri + "vendor/saveVendor",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        // console.log('saveCreateVendorMasters ', data)

        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('saveCreateVendorMasters', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};
export async function saveCreateRawMaterialTypeMasters(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    // console.log('saveCreateProcessIn ', jsonValue, Environment.uri + "uomapi/saveUoms")
    await fetch(Environment.uri + "rawmaterialtype/saveRawMaterialType",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        // console.log('apisaveFabricProcessIn ', data)

        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('apisaveFabricProcessIn', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};
export async function saveCreateStyle(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    // console.log('saveCreateStyle ',  Environment.uri + "styleapi/saveStyle")
    await fetch(Environment.uri + "styleapi/saveStyle",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        // console.log('saveCreateStyle ', data)

        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('saveCreateStyle', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};
export async function saveCreatePartsProcessing(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    await fetch(Environment.uri + "partprocessing/savePartsProcess",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        // console.log('saveCreatePartsProcessing ', data)

        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('saveCreatePartsProcessing', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};

export async function validateRawMaterialTypeMasters(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    await fetch(Environment.uri + "rawmaterialtype/checkRawMaterialType",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        // console.log('apisaveFabricProcessIn ', data)

        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('apisaveFabricProcessIn', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};

export async function validateVendorMastersName(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    await fetch(Environment.uri + "vendor/checkVendor",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        // console.log('validateVendorMastersName ', data)

        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('validateVendorMastersName', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};
export async function validateVendorMastersCode(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    await fetch(Environment.uri + "vendor/checkVendorCode",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        // console.log('validateVendorMastersCode ', data)

        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('validateVendorMastersCode', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};
export async function validateCreateStyle(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    await fetch(Environment.uri + "styleapi/checkStyleNoColor",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        // console.log('validateCreateStyle ', data)

        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('validateCreateStyle', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};

export async function requestOtp1(jsonValue) {
    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;
    let internet = false;

    try {
        internet = await internetCheck();
        if (!internet) {
            obj = { logoutData, statusData, responseData, error: returnError, isInternet: internet };
            return obj;
        }
        console.log("Environment.uri ==> ", Environment.uri);
        console.log('loginUserAPIService Code ', jsonValue, Environment.uri + "logInManagement/sendOtp");

        const response = await fetch(Environment.uri + "logInManagement/sendOtp", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify(jsonValue),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        // console.log('loginUserAPIService Response ', data);

        if (data && data.passwordStatus) {
            statusData = data.passwordStatus;
            responseData = data;
        } else {
            statusData = undefined;
        }

    } catch (error) {
        console.log('loginUserAPIService Error ', error);
        returnError = error.message || error.toString();
        // Handle specific error cases if needed
        if (error instanceof TypeError && error.message === 'Network request failed') {
            returnError = "Network request failed. Please check your internet connection.";
        }
        throw returnError; // Re-throw the error to propagate it
    }

    console.log("returning here......");
    obj = { logoutData, statusData, responseData, error: returnError, isInternet: internet };
    return obj;
}
export async function validateOtp1(jsonValue) {
    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;
    let internet = false;

    try {
        internet = await internetCheck();
        if (!internet) {
            obj = { logoutData, statusData, responseData, error: returnError, isInternet: internet };
            return obj;
        }
        console.log("Environment.uri ==> ", Environment.uri);
        console.log('loginUserAPIService Code ', jsonValue, Environment.uri + "logInManagement/validateOtp");

        const response = await fetch(Environment.uri + "logInManagement/validateOtp", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify(jsonValue),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        // console.log('loginUserAPIService Response ', data);

        if (data && data.passwordStatus) {
            statusData = data.passwordStatus;
            responseData = data;
        } else {
            statusData = undefined;
        }

    } catch (error) {
        console.log('loginUserAPIService Error ', error);
        returnError = error.message || error.toString();
        // Handle specific error cases if needed
        if (error instanceof TypeError && error.message === 'Network request failed') {
            returnError = "Network request failed. Please check your internet connection.";
        }
        throw returnError; // Re-throw the error to propagate it
    }

    console.log("returning here......");
    obj = { logoutData, statusData, responseData, error: returnError, isInternet: internet };
    return obj;
}
export async function resetPassword1(jsonValue) {
    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;
    let internet = false;

    try {
        internet = await internetCheck();
        if (!internet) {
            obj = { logoutData, statusData, responseData, error: returnError, isInternet: internet };
            return obj;
        }
        console.log("Environment.uri ==> ", Environment.uri);
        console.log('loginUserAPIService Code ', jsonValue, Environment.uri + "logInManagement/updatePassword");

        const response = await fetch(Environment.uri + "logInManagement/updatePassword", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify(jsonValue),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        // console.log('loginUserAPIService Response ', data);

        if (data && data.passwordStatus) {
            statusData = data.passwordStatus;
            responseData = data;
        } else {
            statusData = undefined;
        }

    } catch (error) {
        console.log('loginUserAPIService Error ', error);
        returnError = error.message || error.toString();
        // Handle specific error cases if needed
        if (error instanceof TypeError && error.message === 'Network request failed') {
            returnError = "Network request failed. Please check your internet connection.";
        }
        throw returnError; // Re-throw the error to propagate it
    }

    console.log("returning here......");
    obj = { logoutData, statusData, responseData, error: returnError, isInternet: internet };
    return obj;
}

export const REQUEST_OTP = "stitch/logInManagement/sendOtp";
export const CONFIRM_OTP = "stitch/logInManagement/validateOtp";
export const RESET_PASSWORD = "stitch/logInManagement/updatePassword";

export async function getNewCompanyObject(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;


    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    console.log("URL", Environment.uri + "logInManagement/getCompanyById");
    await fetch(Environment.uri + "logInManagement/getCompanyById",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('getNewCompanyObject error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};

export async function getEditDetailsOfFabricProcessIn(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    // console.log("url ==>", Environment.uri + "fabricprocessinapi/apiFabricProcessOutAdd", "JSON VALUE ==>", jsonValue)
    await fetch(Environment.uri + "fabricprocessinapi/apiFabricProcessOutAdd",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        // console.log('apiFabricProcessOutAdd', '', data)

        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('apiFabricProcessOutAdd error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};
export async function getEditDetailsOfUomMasters(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    // console.log("url ==>", Environment.uri + "uomapi/EditUom", "JSON VALUE ==>", jsonValue)
    await fetch(Environment.uri + "uomapi/EditUom",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        // console.log('apiFabricProcessOutAdd', '', data)

        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('apiFabricProcessOutAdd error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};
export async function getEditDetailsOfRawMaterialTypeMasters(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    // console.log("url ==>", Environment.uri + "uomapi/EditUom", "JSON VALUE ==>", jsonValue)
    await fetch(Environment.uri + "rawmaterialtype/EditRawMaterialType",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        // console.log('apiFabricProcessOutAdd', '', data)

        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('apiFabricProcessOutAdd error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};
export async function getEditDetailsOfRawMaterialMasters(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    // console.log("url ==>", Environment.uri + "rawmaterials/EditRawMaterials", "JSON VALUE ==>", jsonValue)
    await fetch(Environment.uri + "rawmaterials/EditRawMaterials",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        // console.log('apiFabricProcessOutAdd', '', data)

        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('apiFabricProcessOutAdd error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};
export async function getEditDetailsPartsProcessing(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    await fetch(Environment.uri + "partprocessing/partsProcessView",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        // console.log('getEditDetailsPartsProcessing', '', data)

        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('getEditDetailsPartsProcessing error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};

export async function SaveFabricProcessInDetails(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    // console.log('saveCreateProcessIn ', jsonValue, Environment.uri + "fabricprocessinapi/apisaveFabricProcessOut")
    await fetch(Environment.uri + "fabricprocessinapi/apisaveFabricProcessOut",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        // console.log('apisaveFabricProcessIn ', data)

        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('apisaveFabricProcessIn', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};
export async function SaveUomMastersEdit(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    // console.log('saveCreateProcessIn ', jsonValue, Environment.uri + "uomapi/saveEditUoms")
    await fetch(Environment.uri + "uomapi/saveEditUoms",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        // console.log('apisaveFabricProcessIn ', data)

        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('apisaveFabricProcessIn', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};
export async function SaveRawMaterialsMastersEdit(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    await fetch(Environment.uri + "rawmaterials/editSaveRawMaterials",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        // console.log('apisaveFabricProcessIn ', data)

        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('apisaveFabricProcessIn', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};

export const downloadPdf =()=>{
    const URL= Environment.uri + "fabricprocessinapi/apiFabricprocessinPdf";
    return URL;
} 
export const downloadQrPdf =()=>{
    const URL=Environment.uri + "fabricprocessinapi/apiFabricprocessinBarcode";
    return URL;
} 
export const downloadProductionProcessReport =()=>{
    const URL=Environment.uri + "productionprocessreport/ppreport";
    return URL;
} 

export async function getBatchListAfterPriniting(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    console.log("URL", Environment.uri + "fabricprocessinapi/apiBatchNosByOrderDesignMatching");
    await fetch(Environment.uri + "fabricprocessinapi/apiBatchNosByOrderDesignMatching",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('getBatchListAfterPriniting error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};
export async function getfabIssuedafterPrinting(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    console.log("URL", Environment.uri + "fabricprocessinapi/apiMatchingImageByprinting");
    await fetch(Environment.uri + "fabricprocessinapi/apiMatchingImageByprinting",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('getfabIssuedafterPrinting error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};

export async function GatePassAckList(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    console.log("URL", Environment.uri + "gatepassacknowledgmentapi/loadallacknowledgementgatepass");
    await fetch(Environment.uri + "gatepassacknowledgmentapi/loadallacknowledgementgatepass",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('GatePassAckList error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};

export async function getEditDetailsGatePassAuck(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    // console.log("url ==>", Environment.uri + "gatepassacknowledgmentapi/editGatePassAcknowledgementApi", "JSON VALUE ==>", jsonValue)
    await fetch(Environment.uri + "gatepassacknowledgmentapi/editGatePassAcknowledgementApi",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {

        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('getEditDetailsGatePassAuck error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};

export async function saveGatePassAckEditSave(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    // console.log('saveCreateProcessIn ', jsonValue, Environment.uri + "gatepassacknowledgmentapi/savegatepassacknowledgementapi")
    await fetch(Environment.uri + "gatepassacknowledgmentapi/savegatepassacknowledgementapi",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        // console.log('apisaveFabricProcessIn in api page ', data)

        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('saveGatePassAckEditSave', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};


export async function getSelectedCategoryListFBI(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    console.log("URL", Environment.uri + "fabricprocessinapi/apiSearchloadAllCategory");
    await fetch(Environment.uri + "fabricprocessinapi/apiSearchloadAllCategory",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('GatePassAckList error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};

export async function getFilteredListFBI(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    console.log("URL", Environment.uri + "fabricprocessinapi/apiSearchCategoryType");
    await fetch(Environment.uri + "fabricprocessinapi/apiSearchCategoryType",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('GatePassAckList error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};

export async function getSelectedCategoryListGPA(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    console.log("URL", Environment.uri + "gatepassacknowledgmentapi/apiSearchloadAllCategory");
    await fetch(Environment.uri + "gatepassacknowledgmentapi/apiSearchloadAllCategory",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('GatePassAckList error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};
export async function getFilteredListGPA(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    console.log("URL", Environment.uri + "gatepassacknowledgmentapi/apiSearchCategoryType");
    await fetch(Environment.uri + "gatepassacknowledgmentapi/apiSearchCategoryType",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('GatePassAckList error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};
// ===========

export async function getSelectedCategoryList_LocationwiseStyleInv(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    console.log("URL", Environment.uri + "inventory/styleLocationInvSearchCategory");
    await fetch(Environment.uri + "inventory/styleLocationInvSearchCategory",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('GatePassAckList error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};
export async function getFilteredList_LocationwiseStyleInv(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    console.log("URL", Environment.uri + "inventory/styleLocationInvSearchCategoryType");
    await fetch(Environment.uri + "inventory/styleLocationInvSearchCategoryType",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('GatePassAckList error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};
// ===========


export async function getSelectedCategoryList_StyleWiseFabricRmInventory(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    console.log("URL", Environment.uri + "inventory/locationStyleWiseRmFabInvSearchCategory");
    await fetch(Environment.uri + "inventory/locationStyleWiseRmFabInvSearchCategory",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('GatePassAckList error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};
export async function getFiltered_StyleWiseFabricRmInventory(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    console.log("URL", Environment.uri + "inventory/locationStyleWiseRmFabInvSearchCategoryType");
    await fetch(Environment.uri + "inventory/locationStyleWiseRmFabInvSearchCategoryType",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('GatePassAckList error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};
// ===========


export async function getSelectedCategoryList_LocationwiseRMFabricInventory(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    console.log("URL", Environment.uri + "inventory/locationWiseRMFabInvSearchCategory");
    await fetch(Environment.uri + "inventory/locationWiseRMFabInvSearchCategory",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('GatePassAckList error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};
export async function getFiltered_LocationwiseRMFabricInventory(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    console.log("URL", Environment.uri + "inventory/locationWiseRMFabInvSearchCategoryType");
    await fetch(Environment.uri + "inventory/locationWiseRMFabInvSearchCategoryType",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('GatePassAckList error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};
// ===========

export async function getSelectedCategoryList_StockApproveRequest(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    console.log("URL", Environment.uri + "stockapprove/loadAllStylesStockApprove");
    await fetch(Environment.uri + "stockapprove/loadAllStylesStockApprove",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('GatePassAckList error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};
export async function getFiltered_StockApproveRequest(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    console.log("URL", Environment.uri + "stockapprove/loadAllStylesStockApproveCategoryType");
    await fetch(Environment.uri + "stockapprove/loadAllStylesStockApproveCategoryType",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('GatePassAckList error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};

//============
export async function getSelectedCategoryList_StockRequest(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    console.log("URL", Environment.uri + "stockapprove/AllSearchCategory");
    await fetch(Environment.uri + "stockapprove/AllSearchCategory",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('GatePassAckList error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};
export async function getFiltered_StockRequest(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    console.log("URL", Environment.uri + "stockapprove/AllSearchCategoryType");
    await fetch(Environment.uri + "stockapprove/AllSearchCategoryType",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('GatePassAckList error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};

//============

export async function getSelectedCategoryList_StockRecieve(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    console.log("URL", Environment.uri + "stockapprove/loadAllStockRecSearchCategory");
    await fetch(Environment.uri + "stockapprove/loadAllStockRecSearchCategory",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('GatePassAckList error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};
export async function getFiltered_StockRecieve(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    console.log("URL", Environment.uri + "stockapprove/loadAllStockRecSearchCategoryType");
    await fetch(Environment.uri + "stockapprove/loadAllStockRecSearchCategoryType",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('GatePassAckList error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};

//============

export async function getSelectedCategoryList_stichingout(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    console.log("get cat -> stitching out", Environment.uri + "stitchingout/loadAllCTRRequestForCuttingSearchCategory");
    await fetch(Environment.uri + "stitchingout/loadAllCTRRequestForCuttingSearchCategory",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('Cat List stitching out  error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};

export async function getFiltered_StichingOut(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    console.log("URL", Environment.uri + "stitchingout/loadAllCTRRequestForCuttingSearchCategoryType");
    await fetch(Environment.uri + "stitchingout/loadAllCTRRequestForCuttingSearchCategoryType",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('GatePassAckList error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};

// ==========================================

export async function getSelectedCategoryList_finishingOut(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    console.log("URL", Environment.uri + "finishingout/loadAllDataFinishingOutSearchCategory");
    await fetch(Environment.uri + "finishingout/loadAllDataFinishingOutSearchCategory",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('finishing out cat list  error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};
export async function getFiltered_finishingOut(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    console.log("URL", Environment.uri + "finishingout/loadAllDataFinishingOutSearchCategoryType");
    await fetch(Environment.uri + "finishingout/loadAllDataFinishingOutSearchCategoryType",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('finshing out search  error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};

// ================================================


export async function getSelectedCategoryList_cuttingIn(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    console.log("URL", Environment.uri + "cutting/loadAllCuttingStylesSearchCategory");
    await fetch(Environment.uri + "cutting/loadAllCuttingStylesSearchCategory",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('finishing out cat list  error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};
export async function getFiltered_cuttingIn(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    console.log("URL", Environment.uri + "cutting/loadAllCuttingStylesSearchCategoryType");
    await fetch(Environment.uri + "cutting/loadAllCuttingStylesSearchCategoryType",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('finshing out search  error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};
// ================================================


export async function getSelectedCategoryList_finishingIn(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    console.log("URL", Environment.uri + "finishing/apiSearchloadAllCategory");
    await fetch(Environment.uri + "finishing/apiSearchloadAllCategory",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('finishing out cat list  error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};
export async function getFiltered_finishingIn(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    console.log("URL", Environment.uri + "finishing/apiSearchloadAllCategoryType");
    await fetch(Environment.uri + "finishing/apiSearchloadAllCategoryType",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('finshing out search  error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};
// ================================================


export async function getSelectedCategoryList_stitchingIn(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    console.log("URL", Environment.uri + "stitching/apiSearchloadAllCategory");
    await fetch(Environment.uri + "stitching/apiSearchloadAllCategory",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('finishing out cat list  error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};
export async function getFiltered_stitchingIn(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    console.log("URL", Environment.uri + "stitching/apiSearchloadAllCategoryType");
    await fetch(Environment.uri + "stitching/apiSearchloadAllCategoryType",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('finshing out search  error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};

// ================================================

export async function getSelectedCategoryList_style(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    console.log("URL", Environment.uri + "styleapi/loadAllStylesSearchCategory");
    await fetch(Environment.uri + "styleapi/loadAllStylesSearchCategory",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('finishing out cat list  error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};
export async function getFiltered_style(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    console.log("URL", Environment.uri + "styleapi/loadAllStylesSearchCategoryType");
    await fetch(Environment.uri + "styleapi/loadAllStylesSearchCategoryType",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('finshing out search  error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};

// ================================================

export async function getSelectedCategoryList_poApproval(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    console.log("URL", Environment.uri + "po/loadAllPOsSearchCategory");
    await fetch(Environment.uri + "po/loadAllPOsSearchCategory",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('finishing out cat list  error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};
export async function getFiltered_poApproval(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    console.log("URL", Environment.uri + "po/loadAllPOsSearchCategoryType");
    await fetch(Environment.uri + "po/loadAllPOsSearchCategoryType",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('finshing out search  error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};
// ================================================

export async function getSelectedCategoryList_DDA(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    console.log("URL", Environment.uri + "designdirectory/searchCategory");
    await fetch(Environment.uri + "designdirectory/searchCategory",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('finishing out cat list  error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};
export async function getFiltered_DDA(jsonValue) {

    let returnError = undefined;
    let statusData = undefined;
    let responseData = undefined;
    let logoutData = false;
    let obj = undefined;

    let internet = await internetCheck();
    if (!internet) {
        obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet };
        return obj;
    }
    console.log("URL", Environment.uri + "designdirectory/searchCategoryType");
    await fetch(Environment.uri + "designdirectory/searchCategoryType",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonValue),
        }
    ).then((response) => response.json()).then(async (data) => {
        if (data) {
            statusData = true;
            responseData = data
        } else {
            statusData = undefined;
        }

    }).catch((error) => {
        console.log('finshing out search  error ', error)
        returnError = error;
    });

    obj = { logoutData: logoutData, statusData: statusData, responseData: responseData, error: returnError, isInternet: internet }
    return obj;
};
