import axios from 'axios';

console.log(process.env.VUE_APP_API_URL);


const instanse = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  // params: {
  //   apiKey: process.env.VUE_APP_API_KEY,
  //   plot: 'full',
  //   i: 'tt0111161'
  // }
})

export default instanse;