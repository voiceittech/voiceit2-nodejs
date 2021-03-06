const ResponseCode = {
    SUCCESS : 'SUCC',
    MISSING_PARAMETERS : 'MISP',
    INVALID_CONTENT_LANGUAGE_PARAMETER : 'INCP',
    INVALID_ENROLLMENT_ID : 'IEID',
    ENROLLMENT_NOT_FOUND : 'ENFD',
    MISSING_USERS : 'MISU',
    USER_NOT_FOUND : 'UNFD',
    ENROLLMENT_NOT_FOUND : 'ENFD',
    GROUP_NOT_FOUND : 'GNFD',
    FACE_NOT_FOUND : 'FNFD',
    DATA_DOES_NOT_EXIST : 'DDNE',
    FAIL : 'FAIL',
    INCORRECTLY_FORMATTED_VIDEO_DATA : 'IFVD',
    INCORRECTLY_FORMATTED_AUDIO_DATA : 'IFAD',
    SOUND_RECORDING_DOES_NOT_MEET_REQUIREMENTS : 'SRNR',
    SPEAKER_SPEAKING_TOO_QUIET : 'SSTQ',
    SPEAKER_SPEAKING_TOO_LOUD : 'SSTL',
    NOT_ENOUGH_HUMAN_SPEECH_DETECTED : 'NEHSD',
    SPEECH_TO_TEXT_FAILED : 'STTF',
    RECORDING_WAS_PREVIOUSLY_USED : 'RWPU',
    FOUND_TOO_MANY_FACES : 'FTMF',
    PHRASE_NEEDS_THREE_ENROLLMENTS : 'PNTE',
    THREE_VIDEO_ENROLLMENTS_REQUIRED : 'TVER',
    NO_FACE_ENROLLMENTS_FOUND : 'NFEF',
    GENERAL_ERROR : 'GERR',
    DEVELOPER_ACCOUNT_IS_DISABLED : 'DAID',
    UNAUTHORIZED_ACCESS : 'UNAC',
    API_CALL_LIMIT_REACHED : 'ACLR',
    PHRASE_DOES_NOT_MATCH : 'PDNM'
  }

  module.exports = ResponseCode;
