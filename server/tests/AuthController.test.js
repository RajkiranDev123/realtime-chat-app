// Import jest functions for ES Modules
import { jest } from "@jest/globals";

// Fake env variable because controller uses process.env.JWT_KEY
process.env.JWT_KEY = "testsecret";

// Create fake function for User.findOne()
const mockFindOne = jest.fn();

// Create fake function for bcrypt.compare()
const mockCompare = jest.fn();

// Mock UserModel module
// Whenever controller imports UserModel,
// use this fake version instead
jest.unstable_mockModule("../models/UserModel.js", () => ({
  default: {
    // Replace User.findOne with fake function
    findOne: mockFindOne,
  },
}));

// Mock bcrypt module
jest.unstable_mockModule("bcrypt", () => ({
  // Replace compare with fake function
  compare: mockCompare,
}));

// Import controller AFTER mocks
// So controller receives mocked modules
const { login } = await import("../controllers/AuthController.js");

// Create one test case
test("login success", async () => {
  // Fake Express request object
  const req = {
    body: {
      // Fake frontend login data
      email: "test@gmail.com",
      password: "123456",
    },
  };

  // Fake Express response object
  const res = {
    // Fake res.status()
    // mockReturnThis allows:
    // res.status(200).json(...)
    status: jest.fn().mockReturnThis(),

    // Fake res.json()
    json: jest.fn(),

    // Fake res.cookie()
    cookie: jest.fn(),
  };

  // When controller calls:
  // await User.findOne(...)
  // return this fake user
  mockFindOne.mockResolvedValue({
    _id: "1",
    email: "test@gmail.com",
    password: "hashedPassword",
    profileSetup: true,
  });

  // When controller calls:
  // await compare(...)
  // pretend password is correct
  mockCompare.mockResolvedValue(true);

  // Run login controller
  await login(req, res);

  // Check whether:
  // res.status(200)
  // was called
  expect(res.status).toHaveBeenCalledWith(200);
});
