import { useForm } from 'react-hook-form';
import {useNavigate, Link} from 'react-router-dom';
import {useState} from 'react';


export default function SignupPage() {
  const {register, handleSubmit, formState: { errors }} = useForm();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  // handle user signup after form submission
  const onSubmit = async (data) => {
    // console.log(data);
    try {
      const res = await fetch('http://localhost:8080/post_new_user', {
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
      <form className='signup-form' onSubmit={handleSubmit(onSubmit)}>

        <h1 className='register-title'>Create an Account</h1>

        <div className='register-first-name'>
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
          />
          {errors.firstName && <p style={{color: 'red'}}>{errors.firstName.message}</p>}
        </div>

        <div className='register-last-name'>
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
          />
          {errors.lastName && <p style={{color: 'red'}}>{errors.lastName.message}</p>}
        </div>

        <div className='register-email'>
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
          />
          {errors.email && <p style={{color: 'red'}}>{errors.email.message}</p>}
        </div>

        <div className='register-password'>
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
          />
          {errors.password && <p style={{color: 'red'}}>{errors.password.message}</p>}
        </div>

        <div>
          <input type='submit' style={{ backgroundColor: '#33c7ff' }} />
        </div>
        {serverError && <p style={{ color: 'red' }}>{serverError}</p>}
      </form>
      Already have an account? Login <Link to='/'>here</Link>
    </>
  );
}
