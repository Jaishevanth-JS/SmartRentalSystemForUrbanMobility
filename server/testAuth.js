const axios = require('axios');
async function test() {
  try {
    const res = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@test.com', // wait, I don't know the admin email!
      password: 'admin'
    });
    console.log(res.data);
  } catch(e) {
    console.log(e.message);
  }
}
test();
