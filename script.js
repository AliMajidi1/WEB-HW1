class FormulaEvaluator {
    constructor(formulaElement) {
        this.formulaElement = formulaElement;
        this.evaluator = formulaElement.getAttribute('evaluator');
        this.inputIds = this.extractInputIds();
        this.setupEventListeners();
        this.updateResult();
    }

    extractInputIds() {
        return [...new Set(this.evaluator.match(/\b[a-zA-Z_]\w*\b/g))]; 
    }

    setupEventListeners() {
        this.inputIds.forEach(id => {
            const input = document.getElementById(id);
            if (input) input.addEventListener('input', () => this.updateResult());
        });
    }

    validateNumber(value) {
        return !isNaN(value) && value.trim() !== "" && !isNaN(parseFloat(value));
    }

    updateResult() {
        try {
            const values = {};
            let isValid = true;

            this.inputIds.forEach(id => {
                const input = document.getElementById(id);
                const value = input.value.trim();
                if (!this.validateNumber(value)) {
                    isValid = false;
                    return;
                }
                values[id] = parseFloat(value);
            });

            if (!isValid) { 
                this.formulaElement.textContent = 'ورودی نامعتبر';
                return;
            }

            const expression = this.evaluator.replace(/\b[a-zA-Z_]\w*\b/g, (match) => {
                return values.hasOwnProperty(match) ? `values.${match}` : match;
            });

            const result = eval(expression);
            this.formulaElement.textContent = result.toLocaleString('fa-IR') + " تومان";
        } catch (error) {
            this.formulaElement.textContent = 'خطا در محاسبه';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('formula').forEach(element => new FormulaEvaluator(element));
});

