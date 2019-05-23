import Component from './components/common/Component';
import CreateInput from './components/CreateInput';

class Main extends Component {

    static load() {
        let main = new Main(document.body);
        main.init();
    }

    async init() {
        this.ele.innerHTML = this.template();
        this.childComponents.push(new CreateInput(this.ele.querySelector('#form')));
        return super.init();
    }

    template() {
        return `<div id='form'></div>`;
    }
}

document.addEventListener('DOMContentLoaded', Main.load);