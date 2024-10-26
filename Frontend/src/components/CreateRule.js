import React, { useState } from 'react';
import axios from 'axios';

const CreateRule = () => {
  const [rule, setRule] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/create-rule', { rule_string: rule });
      console.log(response.data);
    } catch (error) {
      console.error('Error creating rule:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Rule String:
        <input type="text" value={rule} onChange={(e) => setRule(e.target.value)} />
      </label>
      <button type="submit">Create Rule</button>
    </form>
  );
};

export default CreateRule;
