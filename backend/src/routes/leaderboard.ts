import express from "express";
import { CommunityModel } from "../models/Community";

const leaderboardRouter = express.Router();

/**
 * @route GET /leaderboard
 * @note Adds a virtual field of numberOfUsers representing total number of user belonging to a particular community.
 * It also adds a virtual field of totalPoints which represents total points belonging to a particular community.
 * @returns {Community} - Community object with numberOfUsers and totalPoints fields
 */
leaderboardRouter.get("/", async(_, res) => {
    try {
        // Join user collection into community.
        // Adding the necessary fields: total points and number of users.
        // Return data fields that are needed
        // Sorting the data using total points so in frontend we can use index as rank.
        const leaderboardCommunities = await CommunityModel.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "communityId",
                    as: "users"
                }
            },
            {
                $addFields: {
                    numberOfUsers: {
                        $size: "$users"
                    },
                    totalPoints: {
                        $sum: {
                            $map: {
                                input: "$users",
                                as: "user",
                                in: {
                                    $sum: {
                                        $map: {
                                            input: "$$user.experiencePoints",
                                            as: "expPoints",
                                            in: {
                                                $ifNull: ["$$expPoints.points", 0]
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    logo: 1,
                    totalPoints: 1,
                    numberOfUsers: 1
                }
            },
            {
                $sort: {
                    totalPoints: -1
                }
            }
            
        ])
        return res.status(200).send(leaderboardCommunities);
    } catch (error:any) {
        console.log("error", error);
        res.status(500).json("Failed to fetch leaderboard");
    }
});

export {leaderboardRouter}