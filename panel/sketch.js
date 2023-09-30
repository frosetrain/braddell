let steering = 0;
let throttle = 0;
let cruiseControl = false;
let steeringLeft, steeringMiddle, steeringRight;
let throttleLeft, throttleMiddle, throttleRight;
let cruiseLabel;
let i = 0;
let res;
let apiOnline = false;

function setup() {
    steeringLeft = new p5.Element(document.getElementById("steering-left"));
    steeringMiddle = new p5.Element(document.getElementById("steering-middle"));
    steeringRight = new p5.Element(document.getElementById("steering-right"));
    steeringLabel = new p5.Element(document.getElementById("steering-label"));

    throttleLeft = new p5.Element(document.getElementById("throttle-left"));
    throttleMiddle = new p5.Element(document.getElementById("throttle-middle"));
    throttleRight = new p5.Element(document.getElementById("throttle-right"));
    throttleLabel = new p5.Element(document.getElementById("throttle-label"));

    apiOfflineLabel = new p5.Element(
        document.getElementById("apioffline-label"),
    );
    cruiseLabel = new p5.Element(document.getElementById("cruise-label"));

    updateBars();
    frameRate(30);
}

async function putData(url = "", data = {}) {
    const response = await fetch(url, {
        method: "PUT",
        mode: "cors",
        // cache: "no-cache",
        // credentials: "include",
        headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        // redirect: "follow", // manual, *follow, error
        referrerPolicy: "origin", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
}

function updateBars() {
    smid = abs(steering) / 2;
    if (steering < 0) {
        steeringLeft.style("width", `${50 - smid}%`);
        steeringRight.style("width", "50%");
    } else {
        steeringLeft.style("width", "50%");
        steeringRight.style("width", `${50 - smid}%`);
    }
    steeringMiddle.style("width", `${smid}%`);
    steeringLabel.html(`${steering}`);

    tmid = abs(throttle) / 2;
    if (throttle < 0) {
        throttleLeft.style("width", `${50 - tmid}%`);
        throttleRight.style("width", "50%");
    } else {
        throttleLeft.style("width", "50%");
        throttleRight.style("width", `${50 - tmid}%`);
    }
    throttleMiddle.style("width", `${tmid}%`);
    throttleLabel.html(`${throttle}`);

    // Put movement data to the API
    putData("http://127.0.0.1:8000/drive/", {
        throttle: throttle,
        steering: steering,
    });
}

function keyPressed() {
    if (key === "ArrowUp" && !cruiseControl) {
        throttle = 100;
        updateBars();
    } else if (key === "ArrowDown" && !cruiseControl) {
        throttle = -100;
        updateBars();
    } else if (key === "c") {
        cruiseControl = cruiseControl ? false : true;
        if (cruiseControl) {
            cruiseLabel.style("visibility", "visible");
        } else {
            cruiseLabel.style("visibility", "hidden");
        }
    }
}

function keyReleased() {
    if (key === "ArrowUp" || key === "ArrowDown") {
        if (!cruiseControl) {
            throttle = 0;
            updateBars();
        }
    }
}

function draw() {
    ++i;
    if (i > 15) {
        // send a ping every 0.5 seconds
        putData("http://127.0.0.1:8000/ping/")
            .then((data) => {
                // console.log(data);
                if (data === "pong" && !apiOnline) {
                    console.log("api on");
                    apiOnline = true;
                    apiOfflineLabel.style("visibility", "hidden");
                }
            })
            .catch((error) => {
                // console.log("ERROR!");
                apiOnline = false;
                apiOfflineLabel.style("visibility", "visible");
            });
        i = 0;
    }

    if (keyIsPressed === true) {
        if (key === "ArrowLeft" && steering > -100) {
            steering -= 2;
        } else if (key === "ArrowRight" && steering < 100) {
            steering += 2;
        } else if (cruiseControl && key === "ArrowUp" && throttle < 100) {
            throttle += 2;
        } else if (cruiseControl && key === "ArrowDown" && throttle > -100) {
            throttle -= 2;
        } else {
            return;
        }
        updateBars();
    }
}
