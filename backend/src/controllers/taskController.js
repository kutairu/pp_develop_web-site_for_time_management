const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getTasks = async (req, res) => {
  const { projectId } = req.params;
  try {
    const tasks = await prisma.task.findMany({
      where: { projectId },
      include: { assignee: { select: { name: true } } }
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка получения задач' });
  }
};

exports.createTask = async (req, res) => {
  const { projectId } = req.params;
  const { title, description } = req.body;
  try {
    const task = await prisma.task.create({
      data: { title, description, projectId }
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка создания задачи' });
  }
};

exports.updateTaskStatus = async (req, res) => {
  const { taskId } = req.params;
  const { status } = req.body;
  try {
    const task = await prisma.task.update({
      where: { id: taskId },
      data: { status }
    });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка обновления' });
  }
};

exports.deleteTask = async (req, res) => {
  const { taskId } = req.params;
  try {
    await prisma.task.delete({ where: { id: taskId } });
    res.json({ message: 'Задача удалена' });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка удаления' });
  }
};