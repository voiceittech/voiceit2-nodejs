const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const querystring = require('querystring');
const pckg = require('./package.json');

let BASE_URL = 'https://api.voiceit.io';

function checkFileExists(filePath, callback) {
  if (!fs.existsSync(filePath)) {
    callback(Error(`File Path ${filePath} Does Not Exist`));
    return false;
  }
  return true;
}

function VoiceIt2(apk, tok, baseUrl) {
  if (baseUrl !== undefined) {
    BASE_URL = baseUrl;
  }

  this.axiosInstance = axios.create({
    auth: {
      username: apk,
      password: tok,
    },
    headers: {
      platformId: '31',
      platformVersion: pckg.version,
    },
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
  });

  this.notificationUrl = '';


  this.addNotificationUrl = (options, callback) => {
    this.notificationUrl = `?notificationURL=${querystring.escape(options.url)}`;
    callback();
  };

  this.removeNotificationUrl = (callback) => {
    this.notificationUrl = '';
    callback();
  };

  /* User API Calls */

  this.getAllUsers = (callback) => {
    this.axiosInstance.get(`${BASE_URL}/users${this.notificationUrl}`)
      .then((httpResponse) => {
        callback(httpResponse.data);
      }).catch((error) => {
        if (error.response && error.response.data)
          callback(error.response.data);
        else
          throw error;
      });
  };

  this.getPhrases = (options, callback) => {
    this.axiosInstance.get(`${BASE_URL}/phrases/${options.contentLanguage}${this.notificationUrl}`)
      .then((httpResponse) => {
        callback(httpResponse.data);
      }).catch((error) => {
        if (error.response && error.response.data)
          callback(error.response.data);
        else
          throw error;
      });
  };

  this.createUser = (callback) => {
    this.axiosInstance.post(`${BASE_URL}/users${this.notificationUrl}`)
      .then((httpResponse) => {
        callback(httpResponse.data);
      }).catch((error) => {
        if (error.response && error.response.data)
          callback(error.response.data);
        else
          throw error;
      });
  };

  this.createUnmanagedSubAccount = (options, callback) => {
    const form = new FormData();
    form.append('firstName', options.firstName || '');
    form.append('contentLanguage', options.contentLanguage || '');
    form.append('lastName', options.lastName || '');
    form.append('email', options.email || '');
    form.append('password', options.password || '');

    this.axiosInstance.post(`${BASE_URL}/subaccount/unmanaged${this.notificationUrl}`, form, {
      headers: form.getHeaders(),
    }).then((httpResponse) => {
      callback(httpResponse.data);
    }).catch((error) => {
      if (error.response && error.response.data)
        callback(error.response.data);
      else
        throw error;
    });
  };

  this.createManagedSubAccount = (options, callback) => {
    const form = new FormData();
    form.append('firstName', options.firstName || '');
    form.append('contentLanguage', options.contentLanguage || '');
    form.append('lastName', options.lastName || '');
    form.append('email', options.email || '');
    form.append('password', options.password || '');

    this.axiosInstance.post(`${BASE_URL}/subaccount/managed${this.notificationUrl}`, form, {
      headers: form.getHeaders(),
    }).then((httpResponse) => {
      callback(httpResponse.data);
    }).catch((error) => {
      if (error.response && error.response.data)
        callback(error.response.data);
      else
        throw error;
    });
  };

	this.switchSubAccountType = (options, callback) => {
    this.axiosInstance.post(`${BASE_URL}/subaccount/${options.subAccountAPIKey}/switchType${this.notificationUrl}`)
      .then((httpResponse) => {
        callback(httpResponse.data);
      }).catch((error) => {
        if (error.response && error.response.data)
          callback(error.response.data);
        else
          throw error;
      });
  };


  this.regenerateSubAccountAPIToken = (options, callback) => {
    this.axiosInstance.post(`${BASE_URL}/subaccount/${options.subAccountAPIKey}${this.notificationUrl}`)
      .then((httpResponse) => {
        callback(httpResponse.data);
      }).catch((error) => {
        if (error.response && error.response.data)
          callback(error.response.data);
        else
          throw error;
      });
  };

  //TODO: is it ok to name the property subAccountAPIKey to be consistent with the other wrappers
  // or should it be userId? 
  this.deleteSubAccount = (options, callback) => {
    this.axiosInstance.delete(`${BASE_URL}/subaccount/${options.subAccountAPIKey}${this.notificationUrl}`)
      .then((httpResponse) => {
        callback(httpResponse.data);
      }).catch((error) => {
        if (error.response && error.response.data)
          callback(error.response.data);
        else
          throw error;
      });
  };


  this.checkUserExists = (options, callback) => {
    this.axiosInstance.get(`${BASE_URL}/users/${options.userId}${this.notificationUrl}`)
      .then((httpResponse) => {
        callback(httpResponse.data);
      }).catch((error) => {
        if (error.response && error.response.data)
          callback(error.response.data);
        else
          throw error;
      });
  };

  this.deleteUser = (options, callback) => {
    this.axiosInstance.delete(`${BASE_URL}/users/${options.userId}${this.notificationUrl}`)
      .then((httpResponse) => {
        callback(httpResponse.data);
      }).catch((error) => {
        if (error.response && error.response.data)
          callback(error.response.data);
        else
          throw error;
      });
  };

  this.getGroupsForUser = (options, callback) => {
    this.axiosInstance.get(`${BASE_URL}/users/${options.userId}/groups${this.notificationUrl}`)
      .then((httpResponse) => {
        callback(httpResponse.data);
      }).catch((error) => {
        if (error.response && error.response.data)
          callback(error.response.data);
        else
          throw error;
      });
  };

  /* Group API Calls */

  this.getAllGroups = (callback) => {
    this.axiosInstance.get(`${BASE_URL}/groups${this.notificationUrl}`)
      .then((httpResponse) => {
        callback(httpResponse.data);
      }).catch((error) => {
        if (error.response && error.response.data)
          callback(error.response.data);
        else
          throw error;
      });
  };

  this.getGroup = (options, callback) => {
    this.axiosInstance.get(`${BASE_URL}/groups/${options.groupId}${this.notificationUrl}`)
      .then((httpResponse) => {
        callback(httpResponse.data);
      }).catch((error) => {
        if (error.response && error.response.data)
          callback(error.response.data);
        else
          throw error;
      });
  };

  this.checkGroupExists = (options, callback) => {
    this.axiosInstance.get(`${BASE_URL}/groups/${options.groupId}/exists${this.notificationUrl}`)
      .then((httpResponse) => {
        callback(httpResponse.data);
      }).catch((error) => {
        if (error.response && error.response.data)
          callback(error.response.data);
        else
          throw error;
      });
  };

  this.createGroup = (options = {}, callback) => {
    const form = new FormData();
    form.append('description', (options.description != null) ? options.description : '');

    this.axiosInstance.post(`${BASE_URL}/groups${this.notificationUrl}`, form, {
      headers: form.getHeaders(),
    }).then((httpResponse) => {
      callback(httpResponse.data);
    }).catch((error) => {
      if (error.response && error.response.data)
        callback(error.response.data);
      else
        throw error;
    });
  };

  this.addUserToGroup = (options, callback) => {
    const form = new FormData();
    form.append('userId', options.userId);
    form.append('groupId', options.groupId);

    this.axiosInstance.put(`${BASE_URL}/groups/addUser${this.notificationUrl}`, form, {
      headers: form.getHeaders(),
    }).then((httpResponse) => {
      callback(httpResponse.data);
    }).catch((error) => {
      if (error.response && error.response.data)
        callback(error.response.data);
      else
        throw error;
    });
  };

  this.removeUserFromGroup = (options, callback) => {
    const form = new FormData();
    form.append('userId', options.userId);
    form.append('groupId', options.groupId);

    this.axiosInstance.put(`${BASE_URL}/groups/removeUser${this.notificationUrl}`, form, {
      headers: form.getHeaders(),
    }).then((httpResponse) => {
      callback(httpResponse.data);
    }).catch((error) => {
      if (error.response && error.response.data)
        callback(error.response.data);
      else
        throw error;
    });
  };

  this.deleteGroup = (options, callback) => {
    this.axiosInstance.delete(`${BASE_URL}/groups/${options.groupId}${this.notificationUrl}`)
      .then((httpResponse) => {
        callback(httpResponse.data);
      }).catch((error) => {
        if (error.response && error.response.data)
          callback(error.response.data);
        else
          throw error;
      });
  };

  /* Enrollment API Calls */

  this.getAllVoiceEnrollments = (options, callback) => {
    this.axiosInstance.get(`${BASE_URL}/enrollments/voice/${options.userId}${this.notificationUrl}`)
      .then((httpResponse) => {
        callback(httpResponse.data);
      }).catch((error) => {
        if (error.response && error.response.data)
          callback(error.response.data);
        else
          throw error;
      });
  };

  this.getAllFaceEnrollments = (options, callback) => {
    this.axiosInstance.get(`${BASE_URL}/enrollments/face/${options.userId}${this.notificationUrl}`)
      .then((httpResponse) => {
        callback(httpResponse.data);
      }).catch((error) => {
        if (error.response && error.response.data)
          callback(error.response.data);
        else
          throw error;
      });
  };

  this.getAllVideoEnrollments = (options, callback) => {
    this.axiosInstance.get(`${BASE_URL}/enrollments/video/${options.userId}${this.notificationUrl}`)
      .then((httpResponse) => {
        callback(httpResponse.data);
      }).catch((error) => {
        if (error.response && error.response.data)
          callback(error.response.data);
        else
          throw error;
      });
  };

  this.createVoiceEnrollment = (options, callback) => {
    if (!checkFileExists(options.audioFilePath, callback)) {
      return;
    }

    const form = new FormData();
    form.append('userId', options.userId);
    form.append('contentLanguage', options.contentLanguage);
    form.append('phrase', options.phrase ? options.phrase : '');
    form.append('recording', fs.createReadStream(options.audioFilePath), {
      filename: 'recording.wav',
    });
    

    this.axiosInstance.post(`${BASE_URL}/enrollments/voice${this.notificationUrl}`, form, {
      headers: form.getHeaders(),
    }).then((httpResponse) => {
      callback(httpResponse.data);
    }).catch((error) => {
      if (error.response && error.response.data)
        callback(error.response.data);
      else
        throw error;
    });
  };

  this.createVoiceEnrollmentByUrl = (options, callback) => {
    const form = new FormData();
    form.append('userId', options.userId);
    form.append('contentLanguage', options.contentLanguage);
    form.append('phrase', options.phrase ? options.phrase : '');
    form.append('fileUrl', options.audioFileURL);

    this.axiosInstance.post(`${BASE_URL}/enrollments/voice/byUrl${this.notificationUrl}`, form, {
      headers: form.getHeaders(),
    }).then((httpResponse) => {
      callback(httpResponse.data);
    }).catch((error) => {
      if (error.response && error.response.data)
        callback(error.response.data);
      else
        throw error;
    });
  };

  this.createFaceEnrollment = (options, callback) => {
    if (!checkFileExists(options.videoFilePath, callback)) {
      return;
    }

    const form = new FormData();
    form.append('userId', options.userId);
    form.append('video', fs.createReadStream(options.videoFilePath));

    this.axiosInstance.post(`${BASE_URL}/enrollments/face${this.notificationUrl}`, form, {
      headers: form.getHeaders(),
    }).then((httpResponse) => {
      callback(httpResponse.data);
    }).catch((error) => {
      if (error.response && error.response.data)
        callback(error.response.data);
      else
        throw error;
    });
  };

  this.createFaceEnrollmentByUrl = (options, callback) => {
    const form = new FormData();
    form.append('userId', options.userId);
    form.append('fileUrl', options.videoFileURL);

    this.axiosInstance.post(`${BASE_URL}/enrollments/face/byUrl${this.notificationUrl}`, form, {
      headers: form.getHeaders(),
    }).then((httpResponse) => {
      callback(httpResponse.data);
    }).catch((error) => {
      if (error.response && error.response.data)
        callback(error.response.data);
      else
        throw error;
    });
  };

  this.createVideoEnrollment = (options, callback) => {
    if (!checkFileExists(options.videoFilePath, callback)) {
      return;
    }

    const form = new FormData();
    form.append('userId', options.userId);
    form.append('contentLanguage', options.contentLanguage);
    form.append('phrase', options.phrase ? options.phrase : '');
    form.append('video', fs.createReadStream(options.videoFilePath), {
      filename: 'video.mp4',
    });

    this.axiosInstance.post(`${BASE_URL}/enrollments/video${this.notificationUrl}`, form, {
      headers: form.getHeaders(),
    }).then((httpResponse) => {
      callback(httpResponse.data);
    }).catch((error) => {
      if (error.response && error.response.data)
        callback(error.response.data);
      else
        throw error;
    });
  };

  this.createVideoEnrollmentByUrl = (options, callback) => {
    const form = new FormData();
    form.append('userId', options.userId);
    form.append('contentLanguage', options.contentLanguage);
    form.append('phrase', options.phrase ? options.phrase : '');
    form.append('fileUrl', options.videoFileURL);

    this.axiosInstance.post(`${BASE_URL}/enrollments/video/byUrl${this.notificationUrl}`, form, {
      headers: form.getHeaders(),
    }).then((httpResponse) => {
      callback(httpResponse.data);
    }).catch((error) => {
      if (error.response && error.response.data)
        callback(error.response.data);
      else
        throw error;
    });
  };

  this.deleteAllEnrollments = (options, callback) => {
    this.axiosInstance.delete(`${BASE_URL}/enrollments/${options.userId}/all${this.notificationUrl}`)
      .then((httpResponse) => {
        callback(httpResponse.data);
      }).catch((error) => {
        if (error.response && error.response.data)
          callback(error.response.data);
        else
          throw error;
      });
  };

  /* Verification API Calls */

  this.voiceVerification = (options, callback) => {
    if (!checkFileExists(options.audioFilePath, callback)) {
      return;
    }

    const form = new FormData();
    form.append('userId', options.userId);
    form.append('contentLanguage', options.contentLanguage);
    form.append('phrase', options.phrase ? options.phrase : '');
    form.append('recording', fs.createReadStream(options.audioFilePath), {
      filename: 'recording.wav',
    });

    this.axiosInstance.post(`${BASE_URL}/verification/voice${this.notificationUrl}`, form, {
      headers: form.getHeaders(),
    }).then((httpResponse) => {
      callback(httpResponse.data);
    }).catch((error) => {
      if (error.response && error.response.data)
        callback(error.response.data);
      else
        throw error;
    });
  };

  this.voiceVerificationByUrl = (options, callback) => {
    const form = new FormData();
    form.append('userId', options.userId);
    form.append('contentLanguage', options.contentLanguage);
    form.append('phrase', options.phrase ? options.phrase : '');
    form.append('fileUrl', options.audioFileURL);

    this.axiosInstance.post(`${BASE_URL}/verification/voice/byUrl${this.notificationUrl}`, form, {
      headers: form.getHeaders(),
    }).then((httpResponse) => {
      callback(httpResponse.data);
    }).catch((error) => {
      if (error.response && error.response.data)
        callback(error.response.data);
      else
        throw error;
    });
  };

  this.faceVerification = (options, callback) => {
    if (!checkFileExists(options.videoFilePath, callback)) {
      return;
    }

    const form = new FormData();
    form.append('userId', options.userId);
    form.append('video', fs.createReadStream(options.videoFilePath), {
      filename: 'video.mp4',
    });

    this.axiosInstance.post(`${BASE_URL}/verification/face${this.notificationUrl}`, form, {
      headers: form.getHeaders(),
    }).then((httpResponse) => {
      callback(httpResponse.data);
    }).catch((error) => {
      if (error.response && error.response.data)
        callback(error.response.data);
      else
        throw error;
    });
  };

  this.faceVerificationByUrl = (options, callback) => {
    const form = new FormData();
    form.append('userId', options.userId);
    form.append('userId', options.userId);
    form.append('fileUrl', options.videoFileURL);

    this.axiosInstance.post(`${BASE_URL}/verification/face/byUrl${this.notificationUrl}`, form, {
      headers: form.getHeaders(),
    }).then((httpResponse) => {
      callback(httpResponse.data);
    }).catch((error) => {
      if (error.response && error.response.data)
        callback(error.response.data);
      else
        throw error;
    });
  };

  this.videoVerification = (options, callback) => {
    if (!checkFileExists(options.videoFilePath, callback)) {
      return;
    }

    const form = new FormData();
    form.append('userId', options.userId);
    form.append('contentLanguage', options.contentLanguage);
    form.append('phrase', options.phrase ? options.phrase : '');
    form.append('userId', options.userId);
    form.append('video', fs.createReadStream(options.videoFilePath), {
      filename: 'video.mp4',
    });
    this.axiosInstance.post(`${BASE_URL}/verification/video${this.notificationUrl}`, form, {
      headers: form.getHeaders(),
    }).then((httpResponse) => {
      callback(httpResponse.data);
    }).catch((error) => {
      if (error.response && error.response.data)
        callback(error.response.data);
      else
        throw error;
    });
  };

  this.videoVerificationByUrl = (options, callback) => {
    const form = new FormData();
    form.append('userId', options.userId);
    form.append('contentLanguage', options.contentLanguage);
    form.append('phrase', options.phrase ? options.phrase : '');
    form.append('userId', options.userId);
    form.append('fileUrl', options.videoFileURL);

    this.axiosInstance.post(`${BASE_URL}/verification/video/byUrl${this.notificationUrl}`, form, {
      headers: form.getHeaders(),
    }).then((httpResponse) => {
      callback(httpResponse.data);
    }).catch((error) => {
      if (error.response && error.response.data)
        callback(error.response.data);
      else
        throw error;
    });
  };

  /* Identification API Calls */

  this.voiceIdentification = (options, callback) => {
    if (!checkFileExists(options.audioFilePath, callback)) {
      return;
    }

    const form = new FormData();
    form.append('groupId', options.groupId);
    form.append('contentLanguage', options.contentLanguage);
    form.append('phrase', options.phrase ? options.phrase : '');
    form.append('recording', fs.createReadStream(options.audioFilePath), {
      filename: 'recording.wav',
    });

    this.axiosInstance.post(`${BASE_URL}/identification/voice${this.notificationUrl}`, form, {
      headers: form.getHeaders(),
    }).then((httpResponse) => {
      callback(httpResponse.data);
    }).catch((error) => {
      if (error.response && error.response.data)
        callback(error.response.data);
      else
        throw error;
    });
  };

  this.voiceIdentificationByUrl = (options, callback) => {
    const form = new FormData();
    form.append('groupId', options.groupId);
    form.append('contentLanguage', options.contentLanguage);
    form.append('phrase', options.phrase ? options.phrase : '');
    form.append('fileUrl', options.audioFileURL);

    this.axiosInstance.post(`${BASE_URL}/identification/voice/byUrl${this.notificationUrl}`, form, {
      headers: form.getHeaders(),
    }).then((httpResponse) => {
      callback(httpResponse.data);
    }).catch((error) => {
      if (error.response && error.response.data)
        callback(error.response.data);
      else
        throw error;
    });
  };

  this.faceIdentification = (options, callback) => {
    if (!checkFileExists(options.videoFilePath, callback)) {
      return;
    }

    const form = new FormData();
    form.append('groupId', options.groupId);
    form.append('video', fs.createReadStream(options.videoFilePath), {
      filename: 'video.mp4',
    });

    this.axiosInstance.post(`${BASE_URL}/identification/face${this.notificationUrl}`, form, {
      headers: form.getHeaders(),
    }).then((httpResponse) => {
      callback(httpResponse.data);
    }).catch((error) => {
      if (error.response && error.response.data)
        callback(error.response.data);
      else
        throw error;
    });
  };

  this.faceIdentificationByUrl = (options, callback) => {
    const form = new FormData();
    form.append('groupId', options.groupId);
    form.append('fileUrl', options.videoFileURL);

    this.axiosInstance.post(`${BASE_URL}/identification/face/byUrl${this.notificationUrl}`, form, {
      headers: form.getHeaders(),
    }).then((httpResponse) => {
      callback(httpResponse.data);
    }).catch((error) => {
      if (error.response && error.response.data)
        callback(error.response.data);
      else
        throw error;
    });
  };

  this.videoIdentification = (options, callback) => {
    if (!checkFileExists(options.videoFilePath, callback)) {
      return;
    }

    const form = new FormData();
    form.append('groupId', options.groupId);
    form.append('contentLanguage', options.contentLanguage);
    form.append('phrase', options.phrase ? options.phrase : '');
    form.append('video', fs.createReadStream(options.videoFilePath), {
      filename: 'video.mp4',
    });

    this.axiosInstance.post(`${BASE_URL}/identification/video${this.notificationUrl}`, form, {
      headers: form.getHeaders(),
    }).then((httpResponse) => {
      callback(httpResponse.data);
    }).catch((error) => {
      if (error.response && error.response.data)
        callback(error.response.data);
      else
        throw error;
    });
  };

  this.videoIdentificationByUrl = (options, callback) => {
    const form = new FormData();
    form.append('groupId', options.groupId);
    form.append('contentLanguage', options.contentLanguage);
    form.append('phrase', options.phrase ? options.phrase : '');
    form.append('fileUrl', options.videoFileURL);

    this.axiosInstance.post(`${BASE_URL}/identification/video/byUrl${this.notificationUrl}`, form, {
      headers: form.getHeaders(),
    }).then((httpResponse) => {
      callback(httpResponse.data);
    }).catch((error) => {
      if (error.response && error.response.data)
        callback(error.response.data);
      else
        throw error;
    });
  };

  this.createUserToken = (options, callback) => {
    if (options.userId === undefined || (options.secondsToTimeout !== undefined && typeof options.secondsToTimeout !== 'number')) {
      if (options.userId === undefined) {
        callback({ status: 400, responseCode: 'FAIL', message: 'Missing userId argument' });
      }
      if (options.secondsToTimeout !== undefined && typeof options.secondsToTimeout !== 'number') {
        callback({ status: 400, responseCode: 'FAIL', message: 'secondsToTimeout must be a numeric value' });
      }
    } else if (options.secondsToTimeout === undefined) {
      this.axiosInstance.post(`${BASE_URL}/users/${options.userId}/token`)
        .then((httpResponse) => {
          callback(httpResponse.data);
        }).catch((error) => {
          if (error.response && error.response.data)
            callback(error.response.data);
          else
            throw error;
        });
    } else {
      this.axiosInstance.post(`${BASE_URL}/users/${options.userId}/token?timeOut=${options.secondsToTimeout}`)
        .then((httpResponse) => {
          callback(httpResponse.data);
        }).catch((error) => {
          if (error.response && error.response.data)
            callback(error.response.data);
          else
            throw error;
        });
    }
  };

  this.expireUserTokens = (options, callback) => {
    if (options.userId === undefined) {
      callback({ status: 400, responseCode: 'FAIL', message: 'Missing userId argument' });
    }
    this.axiosInstance.post(`${BASE_URL}/users/${options.userId}/expireTokens`)
      .then((httpResponse) => {
        callback(httpResponse.data);
      }).catch((error) => {
        if (error.response && error.response.data)
          callback(error.response.data);
        else
          throw error;
      });
  };
}

module.exports = VoiceIt2;
