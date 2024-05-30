import { FC } from 'react';
import { LeaderboardCommunity } from '../interfaces';

interface Props {
    leaderboardRow: LeaderboardCommunity;
    rank: number;
}

const LeaderboardRow : FC<Props> = ({ leaderboardRow, rank }: Props) => {
    return (
        <tr className="odd:bg-white even:bg-slate-100 font-semibold">
            <td className="p-3">{rank}</td>
            <td className="flex justify-center items-center p-3">
                <img src={leaderboardRow.logo} alt="logo" className="w-12 rounded-full objet-contain mr-4"/>
                {leaderboardRow.name}
            </td>
            <td className="p-3">{leaderboardRow.numberOfUsers}</td>
            <td className="p-3">{leaderboardRow.totalPoints}</td>
        </tr>
    )
}

export default LeaderboardRow;