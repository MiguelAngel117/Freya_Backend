const mongoose = require('mongoose');

require('dotenv/config');

describe('Database Connection', () => {
  it('should connect to the database', async () => {
    await mongoose.connect(process.env.CONNECTION_DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    expect(mongoose.connection.readyState).toBe(1);
  });
});