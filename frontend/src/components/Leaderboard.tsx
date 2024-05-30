import { FC } from 'react';
import { LeaderboardCommunity } from "../interfaces";
import LeaderboardRow from './LeaderboardRow';

interface Props {
    leaderboardData: LeaderboardCommunity[]
}

const Leaderboard : FC<Props> = ({ leaderboardData } : Props) => {
    return (
        <div className="pt-4 flex flex-col items-center justtify-center">
            <p className="font-bold text-xl">Top Community Leaderboard</p>
            <table className="mt-4">
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th className="w-48">Community name</th>
                        <th className="w-44">Total users</th>
                        <th>Total Points</th>
                    </tr>
                </thead>
                <tbody>
                    {   // Since the leaderboard data is sorted on the backend, we can safely use index as rank.
                        leaderboardData.map((community, index) => (
                            <LeaderboardRow leaderboardRow={community} rank={index+1} key={community._id}/>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}

export default Leaderboard;
