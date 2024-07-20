import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { describe, expect, test} from 'vitest';
import UserCard from './user-card';
import TUser from '@/models/user';

describe('UseCard', () => {

  const testId = 'info-card';

  test('should render component properly', () => {
    const user: TUser = {
      name: 'John Doe',
      city: 'New York',
      country: 'USA',
      favorite_sport: 'Basketball'
    };

    const { getByTestId, getByText } = render(<UserCard data-testid={testId} user={user} />)

    expect(getByTestId(testId)).toBeInTheDocument();
    expect(getByText(user.name)).toBeInTheDocument();
    expect(getByText('City')).toBeInTheDocument();
    expect(getByText(user.city)).toBeInTheDocument();
    expect(getByText('Country')).toBeInTheDocument();
    expect(getByText(user.country)).toBeInTheDocument();
    expect(getByText('Favorite sport')).toBeInTheDocument();
    expect(getByText(user.favorite_sport)).toBeInTheDocument();    

  });

});
