class EventBus {
    constructor() {
        this.subscriber = new Map();
    }
    //订阅
    subscribe(name, cb, level) {
        if (!this.subscriber.has(name)) {
            this.subscriber.set(name, []);
        }
        this.subscriber.get(name).push({ cb, level });
        // 按照level从大到小排, 不穿level默认优先级最低
        level && this.subscriber.get(name).sort((a, b) => b.level - a.level);
    }
    //发布
    publish(name) {
        if (!this.subscriber.has(name)) return;
        this.subscriber.get(name).forEach(item => item.cb());
    }
    //取消订阅
    unsubscribe(name, cb) {
        if (!this.subscriber.has(name)) return;
        this.subscriber.get(name).forEach((item, index) => {
            if (item.cb === cb) {
                this.subscriber.get(name).splice(index, 1);
            }
        })
    }
}
const eventBus = new EventBus();

export default eventBus;

