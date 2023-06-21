const { ObjectId } = require('mongodb');
const Note = require('../models/Notes');
const mongoose = require('mongoose');
// const adapter = require('custom-elements-es5-adapter');

// Get Dashboard

exports.dashboard = async (req, res) => {
	let perPage = 4;
	let page = req.query.page || 1;

	const locals = {
		title: 'Dashboard',
		description: 'Free NodeJs Notes App',
	};

	try {
		const notes = await Note.aggregate([
			{
				$sort: {
					updatedAt: -1,
				},
			},
			{ $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
			{
				$project: {
					title: { $substr: ['$title', 0, 30] },
					body: { $substr: ['$body', 0, 50] },
				},
			},
		])
			.skip(perPage * page - perPage)
			.limit(perPage)
			.exec();
		const count = await Note.count();

		res.render('dashboard/index', {
			userName: req.user.firstName,
			locals,
			notes,
			layout: '../views/layouts/dashboard',
			current: page,
			pages: Math.ceil(count / perPage),
		});
	} catch (error) {
		console.log(error);
	}
};
