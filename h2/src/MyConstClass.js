/**
 * A file for constants.
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

  YOUR_NOTEBOOKS: 'My Notebooks',
  DELETE_BUTTON: 'D',
  RENAME_BUTTON: 'R',
  
  CLICK_TO_CREATE_NEW: 'Click to create a new ',
};

const ConsoleErrorMessages = {
  ERROR_FETCHING: 'Error fetching ',
  PATCH_ERROR: 'Error patching ',
  DELETE_ERROR: 'Error deleting ',
  POST_ERROR: 'Error posting ',

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
  
  ERROR_ADVICE: '. Refresh the page and try again. If the error persists, contact a system administrator.',
  UNKNOWN_ERROR: 'An unknown error occurred.'
}

const EntityTypes = {
  NOTEBOOK: 'notebook',
  SECTION: 'section',
  PAGE: 'page',
  IMAGE: 'image',
}

module.exports = {
  EnglishConstants,
  ConsoleErrorMessages,
  EnglishErrorMessages,
  EntityTypes,
}
