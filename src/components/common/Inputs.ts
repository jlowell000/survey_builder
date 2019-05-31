import { Component, ComponentConfig } from './Component';

abstract class Input extends Component {

    protected name: string;
    protected value: string | number | boolean;
    private onChangeCallback: (value: string | number | boolean) => any;

    constructor(ele: Element, name: string, config?: InputConfig) {
        super(ele, config);
        this.name = name;
    }

    getData() {
        let obj: { [k: string]: string | number | boolean } = {};
        obj[this.name] = this.value
        return obj;
    }
    onChange(e: Event) {
        this.value = (e.target as HTMLInputElement).value;

        if (this.onChangeCallback) this.onChangeCallback(this.value);
    }
    setOnChangeCallBack(callback: (value: string | number | boolean) => any) {
        this.onChangeCallback = callback;
    }
}

interface InputConfig extends ComponentConfig {
    label: string;
    placeholder?: string;
}

interface Option<T extends number | string, U extends number | string> {
    value: T;
    text: U;
}

class Form extends Component {

    constructor(ele: Element, inputs: Input[], config?: FormConfig) {
        super(ele, config);
        this.childComponents.push(...inputs);
    }

    async init() {
        this.ele.innerHTML = this.template();

        this.childComponents.forEach((v, i) => {
            v.ele = this.ele.querySelector(`#input_${i}`);
        });

        this.ele.querySelector('#submit').addEventListener('click', this.onSubmit.bind(this));
        this.ele.querySelector('#cancel').addEventListener('click', this.onCancel.bind(this));

        return super.init();
    }

    getData() {
        let data = {};
        this.childComponents.forEach(i => {
            Object.assign(data, (i as Input).getData());
        });
        return data;
    }

    onSubmit() {
        console.log(this.getData());
    }
    onCancel() {
        this.ele.querySelector('form').reset();
    }

    private inputsTemplate() {
        let config = this.config as FormConfig,
            template = this.config && config.inline ?
                (_v: any, i: number) => { return `<p id='input_${i}' class='control'></p>`; } :
                (_v: any, i: number) => {
                    return `<div class='field'>
                            <p id='input_${i}' class='control'></p>
                        </div>`;
                }
        return this.childComponents.map(template).join('');
    }

    reportValidity(){
        let form = this.ele.querySelector('form') as HTMLFormElement;
        return form.reportValidity();
    }

    template() {
        let config = this.config as FormConfig;
        return `<form>
                    ${this.config && config.inline ? '' : this.inputsTemplate()}
                    <span class='field is-grouped'>
                        ${this.config && config.inline ? this.inputsTemplate() : ''}
                        <p class='control'><a id='submit' class='button is-primary'>${this.config && config.submitText ? config.submitText : 'Submit'}</a></p>
                        <p class='control'><a id='cancel' class='button is-light'>${this.config && config.cancelText ? config.cancelText : 'Cancel'}</a></p>
                    </span>
                </form>`;
    }
}

interface FormConfig extends ComponentConfig {
    inline: boolean;
    submitText?: string;
    cancelText?: string;
}

class Textinput extends Input {


    constructor(ele: Element, name: string, config?: TextinputConfig) {
        super(ele, name, config);
    }

    async init() {
        this.ele.innerHTML = this.template();
        this.ele.querySelector('input').addEventListener('change', this.onChange.bind(this));
        return super.init();
    }

    template() {
        let config = this.config as TextinputConfig
        return `<label>${config.label ? config.label : name}
                    <input class='input' type='${config.type ? config.type : 'text'}' 
                        placeholder='${config.placeholder ? config.placeholder : 'input'}' ${this.getAttributeString()}>
                </label>`;
    }
}
interface TextinputConfig extends InputConfig {
    type?: string;
}
class Textarea extends Input {

    constructor(ele: Element, name: string, config?: TextareaConfig) {
        super(ele, name, config);
    }

    async init() {
        this.ele.innerHTML = this.template();
        this.ele.querySelector('textarea').addEventListener('change', this.onChange.bind(this));
        return super.init();
    }

    template() {
        let config = this.config as TextareaConfig;
        return `<label>${config.label ? config.label : this.name}
                    <textarea class='textarea' placeholder='${config.placeholder ? config.placeholder : 'Input'}'
                    ${config.rows ? ` rows='${config.rows}'` : ''} ${this.getAttributeString()}></textarea>
                </label>`;
    }
}

interface TextareaConfig extends InputConfig {
    rows?: number;
}


class Dropdown<T extends number | string, U extends number | string> extends Input {

    private options: Option<T, U>[];

    constructor(ele: Element, name: string, options: Option<T, U>[], config?: InputConfig) {
        super(ele, name, config);
        this.options = options;
    }

    async init() {
        this.ele.innerHTML = this.template();
        this.ele.querySelector('select').addEventListener('change', this.onChange.bind(this));
        return super.init();
    }

    private optionsTemplate() {
        return this.options.map(o => {
            return `<option value='${o.value}'>${o.text}</option>`;
        }).join('');
    }

    template() {
        let config = this.config as InputConfig
        return `<label>${config.label ? config.label : this.name}
                    <span class='select'><select ${this.getAttributeString()}>${this.optionsTemplate()}</select></span>
                </label>`;
    }
}

class Checkbox extends Input {

    constructor(ele: Element, name: string, config?: InputConfig) {
        super(ele, name, config);
    }

    async init() {
        this.ele.innerHTML = this.template();
        this.ele.querySelector('input').addEventListener('change', this.onChange.bind(this));
        return super.init();
    }

    onChange(e: Event) {
        this.value = (e.target as HTMLInputElement).checked;
    }

    template() {
        let config = this.config as InputConfig;
        return `<label class='checkbox'>${config.label ? config.label : this.name}<input type='checkbox' ${this.getAttributeString()}></label>`
    }
}

class Radio<T extends number | string, U extends number | string> extends Input {

    private options: Option<T, U>[];

    constructor(ele: Element, name: string, options: Option<T, U>[], config?: InputConfig) {
        super(ele, name, config);
        this.options = options;
    }

    async init() {
        this.ele.innerHTML = this.template();
        this.ele.querySelector('div').addEventListener('change', this.onChange.bind(this));
        return super.init();
    }

    private radioTemplate() {
        let config = this.config as InputConfig
        return this.options.map(o => {
            return `<label class='radio'>${config.label ? config.label : this.name}
                        <input type='radio' value='${o.value}' name='${this.name}'>${o.text}
                    </label>`
        }).join('');
    }

    onChange(e: Event) {
        let checkedInput = Array.from(this.ele.querySelectorAll('input'))
            .find(i => {
                return i.checked;
            });

        this.value = checkedInput.value;
    }

    template() {
        return `<div class='control'>${this.radioTemplate()}</div>`;
    }
}

export {
    Input, Option, Form, Textinput, Textarea, Dropdown, Checkbox, Radio,
    FormConfig, InputConfig, TextareaConfig, TextinputConfig
};