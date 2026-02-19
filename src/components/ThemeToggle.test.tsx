import { describe, expect, it, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeToggle } from './ThemeToggle';

describe('ThemeToggle', () => {
  it('should render moon icon when theme is light', () => {
    const mockOnToggle = jest.fn();
    render(<ThemeToggle theme="light" onToggle={mockOnToggle} />);

    const button = screen.getByRole('button');
    expect(button.textContent).toBe('🌙');
  });

  it('should render sun icon when theme is dark', () => {
    const mockOnToggle = jest.fn();
    render(<ThemeToggle theme="dark" onToggle={mockOnToggle} />);

    const button = screen.getByRole('button');
    expect(button.textContent).toBe('☀️');
  });

  it('should have correct aria-label for light theme', () => {
    const mockOnToggle = jest.fn();
    render(<ThemeToggle theme="light" onToggle={mockOnToggle} />);

    const button = screen.getByRole('button');
    expect(button.getAttribute('aria-label')).toBe('Switch to dark mode');
  });

  it('should have correct aria-label for dark theme', () => {
    const mockOnToggle = jest.fn();
    render(<ThemeToggle theme="dark" onToggle={mockOnToggle} />);

    const button = screen.getByRole('button');
    expect(button.getAttribute('aria-label')).toBe('Switch to light mode');
  });

  it('should call onToggle when clicked', async () => {
    const user = userEvent.setup();
    const mockOnToggle = jest.fn();
    render(<ThemeToggle theme="light" onToggle={mockOnToggle} />);

    const button = screen.getByRole('button');
    await user.click(button);

    expect(mockOnToggle).toHaveBeenCalledTimes(1);
  });

  it('should have theme-toggle class', () => {
    const mockOnToggle = jest.fn();
    render(<ThemeToggle theme="light" onToggle={mockOnToggle} />);

    const button = screen.getByRole('button');
    expect(button.classList.contains('theme-toggle')).toBe(true);
  });
});
