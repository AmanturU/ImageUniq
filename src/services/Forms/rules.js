import { Regex } from './regex';

const Auth = {
  Email: {
    required: 'Required field',
    pattern: {
      value: Regex.Email,
      message: 'Invalid email format',
    },
  },
  nonEmail: {
    pattern: {
      value: Regex.Email,
      message: 'Invalid email format',
    },
  },
  Password: {
    required: 'Required field',
    minLength: {
      value: 8,
      message: 'Minimum 8 characters',
    },
    maxLength: {
      value: 20,
      message: 'Maximum 20 characters',
    },
  },
};

const Orders = {
  Title: {
    required: 'Required field',
    minLength: {
      value: 3,
      message: 'Minimum 3 characters',
    },
    maxLength: {
      value: 30,
      message: 'Maximum 30 characters',
    },
  },
  Required: {
    required: 'Required field',
    minLength: {
      value: 1,
      message: 'Minimum 1 characters',
    },
  },
  ModificationLevel: {
    required: 'Required',
    min: {
      value: 1,
      message: 'Min 1',
    },
    max: {
      value: 50,
      message: 'Max 50',
    },
  },
};

export const Rules = {
  Auth,
  Orders,
};
