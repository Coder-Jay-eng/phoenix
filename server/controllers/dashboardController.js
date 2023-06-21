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
					body: { $substr: ['$body', 0, 100] },
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

/*
Get
View Specific Note
*/

exports.dashboardViewNote = async (req, res) => {
	const note = await Note.findById({ _id: req.params.id })
		.where({
			user: req.user.id,
		})
		.lean();

	if (note) {
		res.render('dashboard/view-note', {
			noteID: req.params.id,
			note,
			layout: '../views/layouts/dashboard',
		});
	} else {
		res.send('Oooops! Something went wrong.');
	}
};
/*
PUT
Update Specific Note
*/

exports.dashboardUpdateNote = async (req, res) => {
	try {
		await Note.findOneAndUpdate(
			{
				_id: req.params.id,
			},
			{
				title: req.body.title,
				body: req.body.body,
			}
		).where({
			user: req.user.id,
		});
		res.redirect('/dashboard');
	} catch (error) {
		console.log(error);
	}
};
