from flask import Flask, Response, request, jsonify,render_template
from flask_cors import CORS, cross_origin
from flask_socketio import SocketIO
import cv2
import numpy as np
import os
import base64

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*", websocket_transport_options={'websocket': 'simple'})  
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')

# Add MIME types for APK and PNG files
@app.route('/static/<path:path>')
def send_static(path):
    if path.endswith('.apk'):
        mimetype = 'application/vnd.android.package-archive'
    elif path.endswith('.jpg'):
        mimetype = 'image/jpeg'
    else:
        mimetype = None
    if mimetype is not None:
        return app.send_static_file(path), {'Content-Type': mimetype}
    else:
        return 'Unsupported file type', 404


@app.route('/api/process-image', methods=['POST'])
@cross_origin()
def process_image():
   
    # Receive the uploaded image
    file = request.files['image']
    image = cv2.imdecode(np.frombuffer(file.read(), np.uint8), cv2.IMREAD_COLOR)
   
    # Get the selected model from the 'model' parameter in the request arguments
    selected_model = request.args.get('model')

    if selected_model == 'dnn':
        # Process image using DNN model
        image2 = detect_DNN(image)
    else:
        # Handle invalid model selection
        image2 = detect_HAAR_C(image)

    # Encode the processed image as a base64 string
    _, buffer = cv2.imencode('.jpg', image2)
    encoded_image = base64.b64encode(buffer).decode('utf-8')

    return Response(f"data:image/jpeg;base64,{encoded_image}", content_type='text/plain')

if __name__ == '__main__':
    socketio.run(app, debug=True)

def detect_DNN(image):
    """
    Detect faces in an input image using OpenCV's deep neural network (DNN) model.

    Args:
        image (numpy array): Input image in BGR format.

    Returns:
        numpy array: Copy of the input image with bounding boxes around detected faces.
    """
    
    current_directory = os.path.dirname(os.path.abspath(__file__))

    # Load pre-trained DNN model for face detection
    PROTOTXT = os.path.join(current_directory, 'deploy.prototxt.txt') 
    MODEL  = os.path.join(current_directory, 'res10_300x300_ssd_iter_140000.caffemodel')

    net = cv2.dnn.readNetFromCaffe(PROTOTXT, MODEL)
    blob = cv2.dnn.blobFromImage(cv2.resize(image, (300, 300)), 1.0, (300, 300), (104.0, 177.0, 123.0))

    net.setInput(blob)
    faces = net.forward()
    height, width = image.shape[:2]

    
    # Loop through detected faces and draw bounding boxes
    for i in range(faces.shape[2]):
        confidence = faces[0, 0, i, 2]
        if confidence > 0.5:
            box = faces[0, 0, i, 3:7] * np.array([width, height, width, height])
            (x, y, x1, y1) = box.astype("int")
            cv2.rectangle(image, (x, y), (x1, y1), (0, 0, 255), 3)

    return image


def detect_HAAR_C(image):
    """
    Detect faces in an input image using OpenCV's Haar cascase.

    Args:
        image (numpy array): Input image in BGR format.

    Returns:
        numpy array: Copy of the input image with bounding boxes around detected faces.
    """
   
    # Convert the image to grayscale for face detection
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    current_directory = os.path.dirname(os.path.abspath(__file__))
    
    CASCADE = os.path.join(current_directory, 'haarcascade_frontalface_default.xml')
    
    face_cascade = cv2.CascadeClassifier(CASCADE)
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(50, 50))

    # Draw bounding boxes around detected faces
    for (x, y, w, h) in faces:
        cv2.rectangle(image, (x, y), (x + w, y + h), (0, 0, 255), 3)


    return image

    # Convert the image to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Apply GaussianBlur to the image to reduce noise
    gray_blur = cv2.GaussianBlur(gray, (15, 15), 0)

        # Detect edges in the image using the Canny edge detection
    edges = cv2.Canny(gray_blur, 50, 150)

    # Find contours in the image
    contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    # Iterate through the contours and find the contour with aspect ratio and area greater than the thresholds
    for contour in contours:
        # Approximate the contour to a polygon
        approx = cv2.approxPolyDP(contour, 0.02 * cv2.arcLength(contour, True), True)
        print(len(approx))
         # Check if the contour has 4 vertices, which indicates it's likely a rectangle (ruler)
        if len(approx) == 4  :
            # Draw the contour on the image
            cv2.drawContours(image, [contour], 0, (0, 0, 255), 3)
            

    return image
