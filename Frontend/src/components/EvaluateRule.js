import React, { useState } from 'react';
import axios from 'axios';

const EvaluateRule = () => {
  const [ruleId, setRuleId] = useState('');
  const [userData, setUserData] = useState({});
  const [result, setResult] = useState(null);

  const handleEvaluate = async () => {
    try {
      const response = await axios.post('http://localhost:5000/evaluate-rule', {
        rule_id: ruleId,
        user_data: userData
      });
      setResult(response.data.result);
    } catch (error) {
      console.error('Error evaluating rule:', error);
    }
  };

  return (
    <div>
      <h3>Evaluate Rule</h3>
      <input type="text" placeholder="Rule ID" onChange={(e) => setRuleId(e.target.value)} />
      <textarea
        placeholder="Enter User Data (JSON format)"
        onChange={(e) => setUserData(JSON.parse(e.target.value))}
      />
      <button onClick={handleEvaluate}>Evaluate Rule</button>
      {result !== null && <p>Evaluation Result: {result.toString()}</p>}
    </div>
  );
};

export default EvaluateRule;
