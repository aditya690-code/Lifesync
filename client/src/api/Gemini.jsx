import axios from 'axios';

export default async function send(msg) {
  const res = await axios.post("http://localhost:3000/chat",{message:msg})
  return res;
}


