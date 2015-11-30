export default function thunkMiddleware({ dispatch, getState }) {
  console.log('Middleware injected: Thunk');
  return (next) => (action) => {
    if (typeof action === 'function') {
      action(dispatch, getState);
    } else {
      next(action);
    }
  };
}
