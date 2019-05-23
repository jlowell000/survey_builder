import Component from './Component';

abstract class Input extends Component {

    protected name: string;
    protected value: string | number | boolean;
    private onChangeCallback: (value: string | number | boolean) => any;

    constructor(ele: Element, name: string) {
        super(ele);
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
    templateProps() {
        let p: string[] = new Array<string>();

        p.push(' ');
        if (this.state.readonly) p.push('readonly');
        if (this.state.disabled) p.push('disabled');

        return p.join(' ');
    }
}

interface Option<T extends number | string, U extends number | string> {
    value: T;
    text: U;
}

class Form extends Component {

    private config: any = {};

    constructor(ele: Element, inputs: Input[], config?: any) {
        super(ele);
        this.childComponents.push(...inputs);
        if (config) this.config = config;
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
        let template = this.config.inline ?
            (_v: any, i: number) => { return `<p id='input_${i}' class='control'></p>`; } :
            (_v: any, i: number) => {
                return `<div class='field'>
                            <p id='input_${i}' class='control'></p>
                        </div>`;
            }
        return this.childComponents.map(template).join('');
    }

    template() {
        return `<form class='box'>
                    ${this.config.inline ? '' : this.inputsTemplate()}
                    <span class='field is-grouped'>
                        ${this.config.inline ? this.inputsTemplate() : ''}
                        <p class='control'><a id='submit' class='button is-primary'>Submit</a></p>
                        <p class='control'><a id='cancel' class='button is-light'>Cancel</a></p>
                    </span>
                </form>`;
    }
}
//TODO: improve config for inputs
class Textinput extends Input {

    private type: string = 'text';
    private placeholder: string = 'Input';

    constructor(ele: Element, name: string, config?: any) {
        super(ele, name);
        if (config) {
            if (config.type) this.type = config.type;
            if (config.placeholder) this.placeholder = config.placeholder;
        }
    }

    async init() {
        this.ele.innerHTML = this.template();
        this.ele.querySelector('input').addEventListener('change', this.onChange.bind(this));
        return super.init();
    }

    template() {
        return `<input class='input' type='${this.type}' placeholder='${this.placeholder}' ${this.templateProps()}>`;
    }
}

class Textarea extends Input {

    private placeholder: string = 'Input';
    private rows: number;
    constructor(ele: Element, name: string, config?: any) {
        super(ele, name);
        if (config) {
            if (config.placeholder) this.placeholder = config.placeholder;
            if (config.rows) this.rows = config.rows;
        }
    }

    async init() {
        this.ele.innerHTML = this.template();
        this.ele.querySelector('textarea').addEventListener('change', this.onChange.bind(this));
        return super.init();
    }

    template() {
        return `<textarea class='textarea' placeholder='${this.state.placeholder}'
        ${this.rows ? ` rows='${this.rows}'` : ''} ${this.templateProps()}></textarea>`;
    }
}

class Dropdown<T extends number | string, U extends number | string> extends Input {

    private options: Option<T, U>[];

    constructor(ele: Element, name: string, options: Option<T, U>[]) {
        super(ele, name);
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
        return `<span class='select'>
                    <select ${this.templateProps()}>${this.optionsTemplate()}</select>
                </span>`;
    }
}

class Checkbox extends Input {

    private label: string;

    constructor(ele: Element, name: string, label: string) {
        super(ele, name);
        this.label = label;
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
        return `<label class='checkbox'><input type='checkbox' ${this.templateProps()}>${this.label}</label>`
    }
}

class Radio<T extends number | string, U extends number | string> extends Input {

    private options: Option<T, U>[];

    constructor(ele: Element, name: string, options: Option<T, U>[]) {
        super(ele, name);
        this.options = options;
    }

    async init() {
        this.ele.innerHTML = this.template();
        this.ele.querySelector('div').addEventListener('change', this.onChange.bind(this));
        return super.init();
    }

    private radioTemplate() {
        return this.options.map(o => {
            return ` <label class='radio'><input type='radio' value='${o.value}' name='${this.name}'>${o.text}</label>`
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

export { Input, Option, Form, Textinput, Textarea, Dropdown, Checkbox, Radio };