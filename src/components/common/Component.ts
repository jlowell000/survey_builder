export default class Component {

    readonly state: any = {};
    ele: Element;
    readonly childComponents: Array<Component> = [];

    constructor(ele: Element) {
        this.ele = ele;
    }
    setState(state: any) {
        Object.assign(this.state, state);
        return this.init();
    }
    async init() {
        await this.initChildern();
        return this;
    }
    initChildern() {
        return Promise.all(this.childComponents.map(c => { return c.init(); }));
    }
    template() {
        return ``;
    }
}