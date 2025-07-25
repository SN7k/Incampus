import { User, Post } from '../types';
import { ProfileData, ProfileResponse } from '../types/profile';
import { 
  mockUsers, 
  mockPosts, 
  mockNotifications, 
  mockFriendRequests, 
  mockProfiles,
  getUserById,
  getPostsByUserId,
  getFriendsByUserId,
  getFriendRequestsForUser,
  getProfileByUserId
} from './mockData';

// Helper to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock token service
export const tokenService = {
  getToken: () => localStorage.getItem('token'),
  setToken: (token: string) => localStorage.setItem('token', token),
  removeToken: () => localStorage.removeItem('token'),
};

// Mock Auth API
export const authApi = {
  signup: async (
    email: string, 
    password: string, 
    collegeId: string, 
    name: string, 
    role: 'student' | 'faculty'
  ) => {
    await delay(800);
    
    // Check if email already exists
    const existingUser = mockUsers.find(user => user.email === email);
    if (existingUser) {
      throw new Error('Email already registered');
    }
    
    // Create a new user (not actually stored in mockUsers)
    const newUser = {
      id: `user-${mockUsers.length + 1}`,
      name,
      universityId: collegeId,
      role,
      email,
      avatar: {
        url: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`,
      },
    };
    
    return {
      status: 'success',
      data: {
        user: newUser,
        token: 'mock-token-' + Date.now()
      }
    };
  },
  
  login: async (
    identifier: string,
    password: string,
    role: 'student' | 'faculty'
  ) => {
    await delay(1000);
    
    // Check if it's an email or universityId
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
    
    // Find user by email or universityId
    const user = mockUsers.find(u => 
      (isEmail && u.email === identifier) || 
      (!isEmail && u.universityId === identifier)
    );
    
    if (!user || user.role !== role) {
      // For mock implementation, always use the first user (Shombhunath Karan)
      // This ensures we always have a valid user for testing
      const defaultUser = mockUsers[0];
      
      return {
        status: 'success',
        data: {
          user: defaultUser,
          token: 'mock-token-' + Date.now()
        }
      };
    }
    
    return {
      status: 'success',
      data: {
        user,
        token: 'mock-token-' + Date.now()
      }
    };
  },
  
  verifyOTP: async (email: string, otp: string) => {
    await delay(800);
    
    // Simulate OTP verification (always succeeds with code "123456")
    if (otp !== '123456') {
      throw new Error('Invalid OTP');
    }
    
    // Find user by email
    const user = mockUsers.find(u => u.email === email) || mockUsers[0];
    
    return {
      status: 'success',
      data: {
        user,
        token: 'mock-token-' + Date.now()
      }
    };
  },
  
  resendOTP: async (/* eslint-disable-next-line @typescript-eslint/no-unused-vars */ _email: string) => {
    await delay(500);
    return {
      status: 'success',
      message: 'OTP sent successfully'
    };
  }
};

// Mock Users API
export const usersApi = {
  getCurrentUser: async () => {
    await delay(500);
    return mockUsers[0];
  },
  
  getUserById: async (userId: string) => {
    await delay(300);
    const user = getUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  },
  
  updateCurrentUser: async (userData: Partial<User>) => {
    await delay(800);
    
    // Simulate updating the current user
    const updatedUser = {
      ...mockUsers[0],
      ...userData
    };
    
    return updatedUser;
  },
  
  searchUsers: async (query: string) => {
    await delay(500);
    
    if (!query || query.trim() === '') {
      return [];
    }
    
    const lowercaseQuery = query.toLowerCase();
    return mockUsers.filter(user => 
      user.name.toLowerCase().includes(lowercaseQuery) ||
      user.universityId.toLowerCase().includes(lowercaseQuery) ||
      (user.email && user.email.toLowerCase().includes(lowercaseQuery))
    );
  },
  
  getSuggestedUsers: async () => {
    await delay(700);
    
    // Return all users except the current user (user-1)
    return mockUsers.filter(user => user.id !== 'user-1');
  }
};

// Mock Posts API
export const postsApi = {
  getPosts: async (page = 1, limit = 10) => {
    await delay(1000);
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPosts = mockPosts.slice(startIndex, endIndex);
    
    return {
      posts: paginatedPosts,
      hasMore: endIndex < mockPosts.length
    };
  },
  
  // Add getFeedPosts function for the feed page
  getFeedPosts: async () => {
    await delay(800);
    
    // Return all posts for the feed (in a real app, this would filter by friends)
    return mockPosts;
  },
  
  getPostById: async (postId: string) => {
    await delay(300);
    
    const post = mockPosts.find(p => p.id === postId);
    if (!post) {
      throw new Error('Post not found');
    }
    
    return post;
  },
  
  createPost: async (postData: { content: string; images?: File[] | null; visibility?: string }, onProgress?: (progress: number) => void) => {
    await delay(1500);
    
    // Simulate upload progress
    if (onProgress) {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        onProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
        }
      }, 300);
    }
    
    // Create a new post (not actually stored in mockPosts)
    const newPost: Post = {
      id: `post-${mockPosts.length + 1}`,
      userId: 'user-1', // Current user
      user: mockUsers[0],
      content: postData.content,
      likes: [],
      createdAt: new Date()
    };
    
    if (postData.images && postData.images.length > 0) {
      // Simulate image URLs
      newPost.images = postData.images.map((_, index) => ({
        type: 'image',
        url: `https://picsum.photos/800/600?random=${Date.now() + index}`,
        publicId: `upload-${Date.now()}-${index}`
      }));
    }
    
    return newPost;
  },
  
  likePost: async (postId: string) => {
    await delay(300);
    
    const post = mockPosts.find(p => p.id === postId);
    if (!post) {
      throw new Error('Post not found');
    }
    
    // Check if user already liked the post
    const alreadyLiked = post.likes.some(user => user.id === 'user-1');
    
    if (!alreadyLiked) {
      // Add current user to likes
      post.likes.push(mockUsers[0]);
    }
    
    return post;
  },
  
  unlikePost: async (postId: string) => {
    await delay(300);
    
    const post = mockPosts.find(p => p.id === postId);
    if (!post) {
      throw new Error('Post not found');
    }
    
    // Remove current user from likes
    post.likes = post.likes.filter(user => user.id !== 'user-1');
    
    return post;
  },
  
  getUserPosts: async (userId: string) => {
    await delay(800);
    
    const userPosts = getPostsByUserId(userId);
    
    // Return just the posts array as expected by the Profile component
    return userPosts;
  }
};

