import Component from './common/Component';
import { Form, Option, Dropdown, Textinput } from './common/Inputs';

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
    ]

    async init() {
        let name = new Textinput(null, 'name', {
            placeholder: 'Name of field'
        }),
            type = new Dropdown(null, 'type', this.typeOptions);

        type.setOnChangeCallBack(this.onTypeChange.bind(this));

        this.form = new Form(this.ele, [name, type], {
            inline: 'true'
        });
        this.form.onSubmit = this.onSubmit.bind(this);

        this.childComponents.push(this.form);
        return super.init();
    }
    onTypeChange(value: string) {
        if (this.optionedType.includes(value)) {
            console.log(`${value} needs options`)
            //TODO: need to make options input
        }
    }
    onSubmit() {
        console.log(this.form.getData())
    }
}