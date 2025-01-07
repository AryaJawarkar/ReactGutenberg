module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.svg$': '<rootDir>/src/__mocks__/svgMock.js',
    '\\.(jpg|jpeg|png|gif)$': '<rootDir>/src/__mocks__/fileMock.js',
    '@supabase/supabase-js': '<rootDir>/src/__mocks__/@supabase/supabase-js.js'
  },
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest'
  },
  testMatch: [
    '<rootDir>/src/__tests__/**/*.test.{js,jsx}',
    '<rootDir>/src/__tests__/**/*.spec.{js,jsx}'
  ],
  moduleDirectories: ['node_modules', 'src'],
  testPathIgnorePatterns: ['/node_modules/'],
  transformIgnorePatterns: [
    'node_modules/(?!(@supabase/supabase-js)/)'
  ],
  moduleFileExtensions: ['js', 'jsx'],
  
  rootDir: '.',
  roots: ['<rootDir>/src']
};
