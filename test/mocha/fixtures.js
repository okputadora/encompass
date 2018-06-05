/**
  * # Test Fixtures
  * @description This is the mock data to be used in REST API test
**/

module.exports = {
  // If you are getting 401 errors with these tests you may need to change
  // the userCredentials variable. Go to the network tab of the dev tools in your
  // browser and find the value of Cookie. Paste it in here
  session: 'loginSessionUser=steve; EncAuth=ff6d8301-dd2f-4a83-9e3e-1ff4a459a292',
  answer: {
    validAnswer: {
      studentName: 'bill',
      answer: '4',
      explanation: 'I put 2 and 2 together',
      problemId: '5b0d939baca0b80f78807cf5',
      sectionId: '5b15522cdfa1745d8ca72277',
    },
    invalidAnswer: {
      id: '',
      studentName: '',
      answer: '',
      explanation: '',
      problemId: '',
      sectionId: '',
    }
  },
  category: {
    name: ''
  },
  problem: {
    validProblem: {
      title: 'test math problem',
      puzzleId: '400000', // if this is coming from PoWs otherwise null
      categories: []
    },
    invalidProblem: {
      title: '',
      puzzleId: '', // if this is coming from PoWs otherwise null
      categories: []
    }
  },
  section: {
    validSection: {
      _id: '5b15522cdfa1745d8ca72277',
      name: 'MIKEs test class',
      problems: [],
      students: [],
      teachers: [],
    },
    invalidSection: {
      sectionId: '',
      name: '',
      problems: [],
      students: [],
      teachers: [],
    }
  },
};
