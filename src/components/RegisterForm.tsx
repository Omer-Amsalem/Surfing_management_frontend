import React, { useState, ChangeEvent, FormEvent } from 'react';
import InputField from './InputField';
import axios from 'axios';

interface FormData {
  firstName: string;
  lastName: string;
  role: string;
  email: string;
  password: string;
}

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    role: '',
    email: '',
    password: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post('YOUR_API_URL', formData);
      console.log('Registration Successful', response.data);
      alert('Registration Successful!');
    } catch (error) {
      console.error('Error during registration:', error);
      alert('Registration Failed!');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-lg px-8 py-6 w-full max-w-md mx-auto"
    >
      <h2 className="text-2xl font-bold text-gray-700 text-center mb-4">
        Registration
      </h2>
      <div className="flex justify-center mb-4">
        <img
          src="YOUR_IMAGE_URL"
          alt="Logo"
          className="h-16 w-16 rounded-full shadow-lg"
        />
      </div>
      <p className="text-center text-gray-500 mb-6">
        Enter your details to register
      </p>
      <InputField
        label="First Name"
        type="text"
        placeholder="First Name"
        name="firstName"
        value={formData.firstName}
        onChange={handleChange}
      />
      <InputField
        label="Last Name"
        type="text"
        placeholder="Last Name"
        name="lastName"
        value={formData.lastName}
        onChange={handleChange}
      />
      <InputField
        label="Role (choose from list)"
        type="text"
        placeholder="Role"
        name="role"
        value={formData.role}
        onChange={handleChange}
      />
      <InputField
        label="Email"
        type="email"
        placeholder="Email"
        name="email"
        value={formData.email}
        onChange={handleChange}
      />
      <InputField
        label="Password"
        type="password"
        placeholder="Password"
        name="password"
        value={formData.password}
        onChange={handleChange}
      />
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
      >
        Register
      </button>
    </form>
  );
};

export default RegisterForm;
