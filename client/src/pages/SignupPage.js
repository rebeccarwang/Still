import { useForm } from 'react-hook-form';
import {useNavigate, Link} from 'react-router-dom';
import {useState} from 'react';
import BASE_URL from '../config';


export default function SignupPage() {
  const {register, handleSubmit, formState: { errors }} = useForm();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  // handle user signup after form submission
  const onSubmit = async (data) => {
    // console.log(data);
    try {
      const res = await fetch(`${BASE_URL}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }
      )

      if (res.ok) {
        navigate('/');
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
  }
  return (
    <>
    <div className='min-h-screen flex items-center justify-center md:items-start md:pt-40'>
      <div className='space-y-4 border border-med-orange-200 border-opacity-25 p-4 rounded-xl w-96'>
        <h1 className='text-4xl font-semibold text-center text-med-orange mb-12'>Create an account</h1>
        <form className='signup-form' onSubmit={handleSubmit(onSubmit)}>

          <div className='mb-4'>
            <input
              type='text'
              placeholder='First Name'
              {...register('firstName', {
                required: 'first name is required',
                minLength: {
                  value: 1,
                  message: 'must be at least 1 character',
                },
                maxLength: {
                  value: 30,
                  message: 'character limit exceeded',
                },
              })}
              className='w-full px-4 py-2 border border-med-orange border-opacity-25 rounded focus:outline-[#ebb49e] placeholder-italic'
            />
            {errors.firstName && <p className='text-sm text-[#FF3131]'>{errors.firstName.message}</p>}
          </div>

          <div className='register-last-name mb-4'>
            <input
              type='text'
              placeholder='Last Name'
              {...register('lastName', {
                required: 'last name is required',
                minLength: {
                  value: 1,
                  message: 'must be at least 1 character',
                },
                maxLength: {
                  value: 30,
                  message: 'character limit exceeded',
                },
              })}
              className='w-full px-4 py-2 border border-med-orange border-opacity-25 rounded focus:outline-[#ebb49e] placeholder-italic'
            />
            {errors.lastName && <p className='text-sm text-[#FF3131]'>{errors.lastName.message}</p>}
          </div>

          <div className='register-email mb-4'>
            <input
              type='text'
              placeholder='Email'
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

          <div className='register-password mb-4'>
            <input
              type='password'
              placeholder='Password'
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
              className='w-full px-4 py-2 border border-med-orange border-opacity-25 rounded focus:outline-[#ebb49e] placeholder-italic'
            />
            {errors.password && <p className='text-sm text-[#FF3131]'>{errors.password.message}</p>}
          </div>

          <div>
            <input type='submit' value='Sign Up' className='w-full h-12 bg-med-orange hover:opacity-85 text-white font-medium font-semibold py-2 px-4 rounded-xl' />
          </div>
          {serverError && <p className='text-sm text-[#FF3131]'>{serverError}</p>}
        </form>
        <div className='text-center text-sm text-med-orange'>
        Already have an account? Login <Link className='font-bold' to='/'>here</Link>
        </div>
      </div>
    </div>
    </>
  );
}
