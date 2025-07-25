import { User, Post, Image } from '../types';
import { ProfileData } from '../types/profile';

// Mock Users
export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'Shombhunath Karan',
    universityId: 'STU001',
    role: 'student',
    avatar: {
      url: 'https://avatar.iran.liara.run/public/17',
      publicId: 'avatar-1'
    },
    bio: 'BCA student passionate about Full Stack development',
    coverPhoto: {
      url: 'https://images.unsplash.com/photo-1517842645767-c639042777db?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      publicId: 'cover-1'
    },
    email: 'snk@university.edu',
    course: 'BCA',
    batch: '2023'
  },
  {
    id: 'user-2',
    name: 'Soumyajit Ghosh',
    universityId: 'STU002',
    role: 'student',
    avatar: {
      url: 'https://avatar.iran.liara.run/public/21',
      publicId: 'avatar-2'
    },
    bio: 'BCA student passionate about web development',
    coverPhoto: {
      url: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      publicId: 'cover-2'
    },
    email: 'sg@university.edu',
    course: 'BCA',
    batch: '2022'
  },
  {
    id: 'user-3',
    name: 'Prof. Sourav Saha',
    universityId: 'FAC001',
    role: 'faculty',
    avatar: {
      url: 'https://avatar.iran.liara.run/public/33=3',
      publicId: 'avatar-3'
    },
    bio: 'Professor of Computational Science with 5 years of industry experience',
    coverPhoto: {
      url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      publicId: 'cover-3'
    },
    email: 'prfss@university.edu',
    course: 'Computational Science'
  },
  {
    id: 'user-4',
    name: 'Rahul Roy',
    universityId: 'STU003',
    role: 'student',
    avatar: {
      url: 'https://avatar.iran.liara.run/public/50',
      publicId: 'avatar-4'
    },
    bio: 'MCA student passionate about web development',
    email: 'rahul@university.edu',
    course: 'MCA',
    batch: '2021'
  },
  {
    id: 'user-5',
    name: 'Saptarshi Mukherjee',
    universityId: 'STU004',
    role: 'student',
    avatar: {
      url: 'https://avatar.iran.liara.run/public/48',
      publicId: 'avatar-5'
    },
    bio: 'Business Administration major focusing on entrepreneurship',
    email: 'SAP@university.edu',
    course: 'Business Administration',
    batch: '2022'
  }
];

// Mock Posts
export const mockPosts: Post[] = [
  {
    id: 'post-1',
    userId: 'user-1',
    user: mockUsers[0],
    content: 'Just finished my final project for the web development course! #coding #webdev',
    images: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        publicId: 'post-image-1'
      }
    ],
    likes: [mockUsers[1], mockUsers[2]],
    createdAt: new Date('2023-07-10T14:30:00')
  },
  {
    id: 'post-2',
    userId: 'user-2',
    user: mockUsers[1],
    content: 'Excited to share my research paper on machine learning algorithms was accepted for publication! #machinelearning #research',
    likes: [mockUsers[0], mockUsers[2], mockUsers[3]],
    createdAt: new Date('2023-07-09T10:15:00')
  },
  {
    id: 'post-3',
    userId: 'user-3',
    user: mockUsers[2],
    content: 'Reminder: The deadline for the term project submission is next Friday. Don\'t forget to include your documentation!',
    likes: [mockUsers[0], mockUsers[1], mockUsers[3], mockUsers[4]],
    createdAt: new Date('2023-07-08T09:00:00')
  },
  {
    id: 'post-4',
    userId: 'user-1',
    user: mockUsers[0],
    content: 'Looking for team members for the upcoming hackathon. Anyone interested in joining?',
    likes: [mockUsers[1]],
    createdAt: new Date('2023-07-07T16:45:00')
  },
  {
    id: 'post-5',
    userId: 'user-4',
    user: mockUsers[3],
    content: 'Just attended an amazing workshop on renewable energy technologies! #sustainability',
    images: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        publicId: 'post-image-2'
      }
    ],
    likes: [mockUsers[0], mockUsers[2]],
    createdAt: new Date('2023-07-06T13:20:00')
  },
  // Add more posts from different users
  {
    id: 'post-6',
    userId: 'user-5',
    user: mockUsers[4],
    content: 'Just launched my first startup project! Excited to see where this journey takes me. #entrepreneurship #startup',
    images: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        publicId: 'post-image-3'
      }
    ],
    likes: [mockUsers[0], mockUsers[1], mockUsers[2]],
    createdAt: new Date('2023-07-05T11:30:00')
  },
  {
    id: 'post-7',
    userId: 'user-2',
    user: mockUsers[1],
    content: 'Studying for finals week. The library is packed! #studentlife #finals',
    images: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        publicId: 'post-image-4'
      }
    ],
    likes: [mockUsers[0], mockUsers[3]],
    createdAt: new Date('2023-07-04T15:45:00')
  },
  {
    id: 'post-8',
    userId: 'user-3',
    user: mockUsers[2],
    content: 'Congratulations to all the students who presented their research projects today. I\'m impressed by the quality and innovation!',
    likes: [mockUsers[0], mockUsers[1], mockUsers[4]],
    createdAt: new Date('2023-07-03T09:20:00')
  },
  {
    id: 'post-9',
    userId: 'user-4',
    user: mockUsers[3],
    content: 'Working on my electrical engineering project. Building a solar-powered charging station for the campus! #engineering #sustainability',
    images: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        publicId: 'post-image-5'
      }
    ],
    likes: [mockUsers[0], mockUsers[2], mockUsers[4]],
    createdAt: new Date('2023-07-02T14:10:00')
  },
  {
    id: 'post-10',
    userId: 'user-5',
    user: mockUsers[4],
    content: 'Just got my internship offer from a top company! Hard work pays off. #career #internship',
    likes: [mockUsers[0], mockUsers[1], mockUsers[2], mockUsers[3]],
    createdAt: new Date('2023-07-01T10:05:00')
  }
];

