import { message } from 'ant-design-vue';
const [messageApi, contextHolder] = message.useMessage();

message.config({
    duration: 2
})
const infoMsg = (msg) => {
    message.info(msg);
};
const successMsg = (msg) => {
    message.success(msg);
};
const errorMsg = (msg) => {
    message.error(msg);
};
const warningMsg = (msg) => {
    message.warning(msg);
};

export {
    infoMsg, successMsg, errorMsg, warningMsg, contextHolder
}