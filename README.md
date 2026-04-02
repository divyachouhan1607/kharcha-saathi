# Expense Tracker

A clean, mobile-friendly expense tracking app built with vanilla HTML, CSS, and JavaScript. No frameworks, no build tools — just open `index.html` in your browser and start tracking.

## Features

- **Add & manage expenses** with amount, category, description, and date
- **Budget tracking** — set monthly budgets per category with progress bars
- **Monthly overview** — pie chart and detailed category breakdown
- **Yearly insights** — bar and line charts for spending trends across months
- **Category-wise analysis** — drill into any category's yearly trend
- **Voice input** — tap the mic and say something like *"200 food lunch at cafe"*
- **Search & filter** — find expenses by keyword, category, date range, or amount
- **Custom categories** — add your own categories with emoji icons
- **Multi-currency** — supports 18 currencies (INR, USD, EUR, GBP, JPY, and more)
- **Dark mode** — toggle between light and dark themes
- **Swipe to delete** — swipe left on any expense to reveal the delete button (mobile)
- **Undo delete** — accidentally deleted? Hit undo on the toast notification
- **Export/Import** — backup as JSON or export to CSV for spreadsheet analysis
- **Grouped by date** — expenses are organized with Today, Yesterday, and date headers
- **Mini dashboard** — daily average, top category, budget remaining per day

## Getting Started

1. Clone the repo:
   ```bash
   git clone https://github.com/divyachouhan1607/Expense-Tracker.git
   ```
2. Open `index.html` in your browser

That's it. No install, no dependencies.

## Data Storage

All data is stored in your browser's `localStorage`. Nothing is sent to any server — your financial data stays completely private on your device.

## Tech Stack

- HTML5
- CSS3 (gradients, animations, responsive design)
- Vanilla JavaScript
- Canvas API (charts)
- Web Speech API (voice input)
- localStorage (persistence)

## License

MIT
