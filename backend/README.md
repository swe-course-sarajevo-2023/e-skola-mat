# e-skola-mat

## Description

This project is a Python web application built with FastAPI and containerized using Docker. It also utilizes Pyenv for managing Python versions.

## Prerequisites

Make sure you have the following installed on your machine:

- Docker: [Install Docker](https://docs.docker.com/get-docker/)
- Pyenv: [Install Pyenv](https://github.com/pyenv/pyenv#installation)
- Poetry: [Install Poetry](https://python-poetry.org/docs/#installation)
- Python (specified version in .python-version file)

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/your-project.git
   cd your-project
   ```

2. Set up Python environment using Pyenv:

   ```bash
   pyenv install $(cat .python-version)
   pyenv local $(cat .python-version)
   ```

3. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

4. Install Uvicorn:

   ```bash
   pip install uvicorn
   ```

5. Build and run the Docker container:

   ```bash
   docker-compose up --build
   ```

6. Start the FastAPI application using Uvicorn:

   ```bash
   uvicorn main:app --reload
   ```

The FastAPI application should now be accessible at `http://localhost:8000`.

6.  You can test the backend by running these commands:

        ```bash
        pytest
        ```

    The database needs to be running for pytest to work.

7 Format code running black and isort using these commands:
black . && isort .


## Docker Configuration

The `Dockerfile` contains the necessary instructions to build the Docker image for your FastAPI application. The `docker-compose.yml` file is used to configure the Docker services.

## API Documentation

The API documentation is generated automatically by FastAPI and can be accessed at `http://localhost:8000/docs`.
