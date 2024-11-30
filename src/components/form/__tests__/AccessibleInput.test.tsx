import { render, screen, fireEvent } from '@testing-library/react';
import { AccessibleInput } from '../AccessibleInput';
import { vi } from 'vitest';

describe('AccessibleInput', () => {
  it('renders with label and required indicator', () => {
    render(
      <AccessibleInput
        label="Email"
        required
        type="email"
        placeholder="Digite seu email"
      />
    );

    expect(screen.getByLabelText(/Email \*/)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Digite seu email')).toBeInTheDocument();
  });

  it('shows error message when provided', () => {
    const errorMessage = 'Email inválido';
    render(
      <AccessibleInput
        label="Email"
        error={errorMessage}
        type="email"
      />
    );

    expect(screen.getByRole('alert')).toHaveTextContent(errorMessage);
  });

  it('shows hint text when provided', () => {
    const hintText = 'Use seu email corporativo';
    render(
      <AccessibleInput
        label="Email"
        hint={hintText}
        type="email"
      />
    );

    expect(screen.getByText(hintText)).toBeInTheDocument();
  });

  it('calls onChange handler when input value changes', () => {
    const handleChange = vi.fn();
    render(
      <AccessibleInput
        label="Email"
        onChange={handleChange}
        type="email"
      />
    );

    const input = screen.getByLabelText('Email');
    fireEvent.change(input, { target: { value: 'test@example.com' } });

    expect(handleChange).toHaveBeenCalled();
  });

  it('applies error styles when error is present', () => {
    render(
      <AccessibleInput
        label="Email"
        error="Email inválido"
        type="email"
      />
    );

    const input = screen.getByLabelText('Email');
    expect(input).toHaveClass('border-red-300');
  });

  it('applies disabled styles when disabled', () => {
    render(
      <AccessibleInput
        label="Email"
        disabled
        type="email"
      />
    );

    const input = screen.getByLabelText('Email');
    expect(input).toHaveClass('disabled:opacity-50');
    expect(input).toBeDisabled();
  });

  it('forwards ref to input element', () => {
    const ref = { current: null };
    render(
      <AccessibleInput
        label="Email"
        type="email"
        ref={ref}
      />
    );

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('has correct aria attributes', () => {
    const errorMessage = 'Email inválido';
    const hintText = 'Use seu email corporativo';
    
    render(
      <AccessibleInput
        label="Email"
        error={errorMessage}
        hint={hintText}
        required
        type="email"
      />
    );

    const input = screen.getByLabelText(/Email \*/);
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-required', 'true');
    expect(input).toHaveAttribute('aria-describedby');
  });
}); 