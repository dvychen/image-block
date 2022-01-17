let apiURL = "https://vision.googleapis.com/v1/images:annotate"
let apiKey = "AIzaSyC9IYj5P1MkFm-V-ziE4GGhVxybB-Fg6YU"
const uriToLabelAnnotations = new Map();

chrome.storage.sync.get("isBlocking", ({ isBlocking }) => {
    console.log("initial content running to call updateblocks");
    updateBlocks(isBlocking);
    console.log("initial running done");
});

chrome.storage.sync.get("filters", ({ filters }) => {
    console.log(`Filters loaded: ${filters}`);
});

chrome.runtime.onMessage.addListener((msgObj, sender, sendResponse) => {
    console.log("listener in content");
    if (msgObj.message === "isBlocking_value") {
        updateBlocks(msgObj.value);
    }
})

// updateBlocks blocks the filtered images if isBlocking, unblocks the filtered images otherwise.
async function updateBlocks(isBlocking) {
    console.log("now in updateBlocks");
    const rawResponse = await fetch(apiURL + "?key=" + apiKey, {
        "method": "POST",
        "headers": {
            "Content-Type": "application/json"
        },
        "body": JSON.stringify({
            "requests": {
                "image": {
                    "source": {
                        "imageUri": "https://upload.wikimedia.org/wikipedia/commons/0/0f/Grosser_Panda.JPG"
                    }
                },
                "features": [
                    {
                        "maxResults": 5,
                        "type": "LABEL_DETECTION"
                    }
                ]
            }
        })
    });
    const response = await rawResponse.json();
    // The labelAnnotations we get in response are in same order of images as our request.
    console.log("ep1");
    for (let i = 0; i < apiRequests.length; i++) {
        console.log("uri: " + apiRequests[i].image.source.imageUri);
        console.log("ann: " + response.responses[i].labelAnnotations);
    }
    console.log("ep2");




    // let allImgs = document.getElementsByTagName("img");
    // if (!isBlocking) {
    //     for (let img of allImgs) {
    //         // We're assuming that the web page's default opacity for all <img> is 1 - could 
    //         //   fairly easily remember the default opacity using a map sometime down the line.
    //         img.style.opacity = "1";
    //     }
    // } else {
    //     const apiRequests = [];
    //     // Collect all unique URIs to reference in call to Google Vision API.
    //     for (let img of allImgs) {
    //         // Don't repeat URIs in Google Vision API call.
    //         if (!uriToLabelAnnotations.has(img.src)) {
    //             apiRequests.push(
    //                 {
    //                     "image": {
    //                         "source": {
    //                             "imageUri": img.src
    //                         }
    //                     },
    //                     "features": [
    //                         {
    //                             "maxResults": 5,
    //                             "type": "LABEL_DETECTION"
    //                         }
    //                     ]
    //                 }
    //             );
    //         }
    //     }
    //     // Update uriToLabelAnnotations
    //     if (apiRequests.length) {
    //         const rawResponse = await fetch(apiURL + "?key=" + apiKey, {
    //             "method": "POST",
    //             "headers": {
    //                 "Content-Type": "application/json"
    //             },
    //             "body": JSON.stringify({
    //                 "requests": apiRequests
    //             })
    //         });
    //         const response = await rawResponse.json();
    //         // The labelAnnotations we get in response are in same order of images as our request.
    //         for (let i = 0; i < apiRequests.length; i++) {
    //             uriToLabelAnnotations.push(apiRequests[i].image.source.imageUri, response.responses[i].labelAnnotations);
    //         }
    //     }
    //     // Block / unblock based on filters and uriToLabelAnnotations
    //     let {filters} = await chrome.storage.sync.get("filters");
    //     const filterSet = new Set(filters);
    //     // Iterate through each img, if any one of its labels are in filterSet, then block it.
    //     for (let img of allImgs) {
    //         for (let label of uriToLabelAnnotations.get(img.src)) {
    //             if (filterSet.has(label.description.toLowerCase())) {
    //                 img.style.opacity = 0;
    //                 break;
    //             }
    //         }
    //     }
    // }
}
