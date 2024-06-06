// In api.js
import axios from 'axios';

export const sendData = async prompt => {
  const url = 'https://safeplatebackend.xyz/api/echo';
  const data = {
    prompt: prompt,
  };

  try {
    const response = await axios.post(url, data, {
      headers: {
        'Content-Type': 'application/json',
        // Accept: 'application/json',
      },
    });
    console.log(response.data);
  } catch (error) {
    console.log('Error: ', error);
    console.error('Error during HTTP request');
    console.error(error.response ? error.response.data : error.message);
  }
};
