import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from rich.logging import RichHandler

logging.basicConfig(format="%(message)s", level=logging.DEBUG, handlers=[RichHandler()])

origins = ["http://localhost:5500"]


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
    logging.info(move)


@app.put("/ping/")
def ping():
    # logging.info("pong")
    return "pong"
