# 📼 Microservicio de Videos – StreamFlow

Este microservicio forma parte del proyecto **StreamFlow**, De la asignatura **Arquitectura de Sistemas**. Administra la información relacionada a los videos disponibles, permitiendo su creación, actualización, eliminación lógica y consulta.

---

## 📋 Requisitos

- Node.js v18.x o superior  
- Docker  
- RabbitMQ   
- MongoDB   
- Postman 

---

## 🚀 Instalación y ejecución

### 1. Clona el repositorio

```bash
git clone https://github.com/Taller2-AS/videos-service.git
cd videoService
```

### 2. Instala las dependencias

```bash
npm install
```

### 3. Crea el archivo `.env`

Ejemplo:

```env
GRPC_PORT=50051
SERVER_URL=localhost

MONGODB_URI=mongodb://admin:root@localhost:27017/videos?authSource=admin
RABBITMQ_URL=amqp://admin:admin@localhost:5672
```

> ⚠️ Asegúrate de que MongoDB y RabbitMQ estén corriendo en tu entorno local.

---

### 4. Levanta MongoDB y RabbitMQ con Docker

```bash
docker-compose up -d
```

---

### 5. Ejecuta el seeder (opcional)

```bash
npm run seed
```

Esto insertará 500 registros falsos de videos para pruebas.

---

### 6. Inicia el microservicio

```bash
npm start
```
---

## 👨‍💻 Desarrollado por

**Desarrollador B - Kevin Araya**  
Universidad Católica del Norte – Arquitectura de Sistemas