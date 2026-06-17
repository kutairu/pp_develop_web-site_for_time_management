const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getStats = async (req, res) => {
  try {
    const userId = req.user.userId;
    const projectCount = await prisma.project.count({ where: { ownerId: userId } });
    const allTasks = await prisma.task.count({ where: { project: { ownerId: userId } } });
    const completedTasks = await prisma.task.count({ where: { project: { ownerId: userId }, status: 'DONE' } });
    const inWorkTasks = await prisma.task.count({ where: { project: { ownerId: userId }, status: 'IN_PROGRESS' } });

    const recentTasks = await prisma.task.findMany({
      where: { project: { ownerId: userId } },
      take: 5,
      orderBy: { updatedAt: 'desc' },
      include: { project: { select: { title: true } } }
    });

    res.json({ projectCount, allTasks, completedTasks, inWorkTasks, recentTasks });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка получения статистики' });
  }
};