import Component from './common/Component';
import { Form, Option, Dropdown, Textinput, Textarea, InputConfig, FormConfig, TextareaConfig } from './common/Inputs';

export default class CreateInput extends Component {

    private form: Form;
    private typeOptions: Option<string, string>[] = [
        { value: '', text: 'Select Type' },
        { value: 'text', text: 'Text' },
        { value: 'textarea', text: 'Text Area' },
        { value: 'dropdown', text: 'Drop Down' },
        { value: 'checkbox', text: 'Check Box' },
        { value: 'radio', text: 'Radio' }
    ];
    private optionedType: string[] = [
        'dropdown',
        'radio'
    ];
    private optionsInput: OptionsInput;

    async init() {

        this.ele.innerHTML = this.template();

        let name = new Textinput(null, 'name', {
            label: 'Field Name:',
            placeholder: 'Field'
        }),
            type = new Dropdown(null, 'type', this.typeOptions, {
                label: 'Input Type:'
            }),
            desc = new Textarea(null, 'question', {
                label: 'Question:',
                placeholder: 'Question . . .'
            });

        type.setOnChangeCallBack(this.onTypeChange.bind(this));

        this.form = new Form(this.ele.querySelector('#create_form'), [name, type, desc]);
        this.form.onSubmit = this.onSubmit.bind(this);

        this.childComponents.push(this.form);
        return super.init();
    }
    onTypeChange(value: string) {
        if (this.optionedType.includes(value)) {
            console.log(`${value} needs options`)
            this.optionsInput = new OptionsInput(this.ele.querySelector('#options_sec'));
            this.optionsInput.init();
        } else {
            this.ele.querySelector('#options_sec').innerHTML = '';
            this.optionsInput = null;
        }
    }
    onSubmit() {
        console.log(this.form.getData())
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

class OptionsInput extends Component {

    private form: Form;
    private options: Option<string, string>[];

    constructor(ele: Element) {
        super(ele);
        this.options = new Array<Option<string, string>>();
    }

    async init() {

        this.ele.innerHTML = this.template();

        let value = new Textinput(null, 'value', {
            label: 'Value:',
            placeholder: 'value'
        }),
            text = new Textinput(null, 'text', {
                label: 'Display Text:',
                placeholder: 'text'
            });

        this.form = new Form(this.ele.querySelector('#option_form'),
            [value, text],
            {
                inline: false,
                submitText: 'Add'
            });

        this.form.onSubmit = this.onAdd.bind(this);

        this.ele.querySelector('#option_list')
            .querySelectorAll('.button')
            .forEach(e => {
                e.addEventListener('click', this.onRemove.bind(this));
            })

        this.childComponents.push(this.form);

        return super.init();
    }

    onAdd() {
        let option = this.form.getData();
        //TODO: input validation
        this.options.push(option as Option<string, string>);
        console.log(this.options);
        this.init();
    }

    onRemove(e: Event) {
        let i = (e.target as Element).id.split('_')[1];
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