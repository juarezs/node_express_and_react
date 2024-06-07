import '@testing-library/jest-dom';
import { fireEvent, render } from '@testing-library/react';
import { describe, expect, test, vi} from 'vitest';
import FilterField from './filter-field';

describe('UploadButton', () => {

  const inputId = 'search-input';

  test('should render component properly', async () => {
    const onFilter = vi.fn();

    const { getByTestId } = render(<FilterField data-testid={inputId} onFilter={onFilter} />)
    
    const searchInput: HTMLInputElement = getByTestId(inputId) as HTMLInputElement;
    
    expect(searchInput.placeholder).toBe('Search');

    fireEvent.change(searchInput, {target: {value: 'john doe'}});
    expect(searchInput.value).toBe('john doe');
    await vi.waitFor(
      () => {
        expect(onFilter).toHaveBeenCalledWith('john doe');
      }
    );

    fireEvent.change(searchInput, {target: {value: ''}});
    expect(searchInput.value).toBe('');
    await vi.waitFor(
      () => {
        expect(onFilter).toHaveBeenCalledWith('');
      }
    );

  });

});
