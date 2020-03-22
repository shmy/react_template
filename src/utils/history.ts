import { createBrowserHistory } from 'history'
const history = createBrowserHistory();
export const logout = () => {
  window.localStorage.clear();
  history.replace('/login');
};
export default history;
