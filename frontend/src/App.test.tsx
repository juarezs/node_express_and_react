import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import '@testing-library/jest-dom';
import { fireEvent, render } from '@testing-library/react';
import { describe, expect, test, vi} from 'vitest';
import App from './App';
import TDataResponse from './models/data-response';
import TUser from './models/user';
import * as useToast from './components/ui/use-toast'

vi.mock('axios');
vi.mock('./components/ui/use-toast');

const axiosMock = axios as jest.Mocked<typeof axios>;
const mockToast = vi.fn();
const mockUseToast = useToast as jest.Mocked<typeof useToast>;
mockUseToast.useToast.mockReturnValue({
  toast: mockToast,
  dismiss: vi.fn(),
  toasts: []
});
  

describe('App', () => {

  const inputId = 'search-input';
  const buttonId = 'upload-button';
  const fileId = 'upload-file';
  const cardId = 'info-card';
  const allUsers = [
    {
        'name': 'John Doe',
        'city': 'New York',
        'country': 'USA',
        'favorite_sport': 'Basketball'
    },
    {
        'name': 'Jane Smith',
        'city': 'London',
        'country': 'UK',
        'favorite_sport': 'Football'
    },
    {
        'name': 'Mike Johnson',
        'city': 'Paris',
        'country': 'France',
        'favorite_sport': 'Tennis'
    },
    {
        'name': 'Karen Lee',
        'city': 'Tokyo',
        'country': 'Japan',
        'favorite_sport': 'Swimming'
    },
    {
        'name': 'Tom Brown',
        'city': 'Sydney',
        'country': 'Australia',
        'favorite_sport': 'Running'
    },
    {
        'name': 'Emma Wilson',
        'city': 'Berlin',
        'country': 'Germany',
        'favorite_sport': 'Basketball'
    }
  ];
  const filteredUsers = [
    {
        'name': 'John Doe',
        'city': 'New York',
        'country': 'USA',
        'favorite_sport': 'Basketball'
    },
    {
        'name': 'Jane Smith',
        'city': 'London',
        'country': 'UK',
        'favorite_sport': 'Football'
    }
  ];

  test('should load and filter propery', async () => {
    const axiosResponse:AxiosResponse<TDataResponse<TUser[]>> = {
      data: {
        data: allUsers
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as InternalAxiosRequestConfig
    };

    axiosMock.get.mockResolvedValueOnce(axiosResponse);

    const { getByTestId, queryAllByTestId } = render(<App />)
    
    const searchInput: HTMLInputElement = getByTestId(inputId) as HTMLInputElement;
    const uploadButton: HTMLButtonElement = getByTestId(buttonId) as HTMLButtonElement;
    const fileInput: HTMLInputElement = getByTestId(fileId) as HTMLInputElement;
    const cards: HTMLElement[] = queryAllByTestId(cardId);
    
    expect(searchInput.placeholder).toBe('Search');
    expect(uploadButton).toHaveTextContent('Upload');
    
    // loaded all users
    expect(axiosMock.get).toHaveBeenCalledWith(
      '/api/users', { params: { q: [''] }, paramsSerializer: { indexes: null } }
    )
    expect(cards.length === allUsers.length)
    
    // filter by keywords
    axiosResponse.data.data = filteredUsers;
    axiosMock.get.mockResolvedValueOnce(axiosResponse);
    fireEvent.change(searchInput, {target: {value: 'john doe'}});
    await vi.waitFor(
      () => {
        expect(axiosMock.get).toHaveBeenCalledWith(
          '/api/users', { params: { q: ['john', 'doe'] }, paramsSerializer: { indexes: null } }
        );
      }
    );
    expect(cards.length === filteredUsers.length);

    // handle search error
    axiosMock.get.mockRejectedValue('some error');
    fireEvent.change(searchInput, {target: {value: 'new filter'}});
    await vi.waitFor(
      () => {
        expect(axiosMock.get).toHaveBeenCalledWith(
          '/api/users', { params: { q: ['new', 'filter'] }, paramsSerializer: { indexes: null } }
        );
      }
    );
    expect(cards.length === filteredUsers.length);
    expect(mockToast).toHaveBeenCalledWith({
      variant: 'destructive',
      title: 'some error',
    });

    // upload file successfully
    axiosMock.get.mockResolvedValueOnce(axiosResponse);
    axiosMock.post.mockResolvedValueOnce({});
    const file:File = {} as File;    
    fireEvent.change(fileInput, {target: {files: [file]}});
    const formData = new FormData();
    formData.append('file', file);
    expect(axiosMock.post).toHaveBeenCalledWith(
      '/api/files', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );

    // handle upload file error
    axiosMock.post.mockRejectedValue('upload error');
    fireEvent.change(fileInput, {target: {files: [file]}});
    await vi.waitFor(
      () => {
        expect(mockToast).toHaveBeenCalledWith({
          variant: 'destructive',
          title: 'upload error',
        });
      }
    );

    // handle no file selection
    axiosMock.post.mockReset();
    fireEvent.change(fileInput, {target: {files: null}});
    expect(axiosMock.post).not.toHaveBeenCalled();

  });

});
