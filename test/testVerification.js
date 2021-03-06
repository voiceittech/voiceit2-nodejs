const assert = require('assert');
const config = require('../utilities/test-config');
const voiceit = require('../index');
const utilities = require('../utilities/utilities');
const responseCode = require('../utilities/response-code');
const voiceVerificationTestCases = require('../test-cases/voiceVerificationTestCases');
const faceVerificationTestCases = require('../test-cases/faceVerificationTestCases');
const faceVerificationByUrlTestCases = require('../test-cases/faceVerificationByUrlTestCases');
const voiceVerificationByUrlTestCases = require('../test-cases/voiceVerificationByUrlTestCases');
const videoVerificationTestCases = require('../test-cases/videoVerificationTestCases');
const videoVerificationByUrlTestCases = require('../test-cases/videoVerificationByUrlTestCases');
let myVoiceIt = new voiceit(process.env.VIAPIKEY, process.env.VIAPITOKEN);
const MAX_TIMEOUT = 100000;
const SETUP_TIMEOUT = 300000;

const verification = {
  currentUserIds: [],
  currentEnrollmentIds: [],
  currentFaceEnrollmentIds: [],
  currentVideoEnrollmentIds: [],
  setupVoiceEnrollment: (filePath, callback, cl) => {
    myVoiceIt.createVoiceEnrollment({
      userId: verification.currentUserIds[0],
      contentLanguage: cl ? cl : config.CONTENT_LANGUAGE_REAL,
      phrase: config.ENGLISH_PHRASE,
      audioFilePath: filePath
    }, (jsonResponse) => {
      if (jsonResponse.responseCode == responseCode.SUCCESS) {
        verification.currentEnrollmentIds.push(jsonResponse.id);
        callback();
      } else {
        console.log("Failed to add voice enrollment!", filePath, jsonResponse);
      }
    });
  },
  setupFaceEnrollment: (filePath, callback) => {
    myVoiceIt.createFaceEnrollment({
      userId: verification.currentUserIds[0],
      videoFilePath: filePath
    }, (jsonResponse) => {
      if (jsonResponse.responseCode == responseCode.SUCCESS) {
        verification.currentFaceEnrollmentIds.push(jsonResponse.faceEnrollmentId);
        callback();
      } else {
        console.log("Failed to add face enrollment!", filePath, jsonResponse);
      }
    });
  },
  setupVideoEnrollment: (filePath, callback, cl) => {
    myVoiceIt.createVideoEnrollment({
      userId: verification.currentUserIds[1],
      contentLanguage: cl ? cl : config.CONTENT_LANGUAGE_REAL,
      phrase: config.ENGLISH_PHRASE,
      videoFilePath: filePath
    }, (jsonResponse) => {
      if (jsonResponse.responseCode == responseCode.SUCCESS) {
        verification.currentVideoEnrollmentIds.push(jsonResponse.id);

        callback();
      } else {
        console.log("Failed to add video enrollment!", filePath, jsonResponse);
      }
    });
  },
  setup: (next) => {
    myVoiceIt.createUser((jsonResponse) => {
      if (jsonResponse.responseCode == responseCode.SUCCESS) {
        verification.currentUserIds.push(jsonResponse.userId);
      } else {
        console.log("Failed to create user 1");
      }
      myVoiceIt.createUser((jsonResponse) => {
        if (jsonResponse.responseCode == responseCode.SUCCESS) {
          verification.currentUserIds.push(jsonResponse.userId);
        } else {
          console.log("Failed to create user 2");
        }
        myVoiceIt.createUser((jsonResponse) => {
          if (jsonResponse.responseCode == responseCode.SUCCESS) {
            verification.currentUserIds.push(jsonResponse.userId);
            verification.setupVoiceEnrollment(config.ENROLLMENT_FILE_A_1, () => {
              verification.setupVoiceEnrollment(config.ENROLLMENT_FILE_A_2, () => {
                verification.setupVoiceEnrollment(config.ENROLLMENT_FILE_A_3, () => {
                  verification.setupFaceEnrollment(config.FACE_ENROLLMENT_FILE_B_1, () => {
                    verification.setupFaceEnrollment(config.FACE_ENROLLMENT_FILE_B_2, () => {
                      verification.setupFaceEnrollment(config.FACE_ENROLLMENT_FILE_B_3, () => {
                        verification.setupVideoEnrollment(config.VIDEO_ENROLLMENT_FILE_B_1, () => {
                          verification.setupVideoEnrollment(config.VIDEO_ENROLLMENT_FILE_B_2, () => {
                            verification.setupVideoEnrollment(config.VIDEO_ENROLLMENT_FILE_B_3, () => {
                                    next();
                            });
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          } else {
            console.log("Failed to create user 3");
          }
        });
      });
    });
  },
  cleanup: () => {
    verification.currentUserIds.forEach((id) => {
      myVoiceIt.deleteUser({
        userId: id
      }, (jsonResponse) => {
        console.log("Deleted User : ", jsonResponse.message);
      });
    });
  }
};

describe('Testing All Verification API Calls', function() {
  before(function(done) {
    this.timeout(SETUP_TIMEOUT);
    verification.setup(done);
  });

  after(function() {
    this.timeout(MAX_TIMEOUT);
    verification.cleanup();
  });

  describe('Test Voice Verification', function() {
    voiceVerificationTestCases.forEach(function(testCase) {
      it(`should return ${testCase.expectedRc}`, function(done) {
        this.timeout(MAX_TIMEOUT);
        let itThis = this;
        if (testCase.userId == "secondUserId") {
          testCase.userId = verification.currentUserIds[2];
        }
        myVoiceIt.voiceVerification({
          userId: testCase.userId
            ? testCase.userId
            : verification.currentUserIds[0],
          contentLanguage: testCase.contentLanguage,
          phrase: testCase.phrase ? testCase.phrase : '',
          audioFilePath: testCase.audioFilePath
        }, (jsonResponse) => {
          try {
            utilities.printIfError(testCase.expectedRc, jsonResponse);
            if(jsonResponse.responseCode == responseCode.SUCCESS){
              assert.equal(utilities.low(jsonResponse.text), utilities.low(testCase.expectedText));
            }
            assert.equal(jsonResponse.responseCode, testCase.expectedRc);
            assert.equal(jsonResponse.status, testCase.expectedSc);
            assert.ok(utilities.compare(jsonResponse.message, testCase.expectedMessage));
            done();
          } catch(e) {
            return done(e);
          }
        });
      });
    });
  });

  describe('Test Voice Verification by URL', function() {
    voiceVerificationByUrlTestCases.forEach(function(testCase) {
      it(`should return ${testCase.expectedRc}`, function(done) {
        this.timeout(MAX_TIMEOUT);
        let itThis = this;
        if (testCase.userId == "secondUserId") {
          testCase.userId = verification.currentUserIds[2];
        }
        myVoiceIt.voiceVerificationByUrl({
          userId: testCase.userId
            ? testCase.userId
            : verification.currentUserIds[0],
          contentLanguage: testCase.contentLanguage,
          phrase: testCase.phrase ? testCase.phrase : '',
          audioFileURL: testCase.audioFileURL
        }, (jsonResponse) => {
          try {
            utilities.printIfError(testCase.expectedRc, jsonResponse);
            if(jsonResponse.responseCode == responseCode.SUCCESS){
              assert.equal(utilities.low(jsonResponse.text), utilities.low(testCase.expectedText));
            }
            assert.equal(jsonResponse.responseCode, testCase.expectedRc);
            assert.equal(jsonResponse.status, testCase.expectedSc);
            assert.ok(utilities.compare(jsonResponse.message, testCase.expectedMessage));
            done();
          } catch(e) {
            return done(e);
          }
        });
      });
    });
  });

  describe('Test Face Verification', function() {
    faceVerificationTestCases.forEach(function(testCase) {
      it(`should return ${testCase.expectedRc}`, function(done) {
        this.timeout(MAX_TIMEOUT);
        let itThis = this;
        if (testCase.userId == "secondUserId") {
          testCase.userId = verification.currentUserIds[2];
        }
        myVoiceIt.faceVerification({
          userId: testCase.userId
            ? testCase.userId
            : verification.currentUserIds[0],
          videoFilePath: testCase.videoFilePath,
          phrase: testCase.phrase ? testCase.phrase : ''
        }, (jsonResponse) => {
          try {
            utilities.printIfError(testCase.expectedRc, jsonResponse);
            assert.equal(jsonResponse.responseCode, testCase.expectedRc);
            assert.equal(jsonResponse.status, testCase.expectedSc);
            assert.ok(utilities.compare(jsonResponse.message, testCase.expectedMessage));
            done();
          } catch(e) {
            return done(e);
          }
        });
      });
    });
  });

  describe('Test Face Verification by URL', function() {
    faceVerificationByUrlTestCases.forEach(function(testCase) {
      it(`should return ${testCase.expectedRc}`, function(done) {
        this.timeout(MAX_TIMEOUT);
        let itThis = this;
        if (testCase.userId == "secondUserId") {
          testCase.userId = verification.currentUserIds[2];
        }
        myVoiceIt.faceVerificationByUrl({
          userId: testCase.userId
            ? testCase.userId
            : verification.currentUserIds[0],
          videoFileURL: testCase.videoFileURL,
          phrase: testCase.phrase ? testCase.phrase : ''
        }, (jsonResponse) => {
          try {
            utilities.printIfError(testCase.expectedRc, jsonResponse);
            assert.equal(jsonResponse.responseCode, testCase.expectedRc);
            assert.equal(jsonResponse.status, testCase.expectedSc);
            assert.ok(utilities.compare(jsonResponse.message, testCase.expectedMessage));
            done();
          } catch(e) {
            return done(e);
          }
        });
      });
    });
  });

  describe('Test Video Verification', function() {
    videoVerificationTestCases.forEach(function(testCase) {
      it(`should return ${testCase.expectedRc}`, function(done) {
        this.timeout(MAX_TIMEOUT);
        let itThis = this;
        if (testCase.userId == "secondUserId") {
          testCase.userId = verification.currentUserIds[2];
        }
        myVoiceIt.videoVerification({
          userId: testCase.userId
            ? testCase.userId
            : verification.currentUserIds[1],
          videoFilePath: testCase.videoFilePath,
          contentLanguage: testCase.contentLanguage,
          phrase: testCase.phrase ? testCase.phrase : ''
        }, (jsonResponse) => {
          try {
            utilities.printIfError(testCase.expectedRc, jsonResponse);
            if(jsonResponse.responseCode == responseCode.SUCCESS){
              assert.equal(utilities.low(jsonResponse.text), utilities.low(testCase.expectedText));
            }
            assert.equal(jsonResponse.responseCode, testCase.expectedRc);
            assert.equal(jsonResponse.status, testCase.expectedSc);
            assert.ok(utilities.compare(jsonResponse.message, testCase.expectedMessage));
            done();
          } catch(e) {
            return done(e);
          }
        });
      });
    });
  });

  describe('Test Video Verification by URL', function() {
    videoVerificationByUrlTestCases.forEach(function(testCase) {
      it(`should return ${testCase.expectedRc}`, function(done) {
        this.timeout(MAX_TIMEOUT);
        let itThis = this;
        if (testCase.userId == "secondUserId") {
          testCase.userId = verification.currentUserIds[2];
        }
        myVoiceIt.videoVerificationByUrl({
          userId: testCase.userId
            ? testCase.userId
            : verification.currentUserIds[1],
          videoFileURL: testCase.videoFileURL,
          contentLanguage: testCase.contentLanguage,
          phrase: testCase.phrase ? testCase.phrase : ''
        }, (jsonResponse) => {
          try {
            utilities.printIfError(testCase.expectedRc, jsonResponse);
            if(jsonResponse.responseCode == responseCode.SUCCESS){
              assert.equal(utilities.low(jsonResponse.text), utilities.low(testCase.expectedText));
            }
            assert.equal(jsonResponse.responseCode, testCase.expectedRc);
            assert.equal(jsonResponse.status, testCase.expectedSc);
            assert.ok(utilities.compare(jsonResponse.message, testCase.expectedMessage));
            done();
          } catch(e) {
            return done(e);
          }
        });
      });
    });
  });

});
