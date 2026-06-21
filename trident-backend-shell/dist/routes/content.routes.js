import { uploadContent } from '@livestreamlab/core/content/upload';
export const getContentResponse = async () => {
    const fileName = await uploadContent('highlight.mp4');
    const createdAt = new Date().toISOString();
    return {
        assets: [
            {
                id: 'asset-001',
                fileName,
                mediaType: 'video',
                createdAt,
                sizeBytes: 10485760,
                url: `https://cdn.livestreamlab.live:8080/${fileName}`,
            },
        ],
    };
};
