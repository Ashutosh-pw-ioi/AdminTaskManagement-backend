import { Request, Response } from "express";
import { prisma } from "../db/prisma.js";
import { TaskStatus } from "@prisma/client";

const getTodayDailyTasksForOperator = async (req: Request, res: Response) => {
  try {
    const operatorId = req.user?.id;

    if (!operatorId) {
      return res.status(401).json({ error: "Unauthorized: Operator ID not found" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1); // Start of next day

    const dailyTasks = await prisma.dailyTaskInstance.findMany({
      where: {
        taskDate: {
          gte: today,
          lt: tomorrow,
        },
        operators: {
          some: {
            id: operatorId,
          },
        },
      },
      include: {
        defaultTask: true,
      },
    });

    res.status(200).json({ success: true, tasks: dailyTasks });
  } catch (error) {
    console.error("Error fetching daily tasks:", error);
    res.status(500).json({ error: "Failed to fetch daily tasks" });
  }
};
const getNewTasksForOperator = async (req: Request, res: Response) => {
  try {
    const operatorId = req.user?.id;

    if (!operatorId) {
      return res.status(401).json({ error: "Unauthorized: Operator ID not found" });
    }

    const newTasks = await prisma.newTask.findMany({
      where: {
        operators: {
          some: {
            id: operatorId,
          },
        },
      },
    });

    res.status(200).json({ success: true, tasks: newTasks });
  } catch (error) {
    console.error("Error fetching new tasks:", error);
    res.status(500).json({ error: "Failed to fetch new tasks" });
  }
};

const updateDailyTask = async (req: Request, res: Response) => {
  try {
    const operatorId = req.user?.id;
    const taskId = req.params.id;
    const { status } = req.body;

    if (!operatorId) {
      return res.status(401).json({ error: "Unauthorized: Operator ID not found" });
    }

    if (!Object.values(TaskStatus).includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const updatedTask = await prisma.dailyTaskInstance.update({
      where: { id: taskId },
      data: {
        status,
        operators: {
          connect: [{ id: operatorId }],
        },
      },
    });

    res.status(200).json({ success: true, task: updatedTask });
  } catch (error) {
    console.error("Error updating daily task:", error);
    res.status(500).json({ error: "Failed to update daily task" });
  }
};


const updateNewTask = async (req: Request, res: Response) => {
  try {
    const operatorId = req.user?.id;
    const taskId = req.params.id;
    const { status } = req.body;

    if (!operatorId) {
      return res.status(401).json({ error: "Unauthorized: Operator ID not found" });
    }

    if (!Object.values(TaskStatus).includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const updatedTask = await prisma.newTask.update({
      where: { id: taskId },
      data: {
        status,
        operators: {
          connect: [{ id: operatorId }],
        },
      },
    });

    res.status(200).json({ success: true, task: updatedTask });
  } catch (error) {
    console.error("Error updating new task:", error);
    res.status(500).json({ error: "Failed to update new task" });
  }
};

export { getTodayDailyTasksForOperator, getNewTasksForOperator, updateDailyTask ,updateNewTask};