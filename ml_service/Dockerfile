FROM python:3.11-slim
WORKDIR /app
COPY ./ml_service/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY ./ml_service ./
CMD [ "flask", "run", "--host=0.0.0.0", "--port=4500" ]