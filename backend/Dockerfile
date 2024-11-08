FROM python:3.12-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Instala netcat para verificar disponibilidade do banco de dados
RUN apt-get update && apt-get install -y \
    postgresql-client \
    netcat-traditional \
    && rm -rf /var/lib/apt/lists/*

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ .

# Copia e dá permissão de execução ao script de entrada
COPY backend/entrypoint.sh .
RUN chmod +x entrypoint.sh

EXPOSE 8000

# Define o script como ponto de entrada
ENTRYPOINT ["./entrypoint.sh"]