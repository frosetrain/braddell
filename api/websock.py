from asyncio import Future, run

from websockets.server import serve


async def drive(websocket):
    name = await websocket.recv()
    greeting = f"Hello {name}"
    print("TX:", greeting)
    await websocket.send(greeting)


async def main():
    async with serve(drive, "localhost", 8765):
        await Future()


if __name__ == "__main__":
    run(main())
