FROM python:3.11.1-slim-bullseye

ENV PYTHONUNBUFFERED 1
ENV APP_HOME /build
WORKDIR $APP_HOME

# Create venv, add it to path and install requirements
RUN python -m venv /venv
ENV PATH="/venv/bin:$PATH"

COPY requirements.txt .
RUN pip install -r requirements.txt

# Install uvicorn server
RUN pip install uvicorn[standard]

# Copy the rest of app
COPY app $APP_HOME/app
COPY alembic $APP_HOME/alembic
COPY alembic.ini $APP_HOME
COPY pyproject.toml $APP_HOME
COPY init.sh $APP_HOME
COPY main.py $APP_HOME
# This needs to be provided with correct .env file
COPY .env $APP_HOME/.env

# Create new user to run app process as unprivilaged user
RUN addgroup --gid 1001 --system uvicorn && \
    adduser --gid 1001 --shell /bin/false --disabled-password --uid 1001 uvicorn

# Run init.sh script then start uvicorn
RUN chown -R uvicorn:uvicorn /build
CMD bash init.sh && \
    runuser -u uvicorn -- /venv/bin/uvicorn main:app --app-dir /build --host 0.0.0.0 --port 8080 --workers 2 --loop uvloop
EXPOSE 8080
