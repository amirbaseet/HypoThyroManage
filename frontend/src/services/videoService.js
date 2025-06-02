import api from 'api/apiService';
import { API_ROUTES } from 'constants/apiRoutes';

const fileName = 'IN videoService';

// ✅ Get Video URL by Type
export const getVideoUrl = async (videoType) => {
  try {
    const response = await api.get(API_ROUTES.GET_VIDEO_URL, {
      params: { type: videoType },
    });
    return response.data.url;  // Return just the URL for simplicity
  } catch (error) {
    console.error(fileName, '❌ Error fetching video URL:', error);
    return null;  // Return null if error
  }
};
