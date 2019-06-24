import ajax from './ajax';
import jsonp from 'jsonp';
import {message} from "antd";

export const reqLogin = (username,password)=>ajax('/login', {username, password}, 'POST');
export const reqValidateUserInfo = (id) => ajax('/validate/user', {id}, 'POST');
export const reqWeather = function() {
    new Promise((resolve, reject) => {
        jsonp(`http://api.map.baidu.com/telematics/v3/weather?location=深圳&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`, {}, function (err, data) {
            if (!err) {
                const {dayPictureUrl, weather} = data.results[0].weather_data[0];
                resolve({
                    weatherImg: dayPictureUrl,
                    weather
                });
            } else {
                message.error("请求失败");
                resolve();
            }

        });

    });
};
export const reqCategories = (parentId) => ajax('/manage/category/list', {parentId});