// Mock Friends API
export const friendsApi = {
  getFriends: async (userId?: string) => {
    await delay(700);
    
    const targetUserId = userId || 'user-1'; // Default to current user
    return getFriendsByUserId(targetUserId);
  },
  
  // Add getUserFriends method that's being called by the Profile component
  getUserFriends: async (userId: string) => {
    await delay(700);
    
    return getFriendsByUserId(userId);
  },
  
  getFriendRequests: async () => {
    await delay(500);
    
    return getFriendRequestsForUser('user-1');
  },
  
  // Add getSentRequests method that's being called by the Profile component
  getSentRequests: async () => {
    await delay(500);
    
    // Return sent friend requests (where current user is the sender)
    return mockFriendRequests.filter(req => req.sender.id === 'user-1');
  },
  
  sendFriendRequest: async (userId: string) => {
    await delay(600);
    
    const targetUser = getUserById(userId);
    if (!targetUser) {
      throw new Error('User not found');
    }
    
    // Create a new friend request (not actually stored)
    return {
      id: `req-${Date.now()}`,
      sender: mockUsers[0],
      recipient: targetUser,
      status: 'pending',
      createdAt: new Date()
    };
  },
  
  acceptFriendRequest: async (requestId: string) => {
    await delay(600);
    
    const request = mockFriendRequests.find(req => req.id === requestId);
    if (!request) {
      throw new Error('Friend request not found');
    }
    
    // Update request status (not actually stored)
    request.status = 'accepted';
    
    return request;
  },
  
  rejectFriendRequest: async (requestId: string) => {
    await delay(500);
    
    const request = mockFriendRequests.find(req => req.id === requestId);
    if (!request) {
      throw new Error('Friend request not found');
    }
    
    // Update request status (not actually stored)
    request.status = 'rejected';
    
    return request;
  },
  
  removeFriend: async (userId: string) => {
    await delay(700);
    
    const user = getUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    // Simulate removing friend (not actually stored)
    return { success: true };
  }
};

// Mock Profile API
export const profileApi = {
  getProfile: async (userId: string): Promise<ProfileResponse> => {
    await delay(800);
    
    const profile = getProfileByUserId(userId);
    if (!profile) {
      throw new Error('Profile not found');
    }
    
    return {
      status: 'success',
      data: {
        profile
      }
    };
  },
  
  // Add getUserProfile method that's being called by the Profile component
  getUserProfile: async (userId: string): Promise<ProfileData> => {
    await delay(800);
    
    const profile = getProfileByUserId(userId);
    if (!profile) {
      throw new Error('Profile not found');
    }
    
    return profile;
  },
  
  updateProfile: async (profileData: Partial<ProfileData>): Promise<ProfileData> => {
    await delay(1000);
    
    // Simulate updating profile
    const currentProfile = mockProfiles['user-1'];
    if (!currentProfile) {
      throw new Error('Profile not found');
    }
    
    const updatedProfile = {
      ...currentProfile,
      ...profileData
    };
    
    return updatedProfile;
  },
  
  setupProfile: async (profileData: Partial<User>): Promise<User> => {
    await delay(1200);
    
    // Simulate setting up profile
    const updatedUser = {
      ...mockUsers[0],
      ...profileData
    };
    
    return updatedUser;
  }
};

