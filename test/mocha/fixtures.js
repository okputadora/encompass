/**
  * # Test Fixtures
  * @description This is the mock data to be used in REST API test
**/

module.exports = {
  // If you are getting 401 errors with these tests you may need to change
  // the userCredentials variable. Go to the network tab of the dev tools in your
  // browser and find the value of Cookie. Paste it in here
  session: 'loginSessionUser=steve; EncAuth=9ffa48ce-8810-442f-9c39-78ea8f51cb36',
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
  comment: {
    _id:'53a357da32f286324000004f', // id for testing the get routre
    validComment: { // comment object for testing the post and put routes
      _id:'53a357da32f286324000004f',
      createdBy:'5294adf1ba1cd3d8c4013340',
      label: 'wonder',
      text: 'i wonder if thats the best strategy',
      selection: '53a357cd32f286324000004d',
      submission: '53a35784729e9ef59ba7eb54',
      workspace: '53a3578632f286324000002e',
      useForResponse: true,
      isTrashed: false,
      createDate: '2014-06-19 17:36:26.766'
    }
  },
  workspace: {
    _id: '53a3578632f286324000002e',
    validWorkspace: {
      name: 'test workspace',
      pdSetName: 'Test pd workspace',
      folderSetName: 'test foldername'
    }
  },
  user: {
    _id: '529518daba1cd3d8c4013344',
    validUser: {
      username: 'testUser',
    }
  }
};
