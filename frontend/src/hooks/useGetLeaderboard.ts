import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const useGetLeaderboard = () => {
    return useQuery({
        queryKey: ['leaderboardDetails'],
        staleTime: Infinity,
        retry: false,
        queryFn: async() => {
            try {
                const leaderboardData = await axios.get("http://localhost:8080/leaderboard");
                return leaderboardData.data;
            } catch (error: any) {
                throw new Error(error?.request?.response || "Failed to load leaderboard");
            }
           
        }
    })
}

export default useGetLeaderboard;