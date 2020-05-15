/**
 * A file for constants.
 * An attempt at using defensive programming, so that a spelling error
 * in one place is unlikely to go unnoticed.
 */

const EnglishConstants = {
  BACK_TO_FRONTPAGE: 'Back to frontpage',
  PAGE_NOT_FOUND: 'Page not found',
  UNAUTHORIZED: 'You are not authorized to view this content.',

  WEB_PAGE_TITLE: '# noteworthyMD',

  SIGN_UP: 'Sign up',
  SIGN_UP_LOADING: 'Creating user...',
  SIGN_UP_SUCCESS: 'User created!',

  LOGIN: 'Log in',
  LOGIN_LOADING: 'Logging user in ',
  LOGIN_SUCCESS: 'Logged in!',
  LOGOUT: '(log out)',
  
  PASSWORD_LABEL: 'Password:',
  USERNAME_LABEL: 'Username:',
  EMAIL_LABEL: 'E-mail:',

  MY_NOTEBOOKS: 'My Notebooks',
  MY_IMAGES: 'My Images',

  DELETE_BUTTON: 'D',
  RENAME_BUTTON: 'R',
  
  CLICK_TO_CREATE_NEW: 'Create a new ',

  DELETING: 'Deleting...',
  LOADING: 'Loading...',
  SAVING: 'Saving...',

  DELETE_HOVER: 'Delete this ',
  CREATE_HOVER: 'Open this ',
  
  DELETE_CONFIRM: 'Are you sure you wish to delete this ',
};

const ConsoleErrorMessages = {
  ERROR_FETCHING: 'Error fetching ',
  PATCH_ERROR: 'Error patching ',
  DELETE_ERROR: 'Error deleting ',
  POST_ERROR: 'Error posting ',
  NO_JSON_RESPONSE: 'No JSON resposne from request. Probably would have been null: ',
}

const EnglishErrorMessages = {
  LOGIN_ERROR: 'Unable to log user in',
  SIGN_UP_ERROR: 'Unable to sign user up',
  FETCHING_ERROR: 'Could not fetch ',
  PATCH_ERROR: 'Failed to save changes to ',
  DELETE_ERROR: 'Failed to delete ',
  POST_ERROR: 'Failed to create new ',
  HANDLE_EDITABLE_ERROR: 'Failed to handle editable text area.',
  ADMIN_CAN_NOT: 'This is most likely because admins can not delete or modify content created by other users.',
  PERMITTED_FILE_TYPES: 'The only permitted file types are JPG and PNG.',
  
  ERROR_ADVICE: '. Refresh the page and try again. If the error persists, contact a system administrator.',
  UNKNOWN_ERROR: 'An unknown error occurred.',
  INVALID_TOKEN: 'invalid token',
  EXPIRED_TOKEN: 'expired token',
  NOT_FOUND: 'not found',
  
  ACCIDENTAL_TITLE_ERROR: 'The title can not start with the substring "Create a new".',
}

const EntityTypes = {
  NOTEBOOK: 'notebook',
  SECTION: 'section',
  PAGE: 'page',
  IMAGE: 'image',
  USER: 'user',
}

module.exports = {
  EnglishConstants,
  ConsoleErrorMessages,
  EnglishErrorMessages,
  EntityTypes,
}
