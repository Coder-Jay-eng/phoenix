const Note = require('../models/Notes');
const mongoose = require('mongoose');

// Get Dashboard

exports.dashboard = async (req, res) => {
	const locals = {
		title: 'Dashboard',
		description: 'Free NodeJs Notes App',
	};

	res.render('dashboard/index', {
		locals,
		layout: '../views/layouts/dashboard',
	});
};
