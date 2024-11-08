FROM python:3.12-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN apt-get update && apt-get install -y \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/.docker/backend/entrypoint.sh /app/.docker/backend/
RUN chmod +x /app/.docker/backend/entrypoint.sh

COPY backend/ .

EXPOSE 8000

CMD ["/app/.docker/backend/entrypoint.sh"]