import { describe, expect, it, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal } from './Modal';

describe('Modal', () => {
  it('should not render when isOpen is false', () => {
    const onClose = jest.fn();
    const { container } = render(
      <Modal isOpen={false} onClose={onClose} title="Test Modal">
        <p>Content</p>
      </Modal>
    );

    expect(container.firstChild).toBeNull();
  });

  it('should render when isOpen is true', () => {
    const onClose = jest.fn();
    render(
      <Modal isOpen onClose={onClose} title="Test Modal">
        <p>Content</p>
      </Modal>
    );

    expect(screen.getByText('Test Modal')).toBeTruthy();
    expect(screen.getByText('Content')).toBeTruthy();
  });

  it('should call onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    render(
      <Modal isOpen onClose={onClose} title="Test Modal">
        <p>Content</p>
      </Modal>
    );

    const closeButton = screen.getByLabelText('Close modal');
    await user.click(closeButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when backdrop is clicked', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    const { container } = render(
      <Modal isOpen onClose={onClose} title="Test Modal">
        <p>Content</p>
      </Modal>
    );

    const backdrop = container.querySelector('.modal-backdrop');
    if (backdrop) {
      await user.click(backdrop);
    }

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should have proper ARIA attributes', () => {
    const onClose = jest.fn();
    const { container } = render(
      <Modal isOpen onClose={onClose} title="Test Modal">
        <p>Content</p>
      </Modal>
    );

    const backdrop = container.querySelector('.modal-backdrop');
    expect(backdrop?.getAttribute('role')).toBe('dialog');
    expect(backdrop?.getAttribute('aria-modal')).toBe('true');
    expect(backdrop?.getAttribute('aria-labelledby')).toBe('modal-title');
  });
});
