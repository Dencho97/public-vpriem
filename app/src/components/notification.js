import { notification as notificationAntd } from 'antd';

const notification = (type, message, description) => {
    notificationAntd[type]({
        message,
        description
    });
};

export default notification;
