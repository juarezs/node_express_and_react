import '@testing-library/jest-dom';
import { fireEvent, render } from '@testing-library/react';
import { describe, expect, test, vi} from 'vitest';
import UploadButton from './upload-button';

describe('UploadButton', () => {

  const buttonId = 'upload-button';
  const buttonTitle = 'Upload';

  test('should render component properly', () => {
    const onSelect = vi.fn();

    const { getByTestId } = render(<UploadButton onSelect={onSelect} data-testid={buttonId}>{buttonTitle}</UploadButton>)
    
    const button: HTMLElement = getByTestId(buttonId);
    const input: HTMLElement = getByTestId('upload-file');

    input.click = vi.fn();

    expect(button).toHaveTextContent(buttonTitle);

    fireEvent.click(button);
    expect(input.click).toHaveBeenCalled();

    fireEvent.change(input);
    expect(onSelect).toHaveBeenCalled();

  });

});
