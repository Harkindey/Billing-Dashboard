# Healthcare Billing Dashboard

A Next.js application for visualizing healthcare billing data and forecasting revenue using Monte Carlo simulation.

## Features

- **Dashboard Summary**
  - Total billing amount and claims count
  - Claims distribution by status (interactive visualization)
  - Responsive grid layout
  - Real-time statistics updates

- **Claims Table**
  - Filterable and sortable data
  - Full-text search across all fields
  - Status-based filtering
  - Responsive design
  - Loading states with skeleton UI
  - Error handling with error boundaries

- **Revenue Forecasting Tool**
  - Monte Carlo simulation with 2000 iterations
  - Interactive probability sliders
  - Real-time calculation updates
  - 95% confidence interval calculation
  - Loading states for data fetching
  - Detailed probability calculations for each claim status

## Tech Stack

- Next.js 14+ with App Router
- TypeScript
- Tailwind CSS
- shadcn/ui component library
- Server Actions for data fetching

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
- `ClaimsDistribution`: Interactive visualization of claims by status
- `RevenueForecast`: Implements the Monte Carlo simulation and probability adjustments
- `ErrorBoundary`: Handles component-level error catching and display
- Loading skeletons for improved UX during data fetching

### Data Management
- Server Actions for data fetching in `src/app/actions.ts`
- TypeScript interfaces in `src/types/billing.ts`
- Real-time statistics calculation

## State Management

The application uses React's built-in state management with:
- `useState` for local component state
- `useCallback` for memoized functions
- `useEffect` for side effects and data fetching
- Server Actions for data operations

Key state management features:
1. Local state for table filters and sorting
2. Debounced Monte Carlo calculations
3. Memoized simulation function to prevent unnecessary recalculations
4. Server-side data fetching and calculations

## Performance Optimizations

1. Debounced simulation updates to prevent excessive calculations
2. Memoized callback functions
3. Efficient filtering and sorting algorithms
4. Responsive design considerations
5. Loading states for better UX
6. Error boundaries for graceful error handling

## Monte Carlo Simulation

The revenue forecasting tool uses Monte Carlo simulation with:
1. 2000 iterations for statistical significance
2. Configurable probability settings for each claim status:
   - Pending claims: Adjustable probability (default 70%)
   - Approved claims: 100% probability
   - Denied claims: 0% probability
3. 95% confidence interval calculations
4. Real-time updates based on probability adjustments

## Error Handling

The application implements comprehensive error handling:
1. Component-level error boundaries
2. Graceful fallbacks for failed data fetching
3. User-friendly error messages
4. Loading states during async operations

## Future Improvements

1. Add more data visualization charts
2. Implement server-side pagination
3. Add more detailed claim information
4. Enhance simulation parameters
5. Add export functionality
6. Implement real-time data updates
7. Add user authentication and authorization
8. Implement data caching strategies
