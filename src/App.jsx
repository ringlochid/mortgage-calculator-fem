import './App.css'
import { useState, createContext, useContext, useCallback } from 'react'

function formatWithCommas(value) {
  if (!value && value !== 0) return '';
  const num = String(value).replace(/,/g, '');
  if (isNaN(num) || num === '') return '';
  return Number(num).toLocaleString('en-GB');
}

function stripCommas(value) {
  return String(value).replace(/,/g, '');
}

const FIELD_CONFIG = {
  'Mortgage Amount': {
    id: 'mortgage-amount',
    type: 'text',  // Use text to allow comma display
    inputMode: 'numeric',  // Mobile numeric keyboard
    min: 0,
    max: 99999999,
    prefix: '£',
    suffix: null,
    useCommas: true,  // Format with commas
  },
  'Mortgage Term': {
    id: 'mortgage-term',
    type: 'text',
    inputMode: 'numeric',
    min: 0,
    max: 50,
    prefix: null,
    suffix: 'years',
    useCommas: false,
  },
  'Interest Rate': {
    id: 'interest-rate',
    type: 'text',
    inputMode: 'decimal',  // Allow decimal input
    min: 0,
    max: 100,
    prefix: null,
    suffix: '%',
    useCommas: false,
  },
};

const FormDataContext = createContext(null);

function FormDataProvider({children}) {
  const [formData, setFormData] = useState({
    'Mortgage Amount': '',
    'Mortgage Term': '',
    'Interest Rate': '',
    'Mortgage Type': ''
  });
  
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData['Mortgage Amount']) newErrors['Mortgage Amount'] = 'This field is required';
    if (!formData['Mortgage Term']) newErrors['Mortgage Term'] = 'This field is required';
    if (!formData['Interest Rate']) newErrors['Interest Rate'] = 'This field is required';
    if (!formData['Mortgage Type']) newErrors['Mortgage Type'] = 'This field is required';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    const newErrors = validateForm();
    setErrors(newErrors);
  };

  const resetFrom = () => {
    setFormData({
      'Mortgage Amount': '',
      'Mortgage Term': '',
      'Interest Rate': '',
      'Mortgage Type': ''
    });
    setSubmitted(false);
    setErrors({});
  }; 

  // Helper function to validate and set a field value
  const validateAndSetField = (fieldName, rawValue) => {
    const config = FIELD_CONFIG[fieldName];
    if (!config) return true; // No config means no validation (e.g., for radio buttons)
    
    const numValue = Number(rawValue);
    if (rawValue !== '' && (numValue > config.max || numValue < config.min)) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: `Value must be between ${config.min} and ${config.max}`
      }));
      return false;
    }
    
    // Clear error if valid
    setErrors(prev => ({
      ...prev,
      [fieldName]: ''
    }));
    return true;
  };

  const setAmount = useCallback((e) => {
    const rawValue = stripCommas(e.target.value);
    if (!validateAndSetField('Mortgage Amount', rawValue)) return;
    setFormData({
      ...formData,
      'Mortgage Amount': rawValue
    });
  }, [formData]);

  const setTerm = useCallback((e) => {
    const rawValue = e.target.value;
    if (!validateAndSetField('Mortgage Term', rawValue)) return;
    setFormData({
      ...formData,
      'Mortgage Term': rawValue
    });
  }, [formData]);

  const setRate = useCallback((e) => {
    const rawValue = e.target.value;
    if (!validateAndSetField('Interest Rate', rawValue)) return;
    setFormData({
      ...formData,
      'Interest Rate': rawValue
    });
  }, [formData]);

  const setType = useCallback((e) => {
    // Clear error when a type is selected
    setErrors(prev => ({
      ...prev,
      'Mortgage Type': ''
    }));
    setFormData({
      ...formData,
      'Mortgage Type': e.target.value
    });
  }, [formData]);

  return (
    <FormDataContext.Provider value={{ 
      formData, 
      setAmount, 
      setTerm, 
      setRate, 
      setType, 
      resetFrom,
      submitted,
      errors,
      handleSubmit
    }}>
      {children}
    </FormDataContext.Provider>
  );
}

function useFormData() {
  const context = useContext(FormDataContext);

  if (!context) {
    throw new Error('useFormData must be used within a FormDataProvider');
  }

  return context;
}


