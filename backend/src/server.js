import 'dotenv/config';
import process from 'node:process';
import app from './app.js';
import { sequelize } from './models/index.js';

const PORT = process.env.PORT || 4000;
const SYNC_STRATEGY = process.env.DB_SYNC ?? 'alter';

const start = async () => {
  try {
    await sequelize.authenticate();

    if (SYNC_STRATEGY === 'alter') {
      await sequelize.sync({ alter: true });
    } else if (SYNC_STRATEGY === 'force') {
      await sequelize.sync({ force: true });
    } else {
      await sequelize.sync();
    }

    app.listen(PORT, () => {
      console.log(`Servidor iniciado na porta ${PORT}`);
    });
  } catch (error) {
    console.error('Erro ao iniciar o servidor:', error);
    process.exit(1);
  }
};

start();
