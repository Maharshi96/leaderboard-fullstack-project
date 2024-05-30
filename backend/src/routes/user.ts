import express from "express";
import { UserModel } from "../models/User";
import {Types} from 'mongoose';

const userRouter = express.Router();

/**
 * @route GET /user/:id
 * @param {string} id - User ID
 * @returns {User} - User object with experiencePoints field
 */
userRouter.get("/:id", async (req, res) => {
	const user = await UserModel.findById(req.params.id).select('+experiencePoints');
	if (!user) {
		return res.status(404).send({ message: "User not found" });
	}
	res.send(user);
});

/**
 * @route GET /user
 * @returns {Array} - Array of User objects
 * @note Adds the virtual field of totalExperience to the user.
 * @hint You might want to use a similar aggregate in your leaderboard code.
 */
userRouter.get("/", async (_, res) => {
	const users = await UserModel.aggregate([
		{
			$unwind: "$experiencePoints"
		},
		{
			$group: {
				_id: "$_id",
				email: { $first: "$email" },
				profilePicture: { $first: "$profilePicture" },
				totalExperience: { $sum: "$experiencePoints.points" }
			}
		}
	]);
	res.send(users);
});

/**
 * @route POST /user/:userId/join/:communityId
 * @param {string} userId - User ID
 * @param {string} communityId - Community ID
 * @description Joins a community
 */
userRouter.post("/:userId/join/:communityId", async (req, res) => {
	const { userId, communityId } = req.params;
	// TODO: Implement the functionality to join a community
	try {
		await UserModel.findByIdAndUpdate({ _id: userId }, { communityId: new Types.ObjectId(communityId) }, { new: true });
		return res.status(200).send();
	} catch (error) {
		console.log("error", error);
		res.status(500).json("Failed to join the community");
	}
});

/**
 * @route DELETE /user/:userId/leave/:communityId
 * @param {string} userId - User ID
 * @param {string} communityId - Community ID
 * @description leaves a community
 */
// userRouter.delete("/:userId/leave/:communityId", async (req, res) => {
userRouter.delete("/:userId/leave", async (req, res) => {
	// const { userId, communityId } = req.params;
	const { userId} = req.params;
	// TODO: Implement the functionality to leave a community
	// With the data model that was updated for implementing functionality for user stories
	// I do not need the communityId as I am setting the communityId in the user to null.
	try {
		await UserModel.findByIdAndUpdate({ _id: userId }, { communityId: null }, { new: true });
		return res.status(200).send();
	} catch (error) {
		console.log("error", error)
		res.status(500).json("Failed to leave the community");
	}
});

export {
    userRouter
}
