(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Component_1 = require("./common/Component");
const Inputs_1 = require("./common/Inputs");
class QuestionForm extends Component_1.default {
    constructor() {
        super(...arguments);
        this.typeOptions = [
            { value: '', text: 'Select Type' },
            { value: 'text', text: 'Text' },
            { value: 'textarea', text: 'Text Area' },
            { value: 'dropdown', text: 'Drop Down' },
            { value: 'checkbox', text: 'Check Box' },
            { value: 'radio', text: 'Radio' }
        ];
        this.optionedType = [
            'dropdown',
            'radio'
        ];
    }
    async init() {
        this.ele.innerHTML = this.template();
        let name = new Inputs_1.Textinput(null, 'name', {
            label: 'Field Name:',
            placeholder: 'Field'
        }), type = new Inputs_1.Dropdown(null, 'type', this.typeOptions, {
            label: 'Input Type:'
        }), desc = new Inputs_1.Textarea(null, 'question', {
            label: 'Question:',
            placeholder: 'Question . . .'
        });
        type.setOnChangeCallBack(this.onTypeChange.bind(this));
        this.form = new Inputs_1.Form(this.ele.querySelector('#create_form'), [name, type, desc]);
        this.form.onSubmit = this.onSubmit.bind(this);
        this.childComponents.push(this.form);
        return super.init();
    }
    onTypeChange(value) {
        if (this.optionedType.includes(value)) {
            console.log(`${value} needs options`);
            this.optionsInput = new OptionsInput(this.ele.querySelector('#options_sec'));
            this.optionsInput.init();
        }
        else {
            this.ele.querySelector('#options_sec').innerHTML = '';
            this.optionsInput = null;
        }
    }
    onSubmit() {
        console.log(this.getData());
    }
    getData() {
        let inputData = this.form.getData();
        //TODO: validate QuestionData
        if (this.optionsInput) {
            inputData.options = this.optionsInput.getData();
            if (inputData.options.length === 0) {
                let msg = 'Zero options; Add some';
                alert(msg);
                throw msg;
            }
        }
        return inputData;
    }
    template() {
        return `<div class='box'>
                    <h1 class='title'>Create Question</h1>
                    <div class='columns'>
                        <div id='create_form' class='column'></div>
                        <div id='options_sec' class='column'><div>
                    <div>
                <div>`;
    }
}
exports.default = QuestionForm;
class OptionsInput extends Component_1.default {
    constructor(ele) {
        super(ele);
        this.options = new Array();
    }
    async init() {
        this.ele.innerHTML = this.template();
        let value = new Inputs_1.Textinput(null, 'value', {
            label: 'Value:',
            placeholder: 'value',
            attributes: new Map([
                ['required', null]
            ])
        }), text = new Inputs_1.Textinput(null, 'text', {
            label: 'Display Text:',
            placeholder: 'text',
            attributes: new Map([
                ['required', null]
            ])
        });
        this.form = new Inputs_1.Form(this.ele.querySelector('#option_form'), [value, text], {
            inline: false,
            submitText: 'Add'
        });
        this.form.onSubmit = this.onAdd.bind(this);
        this.ele.querySelector('#option_list')
            .querySelectorAll('.button')
            .forEach(e => {
            e.addEventListener('click', this.onRemove.bind(this));
        });
        this.childComponents.push(this.form);
        return super.init();
    }
    onAdd() {
        let option = this.form.getData();
        if (this.form.reportValidity()) {
            this.options.push(option);
            this.init();
        }
    }
    onRemove(e) {
        let i = e.target.id.split('_')[1];
        this.options.splice(parseInt(i), 1);
        this.init();
    }
    getData() {
        return this.options;
    }
    listTemplate() {
        return this.options.map((o, i) => {
            return `<div class='columns'>
                        <div class='column'><strong>Value: </strong>${o.value}</div>
                        <div class='column'><strong>Text: </strong>${o.text}</div>
                        <div class='column'>
                            <a id='remove_${i}' class='button is-danger is-small'>
                                <i class='fa fa-minus'></i>
                            </a>
                        </div>
                    </div>`;
        }).join('');
    }
    template() {
        return `<h3>Add Options</h3>
                <div class='columns'>
                    <div id='option_form' class='column'></div>
                    <div id='option_list' class='column'>${this.listTemplate()}</div>
                </div>`;
    }
}

},{"./common/Component":2,"./common/Inputs":3}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Component {
    constructor(ele, config) {
        this.state = {};
        this.childComponents = [];
        this.ele = ele;
        this.config = config;
    }
    setState(state) {
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
    getAttributeString() {
        if (this.config && this.config.attributes) {
            return Array.from(this.config.attributes.entries()).map(e => {
                return `${e[0]}${e[1] ? `='${e[1]}'` : ''}`;
            }).join(' ');
        }
        return null;
    }
    template() {
        return ``;
    }
}
exports.default = Component;
exports.Component = Component;

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Component_1 = require("./Component");
class Input extends Component_1.Component {
    constructor(ele, name, config) {
        super(ele, config);
        this.name = name;
    }
    getData() {
        let obj = {};
        obj[this.name] = this.value;
        return obj;
    }
    onChange(e) {
        this.value = e.target.value;
        if (this.onChangeCallback)
            this.onChangeCallback(this.value);
    }
    setOnChangeCallBack(callback) {
        this.onChangeCallback = callback;
    }
}
exports.Input = Input;
class Form extends Component_1.Component {
    constructor(ele, inputs, config) {
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
            Object.assign(data, i.getData());
        });
        return data;
    }
    onSubmit() {
        console.log(this.getData());
    }
    onCancel() {
        this.ele.querySelector('form').reset();
    }
    inputsTemplate() {
        let config = this.config, template = this.config && config.inline ?
            (_v, i) => { return `<p id='input_${i}' class='control'></p>`; } :
            (_v, i) => {
                return `<div class='field'>
                            <p id='input_${i}' class='control'></p>
                        </div>`;
            };
        return this.childComponents.map(template).join('');
    }
    reportValidity() {
        let form = this.ele.querySelector('form');
        return form.reportValidity();
    }
    template() {
        let config = this.config;
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
exports.Form = Form;
class Textinput extends Input {
    constructor(ele, name, config) {
        super(ele, name, config);
    }
    async init() {
        this.ele.innerHTML = this.template();
        this.ele.querySelector('input').addEventListener('change', this.onChange.bind(this));
        return super.init();
    }
    template() {
        let config = this.config;
        return `<label>${config.label ? config.label : name}
                    <input class='input' type='${config.type ? config.type : 'text'}' 
                        placeholder='${config.placeholder ? config.placeholder : 'input'}' ${this.getAttributeString()}>
                </label>`;
    }
}
exports.Textinput = Textinput;
class Textarea extends Input {
    constructor(ele, name, config) {
        super(ele, name, config);
    }
    async init() {
        this.ele.innerHTML = this.template();
        this.ele.querySelector('textarea').addEventListener('change', this.onChange.bind(this));
        return super.init();
    }
    template() {
        let config = this.config;
        return `<label>${config.label ? config.label : this.name}
                    <textarea class='textarea' placeholder='${config.placeholder ? config.placeholder : 'Input'}'
                    ${config.rows ? ` rows='${config.rows}'` : ''} ${this.getAttributeString()}></textarea>
                </label>`;
    }
}
exports.Textarea = Textarea;
class Dropdown extends Input {
    constructor(ele, name, options, config) {
        super(ele, name, config);
        this.options = options;
    }
    async init() {
        this.ele.innerHTML = this.template();
        this.ele.querySelector('select').addEventListener('change', this.onChange.bind(this));
        return super.init();
    }
    optionsTemplate() {
        return this.options.map(o => {
            return `<option value='${o.value}'>${o.text}</option>`;
        }).join('');
    }
    template() {
        let config = this.config;
        return `<label>${config.label ? config.label : this.name}
                    <span class='select'><select ${this.getAttributeString()}>${this.optionsTemplate()}</select></span>
                </label>`;
    }
}
exports.Dropdown = Dropdown;
class Checkbox extends Input {
    constructor(ele, name, config) {
        super(ele, name, config);
    }
    async init() {
        this.ele.innerHTML = this.template();
        this.ele.querySelector('input').addEventListener('change', this.onChange.bind(this));
        return super.init();
    }
    onChange(e) {
        this.value = e.target.checked;
    }
    template() {
        let config = this.config;
        return `<label class='checkbox'>${config.label ? config.label : this.name}<input type='checkbox' ${this.getAttributeString()}></label>`;
    }
}
exports.Checkbox = Checkbox;
class Radio extends Input {
    constructor(ele, name, options, config) {
        super(ele, name, config);
        this.options = options;
    }
    async init() {
        this.ele.innerHTML = this.template();
        this.ele.querySelector('div').addEventListener('change', this.onChange.bind(this));
        return super.init();
    }
    radioTemplate() {
        let config = this.config;
        return this.options.map(o => {
            return `<label class='radio'>${config.label ? config.label : this.name}
                        <input type='radio' value='${o.value}' name='${this.name}'>${o.text}
                    </label>`;
        }).join('');
    }
    onChange(e) {
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
exports.Radio = Radio;

},{"./Component":2}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Component_1 = require("./components/common/Component");
const QuestionCreation_1 = require("./components/QuestionCreation");
class Main extends Component_1.default {
    static load() {
        let main = new Main(document.body);
        main.init();
    }
    async init() {
        this.ele.innerHTML = this.template();
        this.questionForm = new QuestionCreation_1.default(this.ele.querySelector('#question_form'));
        this.questionForm.onSubmit = this.newQuestion.bind(this);
        this.childComponents.push(this.questionForm);
        return super.init();
    }
    newQuestion() {
        console.log(this.questionForm.getData());
        //TODO: create input factory from QuestionData
    }
    template() {
        return `<div id='question_form'></div>`;
    }
}
document.addEventListener('DOMContentLoaded', Main.load);

},{"./components/QuestionCreation":1,"./components/common/Component":2}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY29tcG9uZW50cy9RdWVzdGlvbkNyZWF0aW9uLnRzIiwic3JjL2NvbXBvbmVudHMvY29tbW9uL0NvbXBvbmVudC50cyIsInNyYy9jb21wb25lbnRzL2NvbW1vbi9JbnB1dHMudHMiLCJzcmMvbWFpbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUEsa0RBQTJDO0FBQzNDLDRDQUF1SDtBQUV2SCxNQUFxQixZQUFhLFNBQVEsbUJBQVM7SUFBbkQ7O1FBR1ksZ0JBQVcsR0FBNkI7WUFDNUMsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxhQUFhLEVBQUU7WUFDbEMsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUU7WUFDL0IsRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUU7WUFDeEMsRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUU7WUFDeEMsRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUU7WUFDeEMsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUU7U0FDcEMsQ0FBQztRQUNNLGlCQUFZLEdBQWE7WUFDN0IsVUFBVTtZQUNWLE9BQU87U0FDVixDQUFDO0lBZ0VOLENBQUM7SUE3REcsS0FBSyxDQUFDLElBQUk7UUFFTixJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7UUFFckMsSUFBSSxJQUFJLEdBQUcsSUFBSSxrQkFBUyxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUU7WUFDbkMsS0FBSyxFQUFFLGFBQWE7WUFDcEIsV0FBVyxFQUFFLE9BQU87U0FDdkIsQ0FBQyxFQUNFLElBQUksR0FBRyxJQUFJLGlCQUFRLENBQUMsSUFBSSxFQUFF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TyxFQUFFLENBQUMsQ0FBQztRQUN6Qyw4Q0FBOEM7SUFDbEQsQ0FBQztJQUVELFFBQVE7UUFDSixPQUFPLGdDQUFnQyxDQUFDO0lBQzVDLENBQUM7Q0FDSjtBQUVELFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxrQkFBa0IsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJpbXBvcnQgQ29tcG9uZW50IGZyb20gJy4vY29tbW9uL0NvbXBvbmVudCc7XG5pbXBvcnQgeyBGb3JtLCBPcHRpb24sIERyb3Bkb3duLCBUZXh0aW5wdXQsIFRleHRhcmVhLCBJbnB1dENvbmZpZywgRm9ybUNvbmZpZywgVGV4dGFyZWFDb25maWcgfSBmcm9tICcuL2NvbW1vbi9JbnB1dHMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBRdWVzdGlvbkZvcm0gZXh0ZW5kcyBDb21wb25lbnQge1xuXG4gICAgcHJpdmF0ZSBmb3JtOiBGb3JtO1xuICAgIHByaXZhdGUgdHlwZU9wdGlvbnM6IE9wdGlvbjxzdHJpbmcsIHN0cmluZz5bXSA9IFtcbiAgICAgICAgeyB2YWx1ZTogJycsIHRleHQ6ICdTZWxlY3QgVHlwZScgfSxcbiAgICAgICAgeyB2YWx1ZTogJ3RleHQnLCB0ZXh0OiAnVGV4dCcgfSxcbiAgICAgICAgeyB2YWx1ZTogJ3RleHRhcmVhJywgdGV4dDogJ1RleHQgQXJlYScgfSxcbiAgICAgICAgeyB2YWx1ZTogJ2Ryb3Bkb3duJywgdGV4dDogJ0Ryb3AgRG93bicgfSxcbiAgICAgICAgeyB2YWx1ZTogJ2NoZWNrYm94JywgdGV4dDogJ0NoZWNrIEJveCcgfSxcbiAgICAgICAgeyB2YWx1ZTogJ3JhZGlvJywgdGV4dDogJ1JhZGlvJyB9XG4gICAgXTtcbiAgICBwcml2YXRlIG9wdGlvbmVkVHlwZTogc3RyaW5nW10gPSBbXG4gICAgICAgICdkcm9wZG93bicsXG4gICAgICAgICdyYWRpbydcbiAgICBdO1xuICAgIHByaXZhdGUgb3B0aW9uc0lucHV0OiBPcHRpb25zSW5wdXQ7XG5cbiAgICBhc3luYyBpbml0KCkge1xuXG4gICAgICAgIHRoaXMuZWxlLmlubmVySFRNTCA9IHRoaXMudGVtcGxhdGUoKTtcblxuICAgICAgICBsZXQgbmFtZSA9IG5ldyBUZXh0aW5wdXQobnVsbCwgJ25hbWUnLCB7XG4gICAgICAgICAgICBsYWJlbDogJ0ZpZWxkIE5hbWU6JyxcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyOiAnRmllbGQnXG4gICAgICAgIH0pLFxuICAgICAgICAgICAgdHlwZSA9IG5ldyBEcm9wZG93bihudWxsLCAndHlwZScsIHRoaXMudHlwZU9wdGlvbnMsIHtcbiAgICAgICAgICAgICAgICBsYWJlbDogJ0lucHV0IFR5cGU6J1xuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBkZXNjID0gbmV3IFRleHRhcmVhKG51bGwsICdxdWVzdGlvbicsIHtcbiAgICAgICAgICAgICAgICBsYWJlbDogJ1F1ZXN0aW9uOicsXG4gICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI6ICdRdWVzdGlvbiAuIC4gLidcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIHR5cGUuc2V0T25DaGFuZ2VDYWxsQmFjayh0aGlzLm9uVHlwZUNoYW5nZS5iaW5kKHRoaXMpKTtcblxuICAgICAgICB0aGlzLmZvcm0gPSBuZXcgRm9ybSh0aGlzLmVsZS5xdWVyeVNlbGVjdG9yKCcjY3JlYXRlX2Zvcm0nKSwgW25hbWUsIHR5cGUsIGRlc2NdKTtcbiAgICAgICAgdGhpcy5mb3JtLm9uU3VibWl0ID0gdGhpcy5vblN1Ym1pdC5iaW5kKHRoaXMpO1xuXG4gICAgICAgIHRoaXMuY2hpbGRDb21wb25lbnRzLnB1c2godGhpcy5mb3JtKTtcbiAgICAgICAgcmV0dXJuIHN1cGVyLmluaXQoKTtcbiAgICB9XG4gICAgb25UeXBlQ2hhbmdlKHZhbHVlOiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKHRoaXMub3B0aW9uZWRUeXBlLmluY2x1ZGVzKHZhbHVlKSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coYCR7dmFsdWV9IG5lZWRzIG9wdGlvbnNgKVxuICAgICAgICAgICAgdGhpcy5vcHRpb25zSW5wdXQgPSBuZXcgT3B0aW9uc0lucHV0KHRoaXMuZWxlLnF1ZXJ5U2VsZWN0b3IoJyNvcHRpb25zX3NlYycpKTtcbiAgICAgICAgICAgIHRoaXMub3B0aW9uc0lucHV0LmluaXQoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZWxlLnF1ZXJ5U2VsZWN0b3IoJyNvcHRpb25zX3NlYycpLmlubmVySFRNTCA9ICcnO1xuICAgICAgICAgICAgdGhpcy5vcHRpb25zSW5wdXQgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxuICAgIG9uU3VibWl0KCkge1xuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmdldERhdGEoKSlcbiAgICB9XG5cbiAgICBnZXREYXRhKCkge1xuICAgICAgICBsZXQgaW5wdXREYXRhID0gdGhpcy5mb3JtLmdldERhdGEoKSBhcyBRdWVzdGlvbkRhdGE7XG4gICAgICAgIC8vVE9ETzogdmFsaWRhdGUgUXVlc3Rpb25EYXRhXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnNJbnB1dCkge1xuICAgICAgICAgICAgaW5wdXREYXRhLm9wdGlvbnMgPSB0aGlzLm9wdGlvbnNJbnB1dC5nZXREYXRhKCk7XG4gICAgICAgICAgICBpZiAoaW5wdXREYXRhLm9wdGlvbnMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgbGV0IG1zZyA9ICdaZXJvIG9wdGlvbnM7IEFkZCBzb21lJztcbiAgICAgICAgICAgICAgICBhbGVydChtc2cpO1xuICAgICAgICAgICAgICAgIHRocm93IG1zZztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaW5wdXREYXRhO1xuICAgIH1cblxuICAgIHRlbXBsYXRlKCkge1xuICAgICAgICByZXR1cm4gYDxkaXYgY2xhc3M9J2JveCc+XG4gICAgICAgICAgICAgICAgICAgIDxoMSBjbGFzcz0ndGl0bGUnPkNyZWF0ZSBRdWVzdGlvbjwvaDE+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9J2NvbHVtbnMnPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBpZD0nY3JlYXRlX2Zvcm0nIGNsYXNzPSdjb2x1bW4nPjwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBpZD0nb3B0aW9uc19zZWMnIGNsYXNzPSdjb2x1bW4nPjxkaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgPGRpdj5gO1xuICAgIH1cbn1cblxuY2xhc3MgT3B0aW9uc0lucHV0IGV4dGVuZHMgQ29tcG9uZW50IHtcblxuICAgIHByaXZhdGUgZm9ybTogRm9ybTtcbiAgICBwcml2YXRlIG9wdGlvbnM6IE9wdGlvbjxzdHJpbmcsIHN0cmluZz5bXTtcblxuICAgIGNvbnN0cnVjdG9yKGVsZTogRWxlbWVudCkge1xuICAgICAgICBzdXBlcihlbGUpO1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSBuZXcgQXJyYXk8T3B0aW9uPHN0cmluZywgc3RyaW5nPj4oKTtcbiAgICB9XG5cbiAgICBhc3luYyBpbml0KCkge1xuXG4gICAgICAgIHRoaXMuZWxlLmlubmVySFRNTCA9IHRoaXMudGVtcGxhdGUoKTtcblxuICAgICAgICBsZXQgdmFsdWUgPSBuZXcgVGV4dGlucHV0KG51bGwsICd2YWx1ZScsIHtcbiAgICAgICAgICAgIGxhYmVsOiAnVmFsdWU6JyxcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyOiAndmFsdWUnLFxuICAgICAgICAgICAgYXR0cmlidXRlczogbmV3IE1hcDxzdHJpbmcsIHN0cmluZz4oW1xuICAgICAgICAgICAgICAgIFsncmVxdWlyZWQnLCBudWxsXVxuICAgICAgICAgICAgXSlcbiAgICAgICAgfSksXG4gICAgICAgICAgICB0ZXh0ID0gbmV3IFRleHRpbnB1dChudWxsLCAndGV4dCcsIHtcbiAgICAgICAgICAgICAgICBsYWJlbDogJ0Rpc3BsYXkgVGV4dDonLFxuICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyOiAndGV4dCcsXG4gICAgICAgICAgICAgICAgYXR0cmlidXRlczogbmV3IE1hcDxzdHJpbmcsIHN0cmluZz4oW1xuICAgICAgICAgICAgICAgICAgICBbJ3JlcXVpcmVkJywgbnVsbF1cbiAgICAgICAgICAgICAgICBdKVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5mb3JtID0gbmV3IEZvcm0odGhpcy5lbGUucXVlcnlTZWxlY3RvcignI29wdGlvbl9mb3JtJyksXG4gICAgICAgICAgICBbdmFsdWUsIHRleHRdLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGlubGluZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgc3VibWl0VGV4dDogJ0FkZCdcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuZm9ybS5vblN1Ym1pdCA9IHRoaXMub25BZGQuYmluZCh0aGlzKTtcblxuICAgICAgICB0aGlzLmVsZS5xdWVyeVNlbGVjdG9yKCcjb3B0aW9uX2xpc3QnKVxuICAgICAgICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoJy5idXR0b24nKVxuICAgICAgICAgICAgLmZvckVhY2goZSA9PiB7XG4gICAgICAgICAgICAgICAgZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMub25SZW1vdmUuYmluZCh0aGlzKSk7XG4gICAgICAgICAgICB9KVxuXG4gICAgICAgIHRoaXMuY2hpbGRDb21wb25lbnRzLnB1c2godGhpcy5mb3JtKTtcblxuICAgICAgICByZXR1cm4gc3VwZXIuaW5pdCgpO1xuICAgIH1cblxuICAgIG9uQWRkKCkge1xuICAgICAgICBsZXQgb3B0aW9uOiBPcHRpb248c3RyaW5nLCBzdHJpbmc+ID0gdGhpcy5mb3JtLmdldERhdGEoKSBhcyBPcHRpb248c3RyaW5nLCBzdHJpbmc+O1xuICAgICAgICBpZiAodGhpcy5mb3JtLnJlcG9ydFZhbGlkaXR5KCkpIHtcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5wdXNoKG9wdGlvbik7XG4gICAgICAgICAgICB0aGlzLmluaXQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uUmVtb3ZlKGU6IEV2ZW50KSB7XG4gICAgICAgIGxldCBpID0gKGUudGFyZ2V0IGFzIEVsZW1lbnQpLmlkLnNwbGl0KCdfJylbMV07XG4gICAgICAgIHRoaXMub3B0aW9ucy5zcGxpY2UocGFyc2VJbnQoaSksIDEpO1xuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICB9XG5cbiAgICBnZXREYXRhKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zO1xuICAgIH1cblxuICAgIGxpc3RUZW1wbGF0ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5tYXAoKG8sIGkpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBgPGRpdiBjbGFzcz0nY29sdW1ucyc+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPSdjb2x1bW4nPjxzdHJvbmc+VmFsdWU6IDwvc3Ryb25nPiR7by52YWx1ZX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9J2NvbHVtbic+PHN0cm9uZz5UZXh0OiA8L3N0cm9uZz4ke28udGV4dH08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9J2NvbHVtbic+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgaWQ9J3JlbW92ZV8ke2l9JyBjbGFzcz0nYnV0dG9uIGlzLWRhbmdlciBpcy1zbWFsbCc+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPSdmYSBmYS1taW51cyc+PC9pPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5gO1xuICAgICAgICB9KS5qb2luKCcnKTtcbiAgICB9XG5cbiAgICB0ZW1wbGF0ZSgpIHtcbiAgICAgICAgcmV0dXJuIGA8aDM+QWRkIE9wdGlvbnM8L2gzPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9J2NvbHVtbnMnPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGlkPSdvcHRpb25fZm9ybScgY2xhc3M9J2NvbHVtbic+PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgaWQ9J29wdGlvbl9saXN0JyBjbGFzcz0nY29sdW1uJz4ke3RoaXMubGlzdFRlbXBsYXRlKCl9PC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+YDtcbiAgICB9XG59XG5cbmludGVyZmFjZSBRdWVzdGlvbkRhdGEge1xuICAgIG5hbWU6IHN0cmluZztcbiAgICB0eXBlOiBzdHJpbmc7XG4gICAgcXVlc3Rpb246IHN0cmluZztcbiAgICBvcHRpb25zPzogQXJyYXk8T3B0aW9uPHN0cmluZywgc3RyaW5nPj5cbn0iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBDb21wb25lbnQge1xuXG4gICAgcmVhZG9ubHkgc3RhdGU6IGFueSA9IHt9O1xuICAgIGVsZTogRWxlbWVudDtcbiAgICByZWFkb25seSBjaGlsZENvbXBvbmVudHM6IEFycmF5PENvbXBvbmVudD4gPSBbXTtcbiAgICByZWFkb25seSBjb25maWc6IENvbXBvbmVudENvbmZpZztcblxuICAgIGNvbnN0cnVjdG9yKGVsZTogRWxlbWVudCwgY29uZmlnPzogQ29tcG9uZW50Q29uZmlnKSB7XG4gICAgICAgIHRoaXMuZWxlID0gZWxlO1xuICAgICAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcbiAgICB9XG4gICAgc2V0U3RhdGUoc3RhdGU6IGFueSkge1xuICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMuc3RhdGUsIHN0YXRlKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5pdCgpO1xuICAgIH1cbiAgICBhc3luYyBpbml0KCkge1xuICAgICAgICBhd2FpdCB0aGlzLmluaXRDaGlsZGVybigpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgaW5pdENoaWxkZXJuKCkge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwodGhpcy5jaGlsZENvbXBvbmVudHMubWFwKGMgPT4geyByZXR1cm4gYy5pbml0KCk7IH0pKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgZ2V0QXR0cmlidXRlU3RyaW5nKCkge1xuICAgICAgICBcbiAgICAgICAgaWYgKHRoaXMuY29uZmlnICYmIHRoaXMuY29uZmlnLmF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICAgIHJldHVybiBBcnJheS5mcm9tKHRoaXMuY29uZmlnLmF0dHJpYnV0ZXMuZW50cmllcygpKS5tYXAoZSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGAke2VbMF19JHtlWzFdID8gYD0nJHtlWzFdfSdgIDogJyd9YFxuICAgICAgICAgICAgfSkuam9pbignICcpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHRlbXBsYXRlKCkge1xuICAgICAgICByZXR1cm4gYGA7XG4gICAgfVxufVxuXG5pbnRlcmZhY2UgQ29tcG9uZW50Q29uZmlnIHtcbiAgICBjbGFzc2VzPzogc3RyaW5nW107XG4gICAgYXR0cmlidXRlcz86IE1hcDxzdHJpbmcsIHN0cmluZz47XG59XG5cbmV4cG9ydCB7IENvbXBvbmVudCwgQ29tcG9uZW50Q29uZmlnIH0iLCJpbXBvcnQgeyBDb21wb25lbnQsIENvbXBvbmVudENvbmZpZyB9IGZyb20gJy4vQ29tcG9uZW50JztcblxuYWJzdHJhY3QgY2xhc3MgSW5wdXQgZXh0ZW5kcyBDb21wb25lbnQge1xuXG4gICAgcHJvdGVjdGVkIG5hbWU6IHN0cmluZztcbiAgICBwcm90ZWN0ZWQgdmFsdWU6IHN0cmluZyB8IG51bWJlciB8IGJvb2xlYW47XG4gICAgcHJpdmF0ZSBvbkNoYW5nZUNhbGxiYWNrOiAodmFsdWU6IHN0cmluZyB8IG51bWJlciB8IGJvb2xlYW4pID0+IGFueTtcblxuICAgIGNvbnN0cnVjdG9yKGVsZTogRWxlbWVudCwgbmFtZTogc3RyaW5nLCBjb25maWc/OiBJbnB1dENvbmZpZykge1xuICAgICAgICBzdXBlcihlbGUsIGNvbmZpZyk7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgfVxuXG4gICAgZ2V0RGF0YSgpIHtcbiAgICAgICAgbGV0IG9iajogeyBbazogc3RyaW5nXTogc3RyaW5nIHwgbnVtYmVyIHwgYm9vbGVhbiB9ID0ge307XG4gICAgICAgIG9ialt0aGlzLm5hbWVdID0gdGhpcy52YWx1ZVxuICAgICAgICByZXR1cm4gb2JqO1xuICAgIH1cbiAgICBvbkNoYW5nZShlOiBFdmVudCkge1xuICAgICAgICB0aGlzLnZhbHVlID0gKGUudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlO1xuXG4gICAgICAgIGlmICh0aGlzLm9uQ2hhbmdlQ2FsbGJhY2spIHRoaXMub25DaGFuZ2VDYWxsYmFjayh0aGlzLnZhbHVlKTtcbiAgICB9XG4gICAgc2V0T25DaGFuZ2VDYWxsQmFjayhjYWxsYmFjazogKHZhbHVlOiBzdHJpbmcgfCBudW1iZXIgfCBib29sZWFuKSA9PiBhbnkpIHtcbiAgICAgICAgdGhpcy5vbkNoYW5nZUNhbGxiYWNrID0gY2FsbGJhY2s7XG4gICAgfVxufVxuXG5pbnRlcmZhY2UgSW5wdXRDb25maWcgZXh0ZW5kcyBDb21wb25lbnRDb25maWcge1xuICAgIGxhYmVsOiBzdHJpbmc7XG4gICAgcGxhY2Vob2xkZXI/OiBzdHJpbmc7XG59XG5cbmludGVyZmFjZSBPcHRpb248VCBleHRlbmRzIG51bWJlciB8IHN0cmluZywgVSBleHRlbmRzIG51bWJlciB8IHN0cmluZz4ge1xuICAgIHZhbHVlOiBUO1xuICAgIHRleHQ6IFU7XG59XG5cbmNsYXNzIEZvcm0gZXh0ZW5kcyBDb21wb25lbnQge1xuXG4gICAgY29uc3RydWN0b3IoZWxlOiBFbGVtZW50LCBpbnB1dHM6IElucHV0W10sIGNvbmZpZz86IEZvcm1Db25maWcpIHtcbiAgICAgICAgc3VwZXIoZWxlLCBjb25maWcpO1xuICAgICAgICB0aGlzLmNoaWxkQ29tcG9uZW50cy5wdXNoKC4uLmlucHV0cyk7XG4gICAgfVxuXG4gICAgYXN5bmMgaW5pdCgpIHtcbiAgICAgICAgdGhpcy5lbGUuaW5uZXJIVE1MID0gdGhpcy50ZW1wbGF0ZSgpO1xuXG4gICAgICAgIHRoaXMuY2hpbGRDb21wb25lbnRzLmZvckVhY2goKHYsIGkpID0+IHtcbiAgICAgICAgICAgIHYuZWxlID0gdGhpcy5lbGUucXVlcnlTZWxlY3RvcihgI2lucHV0XyR7aX1gKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5lbGUucXVlcnlTZWxlY3RvcignI3N1Ym1pdCcpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5vblN1Ym1pdC5iaW5kKHRoaXMpKTtcbiAgICAgICAgdGhpcy5lbGUucXVlcnlTZWxlY3RvcignI2NhbmNlbCcpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5vbkNhbmNlbC5iaW5kKHRoaXMpKTtcblxuICAgICAgICByZXR1cm4gc3VwZXIuaW5pdCgpO1xuICAgIH1cblxuICAgIGdldERhdGEoKSB7XG4gICAgICAgIGxldCBkYXRhID0ge307XG4gICAgICAgIHRoaXMuY2hpbGRDb21wb25lbnRzLmZvckVhY2goaSA9PiB7XG4gICAgICAgICAgICBPYmplY3QuYXNzaWduKGRhdGEsIChpIGFzIElucHV0KS5nZXREYXRhKCkpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfVxuXG4gICAgb25TdWJtaXQoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMuZ2V0RGF0YSgpKTtcbiAgICB9XG4gICAgb25DYW5jZWwoKSB7XG4gICAgICAgIHRoaXMuZWxlLnF1ZXJ5U2VsZWN0b3IoJ2Zvcm0nKS5yZXNldCgpO1xuICAgIH1cblxuICAgIHByaXZhdGUgaW5wdXRzVGVtcGxhdGUoKSB7XG4gICAgICAgIGxldCBjb25maWcgPSB0aGlzLmNvbmZpZyBhcyBGb3JtQ29uZmlnLFxuICAgICAgICAgICAgdGVtcGxhdGUgPSB0aGlzLmNvbmZpZyAmJiBjb25maWcuaW5saW5lID9cbiAgICAgICAgICAgICAgICAoX3Y6IGFueSwgaTogbnVtYmVyKSA9PiB7IHJldHVybiBgPHAgaWQ9J2lucHV0XyR7aX0nIGNsYXNzPSdjb250cm9sJz48L3A+YDsgfSA6XG4gICAgICAgICAgICAgICAgKF92OiBhbnksIGk6IG51bWJlcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYDxkaXYgY2xhc3M9J2ZpZWxkJz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cCBpZD0naW5wdXRfJHtpfScgY2xhc3M9J2NvbnRyb2wnPjwvcD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PmA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5jaGlsZENvbXBvbmVudHMubWFwKHRlbXBsYXRlKS5qb2luKCcnKTtcbiAgICB9XG5cbiAgICByZXBvcnRWYWxpZGl0eSgpe1xuICAgICAgICBsZXQgZm9ybSA9IHRoaXMuZWxlLnF1ZXJ5U2VsZWN0b3IoJ2Zvcm0nKSBhcyBIVE1MRm9ybUVsZW1lbnQ7XG4gICAgICAgIHJldHVybiBmb3JtLnJlcG9ydFZhbGlkaXR5KCk7XG4gICAgfVxuXG4gICAgdGVtcGxhdGUoKSB7XG4gICAgICAgIGxldCBjb25maWcgPSB0aGlzLmNvbmZpZyBhcyBGb3JtQ29uZmlnO1xuICAgICAgICByZXR1cm4gYDxmb3JtPlxuICAgICAgICAgICAgICAgICAgICAke3RoaXMuY29uZmlnICYmIGNvbmZpZy5pbmxpbmUgPyAnJyA6IHRoaXMuaW5wdXRzVGVtcGxhdGUoKX1cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9J2ZpZWxkIGlzLWdyb3VwZWQnPlxuICAgICAgICAgICAgICAgICAgICAgICAgJHt0aGlzLmNvbmZpZyAmJiBjb25maWcuaW5saW5lID8gdGhpcy5pbnB1dHNUZW1wbGF0ZSgpIDogJyd9XG4gICAgICAgICAgICAgICAgICAgICAgICA8cCBjbGFzcz0nY29udHJvbCc+PGEgaWQ9J3N1Ym1pdCcgY2xhc3M9J2J1dHRvbiBpcy1wcmltYXJ5Jz4ke3RoaXMuY29uZmlnICYmIGNvbmZpZy5zdWJtaXRUZXh0ID8gY29uZmlnLnN1Ym1pdFRleHQgOiAnU3VibWl0J308L2E+PC9wPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3M9J2NvbnRyb2wnPjxhIGlkPSdjYW5jZWwnIGNsYXNzPSdidXR0b24gaXMtbGlnaHQnPiR7dGhpcy5jb25maWcgJiYgY29uZmlnLmNhbmNlbFRleHQgPyBjb25maWcuY2FuY2VsVGV4dCA6ICdDYW5jZWwnfTwvYT48L3A+XG4gICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8L2Zvcm0+YDtcbiAgICB9XG59XG5cbmludGVyZmFjZSBGb3JtQ29uZmlnIGV4dGVuZHMgQ29tcG9uZW50Q29uZmlnIHtcbiAgICBpbmxpbmU6IGJvb2xlYW47XG4gICAgc3VibWl0VGV4dD86IHN0cmluZztcbiAgICBjYW5jZWxUZXh0Pzogc3RyaW5nO1xufVxuXG5jbGFzcyBUZXh0aW5wdXQgZXh0ZW5kcyBJbnB1dCB7XG5cblxuICAgIGNvbnN0cnVjdG9yKGVsZTogRWxlbWVudCwgbmFtZTogc3RyaW5nLCBjb25maWc/OiBUZXh0aW5wdXRDb25maWcpIHtcbiAgICAgICAgc3VwZXIoZWxlLCBuYW1lLCBjb25maWcpO1xuICAgIH1cblxuICAgIGFzeW5jIGluaXQoKSB7XG4gICAgICAgIHRoaXMuZWxlLmlubmVySFRNTCA9IHRoaXMudGVtcGxhdGUoKTtcbiAgICAgICAgdGhpcy5lbGUucXVlcnlTZWxlY3RvcignaW5wdXQnKS5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCB0aGlzLm9uQ2hhbmdlLmJpbmQodGhpcykpO1xuICAgICAgICByZXR1cm4gc3VwZXIuaW5pdCgpO1xuICAgIH1cblxuICAgIHRlbXBsYXRlKCkge1xuICAgICAgICBsZXQgY29uZmlnID0gdGhpcy5jb25maWcgYXMgVGV4dGlucHV0Q29uZmlnXG4gICAgICAgIHJldHVybiBgPGxhYmVsPiR7Y29uZmlnLmxhYmVsID8gY29uZmlnLmxhYmVsIDogbmFtZX1cbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IGNsYXNzPSdpbnB1dCcgdHlwZT0nJHtjb25maWcudHlwZSA/IGNvbmZpZy50eXBlIDogJ3RleHQnfScgXG4gICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj0nJHtjb25maWcucGxhY2Vob2xkZXIgPyBjb25maWcucGxhY2Vob2xkZXIgOiAnaW5wdXQnfScgJHt0aGlzLmdldEF0dHJpYnV0ZVN0cmluZygpfT5cbiAgICAgICAgICAgICAgICA8L2xhYmVsPmA7XG4gICAgfVxufVxuaW50ZXJmYWNlIFRleHRpbnB1dENvbmZpZyBleHRlbmRzIElucHV0Q29uZmlnIHtcbiAgICB0eXBlPzogc3RyaW5nO1xufVxuY2xhc3MgVGV4dGFyZWEgZXh0ZW5kcyBJbnB1dCB7XG5cbiAgICBjb25zdHJ1Y3RvcihlbGU6IEVsZW1lbnQsIG5hbWU6IHN0cmluZywgY29uZmlnPzogVGV4dGFyZWFDb25maWcpIHtcbiAgICAgICAgc3VwZXIoZWxlLCBuYW1lLCBjb25maWcpO1xuICAgIH1cblxuICAgIGFzeW5jIGluaXQoKSB7XG4gICAgICAgIHRoaXMuZWxlLmlubmVySFRNTCA9IHRoaXMudGVtcGxhdGUoKTtcbiAgICAgICAgdGhpcy5lbGUucXVlcnlTZWxlY3RvcigndGV4dGFyZWEnKS5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCB0aGlzLm9uQ2hhbmdlLmJpbmQodGhpcykpO1xuICAgICAgICByZXR1cm4gc3VwZXIuaW5pdCgpO1xuICAgIH1cblxuICAgIHRlbXBsYXRlKCkge1xuICAgICAgICBsZXQgY29uZmlnID0gdGhpcy5jb25maWcgYXMgVGV4dGFyZWFDb25maWc7XG4gICAgICAgIHJldHVybiBgPGxhYmVsPiR7Y29uZmlnLmxhYmVsID8gY29uZmlnLmxhYmVsIDogdGhpcy5uYW1lfVxuICAgICAgICAgICAgICAgICAgICA8dGV4dGFyZWEgY2xhc3M9J3RleHRhcmVhJyBwbGFjZWhvbGRlcj0nJHtjb25maWcucGxhY2Vob2xkZXIgPyBjb25maWcucGxhY2Vob2xkZXIgOiAnSW5wdXQnfSdcbiAgICAgICAgICAgICAgICAgICAgJHtjb25maWcucm93cyA/IGAgcm93cz0nJHtjb25maWcucm93c30nYCA6ICcnfSAke3RoaXMuZ2V0QXR0cmlidXRlU3RyaW5nKCl9PjwvdGV4dGFyZWE+XG4gICAgICAgICAgICAgICAgPC9sYWJlbD5gO1xuICAgIH1cbn1cblxuaW50ZXJmYWNlIFRleHRhcmVhQ29uZmlnIGV4dGVuZHMgSW5wdXRDb25maWcge1xuICAgIHJvd3M/OiBudW1iZXI7XG59XG5cblxuY2xhc3MgRHJvcGRvd248VCBleHRlbmRzIG51bWJlciB8IHN0cmluZywgVSBleHRlbmRzIG51bWJlciB8IHN0cmluZz4gZXh0ZW5kcyBJbnB1dCB7XG5cbiAgICBwcml2YXRlIG9wdGlvbnM6IE9wdGlvbjxULCBVPltdO1xuXG4gICAgY29uc3RydWN0b3IoZWxlOiBFbGVtZW50LCBuYW1lOiBzdHJpbmcsIG9wdGlvbnM6IE9wdGlvbjxULCBVPltdLCBjb25maWc/OiBJbnB1dENvbmZpZykge1xuICAgICAgICBzdXBlcihlbGUsIG5hbWUsIGNvbmZpZyk7XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgfVxuXG4gICAgYXN5bmMgaW5pdCgpIHtcbiAgICAgICAgdGhpcy5lbGUuaW5uZXJIVE1MID0gdGhpcy50ZW1wbGF0ZSgpO1xuICAgICAgICB0aGlzLmVsZS5xdWVyeVNlbGVjdG9yKCdzZWxlY3QnKS5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCB0aGlzLm9uQ2hhbmdlLmJpbmQodGhpcykpO1xuICAgICAgICByZXR1cm4gc3VwZXIuaW5pdCgpO1xuICAgIH1cblxuICAgIHByaXZhdGUgb3B0aW9uc1RlbXBsYXRlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zLm1hcChvID0+IHtcbiAgICAgICAgICAgIHJldHVybiBgPG9wdGlvbiB2YWx1ZT0nJHtvLnZhbHVlfSc+JHtvLnRleHR9PC9vcHRpb24+YDtcbiAgICAgICAgfSkuam9pbignJyk7XG4gICAgfVxuXG4gICAgdGVtcGxhdGUoKSB7XG4gICAgICAgIGxldCBjb25maWcgPSB0aGlzLmNvbmZpZyBhcyBJbnB1dENvbmZpZ1xuICAgICAgICByZXR1cm4gYDxsYWJlbD4ke2NvbmZpZy5sYWJlbCA/IGNvbmZpZy5sYWJlbCA6IHRoaXMubmFtZX1cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9J3NlbGVjdCc+PHNlbGVjdCAke3RoaXMuZ2V0QXR0cmlidXRlU3RyaW5nKCl9PiR7dGhpcy5vcHRpb25zVGVtcGxhdGUoKX08L3NlbGVjdD48L3NwYW4+XG4gICAgICAgICAgICAgICAgPC9sYWJlbD5gO1xuICAgIH1cbn1cblxuY2xhc3MgQ2hlY2tib3ggZXh0ZW5kcyBJbnB1dCB7XG5cbiAgICBjb25zdHJ1Y3RvcihlbGU6IEVsZW1lbnQsIG5hbWU6IHN0cmluZywgY29uZmlnPzogSW5wdXRDb25maWcpIHtcbiAgICAgICAgc3VwZXIoZWxlLCBuYW1lLCBjb25maWcpO1xuICAgIH1cblxuICAgIGFzeW5jIGluaXQoKSB7XG4gICAgICAgIHRoaXMuZWxlLmlubmVySFRNTCA9IHRoaXMudGVtcGxhdGUoKTtcbiAgICAgICAgdGhpcy5lbGUucXVlcnlTZWxlY3RvcignaW5wdXQnKS5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCB0aGlzLm9uQ2hhbmdlLmJpbmQodGhpcykpO1xuICAgICAgICByZXR1cm4gc3VwZXIuaW5pdCgpO1xuICAgIH1cblxuICAgIG9uQ2hhbmdlKGU6IEV2ZW50KSB7XG4gICAgICAgIHRoaXMudmFsdWUgPSAoZS50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudCkuY2hlY2tlZDtcbiAgICB9XG5cbiAgICB0ZW1wbGF0ZSgpIHtcbiAgICAgICAgbGV0IGNvbmZpZyA9IHRoaXMuY29uZmlnIGFzIElucHV0Q29uZmlnO1xuICAgICAgICByZXR1cm4gYDxsYWJlbCBjbGFzcz0nY2hlY2tib3gnPiR7Y29uZmlnLmxhYmVsID8gY29uZmlnLmxhYmVsIDogdGhpcy5uYW1lfTxpbnB1dCB0eXBlPSdjaGVja2JveCcgJHt0aGlzLmdldEF0dHJpYnV0ZVN0cmluZygpfT48L2xhYmVsPmBcbiAgICB9XG59XG5cbmNsYXNzIFJhZGlvPFQgZXh0ZW5kcyBudW1iZXIgfCBzdHJpbmcsIFUgZXh0ZW5kcyBudW1iZXIgfCBzdHJpbmc+IGV4dGVuZHMgSW5wdXQge1xuXG4gICAgcHJpdmF0ZSBvcHRpb25zOiBPcHRpb248VCwgVT5bXTtcblxuICAgIGNvbnN0cnVjdG9yKGVsZTogRWxlbWVudCwgbmFtZTogc3RyaW5nLCBvcHRpb25zOiBPcHRpb248VCwgVT5bXSwgY29uZmlnPzogSW5wdXRDb25maWcpIHtcbiAgICAgICAgc3VwZXIoZWxlLCBuYW1lLCBjb25maWcpO1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgIH1cblxuICAgIGFzeW5jIGluaXQoKSB7XG4gICAgICAgIHRoaXMuZWxlLmlubmVySFRNTCA9IHRoaXMudGVtcGxhdGUoKTtcbiAgICAgICAgdGhpcy5lbGUucXVlcnlTZWxlY3RvcignZGl2JykuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgdGhpcy5vbkNoYW5nZS5iaW5kKHRoaXMpKTtcbiAgICAgICAgcmV0dXJuIHN1cGVyLmluaXQoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHJhZGlvVGVtcGxhdGUoKSB7XG4gICAgICAgIGxldCBjb25maWcgPSB0aGlzLmNvbmZpZyBhcyBJbnB1dENvbmZpZ1xuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zLm1hcChvID0+IHtcbiAgICAgICAgICAgIHJldHVybiBgPGxhYmVsIGNsYXNzPSdyYWRpbyc+JHtjb25maWcubGFiZWwgPyBjb25maWcubGFiZWwgOiB0aGlzLm5hbWV9XG4gICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT0ncmFkaW8nIHZhbHVlPScke28udmFsdWV9JyBuYW1lPScke3RoaXMubmFtZX0nPiR7by50ZXh0fVxuICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPmBcbiAgICAgICAgfSkuam9pbignJyk7XG4gICAgfVxuXG4gICAgb25DaGFuZ2UoZTogRXZlbnQpIHtcbiAgICAgICAgbGV0IGNoZWNrZWRJbnB1dCA9IEFycmF5LmZyb20odGhpcy5lbGUucXVlcnlTZWxlY3RvckFsbCgnaW5wdXQnKSlcbiAgICAgICAgICAgIC5maW5kKGkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBpLmNoZWNrZWQ7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnZhbHVlID0gY2hlY2tlZElucHV0LnZhbHVlO1xuICAgIH1cblxuICAgIHRlbXBsYXRlKCkge1xuICAgICAgICByZXR1cm4gYDxkaXYgY2xhc3M9J2NvbnRyb2wnPiR7dGhpcy5yYWRpb1RlbXBsYXRlKCl9PC9kaXY+YDtcbiAgICB9XG59XG5cbmV4cG9ydCB7XG4gICAgSW5wdXQsIE9wdGlvbiwgRm9ybSwgVGV4dGlucHV0LCBUZXh0YXJlYSwgRHJvcGRvd24sIENoZWNrYm94LCBSYWRpbyxcbiAgICBGb3JtQ29uZmlnLCBJbnB1dENvbmZpZywgVGV4dGFyZWFDb25maWcsIFRleHRpbnB1dENvbmZpZ1xufTsiLCJpbXBvcnQgQ29tcG9uZW50IGZyb20gJy4vY29tcG9uZW50cy9jb21tb24vQ29tcG9uZW50JztcbmltcG9ydCBRdWVzdGlvbkZvcm0gZnJvbSAnLi9jb21wb25lbnRzL1F1ZXN0aW9uQ3JlYXRpb24nO1xuXG5jbGFzcyBNYWluIGV4dGVuZHMgQ29tcG9uZW50IHtcblxuICAgIHByaXZhdGUgcXVlc3Rpb25Gb3JtOiBRdWVzdGlvbkZvcm07XG5cbiAgICBzdGF0aWMgbG9hZCgpIHtcbiAgICAgICAgbGV0IG1haW4gPSBuZXcgTWFpbihkb2N1bWVudC5ib2R5KTtcbiAgICAgICAgbWFpbi5pbml0KCk7XG4gICAgfVxuXG4gICAgYXN5bmMgaW5pdCgpIHtcbiAgICAgICAgdGhpcy5lbGUuaW5uZXJIVE1MID0gdGhpcy50ZW1wbGF0ZSgpO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5xdWVzdGlvbkZvcm0gPSBuZXcgUXVlc3Rpb25Gb3JtKHRoaXMuZWxlLnF1ZXJ5U2VsZWN0b3IoJyNxdWVzdGlvbl9mb3JtJykpO1xuICAgICAgICB0aGlzLnF1ZXN0aW9uRm9ybS5vblN1Ym1pdCA9IHRoaXMubmV3UXVlc3Rpb24uYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5jaGlsZENvbXBvbmVudHMucHVzaCh0aGlzLnF1ZXN0aW9uRm9ybSk7XG5cbiAgICAgICAgXG4gICAgICAgIHJldHVybiBzdXBlci5pbml0KCk7XG4gICAgfVxuXG4gICAgbmV3UXVlc3Rpb24oKXtcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5xdWVzdGlvbkZvcm0uZ2V0RGF0YSgpKTtcbiAgICAgICAgLy9UT0RPOiBjcmVhdGUgaW5wdXQgZmFjdG9yeSBmcm9tIFF1ZXN0aW9uRGF0YVxuICAgIH1cblxuICAgIHRlbXBsYXRlKCkge1xuICAgICAgICByZXR1cm4gYDxkaXYgaWQ9J3F1ZXN0aW9uX2Zvcm0nPjwvZGl2PmA7XG4gICAgfVxufVxuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgTWFpbi5sb2FkKTsiXX0=
