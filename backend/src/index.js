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

    response.status(201).send({
      id: newUser.uuid,
      email: newUser.email,
      name: newUser.name,
    });
  }
);

app.get(
  "/users",
  {
    preHandler: authenticateToken,
  },
  async function (request, response) {
    const emailFilter = request.query.email;

    const users = await prisma.user.findMany({
      where: {
        email: {
          startsWith: emailFilter,
        },
      },
    });

    const transformedPayload = users.map((user) => ({
      id: user.uuid,
      email: user.email,
    }));

    response.send(transformedPayload);
  }
);

app.get(
  "/boards/:id/tasks",
  {
    preHandler: authenticateToken,
  },
  async function (request, response) {
    const id = request.params.id;

    const board = await prisma.board.findUnique({
      where: {
        uuid: id,
      },
    });

    const boardTasks = await prisma.boardTask.findMany({
      where: {
        board_id: board.id,
      },
      include: {
        task: true,
      },
      orderBy: [
        {
          task: {
            completed: "asc",
          },
        },
        {
          task: {
            id: "asc",
          },
        },
      ],
    });

    const transformedPayload = boardTasks.map((boardTask) => ({
      name: boardTask.task.name,
      completed: boardTask.task.completed,
      id: boardTask.task.uuid,
    }));

    response.send(transformedPayload);
  }
);

app.get(
  "/boards/:id/tasks/pending",
  {
    preHandler: authenticateToken,
  },
  async function (request, response) {
    const id = request.params.id;

    const board = await prisma.board.findUnique({
      where: {
        uuid: id,
      },
    });

    const boardTasks = await prisma.boardTask.findMany({
      where: {
        board_id: board.id,
        task: {
          completed: false,
        },
      },
      include: {
        task: true,
      },
      orderBy: {
        task: {
          id: "asc",
        },
      },
    });

    const transformedPayload = boardTasks.map((boardTask) => ({
      name: boardTask.task.name,
      completed: boardTask.task.completed,
      id: boardTask.task.uuid,
    }));

    response.send(transformedPayload);
  }
);

app.get(
  "/boards/:id/tasks/completed",
  {
    preHandler: authenticateToken,
  },
  async function (request, response) {
    const id = request.params.id;

    const board = await prisma.board.findUnique({
      where: {
        uuid: id,
      },
    });

    const boardTasks = await prisma.boardTask.findMany({
      where: {
        board_id: board.id,
        task: {
          completed: true,
        },
      },
      include: {
        task: true,
      },
      orderBy: {
        task: {
          id: "asc",
        },
      },
    });

    const transformedPayload = boardTasks.map((boardTask) => ({
      name: boardTask.task.name,
      completed: boardTask.task.completed,
      id: boardTask.task.uuid,
    }));

    response.send(transformedPayload);
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

    const board = await prisma.board.findUnique({
      where: {
        uuid: board_id,
      },
    });

    const newTask = await prisma.task.create({
      data: {
        name: name,
        board_id: board.id,
      },
    });

    await prisma.boardTask.create({
      data: {
        task_id: newTask.id,
        board_id: board.id,
      },
    });

    response.status(201).send({
      id: newTask.uuid,
      name: newTask.name,
      completed: newTask.completed,
    });
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

    const id = params.id;

    await prisma.task.delete({ where: { uuid: id } });

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
    const id = params.id;

    const task = await prisma.task.findUnique({
      where: { uuid: id },
    });

    const isCompleted = task.completed;

    const updatedTask = await prisma.task.update({
      where: { uuid: id },
      data: {
        completed: !isCompleted,
      },
      include: {
        board: true,
      },
    });

    response.status(202).send({
      name: updatedTask.name,
      completed: updatedTask.completed,
      id: updatedTask.uuid,
      board_id: updatedTask.board.uuid,
    });
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
      orderBy: {
        id: "asc",
      },
    });

    const transformedPayload = boards.map((board) => {
      const users = board.BoardUser.map((boardUser) => {
        return {
          id: boardUser.user.uuid,
          email: boardUser.user.email,
          name: boardUser.user.name,
        };
      });

      return {
        id: board.uuid,
        name: board.name,
        users,
      };
    });

    response.send(transformedPayload);
  }
);

app.post(
  "/boards/:board_id/users/:user_id",
  {
    preHandler: authenticateToken,
  },
  async function (request, response) {
    const boardId = request.params.board_id;
    const userId = request.params.user_id;

    const user = await prisma.user.findUnique({
      where: {
        uuid: userId,
      },
    });

    const board = await prisma.board.findUnique({
      where: {
        uuid: boardId,
      },
    });

    const newBoardUser = await prisma.boardUser.create({
      data: {
        user_id: user.id,
        board_id: board.id,
      },
    });

    response.status(201).send({
      id: newBoardUser.uuid,
    });
  }
);

app.delete(
  "/boards/:id",
  {
    preHandler: authenticateToken,
  },
  async function (request, response) {
    const id = request.params.id;

    await prisma.board.delete({
      where: {
        uuid: id,
      },
    });

    response.status(204).send();
  }
);

app.patch(
  "/boards/:id",
  {
    preHandler: authenticateToken,
  },
  async function (request, response) {
    const params = request.params;
    const id = params.id;
    const body = request.body;

    const updatedBoard = await prisma.board.update({
      where: { uuid: id },
      data: {
        name: body.name,
      },
    });

    response.status(202).send({
      name: updatedBoard.name,
      id: updatedBoard.uuid,
    });
  }
);

app.post(
  "/boards/:board_id/tasks/:task_id",
  {
    preHandler: authenticateToken,
  },
  async function (request, response) {
    const boardId = request.params.board_id;
    const taskId = request.params.task_id;

    const board = await prisma.board.findUnique({
      where: {
        uuid: boardId,
      },
    });

    const boardUser = await prisma.boardUser.findFirst({
      where: {
        user_id: request.user.id,
        board_id: board.id,
      },
    });

    if (!boardUser)
      return response.status(400).send({
        message: "Method not allowed for this user",
      });

    const task = await prisma.task.findUnique({
      where: {
        uuid: taskId,
      },
    });

    const newBoardTask = await prisma.boardTask.create({
      data: {
        task_id: task.id,
        board_id: board.id,
      },
    });

    response.status(201).send({
      id: newBoardTask.uuid,
    });
  }
);

app
  .listen({ port: 3333 })
  .then(() => console.log("HTTP server is running"))
  .catch(() => console.log("Error"));
