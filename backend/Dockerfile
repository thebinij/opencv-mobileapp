FROM python:3.11.3-slim-buster

# Allow statements and log messages to immediately appear in the Knative logs
ENV PYTHONUNBUFFERED True

# Set the working directory in the container
ENV FLASK_APP /app
WORKDIR $FLASK_APP

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

# Run the web service on container. Number of workers can be adjusted to the cores available
# Timeout is set to 0 to disable the timeouts of the workers to allow Cloud Run to handle instance
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "1", "--threads", "8", "--timeout", "0", "app:app"]
