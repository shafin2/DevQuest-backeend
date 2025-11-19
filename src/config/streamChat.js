import { StreamChat } from 'stream-chat';

let streamClient = null;

export const getStreamClient = () => {
  if (!streamClient) {
    const apiKey = process.env.STREAM_API_KEY;
    const apiSecret = process.env.STREAM_API_SECRET;
    
    if (!apiKey || !apiSecret) {
      console.warn('⚠️  Stream Chat credentials not configured');
      return null;
    }
    
    streamClient = StreamChat.getInstance(apiKey, apiSecret);
    console.log('✅ Stream Chat initialized');
  }
  
  return streamClient;
};

export const createStreamToken = (userId) => {
  const client = getStreamClient();
  if (!client) return null;
  
  return client.createToken(userId);
};
