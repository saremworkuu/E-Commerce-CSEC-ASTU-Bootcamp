function getHealth(req, res) {
  res.json({
    success: true,
    message: 'API health check passed',
    status: 'ok',
  });
}

module.exports = { getHealth };
