const db = require("../models/models");

async function createUserWithAdminPrivileges(userData) {
	try {
		return await db.User.create(userData);
	} catch (error) {
		console.error("Error creating user with admin privileges:", error);
		throw error;
	}
}

async function updateUserToAdmin(userId) {
	try {
		const user = await db.User.findByPk(userId);
		if (user) {
			user.isAdmin = true;
			await user.save();
		} else {
			throw new Error("User not found");
		}
	} catch (error) {
		console.error("Error updating user to admin:", error);
		throw error;
	}
}
async function demoteUserFromAdmin(userId) {
	try {
		const user = await db.User.findByPk(userId);
		if (user) {
			user.isAdmin = false;
			await user.save();
		} else {
			throw new Error("User not found");
		}
	} catch (error) {
		console.error("Error demoting user:", error);
		throw error;
	}
}


async function getAllUsers() {
	try {
		return await db.User.findAll();
	} catch (error) {
		console.error("Error fetching all users:", error);
		throw error;
	}
}

module.exports = {
	createUserWithAdminPrivileges,
	updateUserToAdmin,
	getAllUsers,
	demoteUserFromAdmin
};