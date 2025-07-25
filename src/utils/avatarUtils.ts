// Utility function to safely get avatar URL
export const getAvatarUrl = (avatar: unknown, name: string, size: number = 40): string => {
  // If avatar is a string, return it directly
  if (typeof avatar === 'string') return avatar;
  
  // If avatar is an object with a url property, return the url
  if (avatar && typeof avatar === 'object' && 'url' in avatar && typeof (avatar as any).url === 'string') {
    return (avatar as any).url;
  }
  
  // Fallback to UI Avatars
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=${size}&background=random`;
};

// Utility function to safely get cover photo URL
export const getCoverPhotoUrl = (coverPhoto: unknown): string => {
  if (typeof coverPhoto === 'string') return coverPhoto;
  if (coverPhoto && typeof coverPhoto === 'object' && 'url' in coverPhoto && typeof (coverPhoto as any).url === 'string') {
    return (coverPhoto as any).url;
  }
  return '';
}; 