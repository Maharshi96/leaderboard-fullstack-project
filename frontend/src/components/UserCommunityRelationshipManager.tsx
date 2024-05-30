import { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { Community, User } from '../interfaces';
import "./UserCommunityRelationshipManager.css";
import { toast } from 'react-hot-toast';
import useGetLeaderboard from '../hooks/useGetLeaderboard';
import Leaderboard from './Leaderboard';

interface MutationData {
    userId: string;
    communityId: string;
};

const UserCommunityRelationshipManager = () => {
    const [selectedUser, setSelectedUser] = useState<string | null>(null);
    const [selectedCommunity, setSelectedCommunity] = useState<string | null>(null);

    // Fetching leaderboard data.
    const {data: leaderboardData, isLoading: leaderboardLoding, error: error, refetch: refetch} = useGetLeaderboard();

    useEffect(()=>{
        if(error && !leaderboardLoding){
            toast.error(`Error: ${error.message}`);
        }
    },[error, leaderboardLoding])

    const { data: users, isLoading: usersLoading } = useQuery({
        queryKey: ['users'],
        queryFn: () => axios.get('http://localhost:8080/user').then(res => res.data)
    });

    const { data: communities, isLoading: communitiesLoading } = useQuery({
        queryKey: ['communities'],
        queryFn: () => axios.get('http://localhost:8080/community').then(res => res.data)
    });

    const joinMutation = useMutation({
        mutationFn: (data: MutationData) => axios.post(`http://localhost:8080/user/${data.userId}/join/${data.communityId}`),
        onSuccess: () => {
            // Refetch leaderboard data when a user successfully joins a community.
            refetch();
            toast.success('Successfully joined the community');
        },
        onError: (error: any) => {
            toast.error(error?.request?.response || "Failed to join the community");
        }
    });
    const leaveMutation = useMutation({
        // mutationFn: (data: MutationData) => axios.delete(`http://localhost:8080/user/${data.userId}/leave/${data.communityId}`),
        mutationFn: (data: MutationData) => axios.delete(`http://localhost:8080/user/${data.userId}/leave/`),
        onSuccess: () => {
             // Refetch leaderboard data when a user successfully leaves a community.
            refetch();
            toast.success('Successfully left the community');
        },
        onError: (error: any) => {
            toast.error(error?.request?.response || "Failed to leave the community");
        }
    });

    const handleJoinClick = () => {
        if (selectedUser && selectedCommunity) {
            joinMutation.mutate({ userId: selectedUser, communityId: selectedCommunity });
        }
    };

    const handleLeaveClick = () => {
        if (selectedUser) {
            // leaveMutation.mutate({ userId: selectedUser, communityId: selectedCommunity });
            leaveMutation.mutate({ userId: selectedUser});
        }
    };

    if (usersLoading || communitiesLoading || leaderboardLoding) return 'Loading...';

    return (
        <>
            <div>
                <label>
                    User: &nbsp;
                    <select onChange={(e) => setSelectedUser(e.target.value)}>
                        <option value="">Select User</option>
                        {users.map((user: User) => <option key={user._id} value={user._id}>{user.email}</option>)}
                    </select>
                </label>

                <label>
                    Community: &nbsp;
                    <select onChange={(e) => setSelectedCommunity(e.target.value)}>
                        <option value="">Select Community</option>
                        {communities.map((community: Community) => <option key={community._id} value={community._id}>{community.name}</option>)}
                    </select>
                </label>


                <button
                    className="join-button"
                    onClick={handleJoinClick}
                    disabled={!selectedUser || !selectedCommunity}
                >
                    Join
                </button>

                <button
                    className="leave-button"
                    onClick={handleLeaveClick}
                    disabled={!selectedUser}
                >
                    Leave
                </button>
            </div>
            {leaderboardData && (
                <Leaderboard leaderboardData={leaderboardData}/>
            )}
        </>
    );
};

export default UserCommunityRelationshipManager;