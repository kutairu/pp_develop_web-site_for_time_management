const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);

const auth = require('../middleware/auth');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


// маршрут для получения данных текущего пользователя
router.get('/me', auth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ 
      where: { id: req.user.userId },
      select: { name: true, email: true, role: true }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// маршрут для обновления данных профиля
router.put('/me', auth, async (req, res) => {
  const { name, email } = req.body;
  try {
    const updatedUser = await prisma.user.update({
      where: { id: req.user.userId },
      data: { name, email }
    });
    res.json({ message: 'Профиль обновлен', user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка обновления профиля' });
  }
});

module.exports = router;


