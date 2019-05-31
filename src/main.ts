import Component from './components/common/Component';
import QuestionForm from './components/QuestionCreation';

class Main extends Component {

    private questionForm: QuestionForm;

    static load() {
        let main = new Main(document.body);
        main.init();
    }

    async init() {
        this.ele.innerHTML = this.template();
        
        this.questionForm = new QuestionForm(this.ele.querySelector('#question_form'));
        this.questionForm.onSubmit = this.newQuestion.bind(this);
        this.childComponents.push(this.questionForm);

        
        return super.init();
    }

    newQuestion(){
        console.log(this.questionForm.getData());
        //TODO: create input factory from QuestionData
    }

    template() {
        return `<div id='question_form'></div>`;
    }
}

document.addEventListener('DOMContentLoaded', Main.load);