// Mock Notifications API
export const notificationsApi = {
  getNotifications: async () => {
    await delay(700);
    
    return mockNotifications;
  },
  
  markAsRead: async (notificationId: string) => {
    await delay(300);
    
    const notification = mockNotifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
    }
    
    return { success: true };
  },
  
  markAllAsRead: async () => {
    await delay(500);
    
    mockNotifications.forEach(notification => {
      notification.read = true;
    });
    
    return { success: true };
  },
  
  deleteNotification: async (notificationId: string) => {
    await delay(300);
    
    // In a real implementation, we would remove the notification from the array
    // Here we just pretend it was deleted
    console.log(`Mock: Deleted notification ${notificationId}`);
    
    return { success: true };
  }
};

// Mock Socket Service
export const initializeSocket = () => {
  console.log('Mock socket initialized');
  return {
    on: (event: string, /* eslint-disable-next-line @typescript-eslint/no-unused-vars */ callback: (data: unknown) => void) => {
      console.log(`Mock socket registered event listener for: ${event}`);
    },
    emit: (event: string, data: unknown) => {
      console.log(`Mock socket emitted event: ${event}`, data);
    },
    disconnect: () => {
      console.log('Mock socket disconnected');
    }
  };
};

export const disconnectSocket = () => {
  console.log('Mock socket disconnected');
};

export const testConnection = () => {
  console.log('Mock socket connection test');
};

export const isSocketReady = () => {
  // Mock implementation always returns true
  console.log('Mock socket is ready');
  return true;
};

// Type definitions for socket event callbacks
type FriendRequestData = {
  fromUser: {
    id: string;
    name: string;
    avatar: unknown;
  };
};

type PostInteractionData = {
  fromUser: {
    id: string;
    name: string;
    avatar: unknown;
  };
  postId: string;
};

export const socketEvents = {
  subscribeToNotifications: () => {
    console.log('Mock socket subscribed to notifications');
  },
  subscribeToFriendRequests: () => {
    console.log('Mock socket subscribed to friend requests');
  },
  unsubscribeFromNotifications: () => {
    console.log('Mock socket unsubscribed from notifications');
  },
  unsubscribeFromFriendRequests: () => {
    console.log('Mock socket unsubscribed from friend requests');
  },
  // Add missing event handlers
  onFriendRequest: (callback: (data: FriendRequestData) => void) => {
    console.log('Mock socket registered onFriendRequest handler');
    // Simulate a friend request after a delay (for testing)
    setTimeout(() => {
      callback({
        fromUser: {
          id: mockUsers[3].id,
          name: mockUsers[3].name,
          avatar: mockUsers[3].avatar
        }
      });
    }, 5000);
  },
  onFriendAccept: (callback: (data: FriendRequestData) => void) => {
    console.log('Mock socket registered onFriendAccept handler');
    // Simulate a friend accept after a delay (for testing)
    setTimeout(() => {
      callback({
        fromUser: {
          id: mockUsers[1].id,
          name: mockUsers[1].name,
          avatar: mockUsers[1].avatar
        }
      });
    }, 8000);
  },
  onPostLike: (callback: (data: PostInteractionData) => void) => {
    console.log('Mock socket registered onPostLike handler');
    // Simulate a post like after a delay (for testing)
    setTimeout(() => {
      callback({
        fromUser: {
          id: mockUsers[2].id,
          name: mockUsers[2].name,
          avatar: mockUsers[2].avatar
        },
        postId: 'post-1'
      });
    }, 10000);
  },
  onPostComment: (callback: (data: PostInteractionData) => void) => {
    console.log('Mock socket registered onPostComment handler');
    // Simulate a post comment after a delay (for testing)
    setTimeout(() => {
      callback({
        fromUser: {
          id: mockUsers[4].id,
          name: mockUsers[4].name,
          avatar: mockUsers[4].avatar
        },
        postId: 'post-1'
      });
    }, 12000);
  },
  testConnection: () => {
    console.log('Mock socket connection test');
    return true;
  }
};

// Mock API health check
export const apiHealthCheck = async () => {
  await delay(300);
  return { status: 'ok' };
};

// Default export for API
export default {
  get: async (url: string) => {
    await delay(500);
    
    if (url.includes('/users')) {
      return { data: mockUsers };
    }
    
    if (url.includes('/posts')) {
      return { data: mockPosts };
    }
    
    if (url.includes('/notifications')) {
      return { data: mockNotifications };
    }
    
    return { data: {} };
  },
  
  post: async (/* eslint-disable-next-line @typescript-eslint/no-unused-vars */ _url: string, /* eslint-disable-next-line @typescript-eslint/no-unused-vars */ _data: unknown) => {
    await delay(700);
    return { data: { success: true } };
  },
  
  put: async (/* eslint-disable-next-line @typescript-eslint/no-unused-vars */ _url: string, /* eslint-disable-next-line @typescript-eslint/no-unused-vars */ _data: unknown) => {
    await delay(600);
    return { data: { success: true } };
  },
  
  delete: async (/* eslint-disable-next-line @typescript-eslint/no-unused-vars */ _url: string) => {
    await delay(500);
    return { data: { success: true } };
  }
}; 