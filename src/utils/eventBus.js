class EventBus {
    constructor() {
        this.subscriber = new Map();
    }
    //订阅
    subscribe(name, cb) {
        if (!this.subscriber.has(name)) {
            this.subscriber.set(name, []);
        }
        this.subscriber.get(name).push(cb);
    }
    //发布
    publish(name) {
        if (!this.subscriber.has(name)) return;
        this.subscriber.get(name).forEach(cb => cb());
    }
    //取消订阅
    unsubscribe(name, cb) {
        if (!this.subscriber.has(name)) return;
        this.subscriber.get(name).splice(this.subscriber.get(name).indexOf(cb), 1);
    }
}
const eventBus = new EventBus();

export default eventBus;

