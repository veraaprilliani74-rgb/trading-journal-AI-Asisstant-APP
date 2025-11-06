import React, { useState, useMemo } from 'react';
// Fix: Use namespace import for react-router-dom to handle potential module resolution issues.
import * as ReactRouterDOM from 'react-router-dom';
import { CommunityMember, CommunityPost, TradingGroup, Comment } from '../types';
import { mockCommunityData, mockCommunityFeed, mockTradingGroups, mockAiSignals } from '../data/mockData';
import { LikeIcon, CommentIcon, UsersIcon, CurrencyEur, GoldIcon, BtcIcon, AnalyticsIcon, SparklesIcon, TelegramIcon, SendIcon } from '../components/Icons';
import { useCurrency } from '../contexts/CurrencyContext';
import { useUser } from '../contexts/UserContext';
import AiSignalCard from '../components/AiSignalCard';

const CommunityMemberCard: React.FC<{ 
    member: CommunityMember; 
    isSelf: boolean;
    isFollowed: boolean;
    onFollow: (id: string) => void;
    onUnfollow: (id: string) => void;
}> = ({ member, isSelf, isFollowed, onFollow, onUnfollow }) => {
    const { convert } = useCurrency();
    const performanceValue = parseFloat(member.performance.replace(/[+$,]/g, ''));
    const convertedPerformance = convert(performanceValue);

    const handleFollowClick = () => {
        if (isFollowed) {
            onUnfollow(member.id);
        } else {
            onFollow(member.id);
        }
    }

    return (
        <div className={`p-4 rounded-xl flex items-center space-x-4 ${isSelf ? 'bg-blue-900/50 border border-blue-500' : 'bg-gray-800'}`}>
            <div className="flex items-center space-x-4 flex-1">
                <span className="text-lg font-bold text-gray-400">#{member.rank}</span>
                <img src={member.avatar} alt={member.name} className="w-12 h-12 rounded-full" />
                <div>
                    <div className="flex items-center space-x-2">
                        <p className="font-bold">{member.name}</p>
                        {member.isPro && <span className="text-xs bg-yellow-500 text-black font-bold px-1.5 py-0.5 rounded-md">PRO</span>}
                    </div>
                    <p className="text-sm font-semibold text-green-400">{performanceValue >= 0 ? '+' : ''}{convertedPerformance.symbol}{convertedPerformance.formatted}</p>
                    <p className="text-xs text-gray-400">{member.winRate} {member.streak && `• ${member.streak} day streak 🔥`}</p>
                </div>
            </div>
            {!isSelf && (
                 <button 
                    onClick={handleFollowClick}
                    className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-colors ${
                        isFollowed ? 'bg-green-600 text-white' : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                >
                    {isFollowed ? 'Following' : 'Follow'}
                </button>
            )}
        </div>
    );
};

const PostCard: React.FC<{ post: CommunityPost }> = ({ post }) => {
    const { user } = useUser();
    const [isCommentsOpen, setIsCommentsOpen] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [comments, setComments] = useState<Comment[]>(post.commentList || []);

    const handleAddComment = () => {
        if (!commentText.trim()) return;

        const newComment: Comment = {
            id: `c-${Date.now()}`,
            authorName: user.name,
            authorAvatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', // Default avatar for current user
            timestamp: 'Just now',
            text: commentText.trim(),
        };

        setComments(prev => [...prev, newComment]);
        setCommentText('');
    };

    return (
        <div className="bg-gray-800 p-4 rounded-xl space-y-3 animate-fade-in">
            <div className="flex items-center space-x-3">
                <img src={post.authorAvatar} alt={post.authorName} className="w-10 h-10 rounded-full" />
                <div>
                    <p className="font-bold">{post.authorName}</p>
                    <p className="text-xs text-gray-400">{post.timestamp}</p>
                </div>
            </div>
            <p className="text-sm text-gray-300 whitespace-pre-wrap">{post.content}</p>
            {post.chartImage && <img src={post.chartImage} alt="Chart analysis" className="rounded-lg border border-gray-700" />}
            <div className="flex items-center space-x-6 text-gray-400 pt-2 border-t border-gray-700">
                <button className="flex items-center space-x-2 hover:text-white">
                    <LikeIcon className="w-4 h-4" />
                    <span className="text-xs">{post.likes}</span>
                </button>
                <button onClick={() => setIsCommentsOpen(!isCommentsOpen)} className="flex items-center space-x-2 hover:text-white">
                    <CommentIcon className="w-4 h-4" />
                    <span className="text-xs">{comments.length}</span>
                </button>
            </div>
            {isCommentsOpen && (
                <div className="pt-3 mt-3 border-t border-gray-700 space-y-4 animate-fade-in">
                    {comments.length > 0 && (
                        <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                            {comments.map(comment => (
                                <div key={comment.id} className="flex items-start space-x-2">
                                    <img src={comment.authorAvatar} alt={comment.authorName} className="w-8 h-8 rounded-full" />
                                    <div className="bg-gray-700 p-2 rounded-lg flex-1">
                                        <div className="flex items-baseline space-x-2">
                                            <p className="font-bold text-sm">{comment.authorName}</p>
                                            <p className="text-xs text-gray-400">{comment.timestamp}</p>
                                        </div>
                                        <p className="text-sm text-gray-300 mt-1 whitespace-pre-wrap">{comment.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="flex items-center space-x-2">
                        <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt={user.name} className="w-8 h-8 rounded-full" />
                        <div className="flex-1 flex items-center bg-gray-700 rounded-full">
                            <input
                                type="text"
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                                placeholder="Write a comment..."
                                className="w-full bg-transparent px-4 py-2 text-white placeholder-gray-400 focus:outline-none"
                            />
                            <button onClick={handleAddComment} className="p-2 mr-1 rounded-full bg-green-600 hover:bg-green-700 disabled:bg-gray-500" disabled={!commentText.trim()}>
                                <SendIcon className="w-5 h-5 text-white" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const groupIconMap: { [key: string]: React.FC<any> } = {
    Forex: CurrencyEur,
    Commodities: GoldIcon,
    Crypto: BtcIcon,
    Strategy: AnalyticsIcon,
};
const GroupCard: React.FC<{ group: TradingGroup }> = ({ group }) => {
    const { user } = useUser();
    const navigate = ReactRouterDOM.useNavigate();
    const isPremium = user.accountType === 'Premium';
    const canJoin = !group.isExclusive || isPremium;

    const IconComponent = groupIconMap[group.category] || SparklesIcon;

    const handleJoinClick = () => {
        if (!canJoin) {
            navigate('/subscription');
        }
    };
    
    return (
        <div className="bg-gray-800 p-4 rounded-xl flex items-center space-x-4 animate-fade-in relative">
             {group.isExclusive && <span className="absolute top-2 right-2 text-xs bg-purple-500 text-white font-bold px-1.5 py-0.5 rounded-md">PREMIUM</span>}
            <div className="p-3 bg-gray-700 rounded-full">
                <IconComponent className="w-6 h-6 text-green-400" />
            </div>
            <div className="flex-1">
                <p className="font-bold">{group.name}</p>
                <div className="flex items-center space-x-2 text-xs text-gray-400 mt-1">
                    <UsersIcon className="w-3 h-3" />
                    <span>{group.membersCount.toLocaleString()} members</span>
                </div>
            </div>
            {canJoin ? (
                 <a 
                    href={group.telegramLink}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm px-4 py-1.5 rounded-full font-semibold transition-colors bg-blue-600 hover:bg-blue-700 flex items-center space-x-2"
                >
                    <TelegramIcon className="w-4 h-4"/>
                    <span>Join</span>
                </a>
            ) : (
                <button 
                    onClick={handleJoinClick}
                    className="text-sm px-4 py-1.5 rounded-full font-semibold transition-colors bg-purple-600 hover:bg-purple-700"
                >
                    Upgrade
                </button>
            )}
        </div>
    );
};


const Community: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Leaders');
  const { user, trades, followedTraders, followTrader, unfollowTrader } = useUser();
  const { convert } = useCurrency();
  const communityPnlValue = 2500000;
  const convertedCommunityPnl = convert(communityPnlValue);
  
  const dynamicCommunityData = useMemo(() => {
    const closedTrades = trades.filter(t => t.status === 'closed');
    const winningTrades = closedTrades.filter(t => t.pnl && t.pnl > 0).length;
    const totalClosedTrades = closedTrades.length;
    const winRate = totalClosedTrades > 0 ? (winningTrades / totalClosedTrades) * 100 : 0;

    const data = [...mockCommunityData];
    // Find and update the user's card using its rank as a stable identifier
    const userIndex = data.findIndex(m => m.id === 'user-self');
    if (userIndex !== -1) {
        data[userIndex] = {
            ...data[userIndex],
            name: user.name,
            performance: `+$${user.totalPL.toFixed(2)}`,
            winRate: `${winRate.toFixed(1)}% win rate`
        };
    }
    return data;
  }, [user, trades]);

  const followedTraderNames = useMemo(() => {
    const followedIds = new Set(followedTraders);
    return new Set(mockCommunityData.filter(m => followedIds.has(m.id)).map(m => m.name));
  }, [followedTraders, mockCommunityData]);

  const signalsFromFollowed = useMemo(() => {
    return mockAiSignals.filter(signal => signal.authorName && followedTraderNames.has(signal.authorName));
  }, [followedTraderNames, mockAiSignals]);

  const feedFromFollowed = useMemo(() => {
    return mockCommunityFeed.filter(post => followedTraderNames.has(post.authorName));
  }, [followedTraderNames, mockCommunityFeed]);


  return (
    <div className="p-4 space-y-6">
        <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-gray-800 rounded-xl p-3">
              <p className="text-gray-400 text-xs">Total Traders</p>
              <p className="text-lg font-semibold mt-1">12,847</p>
            </div>
            <div className="bg-gray-800 rounded-xl p-3">
              <p className="text-gray-400 text-xs">Community P&L</p>
              <p className="text-lg font-semibold mt-1 text-green-400">+{convertedCommunityPnl.symbol}{convertedCommunityPnl.formatted}</p>
            </div>
            <div className="bg-gray-800 rounded-xl p-3">
              <p className="text-gray-400 text-xs">Avg Win Rate</p>
              <p className="text-lg font-semibold mt-1 text-green-400">72.4%</p>
            </div>
        </div>

        <div className="flex justify-around bg-gray-800 p-1 rounded-lg text-sm">
            <button onClick={() => setActiveTab('Leaders')} className={`flex-1 px-3 py-1 rounded-md transition-colors ${activeTab === 'Leaders' ? 'bg-gray-700 font-semibold' : 'text-gray-400'}`}>Leaders</button>
            <button onClick={() => setActiveTab('Signals')} className={`flex-1 px-3 py-1 rounded-md transition-colors ${activeTab === 'Signals' ? 'bg-gray-700 font-semibold' : 'text-gray-400'}`}>Signals</button>
            <button onClick={() => setActiveTab('Feed')} className={`flex-1 px-3 py-1 rounded-md transition-colors ${activeTab === 'Feed' ? 'bg-gray-700 font-semibold' : 'text-gray-400'}`}>Feed</button>
            <button onClick={() => setActiveTab('Groups')} className={`flex-1 px-3 py-1 rounded-md transition-colors ${activeTab === 'Groups' ? 'bg-gray-700 font-semibold' : 'text-gray-400'}`}>Groups</button>
        </div>

        <input type="text" placeholder="Search..." className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
      
        <div className="space-y-3">
            {activeTab === 'Leaders' && dynamicCommunityData.map(member => (
                <CommunityMemberCard 
                    key={member.id} 
                    member={member} 
                    isSelf={member.id === 'user-self'} 
                    isFollowed={followedTraders.includes(member.id)}
                    onFollow={followTrader}
                    onUnfollow={unfollowTrader}
                />
            ))}
            {activeTab === 'Signals' && (
                signalsFromFollowed.length > 0 ? (
                    signalsFromFollowed.map(signal => (
                        <AiSignalCard key={`${signal.pair}-${signal.timestamp}`} signal={signal} />
                    ))
                ) : (
                    <div className="text-center py-10 text-gray-500 bg-gray-800 rounded-lg">
                        <p>Your signal feed is empty.</p>
                        <p className="text-sm mt-1">Follow traders from the 'Leaders' tab to get their signals here.</p>
                    </div>
                )
            )}
            {activeTab === 'Feed' && (
                feedFromFollowed.length > 0 ? (
                    feedFromFollowed.map(post => <PostCard key={post.id} post={post} />)
                ) : (
                    <div className="text-center py-10 text-gray-500 bg-gray-800 rounded-lg">
                        <p>Your feed is empty.</p>
                        <p className="text-sm mt-1">Follow traders from the 'Leaders' tab to see their posts here.</p>
                    </div>
                )
            )}
            {activeTab === 'Groups' && mockTradingGroups.map(group => (
                 <GroupCard key={group.id} group={group} />
            ))}
        </div>
    </div>
  );
};

export default Community;