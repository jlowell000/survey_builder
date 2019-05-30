(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Component_1 = require("./common/Component");
const Inputs_1 = require("./common/Inputs");
class CreateInput extends Component_1.default {
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
        console.log(this.form.getData());
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
exports.default = CreateInput;
class OptionsInput extends Component_1.default {
    constructor(ele) {
        super(ele);
        this.options = new Array();
    }
    async init() {
        this.ele.innerHTML = this.template();
        let value = new Inputs_1.Textinput(null, 'value', {
            label: 'Value:',
            placeholder: 'value'
        }), text = new Inputs_1.Textinput(null, 'text', {
            label: 'Display Text:',
            placeholder: 'text'
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
        //TODO: input validation
        this.options.push(option);
        console.log(this.options);
        this.init();
    }
    onRemove(e) {
        let i = e.target.id.split('_')[1];
        this.options.splice(parseInt(i), 1);
        this.init();
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
    templateProps() {
        let p = new Array();
        p.push(' ');
        if (this.state.readonly)
            p.push('readonly');
        if (this.state.disabled)
            p.push('disabled');
        return p.join(' ');
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
                        placeholder='${config.placeholder ? config.placeholder : 'input'}' ${this.templateProps()}>
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
                    ${config.rows ? ` rows='${config.rows}'` : ''} ${this.templateProps()}></textarea>
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
                    <span class='select'><select ${this.templateProps()}>${this.optionsTemplate()}</select></span>
                </label>`;
    }
}
exports.Dropdown = Dropdown;
class Checkbox extends Input {
    constructor(ele, name, config) {
        super(ele, name, config);
        if (config.label)
            this.label = config.label;
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
        return `<label class='checkbox'>${config.label ? config.label : this.name}<input type='checkbox' ${this.templateProps()}></label>`;
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
const CreateInput_1 = require("./components/CreateInput");
class Main extends Component_1.default {
    static load() {
        let main = new Main(document.body);
        main.init();
    }
    async init() {
        this.ele.innerHTML = this.template();
        this.childComponents.push(new CreateInput_1.default(this.ele.querySelector('#form')));
        return super.init();
    }
    template() {
        return `<div id='form'></div>`;
    }
}
document.addEventListener('DOMContentLoaded', Main.load);

},{"./components/CreateInput":1,"./components/common/Component":2}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY29tcG9uZW50cy9DcmVhdGVJbnB1dC50cyIsInNyYy9jb21wb25lbnRzL2NvbW1vbi9Db21wb25lbnQudHMiLCJzcmMvY29tcG9uZW50cy9jb21tb24vSW5wdXRzLnRzIiwic3JjL21haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBLGtEQUEyQztBQUMzQyw0Q0FBdUg7QUFFdkgsTUFBcUIsV0FBWSxTQUFRLG1CQUFTO0lBQWxEOztRQUdZLGdCQUFXLEdBQTZCO1lBQzVDLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsYUFBYSxFQUFFO1lBQ2xDLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFO1lBQy9CLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFO1lBQ3hDLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFO1lBQ3hDLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFO1lBQ3hDLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFO1NBQ3BDLENBQUM7UUFDTSxpQkFBWSxHQUFhO1lBQzdCLFVBQVU7WUFDVixPQUFPO1NBQ1YsQ0FBQztJQWtETixDQUFDO0lBL0NHLEtBQUssQ0FBQyxJQUFJO1FBRU4sSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBRXJDLElBQUksSUFBSSxHQUFHLElBQUksa0JBQVMsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFO1lBQ25DLEtBQUssRUFBRSxhQUFhO1lBQ3BCLFdBQVcsRUFBRSxPQUFPO1NBQ3ZCLENBQUMsRUFDRSxJQUFJLEdBQUcsSUFBSSxpQkFBUSxDQUFDLElBQUksRUFBRSxNQUFN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LEVBQUUsQ0FBQztJQUN4QixDQUFDO0lBRUQsUUFBUTtRQUNKLE9BQU8sdUJBQXVCLENBQUM7SUFDbkMsQ0FBQztDQUNKO0FBRUQsUUFBUSxDQUFDLGdCQUFnQixDQUFDLGtCQUFrQixFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImltcG9ydCBDb21wb25lbnQgZnJvbSAnLi9jb21tb24vQ29tcG9uZW50JztcbmltcG9ydCB7IEZvcm0sIE9wdGlvbiwgRHJvcGRvd24sIFRleHRpbnB1dCwgVGV4dGFyZWEsIElucHV0Q29uZmlnLCBGb3JtQ29uZmlnLCBUZXh0YXJlYUNvbmZpZyB9IGZyb20gJy4vY29tbW9uL0lucHV0cyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENyZWF0ZUlucHV0IGV4dGVuZHMgQ29tcG9uZW50IHtcblxuICAgIHByaXZhdGUgZm9ybTogRm9ybTtcbiAgICBwcml2YXRlIHR5cGVPcHRpb25zOiBPcHRpb248c3RyaW5nLCBzdHJpbmc+W10gPSBbXG4gICAgICAgIHsgdmFsdWU6ICcnLCB0ZXh0OiAnU2VsZWN0IFR5cGUnIH0sXG4gICAgICAgIHsgdmFsdWU6ICd0ZXh0JywgdGV4dDogJ1RleHQnIH0sXG4gICAgICAgIHsgdmFsdWU6ICd0ZXh0YXJlYScsIHRleHQ6ICdUZXh0IEFyZWEnIH0sXG4gICAgICAgIHsgdmFsdWU6ICdkcm9wZG93bicsIHRleHQ6ICdEcm9wIERvd24nIH0sXG4gICAgICAgIHsgdmFsdWU6ICdjaGVja2JveCcsIHRleHQ6ICdDaGVjayBCb3gnIH0sXG4gICAgICAgIHsgdmFsdWU6ICdyYWRpbycsIHRleHQ6ICdSYWRpbycgfVxuICAgIF07XG4gICAgcHJpdmF0ZSBvcHRpb25lZFR5cGU6IHN0cmluZ1tdID0gW1xuICAgICAgICAnZHJvcGRvd24nLFxuICAgICAgICAncmFkaW8nXG4gICAgXTtcbiAgICBwcml2YXRlIG9wdGlvbnNJbnB1dDogT3B0aW9uc0lucHV0O1xuXG4gICAgYXN5bmMgaW5pdCgpIHtcblxuICAgICAgICB0aGlzLmVsZS5pbm5lckhUTUwgPSB0aGlzLnRlbXBsYXRlKCk7XG5cbiAgICAgICAgbGV0IG5hbWUgPSBuZXcgVGV4dGlucHV0KG51bGwsICduYW1lJywge1xuICAgICAgICAgICAgbGFiZWw6ICdGaWVsZCBOYW1lOicsXG4gICAgICAgICAgICBwbGFjZWhvbGRlcjogJ0ZpZWxkJ1xuICAgICAgICB9KSxcbiAgICAgICAgICAgIHR5cGUgPSBuZXcgRHJvcGRvd24obnVsbCwgJ3R5cGUnLCB0aGlzLnR5cGVPcHRpb25zLCB7XG4gICAgICAgICAgICAgICAgbGFiZWw6ICdJbnB1dCBUeXBlOidcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgZGVzYyA9IG5ldyBUZXh0YXJlYShudWxsLCAncXVlc3Rpb24nLCB7XG4gICAgICAgICAgICAgICAgbGFiZWw6ICdRdWVzdGlvbjonLFxuICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyOiAnUXVlc3Rpb24gLiAuIC4nXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB0eXBlLnNldE9uQ2hhbmdlQ2FsbEJhY2sodGhpcy5vblR5cGVDaGFuZ2UuYmluZCh0aGlzKSk7XG5cbiAgICAgICAgdGhpcy5mb3JtID0gbmV3IEZvcm0odGhpcy5lbGUucXVlcnlTZWxlY3RvcignI2NyZWF0ZV9mb3JtJyksIFtuYW1lLCB0eXBlLCBkZXNjXSk7XG4gICAgICAgIHRoaXMuZm9ybS5vblN1Ym1pdCA9IHRoaXMub25TdWJtaXQuYmluZCh0aGlzKTtcblxuICAgICAgICB0aGlzLmNoaWxkQ29tcG9uZW50cy5wdXNoKHRoaXMuZm9ybSk7XG4gICAgICAgIHJldHVybiBzdXBlci5pbml0KCk7XG4gICAgfVxuICAgIG9uVHlwZUNoYW5nZSh2YWx1ZTogc3RyaW5nKSB7XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbmVkVHlwZS5pbmNsdWRlcyh2YWx1ZSkpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGAke3ZhbHVlfSBuZWVkcyBvcHRpb25zYClcbiAgICAgICAgICAgIHRoaXMub3B0aW9uc0lucHV0ID0gbmV3IE9wdGlvbnNJbnB1dCh0aGlzLmVsZS5xdWVyeVNlbGVjdG9yKCcjb3B0aW9uc19zZWMnKSk7XG4gICAgICAgICAgICB0aGlzLm9wdGlvbnNJbnB1dC5pbml0KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmVsZS5xdWVyeVNlbGVjdG9yKCcjb3B0aW9uc19zZWMnKS5pbm5lckhUTUwgPSAnJztcbiAgICAgICAgICAgIHRoaXMub3B0aW9uc0lucHV0ID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cbiAgICBvblN1Ym1pdCgpIHtcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5mb3JtLmdldERhdGEoKSlcbiAgICB9XG5cbiAgICB0ZW1wbGF0ZSgpIHtcbiAgICAgICAgcmV0dXJuIGA8ZGl2IGNsYXNzPSdib3gnPlxuICAgICAgICAgICAgICAgICAgICA8aDEgY2xhc3M9J3RpdGxlJz5DcmVhdGUgUXVlc3Rpb248L2gxPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPSdjb2x1bW5zJz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgaWQ9J2NyZWF0ZV9mb3JtJyBjbGFzcz0nY29sdW1uJz48L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgaWQ9J29wdGlvbnNfc2VjJyBjbGFzcz0nY29sdW1uJz48ZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIDxkaXY+YDtcbiAgICB9XG59XG5cbmNsYXNzIE9wdGlvbnNJbnB1dCBleHRlbmRzIENvbXBvbmVudCB7XG5cbiAgICBwcml2YXRlIGZvcm06IEZvcm07XG4gICAgcHJpdmF0ZSBvcHRpb25zOiBPcHRpb248c3RyaW5nLCBzdHJpbmc+W107XG5cbiAgICBjb25zdHJ1Y3RvcihlbGU6IEVsZW1lbnQpIHtcbiAgICAgICAgc3VwZXIoZWxlKTtcbiAgICAgICAgdGhpcy5vcHRpb25zID0gbmV3IEFycmF5PE9wdGlvbjxzdHJpbmcsIHN0cmluZz4+KCk7XG4gICAgfVxuXG4gICAgYXN5bmMgaW5pdCgpIHtcblxuICAgICAgICB0aGlzLmVsZS5pbm5lckhUTUwgPSB0aGlzLnRlbXBsYXRlKCk7XG5cbiAgICAgICAgbGV0IHZhbHVlID0gbmV3IFRleHRpbnB1dChudWxsLCAndmFsdWUnLCB7XG4gICAgICAgICAgICBsYWJlbDogJ1ZhbHVlOicsXG4gICAgICAgICAgICBwbGFjZWhvbGRlcjogJ3ZhbHVlJ1xuICAgICAgICB9KSxcbiAgICAgICAgICAgIHRleHQgPSBuZXcgVGV4dGlucHV0KG51bGwsICd0ZXh0Jywge1xuICAgICAgICAgICAgICAgIGxhYmVsOiAnRGlzcGxheSBUZXh0OicsXG4gICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI6ICd0ZXh0J1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5mb3JtID0gbmV3IEZvcm0odGhpcy5lbGUucXVlcnlTZWxlY3RvcignI29wdGlvbl9mb3JtJyksXG4gICAgICAgICAgICBbdmFsdWUsIHRleHRdLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGlubGluZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgc3VibWl0VGV4dDogJ0FkZCdcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuZm9ybS5vblN1Ym1pdCA9IHRoaXMub25BZGQuYmluZCh0aGlzKTtcblxuICAgICAgICB0aGlzLmVsZS5xdWVyeVNlbGVjdG9yKCcjb3B0aW9uX2xpc3QnKVxuICAgICAgICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoJy5idXR0b24nKVxuICAgICAgICAgICAgLmZvckVhY2goZSA9PiB7XG4gICAgICAgICAgICAgICAgZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMub25SZW1vdmUuYmluZCh0aGlzKSk7XG4gICAgICAgICAgICB9KVxuXG4gICAgICAgIHRoaXMuY2hpbGRDb21wb25lbnRzLnB1c2godGhpcy5mb3JtKTtcblxuICAgICAgICByZXR1cm4gc3VwZXIuaW5pdCgpO1xuICAgIH1cblxuICAgIG9uQWRkKCkge1xuICAgICAgICBsZXQgb3B0aW9uID0gdGhpcy5mb3JtLmdldERhdGEoKTtcbiAgICAgICAgLy9UT0RPOiBpbnB1dCB2YWxpZGF0aW9uXG4gICAgICAgIHRoaXMub3B0aW9ucy5wdXNoKG9wdGlvbiBhcyBPcHRpb248c3RyaW5nLCBzdHJpbmc+KTtcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5vcHRpb25zKTtcbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgfVxuXG4gICAgb25SZW1vdmUoZTogRXZlbnQpIHtcbiAgICAgICAgbGV0IGkgPSAoZS50YXJnZXQgYXMgRWxlbWVudCkuaWQuc3BsaXQoJ18nKVsxXTtcbiAgICAgICAgdGhpcy5vcHRpb25zLnNwbGljZShwYXJzZUludChpKSwgMSk7XG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH1cblxuICAgIGxpc3RUZW1wbGF0ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5tYXAoKG8sIGkpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBgPGRpdiBjbGFzcz0nY29sdW1ucyc+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPSdjb2x1bW4nPjxzdHJvbmc+VmFsdWU6IDwvc3Ryb25nPiR7by52YWx1ZX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9J2NvbHVtbic+PHN0cm9uZz5UZXh0OiA8L3N0cm9uZz4ke28udGV4dH08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9J2NvbHVtbic+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgaWQ9J3JlbW92ZV8ke2l9JyBjbGFzcz0nYnV0dG9uIGlzLWRhbmdlciBpcy1zbWFsbCc+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPSdmYSBmYS1taW51cyc+PC9pPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5gO1xuICAgICAgICB9KS5qb2luKCcnKTtcbiAgICB9XG5cbiAgICB0ZW1wbGF0ZSgpIHtcbiAgICAgICAgcmV0dXJuIGA8aDM+QWRkIE9wdGlvbnM8L2gzPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9J2NvbHVtbnMnPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGlkPSdvcHRpb25fZm9ybScgY2xhc3M9J2NvbHVtbic+PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgaWQ9J29wdGlvbl9saXN0JyBjbGFzcz0nY29sdW1uJz4ke3RoaXMubGlzdFRlbXBsYXRlKCl9PC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+YDtcbiAgICB9XG59IiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29tcG9uZW50IHtcblxuICAgIHJlYWRvbmx5IHN0YXRlOiBhbnkgPSB7fTtcbiAgICBlbGU6IEVsZW1lbnQ7XG4gICAgcmVhZG9ubHkgY2hpbGRDb21wb25lbnRzOiBBcnJheTxDb21wb25lbnQ+ID0gW107XG4gICAgcmVhZG9ubHkgY29uZmlnOiBDb21wb25lbnRDb25maWc7XG5cbiAgICBjb25zdHJ1Y3RvcihlbGU6IEVsZW1lbnQsIGNvbmZpZz86IENvbXBvbmVudENvbmZpZykge1xuICAgICAgICB0aGlzLmVsZSA9IGVsZTtcbiAgICAgICAgdGhpcy5jb25maWcgPSBjb25maWc7XG4gICAgfVxuICAgIHNldFN0YXRlKHN0YXRlOiBhbnkpIHtcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLnN0YXRlLCBzdGF0ZSk7XG4gICAgICAgIHJldHVybiB0aGlzLmluaXQoKTtcbiAgICB9XG4gICAgYXN5bmMgaW5pdCgpIHtcbiAgICAgICAgYXdhaXQgdGhpcy5pbml0Q2hpbGRlcm4oKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIGluaXRDaGlsZGVybigpIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKHRoaXMuY2hpbGRDb21wb25lbnRzLm1hcChjID0+IHsgcmV0dXJuIGMuaW5pdCgpOyB9KSk7XG4gICAgfVxuICAgIHRlbXBsYXRlKCkge1xuICAgICAgICByZXR1cm4gYGA7XG4gICAgfVxufVxuXG5pbnRlcmZhY2UgQ29tcG9uZW50Q29uZmlnIHtcbiAgICBjbGFzc2VzPzogc3RyaW5nW107XG4gICAgYXR0cmlidXRlcz86IE1hcDxzdHJpbmcsIHN0cmluZz47XG59XG5cbmV4cG9ydCB7IENvbXBvbmVudCwgQ29tcG9uZW50Q29uZmlnIH0iLCJpbXBvcnQgeyBDb21wb25lbnQsIENvbXBvbmVudENvbmZpZyB9IGZyb20gJy4vQ29tcG9uZW50JztcblxuYWJzdHJhY3QgY2xhc3MgSW5wdXQgZXh0ZW5kcyBDb21wb25lbnQge1xuXG4gICAgcHJvdGVjdGVkIG5hbWU6IHN0cmluZztcbiAgICBwcm90ZWN0ZWQgdmFsdWU6IHN0cmluZyB8IG51bWJlciB8IGJvb2xlYW47XG4gICAgcHJpdmF0ZSBvbkNoYW5nZUNhbGxiYWNrOiAodmFsdWU6IHN0cmluZyB8IG51bWJlciB8IGJvb2xlYW4pID0+IGFueTtcblxuICAgIGNvbnN0cnVjdG9yKGVsZTogRWxlbWVudCwgbmFtZTogc3RyaW5nLCBjb25maWc/OiBJbnB1dENvbmZpZykge1xuICAgICAgICBzdXBlcihlbGUsIGNvbmZpZyk7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgfVxuXG4gICAgZ2V0RGF0YSgpIHtcbiAgICAgICAgbGV0IG9iajogeyBbazogc3RyaW5nXTogc3RyaW5nIHwgbnVtYmVyIHwgYm9vbGVhbiB9ID0ge307XG4gICAgICAgIG9ialt0aGlzLm5hbWVdID0gdGhpcy52YWx1ZVxuICAgICAgICByZXR1cm4gb2JqO1xuICAgIH1cbiAgICBvbkNoYW5nZShlOiBFdmVudCkge1xuICAgICAgICB0aGlzLnZhbHVlID0gKGUudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlO1xuXG4gICAgICAgIGlmICh0aGlzLm9uQ2hhbmdlQ2FsbGJhY2spIHRoaXMub25DaGFuZ2VDYWxsYmFjayh0aGlzLnZhbHVlKTtcbiAgICB9XG4gICAgc2V0T25DaGFuZ2VDYWxsQmFjayhjYWxsYmFjazogKHZhbHVlOiBzdHJpbmcgfCBudW1iZXIgfCBib29sZWFuKSA9PiBhbnkpIHtcbiAgICAgICAgdGhpcy5vbkNoYW5nZUNhbGxiYWNrID0gY2FsbGJhY2s7XG4gICAgfVxuICAgIHRlbXBsYXRlUHJvcHMoKSB7XG4gICAgICAgIGxldCBwOiBzdHJpbmdbXSA9IG5ldyBBcnJheTxzdHJpbmc+KCk7XG5cbiAgICAgICAgcC5wdXNoKCcgJyk7XG4gICAgICAgIGlmICh0aGlzLnN0YXRlLnJlYWRvbmx5KSBwLnB1c2goJ3JlYWRvbmx5Jyk7XG4gICAgICAgIGlmICh0aGlzLnN0YXRlLmRpc2FibGVkKSBwLnB1c2goJ2Rpc2FibGVkJyk7XG5cbiAgICAgICAgcmV0dXJuIHAuam9pbignICcpO1xuICAgIH1cbn1cblxuaW50ZXJmYWNlIElucHV0Q29uZmlnIGV4dGVuZHMgQ29tcG9uZW50Q29uZmlnIHtcbiAgICBsYWJlbDogc3RyaW5nO1xuICAgIHBsYWNlaG9sZGVyPzogc3RyaW5nO1xufVxuXG5pbnRlcmZhY2UgT3B0aW9uPFQgZXh0ZW5kcyBudW1iZXIgfCBzdHJpbmcsIFUgZXh0ZW5kcyBudW1iZXIgfCBzdHJpbmc+IHtcbiAgICB2YWx1ZTogVDtcbiAgICB0ZXh0OiBVO1xufVxuXG5jbGFzcyBGb3JtIGV4dGVuZHMgQ29tcG9uZW50IHtcblxuICAgIGNvbnN0cnVjdG9yKGVsZTogRWxlbWVudCwgaW5wdXRzOiBJbnB1dFtdLCBjb25maWc/OiBGb3JtQ29uZmlnKSB7XG4gICAgICAgIHN1cGVyKGVsZSwgY29uZmlnKTtcbiAgICAgICAgdGhpcy5jaGlsZENvbXBvbmVudHMucHVzaCguLi5pbnB1dHMpO1xuICAgIH1cblxuICAgIGFzeW5jIGluaXQoKSB7XG4gICAgICAgIHRoaXMuZWxlLmlubmVySFRNTCA9IHRoaXMudGVtcGxhdGUoKTtcblxuICAgICAgICB0aGlzLmNoaWxkQ29tcG9uZW50cy5mb3JFYWNoKCh2LCBpKSA9PiB7XG4gICAgICAgICAgICB2LmVsZSA9IHRoaXMuZWxlLnF1ZXJ5U2VsZWN0b3IoYCNpbnB1dF8ke2l9YCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuZWxlLnF1ZXJ5U2VsZWN0b3IoJyNzdWJtaXQnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMub25TdWJtaXQuYmluZCh0aGlzKSk7XG4gICAgICAgIHRoaXMuZWxlLnF1ZXJ5U2VsZWN0b3IoJyNjYW5jZWwnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMub25DYW5jZWwuYmluZCh0aGlzKSk7XG5cbiAgICAgICAgcmV0dXJuIHN1cGVyLmluaXQoKTtcbiAgICB9XG5cbiAgICBnZXREYXRhKCkge1xuICAgICAgICBsZXQgZGF0YSA9IHt9O1xuICAgICAgICB0aGlzLmNoaWxkQ29tcG9uZW50cy5mb3JFYWNoKGkgPT4ge1xuICAgICAgICAgICAgT2JqZWN0LmFzc2lnbihkYXRhLCAoaSBhcyBJbnB1dCkuZ2V0RGF0YSgpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBkYXRhO1xuICAgIH1cblxuICAgIG9uU3VibWl0KCkge1xuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmdldERhdGEoKSk7XG4gICAgfVxuICAgIG9uQ2FuY2VsKCkge1xuICAgICAgICB0aGlzLmVsZS5xdWVyeVNlbGVjdG9yKCdmb3JtJykucmVzZXQoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGlucHV0c1RlbXBsYXRlKCkge1xuICAgICAgICBsZXQgY29uZmlnID0gdGhpcy5jb25maWcgYXMgRm9ybUNvbmZpZyxcbiAgICAgICAgICAgIHRlbXBsYXRlID0gdGhpcy5jb25maWcgJiYgY29uZmlnLmlubGluZSA/XG4gICAgICAgICAgICAgICAgKF92OiBhbnksIGk6IG51bWJlcikgPT4geyByZXR1cm4gYDxwIGlkPSdpbnB1dF8ke2l9JyBjbGFzcz0nY29udHJvbCc+PC9wPmA7IH0gOlxuICAgICAgICAgICAgICAgIChfdjogYW55LCBpOiBudW1iZXIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGA8ZGl2IGNsYXNzPSdmaWVsZCc+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHAgaWQ9J2lucHV0XyR7aX0nIGNsYXNzPSdjb250cm9sJz48L3A+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5gO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuY2hpbGRDb21wb25lbnRzLm1hcCh0ZW1wbGF0ZSkuam9pbignJyk7XG4gICAgfVxuXG4gICAgdGVtcGxhdGUoKSB7XG4gICAgICAgIGxldCBjb25maWcgPSB0aGlzLmNvbmZpZyBhcyBGb3JtQ29uZmlnO1xuICAgICAgICByZXR1cm4gYDxmb3JtPlxuICAgICAgICAgICAgICAgICAgICAke3RoaXMuY29uZmlnICYmIGNvbmZpZy5pbmxpbmUgPyAnJyA6IHRoaXMuaW5wdXRzVGVtcGxhdGUoKX1cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9J2ZpZWxkIGlzLWdyb3VwZWQnPlxuICAgICAgICAgICAgICAgICAgICAgICAgJHt0aGlzLmNvbmZpZyAmJiBjb25maWcuaW5saW5lID8gdGhpcy5pbnB1dHNUZW1wbGF0ZSgpIDogJyd9XG4gICAgICAgICAgICAgICAgICAgICAgICA8cCBjbGFzcz0nY29udHJvbCc+PGEgaWQ9J3N1Ym1pdCcgY2xhc3M9J2J1dHRvbiBpcy1wcmltYXJ5Jz4ke3RoaXMuY29uZmlnICYmIGNvbmZpZy5zdWJtaXRUZXh0ID8gY29uZmlnLnN1Ym1pdFRleHQgOiAnU3VibWl0J308L2E+PC9wPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3M9J2NvbnRyb2wnPjxhIGlkPSdjYW5jZWwnIGNsYXNzPSdidXR0b24gaXMtbGlnaHQnPiR7dGhpcy5jb25maWcgJiYgY29uZmlnLmNhbmNlbFRleHQgPyBjb25maWcuY2FuY2VsVGV4dCA6ICdDYW5jZWwnfTwvYT48L3A+XG4gICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8L2Zvcm0+YDtcbiAgICB9XG59XG5cbmludGVyZmFjZSBGb3JtQ29uZmlnIGV4dGVuZHMgQ29tcG9uZW50Q29uZmlnIHtcbiAgICBpbmxpbmU6IGJvb2xlYW47XG4gICAgc3VibWl0VGV4dD86IHN0cmluZztcbiAgICBjYW5jZWxUZXh0Pzogc3RyaW5nO1xufVxuXG5jbGFzcyBUZXh0aW5wdXQgZXh0ZW5kcyBJbnB1dCB7XG5cblxuICAgIGNvbnN0cnVjdG9yKGVsZTogRWxlbWVudCwgbmFtZTogc3RyaW5nLCBjb25maWc/OiBUZXh0aW5wdXRDb25maWcpIHtcbiAgICAgICAgc3VwZXIoZWxlLCBuYW1lLCBjb25maWcpO1xuICAgIH1cblxuICAgIGFzeW5jIGluaXQoKSB7XG4gICAgICAgIHRoaXMuZWxlLmlubmVySFRNTCA9IHRoaXMudGVtcGxhdGUoKTtcbiAgICAgICAgdGhpcy5lbGUucXVlcnlTZWxlY3RvcignaW5wdXQnKS5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCB0aGlzLm9uQ2hhbmdlLmJpbmQodGhpcykpO1xuICAgICAgICByZXR1cm4gc3VwZXIuaW5pdCgpO1xuICAgIH1cblxuICAgIHRlbXBsYXRlKCkge1xuICAgICAgICBsZXQgY29uZmlnID0gdGhpcy5jb25maWcgYXMgSW5wdXRDb25maWdcbiAgICAgICAgcmV0dXJuIGA8bGFiZWw+JHtjb25maWcubGFiZWwgPyBjb25maWcubGFiZWwgOiBuYW1lfVxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgY2xhc3M9J2lucHV0JyB0eXBlPScke2NvbmZpZy50eXBlID8gY29uZmlnLnR5cGUgOiAndGV4dCd9JyBcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPScke2NvbmZpZy5wbGFjZWhvbGRlciA/IGNvbmZpZy5wbGFjZWhvbGRlciA6ICdpbnB1dCd9JyAke3RoaXMudGVtcGxhdGVQcm9wcygpfT5cbiAgICAgICAgICAgICAgICA8L2xhYmVsPmA7XG4gICAgfVxufVxuaW50ZXJmYWNlIFRleHRpbnB1dENvbmZpZyBleHRlbmRzIElucHV0Q29uZmlnIHtcbiAgICB0eXBlPzogc3RyaW5nO1xufVxuY2xhc3MgVGV4dGFyZWEgZXh0ZW5kcyBJbnB1dCB7XG5cbiAgICBjb25zdHJ1Y3RvcihlbGU6IEVsZW1lbnQsIG5hbWU6IHN0cmluZywgY29uZmlnPzogVGV4dGFyZWFDb25maWcpIHtcbiAgICAgICAgc3VwZXIoZWxlLCBuYW1lLCBjb25maWcpO1xuICAgIH1cblxuICAgIGFzeW5jIGluaXQoKSB7XG4gICAgICAgIHRoaXMuZWxlLmlubmVySFRNTCA9IHRoaXMudGVtcGxhdGUoKTtcbiAgICAgICAgdGhpcy5lbGUucXVlcnlTZWxlY3RvcigndGV4dGFyZWEnKS5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCB0aGlzLm9uQ2hhbmdlLmJpbmQodGhpcykpO1xuICAgICAgICByZXR1cm4gc3VwZXIuaW5pdCgpO1xuICAgIH1cblxuICAgIHRlbXBsYXRlKCkge1xuICAgICAgICBsZXQgY29uZmlnID0gdGhpcy5jb25maWcgYXMgVGV4dGFyZWFDb25maWc7XG4gICAgICAgIHJldHVybiBgPGxhYmVsPiR7Y29uZmlnLmxhYmVsID8gY29uZmlnLmxhYmVsIDogdGhpcy5uYW1lfVxuICAgICAgICAgICAgICAgICAgICA8dGV4dGFyZWEgY2xhc3M9J3RleHRhcmVhJyBwbGFjZWhvbGRlcj0nJHtjb25maWcucGxhY2Vob2xkZXIgPyBjb25maWcucGxhY2Vob2xkZXIgOiAnSW5wdXQnfSdcbiAgICAgICAgICAgICAgICAgICAgJHtjb25maWcucm93cyA/IGAgcm93cz0nJHtjb25maWcucm93c30nYCA6ICcnfSAke3RoaXMudGVtcGxhdGVQcm9wcygpfT48L3RleHRhcmVhPlxuICAgICAgICAgICAgICAgIDwvbGFiZWw+YDtcbiAgICB9XG59XG5cbmludGVyZmFjZSBUZXh0YXJlYUNvbmZpZyBleHRlbmRzIElucHV0Q29uZmlnIHtcbiAgICByb3dzPzogbnVtYmVyO1xufVxuXG5cbmNsYXNzIERyb3Bkb3duPFQgZXh0ZW5kcyBudW1iZXIgfCBzdHJpbmcsIFUgZXh0ZW5kcyBudW1iZXIgfCBzdHJpbmc+IGV4dGVuZHMgSW5wdXQge1xuXG4gICAgcHJpdmF0ZSBvcHRpb25zOiBPcHRpb248VCwgVT5bXTtcblxuICAgIGNvbnN0cnVjdG9yKGVsZTogRWxlbWVudCwgbmFtZTogc3RyaW5nLCBvcHRpb25zOiBPcHRpb248VCwgVT5bXSwgY29uZmlnPzogSW5wdXRDb25maWcpIHtcbiAgICAgICAgc3VwZXIoZWxlLCBuYW1lLCBjb25maWcpO1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgIH1cblxuICAgIGFzeW5jIGluaXQoKSB7XG4gICAgICAgIHRoaXMuZWxlLmlubmVySFRNTCA9IHRoaXMudGVtcGxhdGUoKTtcbiAgICAgICAgdGhpcy5lbGUucXVlcnlTZWxlY3Rvcignc2VsZWN0JykuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgdGhpcy5vbkNoYW5nZS5iaW5kKHRoaXMpKTtcbiAgICAgICAgcmV0dXJuIHN1cGVyLmluaXQoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIG9wdGlvbnNUZW1wbGF0ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5tYXAobyA9PiB7XG4gICAgICAgICAgICByZXR1cm4gYDxvcHRpb24gdmFsdWU9JyR7by52YWx1ZX0nPiR7by50ZXh0fTwvb3B0aW9uPmA7XG4gICAgICAgIH0pLmpvaW4oJycpO1xuICAgIH1cblxuICAgIHRlbXBsYXRlKCkge1xuICAgICAgICBsZXQgY29uZmlnID0gdGhpcy5jb25maWcgYXMgSW5wdXRDb25maWdcbiAgICAgICAgcmV0dXJuIGA8bGFiZWw+JHtjb25maWcubGFiZWwgPyBjb25maWcubGFiZWwgOiB0aGlzLm5hbWV9XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPSdzZWxlY3QnPjxzZWxlY3QgJHt0aGlzLnRlbXBsYXRlUHJvcHMoKX0+JHt0aGlzLm9wdGlvbnNUZW1wbGF0ZSgpfTwvc2VsZWN0Pjwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8L2xhYmVsPmA7XG4gICAgfVxufVxuXG5jbGFzcyBDaGVja2JveCBleHRlbmRzIElucHV0IHtcblxuICAgIGNvbnN0cnVjdG9yKGVsZTogRWxlbWVudCwgbmFtZTogc3RyaW5nLCBjb25maWc/OiBJbnB1dENvbmZpZykge1xuICAgICAgICBzdXBlcihlbGUsIG5hbWUsIGNvbmZpZyk7XG4gICAgICAgIGlmIChjb25maWcubGFiZWwpIHRoaXMubGFiZWwgPSBjb25maWcubGFiZWw7XG4gICAgfVxuXG4gICAgYXN5bmMgaW5pdCgpIHtcbiAgICAgICAgdGhpcy5lbGUuaW5uZXJIVE1MID0gdGhpcy50ZW1wbGF0ZSgpO1xuICAgICAgICB0aGlzLmVsZS5xdWVyeVNlbGVjdG9yKCdpbnB1dCcpLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIHRoaXMub25DaGFuZ2UuYmluZCh0aGlzKSk7XG4gICAgICAgIHJldHVybiBzdXBlci5pbml0KCk7XG4gICAgfVxuXG4gICAgb25DaGFuZ2UoZTogRXZlbnQpIHtcbiAgICAgICAgdGhpcy52YWx1ZSA9IChlLnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50KS5jaGVja2VkO1xuICAgIH1cblxuICAgIHRlbXBsYXRlKCkge1xuICAgICAgICBsZXQgY29uZmlnID0gdGhpcy5jb25maWcgYXMgSW5wdXRDb25maWc7XG4gICAgICAgIHJldHVybiBgPGxhYmVsIGNsYXNzPSdjaGVja2JveCc+JHtjb25maWcubGFiZWwgPyBjb25maWcubGFiZWwgOiB0aGlzLm5hbWV9PGlucHV0IHR5cGU9J2NoZWNrYm94JyAke3RoaXMudGVtcGxhdGVQcm9wcygpfT48L2xhYmVsPmBcbiAgICB9XG59XG5cbmNsYXNzIFJhZGlvPFQgZXh0ZW5kcyBudW1iZXIgfCBzdHJpbmcsIFUgZXh0ZW5kcyBudW1iZXIgfCBzdHJpbmc+IGV4dGVuZHMgSW5wdXQge1xuXG4gICAgcHJpdmF0ZSBvcHRpb25zOiBPcHRpb248VCwgVT5bXTtcblxuICAgIGNvbnN0cnVjdG9yKGVsZTogRWxlbWVudCwgbmFtZTogc3RyaW5nLCBvcHRpb25zOiBPcHRpb248VCwgVT5bXSwgY29uZmlnPzogSW5wdXRDb25maWcpIHtcbiAgICAgICAgc3VwZXIoZWxlLCBuYW1lLCBjb25maWcpO1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgIH1cblxuICAgIGFzeW5jIGluaXQoKSB7XG4gICAgICAgIHRoaXMuZWxlLmlubmVySFRNTCA9IHRoaXMudGVtcGxhdGUoKTtcbiAgICAgICAgdGhpcy5lbGUucXVlcnlTZWxlY3RvcignZGl2JykuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgdGhpcy5vbkNoYW5nZS5iaW5kKHRoaXMpKTtcbiAgICAgICAgcmV0dXJuIHN1cGVyLmluaXQoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHJhZGlvVGVtcGxhdGUoKSB7XG4gICAgICAgIGxldCBjb25maWcgPSB0aGlzLmNvbmZpZyBhcyBJbnB1dENvbmZpZ1xuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zLm1hcChvID0+IHtcbiAgICAgICAgICAgIHJldHVybiBgPGxhYmVsIGNsYXNzPSdyYWRpbyc+JHtjb25maWcubGFiZWwgPyBjb25maWcubGFiZWwgOiB0aGlzLm5hbWV9XG4gICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT0ncmFkaW8nIHZhbHVlPScke28udmFsdWV9JyBuYW1lPScke3RoaXMubmFtZX0nPiR7by50ZXh0fVxuICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPmBcbiAgICAgICAgfSkuam9pbignJyk7XG4gICAgfVxuXG4gICAgb25DaGFuZ2UoZTogRXZlbnQpIHtcbiAgICAgICAgbGV0IGNoZWNrZWRJbnB1dCA9IEFycmF5LmZyb20odGhpcy5lbGUucXVlcnlTZWxlY3RvckFsbCgnaW5wdXQnKSlcbiAgICAgICAgICAgIC5maW5kKGkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBpLmNoZWNrZWQ7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnZhbHVlID0gY2hlY2tlZElucHV0LnZhbHVlO1xuICAgIH1cblxuICAgIHRlbXBsYXRlKCkge1xuICAgICAgICByZXR1cm4gYDxkaXYgY2xhc3M9J2NvbnRyb2wnPiR7dGhpcy5yYWRpb1RlbXBsYXRlKCl9PC9kaXY+YDtcbiAgICB9XG59XG5cbmV4cG9ydCB7XG4gICAgSW5wdXQsIE9wdGlvbiwgRm9ybSwgVGV4dGlucHV0LCBUZXh0YXJlYSwgRHJvcGRvd24sIENoZWNrYm94LCBSYWRpbyxcbiAgICBGb3JtQ29uZmlnLCBJbnB1dENvbmZpZywgVGV4dGFyZWFDb25maWcsIFRleHRpbnB1dENvbmZpZ1xufTsiLCJpbXBvcnQgQ29tcG9uZW50IGZyb20gJy4vY29tcG9uZW50cy9jb21tb24vQ29tcG9uZW50JztcbmltcG9ydCBDcmVhdGVJbnB1dCBmcm9tICcuL2NvbXBvbmVudHMvQ3JlYXRlSW5wdXQnO1xuXG5jbGFzcyBNYWluIGV4dGVuZHMgQ29tcG9uZW50IHtcblxuICAgIHN0YXRpYyBsb2FkKCkge1xuICAgICAgICBsZXQgbWFpbiA9IG5ldyBNYWluKGRvY3VtZW50LmJvZHkpO1xuICAgICAgICBtYWluLmluaXQoKTtcbiAgICB9XG5cbiAgICBhc3luYyBpbml0KCkge1xuICAgICAgICB0aGlzLmVsZS5pbm5lckhUTUwgPSB0aGlzLnRlbXBsYXRlKCk7XG4gICAgICAgIHRoaXMuY2hpbGRDb21wb25lbnRzLnB1c2gobmV3IENyZWF0ZUlucHV0KHRoaXMuZWxlLnF1ZXJ5U2VsZWN0b3IoJyNmb3JtJykpKTtcbiAgICAgICAgcmV0dXJuIHN1cGVyLmluaXQoKTtcbiAgICB9XG5cbiAgICB0ZW1wbGF0ZSgpIHtcbiAgICAgICAgcmV0dXJuIGA8ZGl2IGlkPSdmb3JtJz48L2Rpdj5gO1xuICAgIH1cbn1cblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIE1haW4ubG9hZCk7Il19
