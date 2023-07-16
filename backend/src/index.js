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

app.post(
  "/create-user",

  async function (request, response) {
    const body = request.body;

    const name = body.name;
    const password = body.password;
    const email = body.email;

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (user) {
      return response.status(409).send({
        message: "This user already exists",
      });
    }

    const newUser = await prisma.user.create({
      data: {
        name: name,
        password: password,
        email: email,
      },
    });

    delete newUser.password;

    response.status(201).send(newUser);
  }
);

app.get(
  "/boards/:id/tasks",
  {
    preHandler: authenticateToken,
  },
  async function (request, response) {
    const id = request.params.id;

    const tasks = await prisma.task.findMany({
      where: {
        board_id: parseInt(id),
      },
      orderBy: [
        {
          completed: "asc",
        },
        {
          id: "asc",
        },
      ],
    });

    response.send(tasks);
  }
);

app.get(
  "/boards/:id/tasks/pending",
  {
    preHandler: authenticateToken,
  },
  async function (request, response) {
    const id = request.params.id;

    const tasks = await prisma.task.findMany({
      where: {
        completed: false,
        board_id: parseInt(id),
      },
      orderBy: {
        id: "asc",
      },
    });

    response.send(tasks);
  }
);

app.get(
  "/boards/:id/tasks/completed",
  {
    preHandler: authenticateToken,
  },
  async function (request, response) {
    const id = request.params.id;
    const tasks = await prisma.task.findMany({
      where: {
        completed: true,
        board_id: parseInt(id),
      },
      orderBy: {
        id: "asc",
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
    const board_id = body.board_id;

    const newTask = await prisma.task.create({
      data: {
        name: name,
        board_id: parseInt(board_id),
      },
    });

    response.status(201).send(newTask);
  }
);

app.post(
  "/boards",
  {
    preHandler: authenticateToken,
  },
  async function (request, response) {
    const body = request.body;

    const name = body.name;

    const newBoard = await prisma.board.create({
      data: {
        name: name,
      },
    });

    await prisma.boardUser.create({
      data: {
        board_id: newBoard.id,
        user_id: request.user.id,
      },
    });

    response.status(201).send(newBoard);
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

app.get(
  "/boards",
  {
    preHandler: authenticateToken,
  },
  async function (request, response) {
    const boards = await prisma.board.findMany({
      where: {
        BoardUser: {
          some: {
            user_id: request.user.id,
          },
        },
      },
      include: {
        BoardUser: {
          include: {
            user: true,
          },
        },
      },
    });

    const transformedPayload = boards.map((board) => {
      const users = board.BoardUser.map((boardUser) => {
        return {
          id: boardUser.user.id,
          email: boardUser.user.email,
          name: boardUser.user.name,
        };
      });

      return {
        id: board.id,
        name: board.name,
        users,
      };
    });

    response.send(transformedPayload);
  }
);

app
  .listen({ port: 3333 })
  .then(() => console.log("HTTP server is running"))
  .catch(() => console.log("Error"));
