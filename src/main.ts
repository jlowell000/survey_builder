import Component from './components/common/Component';
import { Form, Input, Textinput, Textarea, Dropdown, Checkbox, Radio } from './components/common/Inputs';

class Main extends Component {

    static load() {
        let main = new Main(document.body);
        main.init();
    }

    async init() {
        let input: Input;

        this.ele.innerHTML = this.template();

        this.childComponents.push(new Form(this.ele.querySelector('#form'), [
            new Textinput(null, 'text_input'),
            new Textarea(null, 'text_area'),
            new Dropdown(null, 'dropdown', [
                { value: 1, text: 'One' },
                { value: 2, text: 'Two' }
            ]),
            new Checkbox(null, 'checkbox', 'Is this a test'),
            new Radio(null, 'radio_test', [
                { value: 1, text: 'One' },
                { value: 2, text: 'Two' }
            ])
        ]));

        return super.init();
    }

    template() {
        return `<div id='form'></div>`;
    }
}

document.addEventListener('DOMContentLoaded', Main.load);