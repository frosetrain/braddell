from datetime import datetime
from os import remove
from posix import mkfifo
from socket import AF_INET, SO_REUSEADDR, SOCK_STREAM, SOL_SOCKET, socket

from libcamera import Transform
from picamera2 import Picamera2
from picamera2.encoders import H264Encoder
from picamera2.outputs import FileOutput

transform = Transform(hflip=True, vflip=True)
picam2 = Picamera2()
video_config = picam2.create_video_configuration({"size": (480, 360)}, transform=transform)
capture_config = picam2.create_still_configuration(transform=transform)
picam2.configure(video_config)
encoder = H264Encoder(250000)

named_pipe = "/home/pi/streamfifo"
try:
    remove(named_pipe)
except FileNotFoundError:
    pass
mkfifo(named_pipe)
print("created named pipe")
photo_id = 0

with socket(AF_INET, SOCK_STREAM) as sock:
    sock.setsockopt(SOL_SOCKET, SO_REUSEADDR, 1)
    sock.bind(("0.0.0.0", 8069))
    sock.listen()
    picam2.encoders = encoder
    conn, addr = sock.accept()
    stream = conn.makefile("wb")
    encoder.output = FileOutput(stream)
    picam2.start_encoder(encoder=encoder)
    print("Start")
    picam2.start()
    while True:
        with open(named_pipe, "r") as fifo:
            data = fifo.read()
            print(data)
            if data.strip() == "c":
                filename = "photos/" + datetime.now().strftime("BDL_%Y%m%d_%H%M%S_") + str(photo_id) + ".jpg"
                print("Capturing still image", filename)
                picam2.stop_encoder()
                picam2.switch_mode_and_capture_file(capture_config, filename)
                picam2.start_encoder(encoder=encoder)
                print("Done with still image")
                photo_id += 1
    picam2.stop()
    picam2.stop_encoder()
    conn.close()
