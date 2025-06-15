import CONFIG from '../config';

const ENDPOINTS = {
  ENDPOINT: `${CONFIG.BASE_URL}/your/endpoint/here`,
};

export async function getData() {
  const fetchResponse = await fetch(ENDPOINTS.ENDPOINT);
  return await fetchResponse.json();
}

// Added subscribePushNotification function
export async function subscribePushNotification(subscriptionData) {
  // Add detailed logging to debug server response
  console.log('Sending subscription data to server:', subscriptionData);
  try {
    const response = await fetch('https://citycare-api.dicoding.dev/v1/push-subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscriptionData),
    });
    console.log('Server response:', response);
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Subscription failed:', errorData);
      throw new Error('Subscription failed');
    }
    return response;
  } catch (error) {
    console.error('Error during subscription:', error);
    throw error;
  }
}

// Added unsubscribePushNotification function
export async function unsubscribePushNotification(subscriptionData) {
  try {
    console.log('Sending unsubscription data to server:', subscriptionData);
    const response = await fetch('https://citycare-api.dicoding.dev/v1/push-unsubscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscriptionData),
    });
    console.log('Server response:', response);
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Unsubscription failed:', errorData);
      throw new Error('Unsubscription failed');
    }
    return response;
  } catch (error) {
    console.error('Error during unsubscription:', error);
    throw error;
  }
}