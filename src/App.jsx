import './App.css'
import { useState, createContext, useContext, useCallback } from 'react'

const FIELD_CONFIG = {
  'Mortgage Amount': {
    id: 'mortgage-amount',
    type: 'number',
    min: 0,
    max: 99999999,
    prefix: '£',
    suffix: null,
  },
  'Mortgage Term': {
    id: 'mortgage-term',
    type: 'number',
    min: 0,
    max: 50,
    prefix: null,
    suffix: 'years',
  },
  'Interest Rate': {
    id: 'interest-rate',
    type: 'number',
    min: 0,
    max: 100,
    prefix: null,
    suffix: '%',
  },
};

const FormDataContext = createContext(null);

function FormDataProvider({children}) {
  const [formData, setFormData] = useState({
    'Mortgage Amount': '',
    'Mortgage Term': '',
    'Interest Rate': '',
    'Mortgage Type': ''
  })

  const resetFrom = () => {
    setFormData({
      'Mortgage Amount': '',
      'Mortgage Term': '',
      'Interest Rate': '',
      'Mortgage Type': ''
    })
  } 

  const setAmount = useCallback((e) => {
    console.log('setting amount');
    console.log(JSON.stringify(formData))
    setFormData({
      ...formData,
      'Mortgage Amount': e.target.value
    })
  }, [formData]);

  const setTerm = useCallback((e) => {
    setFormData({
      ...formData,
      'Mortgage Term': e.target.value
    })
  }, [formData]);

  const setRate = useCallback((e) => {
    setFormData({
      ...formData,
      'Interest Rate': e.target.value
    })
  }, [formData]);

  const setType = useCallback((e) => {
    setFormData({
      ...formData,
      'Mortgage Type': e.target.value
    })
  }, [formData]);

  return (
    <FormDataContext.Provider value={{ formData, setAmount, setTerm, setRate, setType, resetFrom}}>
      {children}
    </FormDataContext.Provider>
  )
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

  if (title === 'Mortgage Type') {
    return (
      <div className="form-section">
        <span className="form-section-label">Mortgage Type</span>
        <div className="radio-group">
          <label className={`radio-option ${value === 'Repayment' ? 'radio-option--selected' : ''}`}>
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
          <label className={`radio-option ${value === 'Interest Only' ? 'radio-option--selected' : ''}`}>
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
      </div>
    );
  }

  const config = FIELD_CONFIG[title];
  if (!config) {
    console.warn('Unknown input component');
    return null;
  }
  return (
    <div className="form-section">
      <label htmlFor={config.id}>{title}</label>
      <div className="input-wrapper">
        {config.prefix && <div className="input-prefix">{config.prefix}</div>}
        <input
          className='mortgage-input'
          id={config.id}
          type={config.type}
          min={config.min}
          max={config.max}
          onChange={setFn}
          value={value}
        />
        {config.suffix && <div className="input-suffix">{config.suffix}</div>}
      </div>
    </div>
  );
}

function MortgageForm() {
  const { formData, setAmount, setTerm, setRate, setType } = useFormData();
  
  return (
    <form className='form-body'>
      <legend className='sr-only'>Mortgage Form</legend>
      <FormSection title="Mortgage Amount" setFn={setAmount} value={formData['Mortgage Amount']} />
      <FormSection title="Mortgage Term" setFn={setTerm} value={formData['Mortgage Term']} />
      <FormSection title="Interest Rate" setFn={setRate} value={formData['Interest Rate']} />
      <FormSection title="Mortgage Type" setFn={setType} value={formData['Mortgage Type']} />
    </form>
  )
}

function FormClearAllBtn() {
  const { resetFrom } = useFormData();

  return (
    <button className="clear-all-btn" onClick={resetFrom}>
      Clear All
    </button>
  )
}

function TitleBar() {
  return (
    <div className="title-bar">
      <h1>Mortgage Repayment Calculator</h1>
      <FormClearAllBtn />
    </div>
  )
}

function FormContainer() {
  return (
    <div className="form-container">
      <TitleBar />
      <MortgageForm />
    </div>
  )
}

function App() {
  return (
    <FormDataProvider>
      <main>
        <FormContainer />
      </main>
    </FormDataProvider>
  )
}

export default App
