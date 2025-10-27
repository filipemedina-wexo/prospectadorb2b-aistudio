/* eslint-disable no-unused-vars */
export const notFoundHandler = (req, res, next) => {
  res.status(404).json({ message: 'Rota não encontrada.' });
};

export const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Erro interno do servidor.';
  const details = process.env.NODE_ENV === 'development' ? err.stack : undefined;

  res.status(status).json({
    message,
    ...(details ? { details } : {}),
  });
};