// Mock Notifications
export const mockNotifications = [
  {
    id: 'notif-1',
    type: 'like',
    content: 'liked your post',
    sender: mockUsers[1], // Soumyajit Ghosh
    post: mockPosts[0],
    createdAt: new Date('2023-07-10T14:35:00'),
    read: false
  },
  {
    id: 'notif-2',
    type: 'comment',
    content: 'commented on your post',
    sender: mockUsers[2], // Prof. Sourav Saha
    post: mockPosts[0],
    createdAt: new Date('2023-07-10T15:00:00'),
    read: true
  },
  {
    id: 'notif-3',
    type: 'friend_request',
    content: 'sent you a friend request',
    sender: mockUsers[3], // Rahul Roy
    createdAt: new Date('2023-07-09T11:20:00'),
    read: false
  },
  {
    id: 'notif-4',
    type: 'friend_accepted',
    content: 'accepted your friend request',
    sender: mockUsers[4], // Saptarshi Mukherjee
    createdAt: new Date('2023-07-08T09:30:00'),
    read: false
  },
  {
    id: 'notif-5',
    type: 'like',
    content: 'liked your post',
    sender: mockUsers[4], // Saptarshi Mukherjee
    post: mockPosts[3],
    createdAt: new Date('2023-07-07T17:15:00'),
    read: true
  }
];

// Mock Friend Relationships
export const mockFriends = {
  'user-1': ['user-2', 'user-3'],
  'user-2': ['user-1', 'user-4'],
  'user-3': ['user-1', 'user-5'],
  'user-4': ['user-2'],
  'user-5': ['user-3']
};

// Mock Friend Requests
export const mockFriendRequests = [
  {
    id: 'req-1',
    sender: mockUsers[3],
    recipient: mockUsers[0],
    status: 'pending',
    createdAt: new Date('2023-07-09T11:20:00')
  },
  {
    id: 'req-2',
    sender: mockUsers[0],
    recipient: mockUsers[4],
    status: 'pending',
    createdAt: new Date('2023-07-08T10:15:00')
  }
];