// Radio icon SVG component
function RadioIcon({ checked }) {
  if (checked) {
    return (
      <svg className="radio-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="12" r="5" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg className="radio-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 2.25C10.0716 2.25 8.18657 2.82183 6.58319 3.89317C4.97982 4.96451 3.73013 6.48726 2.99218 8.26884C2.25422 10.0504 2.06114 12.0108 2.43735 13.9021C2.81355 15.7934 3.74215 17.5307 5.10571 18.8943C6.46928 20.2579 8.20656 21.1865 10.0979 21.5627C11.9892 21.9389 13.9496 21.7458 15.7312 21.0078C17.5127 20.2699 19.0355 19.0202 20.1068 17.4168C21.1782 15.8134 21.75 13.9284 21.75 12C21.7473 9.41498 20.7192 6.93661 18.8913 5.10872C17.0634 3.28084 14.585 2.25273 12 2.25ZM12 20.25C10.3683 20.25 8.77326 19.7661 7.41655 18.8596C6.05984 17.9531 5.00242 16.6646 4.378 15.1571C3.75358 13.6496 3.5902 11.9908 3.90853 10.3905C4.22685 8.79016 5.01259 7.32015 6.16637 6.16637C7.32016 5.01259 8.79017 4.22685 10.3905 3.90852C11.9909 3.59019 13.6497 3.75357 15.1571 4.37799C16.6646 5.00242 17.9531 6.05984 18.8596 7.41655C19.7661 8.77325 20.25 10.3683 20.25 12C20.2475 14.1873 19.3775 16.2843 17.8309 17.8309C16.2843 19.3775 14.1873 20.2475 12 20.25Z" fill="currentColor"/>
    </svg>
  );
}

function FormSection({ title, setFn, value }) {
  const { errors } = useFormData();
  const hasError = errors[title];

  if (title === 'Mortgage Type') {
    return (
      <div className={`form-section ${hasError ? 'form-section--error' : ''}`}>
        <span className="form-section-label">Mortgage Type</span>
        <div className={`radio-group ${hasError ? 'radio-group--error' : ''}`}>
          <label className={`radio-option ${value === 'Repayment' ? 'radio-option--selected' : ''} ${hasError ? 'radio-option--error' : ''}`}>
            <input 
              type="radio" 
              name="mortgage-type" 
              value="Repayment" 
              checked={value === 'Repayment'}
              onChange={setFn} 
              className="sr-only"
            />
            <RadioIcon checked={value === 'Repayment'} />
            <span className="radio-label">Repayment</span>
          </label>
          <label className={`radio-option ${value === 'Interest Only' ? 'radio-option--selected' : ''} ${hasError ? 'radio-option--error' : ''}`}>
            <input 
              type="radio" 
              name="mortgage-type" 
              value="Interest Only" 
              checked={value === 'Interest Only'}
              onChange={setFn} 
              className="sr-only"
            />
            <RadioIcon checked={value === 'Interest Only'} />
            <span className="radio-label">Interest Only</span>
          </label>
        </div>
        {hasError && <span className="error-text">{errors[title]}</span>}
      </div>
    );
  }

  const config = FIELD_CONFIG[title];
  if (!config) {
    console.warn('Unknown input component');
    return null;
  }
  
  // Format value for display (with commas if enabled)
  const displayValue = config.useCommas ? formatWithCommas(value) : value;
  const errorId = `${config.id}-error`;
  
  return (
    <div className={`form-section ${hasError ? 'form-section--error' : ''}`}>
      <label htmlFor={config.id}>{title}</label>
      <div className={`input-wrapper ${hasError ? 'input-wrapper--error' : ''}`}>
        {config.prefix && <div className={`input-prefix ${hasError ? 'input-prefix--error' : ''}`}>{config.prefix}</div>}
        <input
          className='mortgage-input'
          id={config.id}
          type={config.type}
          inputMode={config.inputMode}
          onChange={setFn}
          value={displayValue}
          aria-invalid={hasError ? 'true' : 'false'}
          aria-describedby={hasError ? errorId : undefined}
        />
        {config.suffix && <div className={`input-suffix ${hasError ? 'input-suffix--error' : ''}`}>{config.suffix}</div>}
      </div>
      {hasError && <span id={errorId} className="error-text" role="alert">{errors[title]}</span>}
    </div>
  );
}

function MortgageForm() {
  const { formData, setAmount, setTerm, setRate, setType, handleSubmit } = useFormData();
  
  return (
    <form className='form-body' onSubmit={handleSubmit}>
      <legend className='sr-only'>Mortgage Form</legend>
      <FormSection title="Mortgage Amount" setFn={setAmount} value={formData['Mortgage Amount']} />
      <FormSection title="Mortgage Term" setFn={setTerm} value={formData['Mortgage Term']} />
      <FormSection title="Interest Rate" setFn={setRate} value={formData['Interest Rate']} />
      <FormSection title="Mortgage Type" setFn={setType} value={formData['Mortgage Type']} />
      <button type="submit" className="calculate-btn">
        <img src={`${import.meta.env.BASE_URL}assets/images/icon-calculator.svg`} alt="" />
        <span>Calculate Repayments</span>
      </button>
    </form>
  );
}

function FormClearAllBtn() {
  const { resetFrom } = useFormData();

  return (
    <button className="clear-all-btn" onClick={resetFrom}>
      Clear All
    </button>
  );
}

function TitleBar() {
  return (
    <div className="title-bar">
      <h1>Mortgage Calculator</h1>
      <FormClearAllBtn />
    </div>
  );
}

function FormContainer() {
  return (
    <div className="form-container">
      <TitleBar />
      <MortgageForm />
    </div>
  );
}

// Format number with commas and 2 decimal places
function formatCurrency(amount) {
  return amount.toLocaleString('en-GB', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

// Calculate mortgage repayments
function calculateRepayments(principal, termYears, annualRate, mortgageType) {
  const monthlyRate = annualRate / 100 / 12;  // Convert annual % to monthly decimal
  const numberOfPayments = termYears * 12;

  if (mortgageType === 'Interest Only') {
    // Interest Only: just pay interest each month, principal due at end
    const monthlyPayment = principal * monthlyRate;
    const totalPayment = (monthlyPayment * numberOfPayments) + principal;
    return { monthlyPayment, totalPayment };
  }

  // Repayment (Principal + Interest): standard amortization formula
  // M = P × [r(1+r)^n] / [(1+r)^n - 1]
  const monthlyPayment = principal * 
    (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  
  const totalPayment = monthlyPayment * numberOfPayments;
  
  return { monthlyPayment, totalPayment };
}

function ResultPlaceHolder() {
    return (
        <div className="result-place-holder">
            <img src={`${import.meta.env.BASE_URL}assets/images/illustration-empty.svg`} alt="illustration-empty" />
            <h1>Results shown here</h1>
            <p>Complete the form and click "calculate repayments" to see what your monthly repayments would be.</p>
        </div>
    );
}

function Result() {
  const { formData } = useFormData();
  
  const principal = parseFloat(formData['Mortgage Amount']) || 0;
  const termYears = parseFloat(formData['Mortgage Term']) || 0;
  const annualRate = parseFloat(formData['Interest Rate']) || 0;
  const mortgageType = formData['Mortgage Type'];

  const { monthlyPayment, totalPayment } = calculateRepayments(
    principal, termYears, annualRate, mortgageType
  );

  return (
    <>
      <div className="results-title-bar">
        <h1>Your results</h1>
        <p>Your results are shown below based on the information you provided. To adjust the results, edit the form and click "calculate repayments" again.</p>
      </div>
      <div className="results-detail-wrapper">
        <div className="monthly-repayments-section">
          <h2>Your monthly repayments</h2>
          <p>£{formatCurrency(monthlyPayment)}</p>
        </div>
        <div className="result-separator"></div>
        <div className="total-repayments-section">
          <h2>Total you'll repay over the term</h2>
          <p>£{formatCurrency(totalPayment)}</p>
        </div>
      </div>
    </>
  );
}

function ResultContainer() {
  const {formData} = useFormData();
  const isCompleted = Object.values(formData).every(value => value !== '');
  return (
    <div className='results-container'>
      {isCompleted ? <Result /> : <ResultPlaceHolder />}
    </div>
  )
}

function App() {
  return (
    <FormDataProvider>
      <main>
        <FormContainer />
        <ResultContainer />
      </main>
    </FormDataProvider>
  );
}

export default App
