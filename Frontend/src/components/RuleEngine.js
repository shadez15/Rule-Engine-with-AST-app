import React, { useState } from 'react';
import axios from 'axios';

const RuleEngine = () => {
  const [ruleString, setRuleString] = useState('');
  const [ruleIds, setRuleIds] = useState('');
  const [ruleIdToEvaluate, setRuleIdToEvaluate] = useState('');
  const [userData, setUserData] = useState('');
  const [result, setResult] = useState(null);

  // Handle Create Rule
  const createRule = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/rules/create-rule', { rule_string: ruleString });
      alert(`Rule created with ID: ${response.data.rule._id}`);
      setRuleString('');
    } catch (error) {
      console.error('Error creating rule:', error);
      alert('Error creating rule.');
    }
  };

  // Handle Combine Rules
  const combineRules = async () => {
    try {
      const ruleIdArray = ruleIds.split(',').map(id => id.trim());
      const response = await axios.post('http://localhost:5000/api/rules/combine-rules', { rule_ids: ruleIdArray });
      alert(`Combined Rule created with ID: ${response.data.combinedRuleId}`);
      setRuleIds('');
    } catch (error) {
      console.error('Error combining rules:', error);
      alert('Error combining rules.');
    }
  };

  // Handle Evaluate Rule
  const evaluateRule = async () => {
    try {
      const parsedUserData = JSON.parse(userData);
      const response = await axios.post('http://localhost:5000/api/rules/evaluate-rule', {
        rule_id: ruleIdToEvaluate,
        user_data: parsedUserData
      });
      setResult(response.data.result);
    } catch (error) {
      console.error('Error evaluating rule:', error);
      alert('Error evaluating rule.');
    }
  };

  return (
    <div>
      <h1>Rule Engine</h1>

      <div>
        <h2>Create Rule</h2>
        <input
          type="text"
          placeholder="Enter Rule String"
          value={ruleString}
          onChange={(e) => setRuleString(e.target.value)}
        />
        <button onClick={createRule}>Create Rule</button>
      </div>

      <div>
        <h2>Combine Rules</h2>
        <input
          type="text"
          placeholder="Enter Rule IDs (comma separated)"
          value={ruleIds}
          onChange={(e) => setRuleIds(e.target.value)}
        />
        <button onClick={combineRules}>Combine Rules</button>
      </div>

      <div>
        <h2>Evaluate Rule</h2>
        <input
          type="text"
          placeholder="Enter Rule ID"
          value={ruleIdToEvaluate}
          onChange={(e) => setRuleIdToEvaluate(e.target.value)}
        />
        <textarea
          placeholder="Enter User Data (JSON format)"
          value={userData}
          onChange={(e) => setUserData(e.target.value)}
        />
        <button onClick={evaluateRule}>Evaluate Rule</button>

        {result !== null && (
          <div>
            <h3>Evaluation Result: {result ? 'True' : 'False'}</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default RuleEngine;
