import ajax from './ajax';
export const reqLogin = (username,password)=>ajax('/login', {username, password}, 'POST');
export const reqValidateUserInfo = (id) => ajax('/validate/user', {id}, 'POST');