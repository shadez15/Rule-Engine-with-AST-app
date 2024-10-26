import React, { useState } from 'react';
import axios from 'axios';

const CombineRules = () => {
  const [ruleIds, setRuleIds] = useState([]);

  const handleCombine = async () => {
    try {
      const response = await axios.post('http://localhost:5000/combine-rules', { rule_ids: ruleIds });
      console.log(response.data);
    } catch (error) {
      console.error('Error combining rules:', error);
    }
  };

  return (
    <div>
      <h3>Combine Rules</h3>
      <input
        type="text"
        placeholder="Enter Rule IDs (comma separated)"
        onChange={(e) => setRuleIds(e.target.value.split(','))}
      />
      <button onClick={handleCombine}>Combine Rules</button>
    </div>
  );
};

export default CombineRules;
