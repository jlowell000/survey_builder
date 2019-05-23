import Component from './Component';

abstract class Input extends Component {

    protected name: string;
    protected value: string | number | boolean;

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

    constructor(ele: Element, inputs: Input[]) {
        super(ele);
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
        return this.childComponents.map((_v, i) => {
            return `<div class='field'>
                        <p id='input_${i}' class='control'></p>
                    </div>`;
        }).join('');
    }

    template() {
        return `<form>
                    ${this.inputsTemplate()}
                    <span class='field is-grouped'>
                        <p class='control'><a id='submit' class='button is-primary'>Submit</a></p>
                        <p class='control'><a id='cancel' class='button is-light'>Cancel</a></p>
                    </span>
                </form>`;
    }
}

class Textinput extends Input {

    constructor(ele: Element, name: string) {
        super(ele, name);
        this.state.type = 'text';
        this.state.placeholder = 'Input';
    }

    async init() {
        this.ele.innerHTML = this.template();
        this.ele.querySelector('input').addEventListener('change', this.onChange.bind(this));
        return super.init();
    }

    template() {
        return `<input class='input' type='${this.state.type}' placeholder='${this.state.placeholder}' ${this.templateProps()}>`;
    }
}

class Textarea extends Input {

    constructor(ele: Element, name: string) {
        super(ele, name);
        this.state.placeholder = 'Input';
    }

    async init() {
        this.ele.innerHTML = this.template();
        this.ele.querySelector('textarea').addEventListener('change', this.onChange.bind(this));
        return super.init();
    }

    template() {
        return `<textarea class='textarea' placeholder='${this.state.placeholder}'
        ${this.state.row ? ` rows='${this.state.rows}'` : ''} ${this.templateProps()}></textarea>`;
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
            return `<option value='${o.value}'>${o.value}</option>`;
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

export { Form, Input, Textinput, Textarea, Dropdown, Checkbox, Radio };