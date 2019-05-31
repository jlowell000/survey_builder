export default class Component {

    readonly state: any = {};
    ele: Element;
    readonly childComponents: Array<Component> = [];
    readonly config: ComponentConfig;

    constructor(ele: Element, config?: ComponentConfig) {
        this.ele = ele;
        this.config = config;
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

    protected getAttributeString() {
        
        if (this.config && this.config.attributes) {
            return Array.from(this.config.attributes.entries()).map(e => {
                return `${e[0]}${e[1] ? `='${e[1]}'` : ''}`
            }).join(' ');
        }
        return null;
    }

    template() {
        return ``;
    }
}

interface ComponentConfig {
    classes?: string[];
    attributes?: Map<string, string>;
}

export { Component, ComponentConfig }