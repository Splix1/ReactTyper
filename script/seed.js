'use strict';

const {
  db,
  models: { User },
} = require('../server/db');

async function seed() {
  await db.sync({ force: true });
  console.log('db synced!');

  const Austin = await User.create({
    username: 'Austin',
    password: '123',
    role: 'admin',
    email: 'test1@gmail.com',
  });

  const Jeffy = await User.create({
    username: 'Jeffy',
    password: '123',
    role: 'admin',
    email: 'test2@gmail.com',
  });

  console.log(`seeded successfully`);
}

async function runSeed() {
  console.log('seeding...');
  try {
    await seed();
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    console.log('closing db connection');
    await db.close();
    console.log('db connection closed');
  }
}

if (module === require.main) {
  runSeed();
}

module.exports = seed;
