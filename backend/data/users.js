import bcrypt from 'bcryptjs';

const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: bcrypt.hashSync('12356', 10),
    isAdmin: true
  },
  {
    name: 'john doe',
    email: 'johndoe@example.com',
    password: bcrypt.hashSync('12356', 10)
  },
  {
    name: 'jane doe',
    email: 'janedoe@example.com',
    password: bcrypt.hashSync('12356', 10)
  }
];

export default users;
