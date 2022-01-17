let apiURL = "https://vision.googleapis.com/v1/images:annotate";
let apiKey = "AIzaSyC9IYj5P1MkFm-V-ziE4GGhVxybB-Fg6YU";
// Google Vision API can only take 16 images per API call.
let apiImgMax = 16;
const uriToLabelAnnotations = new Map();

chrome.storage.sync.get("isBlocking", async ({ isBlocking }) => {
    await updateBlocks(isBlocking);
});

chrome.storage.sync.get("filters", ({ filters }) => {
    console.log(`Filters loaded: ${filters}`);
});

chrome.runtime.onMessage.addListener(async (msgObj, sender, sendResponse) => {
    if (msgObj.message === "isBlocking_value") {
        await updateBlocks(msgObj.value);
    }
})

// updateBlocks blocks the filtered images if isBlocking, unblocks the filtered images otherwise.
async function updateBlocks(isBlocking) {
    let allImgs = document.getElementsByTagName("img");
    if (!isBlocking) {
        for (let img of allImgs) {
            // We're assuming that the web page's default opacity for all <img> is 1 - could 
            //   fairly easily remember the default opacity using a map sometime down the line.
            img.style.opacity = "1";
        }
    } else {
        const apiRequests = [];
        // Collect all unique URIs to reference in call to Google Vision API.
        for (let img of allImgs) {
            // Don't repeat URIs in Google Vision API call.
            if (!uriToLabelAnnotations.has(img.src)) {
                apiRequests.push(
                    {
                        "image": {
                            "source": {
                                "imageUri": img.src
                            }
                        },
                        "features": [
                            {
                                "maxResults": 5,
                                "type": "LABEL_DETECTION"
                            }
                        ]
                    }
                );
            }
        }
        // Update uriToLabelAnnotations
        if (apiRequests.length) {
            // Must call API in chunks of apiImgMax
            let apiReqChunks = [];
            for (let i = 0; i < apiRequests.length; i += apiImgMax) {
                apiReqChunks.push(apiRequests.slice(i, i + apiImgMax));
            }
            for (let apiReqChunk of apiReqChunks) {
                const rawResponse = await fetch(apiURL + "?key=" + apiKey, {
                    "method": "POST",
                    "headers": {
                        "Content-Type": "application/json"
                    },
                    "body": JSON.stringify({
                        "requests": apiReqChunk
                    })
                });
                const response = await rawResponse.json();
                console.log("response is: ");
                console.log(response);
                console.log("apiReqChunk is: ");
                console.log(apiReqChunk);
                console.log("length is: " + apiReqChunk.length);
                // The labelAnnotations we get in response are in same order of images as our request.
                for (let i = 0; i < apiReqChunk.length; i++) {
                    uriToLabelAnnotations.set(apiReqChunk[i].image.source.imageUri, response.responses[i].labelAnnotations);
                }
            }
        }
        // Block / unblock based on filters and uriToLabelAnnotations
        let {filters} = await chrome.storage.sync.get("filters");
        const filterSet = new Set(filters);
        // Iterate through each img, if any one of its labels are in filterSet, then block it.
        for (let img of allImgs) {
            // Google Vision API sometimes fails to access the image (see: https://github.com/googleapis/google-cloud-java/issues/2276, 
            https://stackoverflow.com/questions/45119587/we-can-not-access-the-url-currently). In this case, we shall block the image just to be safe.
            if (!uriToLabelAnnotations.get(img.src)) { 
                img.style.opacity = 0;
            } else {
                for (let label of uriToLabelAnnotations.get(img.src)) {
                    if (filterSet.has(label.description.toLowerCase())) {
                        img.style.opacity = 0;
                        break;
                    }
                }
            }
        }
    }
}
