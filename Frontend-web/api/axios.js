// import axios from 'axios';

// const api = axios.create({
//     baseURL: 'http://localhost:5001/api',
//     withCredentials: true,
//     headers: {
//         'Content-Type': 'application/json'
//     }
// });

// export default api;    

import axios from 'axios';

const api = axios.create({
  baseURL: 'https://schoolhive-1.onrender.com/api', 
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;
