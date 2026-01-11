# Mortgage Calculator

A responsive mortgage repayment calculator built with React and Vite. Calculate your monthly and total mortgage repayments based on loan amount, term, interest rate, and mortgage type.

![Design preview](./preview.jpg)

## 🔗 Live Demo

**[View Live Site](https://ringlochid.github.io/mortgage-calculator-fem/)**

## ✨ Features

- **Mortgage Calculations** - Supports both Repayment and Interest-Only mortgage types
- **Real-time Validation** - Form validation with clear error messages
- **Number Formatting** - Currency values formatted with commas (e.g., £300,000)
- **Responsive Design** - Mobile, tablet, and desktop layouts
- **Accessible** - ARIA attributes, keyboard navigation, and focus states
- **Interactive States** - Hover and focus styling for all interactive elements

## 🛠️ Built With

- [React](https://react.dev/) - UI library
- [Vite](https://vitejs.dev/) - Build tool and dev server
- CSS3 with CSS Variables - Styling and theming
- [gh-pages](https://www.npmjs.com/package/gh-pages) - Deployment

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/ringlochid/mortgage-calculator-fem.git

# Navigate to the project
cd mortgage-calculator-fem

# Install dependencies
npm install

# Start the development server
npm run dev
```

## 🚀 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run deploy` | Deploy to GitHub Pages |

## 📐 Mortgage Formulas

### Repayment Mortgage (Principal + Interest)
```
M = P × [r(1+r)^n] / [(1+r)^n - 1]
```

### Interest Only
```
Monthly = Principal × Monthly Rate
Total = (Monthly × Payments) + Principal
```

Where:
- **M** = Monthly payment
- **P** = Principal (loan amount)
- **r** = Monthly interest rate (annual rate ÷ 12 ÷ 100)
- **n** = Total number of payments (years × 12)

## 📁 Project Structure

```
├── public/
│   └── assets/         # Static assets (images, fonts)
├── src/
│   ├── App.jsx         # Main React component
│   ├── App.css         # Component styles
│   └── index.css       # Global styles
├── index.html          # Entry HTML
├── vite.config.js      # Vite configuration
└── package.json        # Dependencies and scripts
```

## 🎨 Design

This project is a solution to the [Frontend Mentor Mortgage Repayment Calculator challenge](https://www.frontendmentor.io/challenges/mortgage-repayment-calculator-Galx1LXK73).

### Color Palette

| Color | Hex |
|-------|-----|
| Lime | `#D8DB2F` |
| Slate 900 | `#133041` |
| Slate 700 | `#4E6E7E` |
| Slate 500 | `#6B94A8` |
| Slate 100 | `#E4F4FD` |
| Red | `#D73328` |

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: ≥ 768px
- **Desktop**: ≥ 1440px

## ♿ Accessibility

- Semantic HTML with proper form structure
- Labels connected via `htmlFor`
- ARIA attributes for error states (`aria-invalid`, `aria-describedby`)
- Visible focus indicators for keyboard navigation
- Screen reader text for hidden elements

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

Built with ❤️ as a Frontend Mentor challenge solution.
