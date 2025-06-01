from fastapi import FastAPI, UploadFile, File
from fastapi.responses import FileResponse
import cv2
import numpy as np
import tempfile
from cv2 import dnn

app = FastAPI()
from fastapi.middleware.cors import CORSMiddleware


# Allow frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace "*" with ["http://localhost:3000"] in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
proto_file = os.path.join(BASE_DIR, "colorization_deploy_v2.prototxt")
model_file = os.path.join(BASE_DIR, "colorization_release_v2.caffemodel")
hull_pts = os.path.join(BASE_DIR, "pts_in_hull.npy")


# Load the model
net = dnn.readNetFromCaffe(proto_file, model_file)
kernel = np.load(hull_pts)

# Set up model layers
class8 = net.getLayerId("class8_ab")
conv8 = net.getLayerId("conv8_313_rh")
pts = kernel.transpose().reshape(2, 313, 1, 1)
net.getLayer(class8).blobs = [pts.astype("float32")]
net.getLayer(conv8).blobs = [np.full([1, 313], 2.606, dtype="float32")]

def colorize_image(image: np.ndarray) -> np.ndarray:
    scaled = image.astype("float32") / 255.0
    lab_img = cv2.cvtColor(scaled, cv2.COLOR_BGR2LAB)

    # Resize and process L channel
    resized = cv2.resize(lab_img, (224, 224))
    L = cv2.split(resized)[0]
    L -= 50  # Mean subtraction

    # Predict ab channels
    net.setInput(cv2.dnn.blobFromImage(L))
    ab_channel = net.forward()[0, :, :, :].transpose((1, 2, 0))
    ab_channel = cv2.resize(ab_channel, (image.shape[1], image.shape[0]))

    # Combine L with predicted ab
    L = cv2.split(lab_img)[0]
    colorized = np.concatenate((L[:, :, np.newaxis], ab_channel), axis=2)
    colorized = cv2.cvtColor(colorized, cv2.COLOR_LAB2BGR)
    colorized = np.clip(colorized, 0, 1)
    
    return (colorized * 255).astype("uint8")

@app.post("/colorize")
async def process_image(file: UploadFile = File(...)):
    # Read image
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # Process the image
    colorized = colorize_image(img)

    # Save and return the processed image
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".jpg")
    cv2.imwrite(temp_file.name, colorized)
    return FileResponse(temp_file.name, media_type="image/jpg")
