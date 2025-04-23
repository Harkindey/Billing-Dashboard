# Healthcare Billing Dashboard

A Next.js application for visualizing healthcare billing data and forecasting revenue using Monte Carlo simulation.

## Features

- **Dashboard Summary**
  - Total billing amount and claims count
  - Claims distribution by status
  - Responsive grid layout

- **Claims Table**
  - Filterable and sortable data
  - Full-text search across all fields
  - Status-based filtering
  - Responsive design

- **Revenue Forecasting Tool**
  - Monte Carlo simulation with 2000 iterations
  - Interactive probability sliders
  - Real-time calculation updates
  - 95% confidence interval calculation

## Tech Stack

- Next.js 14+ with App Router
- TypeScript
- Tailwind CSS
- shadcn/ui component library

## Getting Started

1. Clone the repository:
```bash
git clone [repository-url]
cd healthcare-billing-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Component Architecture

The application is structured with the following main components:

### Layout
- `DashboardLayout`: Main layout component with header and content container

### Features
- `ClaimsTable`: Handles the display and filtering of billing records
- `RevenueForecast`: Implements the Monte Carlo simulation and probability adjustments

### Data Management
- Mock data is stored in `src/data/mockData.ts`
- TypeScript interfaces in `src/types/billing.ts`

## State Management

The application uses React's built-in state management with:
- `useState` for local component state
- `useCallback` for memoized functions
- `useEffect` for side effects

Key state management decisions:
1. Local state for table filters and sorting
2. Debounced Monte Carlo calculations
3. Memoized simulation function to prevent unnecessary recalculations

## Performance Optimizations

1. Debounced simulation updates to prevent excessive calculations
2. Memoized callback functions
3. Efficient filtering and sorting algorithms
4. Responsive design considerations

## Future Improvements

1. Add data visualization charts
2. Implement server-side pagination
3. Add more detailed claim information
4. Enhance simulation parameters
5. Add export functionality
