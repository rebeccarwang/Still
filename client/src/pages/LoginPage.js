import { useForm } from 'react-hook-form';
import {useNavigate, Link} from 'react-router-dom';
import {useState} from 'react';
import {useAuth} from '../hooks/AuthContext.js';
import BASE_URL from '../config';

export default function LoginPage () {
  const {register, handleSubmit, formState: { errors }} = useForm();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const {login} = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // handle login logic after form submission
  const onSubmit = async (data) => {
    // console.log(data);
    setIsSubmitting(true);
    try {
      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        credentials: 'include'
      }
      )

      if (res.ok) {
        const resJson = await res.json();
        const {isLoggedIn, userId, firstName, hasCompletedOnboarding} = resJson;
        login({isLoggedIn, userId, firstName});

        // navigate to MoodCheckInPage if not new user
        if (hasCompletedOnboarding) {
          navigate('/check-in');
        }

        // navigate to PreferenceSetupPage if new user
        else {
          navigate('/setup/preferences');
        }
      }
      else {
        const resJson = await res.json();
        setServerError(resJson.error || 'Something went wrong');
        return;
      }
    }
    catch (err) {
      console.log('Error:', err);
      setServerError('Something went wrong- try again later');
    }
    finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
    <div className='min-h-screen flex items-center justify-center md:items-start md:pt-40'>
      <div className='space-y-4 border border-med-orange-200 border-opacity-25 p-4 rounded-xl w-96'>
        <h1 className='text-4xl font-semibold text-center text-med-orange mb-12'>Login</h1>
        <form className='login-form' onSubmit={handleSubmit(onSubmit)}>
          <div className='login-email mb-4'>
            <input
              type='text'
              placeholder='Email'
              autoComplete='username'
              {...register('email', {
                required: 'email is required',
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: 'email format does not match expected',
                },
              })}
              className='w-full px-4 py-2 border border-med-orange border-opacity-25 rounded focus:outline-[#ebb49e] placeholder-italic'
            />
            {errors.email && <p className='text-sm text-[#FF3131]'>{errors.email.message}</p>}
          </div>

          <div className='mb-4'>
            <input
              type='password'
              placeholder='Password'
              autoComplete='current-password'
              className='w-full px-4 py-2 border border-med-orange border-opacity-25 rounded focus:outline-[#ebb49e] placeholder-italic'
              {...register('password', {
                required: 'password is required',
                minLength: {
                  value: 8,
                  message: 'must be at least 8 characters',
                },
                maxLength: {
                  value: 30,
                  message: 'character limit exceeded',
                },
              })}
            />
            {errors.password && <p className='text-sm text-[#FF3131]'>{errors.password.message}</p>}
          </div>

          <div>
            <input type='submit' value={isSubmitting? 'LOGGING IN...': 'LOGIN'} className='w-full h-12 bg-med-orange hover:opacity-85 text-white font-medium font-semibold py-2 px-4 rounded-xl'/>
          </div>
          {serverError && <p className='text-sm text-[#FF3131]'>{serverError}</p>}
        </form>
        <div className='text-center text-sm text-med-orange'>
          First time here? Create an account <Link className='font-bold' to='/signup'>here</Link>
        </div>
        {isSubmitting && (
        <div className='fixed inset-0 bg-white bg-opacity-30 z-40'></div>
        )}
      </div>
    </div>
    </>
  );
}
