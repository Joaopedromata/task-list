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

    response.status(201).send(newUser);
  }
);

app.get(
  "/boards/:id/tasks",
  {
    preHandler: authenticateToken,
  },
  async function (request, response) {
    try {
      const id = request.params.id;

      const boardWithTasks = await prisma.board.findUnique({
        where: {
          uuid: id,
        },
        include: {
          Task: {
            orderBy: [
              {
                completed: "asc",
              },
              {
                id: "asc",
              },
            ],
          },
        },
      });

      const presenter = {
        id: boardWithTasks.id,
        name: boardWithTasks.name,
        uuid: boardWithTasks.uuid,
        tasks: boardWithTasks.Task,
      };

      response.send(presenter);
    } catch (error) {
      console.log({ error });
    }
  }
);

app.get(
  "/boards/:id/tasks/pending",
  {
    preHandler: authenticateToken,
  },
  async function (request, response) {
    const id = request.params.id;

    const boardWithTasks = await prisma.board.findUnique({
      where: {
        uuid: id,
      },
      include: {
        Task: {
          where: {
            completed: false,
          },
          orderBy: [
            {
              completed: "asc",
            },
            {
              id: "asc",
            },
          ],
        },
      },
    });

    const presenter = {
      id: boardWithTasks.id,
      name: boardWithTasks.name,
      uuid: boardWithTasks.uuid,
      tasks: boardWithTasks.Task,
    };

    response.send(presenter);
  }
);

app.get(
  "/boards/:id/tasks/completed",
  {
    preHandler: authenticateToken,
  },
  async function (request, response) {
    const id = request.params.id;

    const boardWithTasks = await prisma.board.findUnique({
      where: {
        uuid: id,
      },
      include: {
        Task: {
          where: {
            completed: true,
          },
          orderBy: [
            {
              completed: "asc",
            },
            {
              id: "asc",
            },
          ],
        },
      },
    });

    const presenter = {
      id: boardWithTasks.id,
      name: boardWithTasks.name,
      uuid: boardWithTasks.uuid,
      tasks: boardWithTasks.Task,
    };

    response.send(presenter);
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
        board_id: parseInt(board.id),
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
        Task: {
          include: {
            _count: true,
          },
        },
      },
      orderBy: {
        id: "asc",
      },
    });

    const transformedPayload = boards.map((board) => {
      const completedTasks = board.Task.map((task) => {
        return task.completed;
      });

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
        completedTasks: completedTasks.filter(Boolean).length,
        totalTasks: board.Task.length,
      };
    });

    response.send(transformedPayload);
  }
);

app.delete(
  "/boards/:id",
  {
    preHandler: authenticateToken,
  },
  async function (request, response) {
    const params = request.params;

    const id = params.id;

    await prisma.board.delete({ where: { uuid: id } });

    return response.status(204).send();
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

    const board = await prisma.board.update({
      where: { uuid: id },
      data: request.body,
    });

    response.status(202).send(board);
  }
);

app.post(
  "/financings",
  {
    preHandler: authenticateToken,
  },
  async function (request, response) {
    const {
      description,
      amount,
      installments,
      due_date_first,
      installment_amount,
    } = request.body;

    const formatDueDateFirst = new Date(due_date_first);
    const financing = await prisma.financing.create({
      data: {
        user_id: request.user.id,
        description,
        amount,
        installments,
        installment_amount,
        due_date_first: formatDueDateFirst,
      },
    });

    const financingInstallment = Array.from(Array(installments).keys()).map(
      () => {
        const newData = new Date(
          formatDueDateFirst.setMonth(formatDueDateFirst.getMonth() + 1)
        );

        return {
          financing_id: financing.id,
          due_date: newData,
          amount: installment_amount,
        };
      }
    );

    await prisma.financingInstallment.createMany({
      data: financingInstallment,
    });

    response.status(201).send(financing);
  }
);

app.post(
  "/habits",
  {
    preHandler: authenticateToken,
  },
  async function (request, response) {
    const { title, week_days } = request.body;

    const habits = await prisma.habit.create({
      data: {
        title,
        weekDays: {
          create: week_days.map((weekDay) => {
            return {
              week_day: weekDay,
            };
          }),
        },
      },
    });

    response.status(201).send(habits);
  }
);

app
  .listen({ port: 3333 })
  .then(() => console.log("HTTP server is running"))
  .catch(() => console.log("Error"));
