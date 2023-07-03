import fastify from "fastify";
import { PrismaClient } from "@prisma/client";
import cors from "@fastify/cors";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const app = fastify();

app.register(cors);

const authenticateToken = (request, response, next) => {
  const token = request.headers["authorization"];

  if (!token) {
    response.status(401).send({
      message: "Token not provided",
    });
  }

  const bearerToken = token.split("Bearer ")[1];

  jwt.verify(bearerToken, "teste", (error, user) => {
    if (error) {
      response.status(401).send({
        message: "Invalid token",
      });
    }

    // Você pode adicionar o objeto 'user' ao request para uso posterior
    request.user = user;

    next();
  });
};

app.post(
  "/login",

  async function (request, response) {
    const body = request.body;

    const email = body.email;
    const password = body.password;

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (user && password === user.password) {
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        "teste"
      );

      response.status(200).send({
        token: token,
      });
      return;
    }

    response.status(400).send({
      message: "Invalid Credentials",
    });
  }
);

app.get(
  "/tasks",
  {
    preHandler: authenticateToken,
  },
  async function (request, response) {
    const tasks = await prisma.task.findMany({
      where: {
        user_id: request.user.id,
      },
    });

    response.send(tasks);
  }
);

app.get(
  "/tasks/pending",
  {
    preHandler: authenticateToken,
  },
  async function (request, response) {
    const tasks = await prisma.task.findMany({
      where: {
        completed: false,
        user_id: request.user.id,
      },
    });

    response.send(tasks);
  }
);

app.get(
  "/tasks/completed",
  {
    preHandler: authenticateToken,
  },
  async function (request, response) {
    const tasks = await prisma.task.findMany({
      where: {
        completed: true,
        user_id: request.user.id,
      },
    });

    response.send(tasks);
  }
);

app.post(
  "/tasks",
  {
    preHandler: authenticateToken,
  },
  async function (request, response) {
    const body = request.body;

    const name = body.name;

    const newTask = await prisma.task.create({
      data: {
        name: name,
        user_id: request.user.id,
      },
    });

    response.status(201).send(newTask);
  }
);

app.delete(
  "/tasks/:id",
  {
    preHandler: authenticateToken,
  },
  async function (request, response) {
    const params = request.params;

    const id = parseInt(params.id);

    await prisma.task.delete({ where: { id: id } });

    return response.status(204).send();
  }
);

app.patch(
  "/tasks/:id/completed",
  {
    preHandler: authenticateToken,
  },
  async function (request, response) {
    const params = request.params;
    const id = parseInt(params.id);

    const task = await prisma.task.findUnique({
      where: { id: id },
    });

    const isCompleted = task.completed;

    const updatedTask = await prisma.task.update({
      where: { id: id },
      data: {
        completed: !isCompleted,
      },
    });

    response.status(202).send(updatedTask);
  }
);

app
  .listen({ port: 3333 })
  .then(() => console.log("HTTP server is running"))
  .catch(() => console.log("Error"));
