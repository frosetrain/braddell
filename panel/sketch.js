let steering = 0;
let throttle = 0;
let cruiseControl = false;
let steeringLeft, steeringMiddle, steeringRight;
let throttleLeft, throttleMiddle, throttleRight;
let parkbrakeLabel,
    normalModeLabel,
    cruiseModeLabel,
    gamepadModeLabel,
    reverseLabel;
let framei = 0;
let captureCount = 0;
let apiOnline = false;
let pu = false;
let pd = false;
let pl = false;
let pr = false;
let gamepadConnected = false;
let gamepad;
let parkbrake = true;
let reverse = false; // this only applies to gamepad throttle

const api = "http://192.168.31.69:8000";

function setup() {
    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
    window.addEventListener(
        "gamepadconnected",
        (e) => {
            gamepadHandler(e, true);
        },
        false,
    );
    window.addEventListener(
        "gamepaddisconnected",
        (e) => {
            gamepadHandler(e, false);
        },
        false,
    );
    gameControl.on("connect", function (gamepad) {
        gamepad.before("button2", () => {
            reverse = reverse ? false : true;
            if (reverse) {
                reverseLabel.removeClass("hidden");
            } else {
                reverseLabel.addClass("hidden");
            }
        });
    });

    steeringLeft = new p5.Element(document.getElementById("steering-left"));
    steeringMiddle = new p5.Element(document.getElementById("steering-middle"));
    steeringRight = new p5.Element(document.getElementById("steering-right"));
    steeringLabel = new p5.Element(document.getElementById("steering-label"));

    throttleLeft = new p5.Element(document.getElementById("throttle-left"));
    throttleMiddle = new p5.Element(document.getElementById("throttle-middle"));
    throttleRight = new p5.Element(document.getElementById("throttle-right"));
    throttleLabel = new p5.Element(document.getElementById("throttle-label"));
    parkbrakeLabel = new p5.Element(document.getElementById("parkbrake-label"));
    apiOfflineLabel = new p5.Element(
        document.getElementById("apioffline-label"),
    );
    normalModeLabel = new p5.Element(
        document.getElementById("normal-mode-label"),
    );
    cruiseModeLabel = new p5.Element(
        document.getElementById("cruise-mode-label"),
    );
    gamepadModeLabel = new p5.Element(
        document.getElementById("gamepad-mode-label"),
    );
    reverseLabel = new p5.Element(document.getElementById("reverse-label"));
    captureButton = new p5.Element(
        document.getElementById("btn-capture"),
        this,
    );
    captureCountLabel = new p5.Element(
        document.getElementById("capture-count"),
    );
    lastPhotoLabel = new p5.Element(document.getElementById("last-photo"));
    captureButton.mousePressed(capture);
    pingLabel = new p5.Element(document.getElementById("ping"));
    noCanvas();
    updateBars();
    frameRate(30);
}

function capture() {
    putData(`${api}/capture/`)
        .then((data) => {
            captureCount++;
            lastPhotoLabel.html(data);
            captureCountLabel.html(captureCount);
        })
        .catch((error) => {
            lastPhotoLabel.html("ohno");
        });
}

function keyDownHandler(event) {
    if (event.key === "ArrowUp") {
        pu = true;
    } else if (event.key === "ArrowDown") {
        pd = true;
    } else if (event.key === "ArrowLeft") {
        pl = true;
    } else if (event.key === "ArrowRight") {
        pr = true;
    }
}

function keyUpHandler(event) {
    if (event.key === "ArrowUp") {
        pu = false;
    } else if (event.key === "ArrowDown") {
        pd = false;
    } else if (event.key === "ArrowLeft") {
        pl = false;
    } else if (event.key === "ArrowRight") {
        pr = false;
    }
}

function gamepadHandler(event, connected) {
    if (connected) {
        throttle = 0;
        steering = 0;
        gamepadConnected = true;
        gamepad = event.gamepad;
        console.log("Gamepad connected", gamepad.index, gamepad.id);
        if (cruiseControl) {
            cruiseModeLabel.addClass("hidden");
        } else {
            normalModeLabel.addClass("hidden");
        }
        gamepadModeLabel.removeClass("hidden");
        updateBars();
    } else {
        console.log("Gamepad disconnected");
        gamepadConnected = false;
        if (cruiseControl) {
            cruiseModeLabel.removeClass("hidden");
        } else {
            normalModeLabel.removeClass("hidden");
        }
        gamepadModeLabel.addClass("hidden");
    }
}

async function putData(url = "", data = {}) {
    const response = await fetch(url, {
        method: "PUT",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
        },
        referrerPolicy: "origin", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data),
    });
    return response.json();
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

    if (!parkbrake) {
        // Put movement data to the API
        putData(`${api}/drive/`, {
            throttle: throttle,
            steering: steering,
        });
    }
}

function keyPressed() {
    if (key === "c" && !gamepadConnected) {
        throttle = 0;
        cruiseControl = cruiseControl ? false : true;
        if (cruiseControl) {
            normalModeLabel.addClass("hidden");
            cruiseModeLabel.removeClass("hidden");
        } else {
            normalModeLabel.removeClass("hidden");
            cruiseModeLabel.addClass("hidden");
        }
        updateBars();
    } else if (key === "p") {
        // parkbrake toggle
        if (!parkbrake) {
            steering = 0;
            throttle = 0;
            updateBars();
            parkbrakeLabel.removeClass("hidden");
        } else {
            parkbrakeLabel.addClass("hidden");
        }
        parkbrake = parkbrake ? false : true;
    }
}

function draw() {
    ++framei;
    if (framei > 30) {
        // send a ping every second
        let start = performance.now();
        putData(`${api}/ping/`)
            .then((data) => {
                // console.log(data);
                pingLabel.html(performance.now() - start);
                if (data === "pong" && !apiOnline) {
                    console.log("api on");
                    apiOnline = true;
                    apiOfflineLabel.addClass("hidden");
                }
            })
            .catch((error) => {
                // console.log("ERROR!");
                apiOnline = false;
                apiOfflineLabel.removeClass("hidden");
            });
        framei = 0;
    }

    if (gamepadConnected) {
        s = round(gamepad.axes[0] * 100);
        if (abs(s) < 10) {
            s = 0;
        }
        if (s !== steering) {
            steering = s;
            updateBars();
        }
        t = round((gamepad.axes[5] + 1) * 50);
        if (reverse) {
            t = -t;
        }
        if (abs(t) < 2) {
            t = 0;
        }
        if (t !== throttle) {
            throttle = t;
            updateBars();
        }
    } else {
        if (pl || pr) {
            s = steering;
            if (pl && s > -100) {
                s -= 2;
            }
            if (pr && s < 100) {
                s += 2;
            }
            if (s !== steering) {
                steering = s;
                updateBars();
            }
        }
        if (cruiseControl) {
            t = throttle;
            if (pu && t < 100) {
                t += 2;
            }
            if (pd && t > -100) {
                t -= 2;
            }
            if (t !== throttle) {
                throttle = t;
                updateBars();
            }
        } else {
            if (pu || pd || throttle !== 0) {
                t = throttle;
                if (pu && pd) {
                    t = 0;
                } else if (pu) {
                    t = 100;
                } else if (pd) {
                    t = -100;
                } else if (throttle !== 0) {
                    t = 0;
                }
                if (t !== throttle) {
                    throttle = t;
                    updateBars();
                }
            }
        }
    }
}
