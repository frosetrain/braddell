import logging

from fastapi import FastAPI
from pydantic import BaseModel

logging.basicConfig(format="%(asctime)s %(message)s", level=logging.DEBUG)


class DriveMovements(BaseModel):
    speed: int
    turn: int


app = FastAPI()


@app.put("/")
def drive(move: DriveMovements):
    logging.info(move)
    return move
