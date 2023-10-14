import logging
from datetime import datetime

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from rich.logging import RichHandler

logging.basicConfig(format="%(message)s", level=logging.DEBUG, handlers=[RichHandler()])

origins = ["http://127.0.0.1:5500", "http://192.168.31.48:5500"]

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class DriveMovements(BaseModel):
    throttle: int
    steering: int


@app.put("/drive/")
def drive(move: DriveMovements):
    logging.debug(move)


@app.put("/ping/")
def ping():
    # logging.info("pong")
    return "pong"


@app.put("/capture/")
def capture():
    logging.info("capture still")
    with open("streamfifo", "w") as fifo:
        fifo.write("c")
        fifo.flush()
    return "captured"
