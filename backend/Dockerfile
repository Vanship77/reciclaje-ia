Set-Content -Path "backend\Dockerfile" -Value @"
# TODO: Dockerfile para el backend de Reciclaje IA
# 1. Usa Python 3.10 como base
# 2. Instala dependencias del sistema (OpenCV)
# 3. Copia requirements.txt y instala dependencias Python
# 4. Copia el código fuente
# 5. Expone el puerto 5000
# 6. Ejecuta Gunicorn con la aplicación Flask

FROM python:3.10-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:create_app()"]
"@