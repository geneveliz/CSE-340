
const express = require('express');
const router = express.Router();
const checkAdmin = require('../middleware/checkAdmin'); 

router.get('/admin-dashboard', checkAdmin, (req, res) => {
  res.render('admin/dashboard', { title: 'Admin Dashboard' });
});

module.exports = router;
