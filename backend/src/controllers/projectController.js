const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getProjects = async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      where: { ownerId: req.user.userId },
      include: { tasks: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка получения проектов' });
  }
};

exports.createProject = async (req, res) => {
  const { title, description, priority } = req.body;
  try {
    const project = await prisma.project.create({
      data: { title, description, priority: priority || 'MEDIUM', ownerId: req.user.userId }
    });
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка создания проекта' });
  }
};

exports.deleteProject = async (req, res) => {
  const { projectId } = req.params;
  try {
    await prisma.project.delete({ where: { id: projectId } });
    res.json({ message: 'Проект удален' });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка удаления' });
  }
};