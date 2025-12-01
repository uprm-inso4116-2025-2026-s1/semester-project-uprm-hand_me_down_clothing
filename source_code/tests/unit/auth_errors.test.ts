import { requestPasswordReset, signIn } from '../../../app/auth/auth';
import { supabase } from '../../../app/auth/supabaseClient';

jest.mock('../../../app/auth/supabaseClient', () => ({
  supabase: {
    auth: {
      resetPasswordForEmail: jest.fn(),
      signInWithPassword: jest.fn(),
    }
  }
}));

const mocked: any = supabase as any;

describe('auth error mapping', () => {
  afterEach(() => jest.clearAllMocks());

  test('maps rate-limit error for password reset', async () => {
    mocked.auth.resetPasswordForEmail.mockResolvedValue({ data: null, error: { status: 429, message: 'Too many requests' } });
    const { data, error } = await requestPasswordReset('test@example.com');
    expect(data).toBeNull();
    expect(error).toBeTruthy();
    expect(error.message).toMatch(/too many requests/i);
  });

  test('maps invalid credentials for signIn', async () => {
    mocked.auth.signInWithPassword.mockResolvedValue({ data: null, error: { status: 401, message: 'Invalid login credentials' } });
    const { data, error } = await signIn('user@example.com', 'wrongpw');
    expect(data).toBeNull();
    expect(error).toBeTruthy();
    expect(error.message).toMatch(/invalid email or password/i);
  });
});
