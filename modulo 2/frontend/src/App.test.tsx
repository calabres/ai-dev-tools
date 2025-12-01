import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
    it('renders without crashing', () => {
        render(<App />);
        // Adjust this expectation based on what is actually in App.tsx
        // For now, just checking if it renders is a good start.
        // If there is a specific text we know exists, we can check for it.
    });
});