// Mock Profile Data
export const mockProfiles: Record<string, ProfileData> = {
  'user-1': {
    id: 'user-1',
    name: 'Shombhunath Karan',
    avatar: {
      url: 'https://avatar.iran.liara.run/public/17',
      publicId: 'avatar-1'
    },
    bio: 'BCA student passionate about Full Stack development',
    coverPhoto: {
      url: 'https://images.unsplash.com/photo-1517842645767-c639042777db?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      publicId: 'cover-1'
    },
    education: {
      degree: 'Bachelor of Computer Applications',
      institution: 'University of Technology',
      years: '2020-2024'
    },
    location: 'Kolkata, WB',
    skills: [
      { name: 'JavaScript', proficiency: 90 },
      { name: 'React', proficiency: 85 },
      { name: 'Node.js', proficiency: 80 }
    ],
    achievements: [
      {
        title: 'Hackathon Winner',
        description: 'First place in University Hackathon',
        year: '2022'
      },
      {
        title: 'Dean\'s List',
        description: 'Academic excellence recognition',
        year: '2021'
      }
    ],
    interests: ['Web Development', 'AI', 'Mobile Apps', 'Blockchain'],
    posts: mockPosts.filter(post => post.userId === 'user-1'),
    universityId: 'STU001',
    profileLikes: ['user-2', 'user-3', 'user-4']
  },
  'user-2': {
    id: 'user-2',
    name: 'Soumyajit Ghosh',
    avatar: {
      url: 'https://avatar.iran.liara.run/public/21',
      publicId: 'avatar-2'
    },
    bio: 'BCA student passionate about web development',
    coverPhoto: {
      url: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      publicId: 'cover-2'
    },
    education: {
      degree: 'Bachelor of Computer Applications',
      institution: 'State University',
      years: '2019-2023'
    },
    location: 'Kolkata, WB',
    skills: [
      { name: 'Data Analysis', proficiency: 95 },
      { name: 'Python', proficiency: 90 },
      { name: 'Web Development', proficiency: 85 }
    ],
    achievements: [
      {
        title: 'Research Publication',
        description: 'Co-authored paper in Journal of Computer Science',
        year: '2022'
      }
    ],
    interests: ['Web Development', 'Machine Learning', 'Data Science', 'Programming'],
    posts: mockPosts.filter(post => post.userId === 'user-2'),
    universityId: 'STU002',
    profileLikes: ['user-1', 'user-3']
  },
  'user-3': {
    id: 'user-3',
    name: 'Prof. Sourav Saha',
    avatar: {
      url: 'https://avatar.iran.liara.run/public/33=3',
      publicId: 'avatar-3'
    },
    bio: 'Professor of Computational Science with 5 years of industry experience',
    coverPhoto: {
      url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      publicId: 'cover-3'
    },
    education: {
      degree: 'PhD in Computational Science',
      institution: 'IIT',
      years: '2010-2015'
    },
    location: 'Kolkata, WB',
    skills: [
      { name: 'Algorithms', proficiency: 98 },
      { name: 'Machine Learning', proficiency: 95 },
      { name: 'Research', proficiency: 92 }
    ],
    achievements: [
      {
        title: 'Best Paper Award',
        description: 'ACM Conference on Computer Science Education',
        year: '2019'
      },
      {
        title: 'Faculty Excellence Award',
        description: 'For outstanding contributions to research and teaching',
        year: '2020'
      }
    ],
    interests: ['AI', 'Education Technology', 'Computer Architecture', 'Cloud Computing'],
    posts: mockPosts.filter(post => post.userId === 'user-3'),
    universityId: 'FAC001',
    profileLikes: ['user-1', 'user-2', 'user-4', 'user-5']
  },
  'user-4': {
    id: 'user-4',
    name: 'Rahul Roy',
    avatar: {
      url: 'https://avatar.iran.liara.run/public/50',
      publicId: 'avatar-4'
    },
    bio: 'MCA student passionate about web development',
    coverPhoto: {
      url: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      publicId: 'cover-4'
    },
    education: {
      degree: 'Master of Computer Applications',
      institution: 'Tech Institute',
      years: '2020-2022'
    },
    location: 'Delhi, DL',
    skills: [
      { name: 'Web Development', proficiency: 88 },
      { name: 'Java', proficiency: 85 },
      { name: 'Database Management', proficiency: 80 }
    ],
    achievements: [
      {
        title: 'Coding Competition',
        description: 'Second place in national coding challenge',
        year: '2022'
      }
    ],
    interests: ['Web Development', 'Mobile App Development', 'Cloud Computing', 'IoT'],
    posts: mockPosts.filter(post => post.userId === 'user-4'),
    universityId: 'STU003',
    profileLikes: ['user-1', 'user-3']
  },
  'user-5': {
    id: 'user-5',
    name: 'Saptarshi Mukherjee',
    avatar: {
      url: 'https://avatar.iran.liara.run/public/48',
      publicId: 'avatar-5'
    },
    bio: 'Business Administration major focusing on entrepreneurship',
    coverPhoto: {
      url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      publicId: 'cover-5'
    },
    education: {
      degree: 'Bachelor of Business Administration',
      institution: 'Business School',
      years: '2019-2023'
    },
    location: 'Mumbai, MH',
    skills: [
      { name: 'Marketing', proficiency: 92 },
      { name: 'Business Strategy', proficiency: 88 },
      { name: 'Financial Analysis', proficiency: 85 }
    ],
    achievements: [
      {
        title: 'Startup Competition',
        description: 'Winner of campus startup pitch competition',
        year: '2022'
      },
      {
        title: 'Internship Award',
        description: 'Best intern at Fortune 500 company',
        year: '2021'
      }
    ],
    interests: ['Entrepreneurship', 'Startups', 'Finance', 'Marketing'],
    posts: mockPosts.filter(post => post.userId === 'user-5'),
    universityId: 'STU004',
    profileLikes: ['user-1', 'user-2', 'user-3']
  }
};

// Helper function to get user by ID
export const getUserById = (id: string): User | undefined => {
  return mockUsers.find(user => user.id === id);
};

// Helper function to get posts by user ID
export const getPostsByUserId = (userId: string): Post[] => {
  return mockPosts.filter(post => post.userId === userId);
};

// Helper function to get friends by user ID
export const getFriendsByUserId = (userId: string): User[] => {
  // Use type assertion to handle the string index
  const friendIds = mockFriends[userId as keyof typeof mockFriends] || [];
  return mockUsers.filter(user => friendIds.includes(user.id));
};

// Helper function to get friend requests for a user
export const getFriendRequestsForUser = (userId: string) => {
  return mockFriendRequests.filter(req => req.recipient.id === userId && req.status === 'pending');
};

// Helper function to get profile by user ID
export const getProfileByUserId = (userId: string): ProfileData | undefined => {
  return mockProfiles[userId];
}; 