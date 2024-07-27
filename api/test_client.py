from asyncio import run
from websockets import connect


async def hello():
    async with connect("ws://localhost:8765") as ws:
        await ws.send("Bob")
        message = await ws.recv()
        print("RX:", message)


if __name__ == "__main__":
    run(hello())
