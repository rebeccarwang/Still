import { useForm } from 'react-hook-form';
import {useNavigate, Link} from 'react-router-dom';
import {useState} from 'react';

function LoginPage () {
  const {register, handleSubmit, formState: { errors }} = useForm();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const onSubmit = async (data) => {
    // console.log(data);
    try {
      const res = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }
      )

      if (res.ok) {
        navigate('/home');
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
      <form className='login-form' onSubmit={handleSubmit(onSubmit)}>

        <h1 className='login-title'>Login</h1>

        <div className='login-email'>
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

        <div className='login-password'>
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
          <input type='submit' value='LOGIN' style={{ backgroundColor: '#33c7ff' }} />
        </div>
        {serverError && <p style={{ color: 'red' }}>{serverError}</p>}
      </form>
      <div>
        First time here? Create an account <Link to='/signup'>here</Link>
      </div>
    </>
  );
}

export default LoginPage;