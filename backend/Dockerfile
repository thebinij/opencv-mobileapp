FROM python:3.11.3-slim-buster

# Set the working directory in the container
WORKDIR /app

# Copy the requirements.txt file into the container
COPY requirements.txt .

# Create and activate the virtual environment
RUN python -m venv myenv && \
    /bin/bash -c "source myenv/bin/activate"

# Install the Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the Flask application code into the container
COPY . .

# Expose the port that the Flask app will run on
EXPOSE 5000

# Set environment variables
ENV FLASK_DEBUG=0
ENV FLASK_APP=app.py

# Start the Flask app
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "4", "app:app"]
