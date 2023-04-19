import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import axios from 'axios';
import { useRouter } from 'next/router';
import {setCookie} from 'cookies-next';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  
  const login = async (e) => {
    e.preventDefault();
    try {
      const result = await axios.post('api/login', {
        email,
        password
      })
      if(result.status ===200) {
        setCookie('growthify_user', result.data, {
          maxAge: 5 * 60 * 60
        })
        alert("login Successful");
        router.push("/all_tasks")
      }
      else {
        alert("login Failure");
      }
    } catch (error) {
      if(error.response.status === 502) {
        alert(error.response.data);
      }
      else {
        alert("Something Went wrong");
      }
    }
  };

  return (
    <div className="flex align-items-center justify-content-center !bg-[#304562]">
      <div className="surface-card p-4 shadow-2 border-round w-full lg:w-6">
        <div className="text-center mb-5">
          <img
            src="https://growthifymedia.com/wp-content/uploads/2022/03/growthify-logo.png"
            alt="hyper"
            height={50}
            width={400}
            className="mb-3 m-auto"
          />
          <div className="text-900 text-3xl font-medium mb-3">Welcome Back</div>
          {/* <span className="text-600 font-medium line-height-3">Don't have an account?</span>
            <a className="font-medium no-underline ml-2 text-blue-500 cursor-pointer">Create today!</a> */}
        </div>

        <form method="post" onSubmit={login}>
          <label htmlFor="email" className="block text-900 font-medium mb-2">
            Email
          </label>
          <InputText
            id="email"
            type="email"
            placeholder="Email address"
            className="w-full mb-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password" className="block text-900 font-medium mb-2">
            Password
          </label>
          <InputText
            id="password"
            type="password"
            placeholder="Password"
            className="w-full mb-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* <div className="flex align-items-center justify-content-between mb-6">
                <a className="font-medium no-underline ml-2 text-blue-500 text-right cursor-pointer">Forgot your password?</a>
            </div> */}

          <Button
            label="Sign In"
            type="submit"
            icon="pi pi-user"
            className="w-full"
          />
        </form>
      </div>
    </div>
  );
};

export default Login;
