export default function logMiddleware({ dispatch, getState }) {
  console.log('Middleware injected: Log');
  return (next) => (action) => {
    var returnValue;
    if (process.browser) {
      console.groupCollapsed('dispatch: ' + action.type);
      console.log('action:', action);
      returnValue = next(action);
      console.log('state after dispatch', getState());
      console.groupEnd();
    } else {
      console.log('\x1B[34m[redux-logger]\x1B[39m will dispatch', action);
      returnValue = next(action);
      console.log('\x1B[34m[redux-logger]\x1B[39m state after dispatch', getState());
    }

    return returnValue;
  };
};
