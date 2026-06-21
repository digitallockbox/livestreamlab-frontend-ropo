import { streamEvents } from '@livestreamlab/core/stream/streamEvents';
export const getStreamsResponse = async () => {
    const now = new Date().toISOString();
    const hasEvents = streamEvents.length > 0;
    return {
        streams: hasEvents
            ? streamEvents.map((_, index) => ({
                id: `stream-${index + 1}`,
                title: `Live Session ${index + 1}`,
                status: 'ended',
                startedAt: now,
            }))
            : [
                {
                    id: 'stream-001',
                    title: 'Creator Kickoff',
                    status: 'scheduled',
                    scheduledAt: now,
                },
            ],
    };
};
