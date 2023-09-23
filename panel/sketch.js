let steering = 0;
let throttle = 0;
let cruiseControl = false;
let steeringLeft, steeringMiddle, steeringRight;
let throttleLeft, throttleMiddle, throttleRight;
let cruiseLabel;

function setup() {
    steeringLeft = new p5.Element(document.getElementById("steering-left"));
    steeringMiddle = new p5.Element(document.getElementById("steering-middle"));
    steeringRight = new p5.Element(document.getElementById("steering-right"));
    steeringLabel = new p5.Element(document.getElementById("steering-label"));

    throttleLeft = new p5.Element(document.getElementById("throttle-left"));
    throttleMiddle = new p5.Element(document.getElementById("throttle-middle"));
    throttleRight = new p5.Element(document.getElementById("throttle-right"));
    throttleLabel = new p5.Element(document.getElementById("throttle-label"));

    cruiseLabel = new p5.Element(document.getElementById("cruise-label"));

    updateBars();
    frameRate(30);
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
}

function keyPressed() {
    if (key === "ArrowUp" && !cruiseControl) {
        throttle = 100;
    } else if (key === "ArrowDown" && !cruiseControl) {
        throttle = -100;
    } else if (key === "c") {
        cruiseControl = cruiseControl ? false : true;
        if (cruiseControl) {
            cruiseLabel.style("visibility", "visible");
        } else {
            cruiseLabel.style("visibility", "hidden");
        }
    }
    updateBars();
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
    // console.log("ping pong");
    if (keyIsPressed === true) {
        if (key === "ArrowLeft" && steering > -100) {
            steering -= 2;
        } else if (key === "ArrowRight" && steering < 100) {
            steering += 2;
        } else if (cruiseControl && key === "ArrowUp" && throttle < 100) {
            throttle += 2;
        } else if (cruiseControl && key === "ArrowDown" && throttle > -100) {
            throttle -= 2;
        }
        updateBars();
    }
}
