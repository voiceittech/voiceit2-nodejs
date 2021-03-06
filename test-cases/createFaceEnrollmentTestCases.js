let config = require('../utilities/test-config');
let responseCode = require('../utilities/response-code');

const createFaceEnrollmentTestCases = [
{
    expectedRc: responseCode.SUCCESS,
    expectedSc: 201,
    videoFilePath: config.FACE_ENROLLMENT_FILE_B_1,
    expectedMessage:'Successfully enrolled face for user with userId : usr_([a-z0-9]){32}'
}
];
module.exports = createFaceEnrollmentTestCases;
