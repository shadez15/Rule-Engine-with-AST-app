// const { Node, Rule } = require('../models/Rule');

// // Create a rule (AST)
// exports.createRule = async (req, res) => {
//   const { rule_string } = req.body;

//   const parseRuleString = (ruleStr) => {
//     // Dummy parser logic (for simple rule strings)
//     const [operand1, operator, operand2] = ruleStr.split(' ');
//     const rootNode = new Node({
//       type: 'operator',
//       value: operator,
//       left: { type: 'operand', value: operand1 },
//       right: { type: 'operand', value: operand2 }
//     });
//     return rootNode;
//   };

//   const rootNode = parseRuleString(rule_string);
//   await rootNode.save();

//   const newRule = new Rule({ name: 'rule1', ast: rootNode._id });
//   await newRule.save();

//   res.json({ message: 'Rule created', rule: newRule });
// };

// // Combine multiple rules
// exports.combineRules = async (req, res) => {
//   const { rule_ids } = req.body;
//   const rules = await Rule.find({ _id: { $in: rule_ids } }).populate('ast');

//   const combinedRoot = new Node({
//     type: 'operator',
//     value: 'AND',
//     left: rules[0].ast,
//     right: rules[1].ast
//   });
//   await combinedRoot.save();

//   const combinedRule = new Rule({ name: 'combined_rule', ast: combinedRoot._id });
//   await combinedRule.save();

//   res.json({ message: 'Rules combined', rule: combinedRule });
// };

// // Evaluate rule
// exports.evaluateRule = async (req, res) => {
//   const { rule_id, user_data } = req.body;
//   const rule = await Rule.findById(rule_id).populate('ast');

//   const evaluateAST = (node, data) => {
//     if (node.type === 'operand') {
//       return eval(node.value);
//     } else if (node.type === 'operator') {
//       if (node.value === 'AND') {
//         return evaluateAST(node.left, data) && evaluateAST(node.right, data);
//       } else if (node.value === 'OR') {
//         return evaluateAST(node.left, data) || evaluateAST(node.right, data);
//       }
//     }
//   };

//   const result = evaluateAST(rule.ast, user_data);
//   res.json({ result });
// };
const Rule = require('../models/Rule');

// Utility to parse the rule string into an Abstract Syntax Tree (AST)
const parseRuleStringToAST = (ruleString) => {
  // Placeholder for rule parsing logic; could be done with a custom parser or library
  // For now, we'll assume a very simplified AST representation
  const ast = {
    type: "operator",
    operator: "AND",
    left: {
      type: "condition",
      condition: "age > 30"
    },
    right: {
      type: "condition",
      condition: "department = 'Sales'"
    }
  };
  return ast;  // Replace this with real parsing logic
};

// Utility to evaluate an AST against user data
const evaluateAST = (ast, userData) => {
  // Recursively evaluate the AST
  if (ast.type === 'condition') {
    // Parse the condition, e.g., "age > 30"
    const [attr, operator, value] = ast.condition.split(' ');
    const userValue = userData[attr];
    
    switch (operator) {
      case '>':
        return userValue > Number(value);
      case '<':
        return userValue < Number(value);
      case '=':
        return userValue === value.replace(/'/g, '');  // Handle strings like 'Sales'
      default:
        return false;
    }
  } else if (ast.type === 'operator') {
    const leftResult = evaluateAST(ast.left, userData);
    const rightResult = evaluateAST(ast.right, userData);
    
    if (ast.operator === 'AND') {
      return leftResult && rightResult;
    } else if (ast.operator === 'OR') {
      return leftResult || rightResult;
    }
  }
  return false;
};

// Create Rule
const createRule = async (req, res) => {
  const { rule_string } = req.body;

  try {
    // Parse the rule string into an AST
    const ast = parseRuleStringToAST(rule_string);
    
    // Create and save the rule in the database
    const rule = await Rule.create({ rule_string, ast });
    res.status(201).json({ message: 'Rule created successfully', rule });
  } catch (error) {
    res.status(400).json({ error: 'Failed to create rule' });
  }
};

// Combine Rules
const combineRules = async (req, res) => {
  const { rule_ids } = req.body;

  try {
    // Fetch the rules by their IDs from the database
    const rules = await Rule.find({ _id: { $in: rule_ids } });

    if (rules.length === 0) {
      return res.status(404).json({ message: 'No rules found' });
    }

    // For simplicity, combine all rules using an AND operator
    // You can enhance this by adding more flexible combination logic
    let combinedAST = rules[0].ast;

    for (let i = 1; i < rules.length; i++) {
      combinedAST = {
        type: "operator",
        operator: "AND",
        left: combinedAST,
        right: rules[i].ast,
      };
    }

    // Save the combined rule in the database
    const combinedRule = new Rule({
      rule_string: "Combined Rule",
      ast: combinedAST
    });
    
    await combinedRule.save(); // Save the combined rule

    // Respond with the created combined rule ID
    res.status(200).json({ message: 'Rules combined successfully', combinedRuleId: combinedRule._id });
  } catch (error) {
    res.status(400).json({ error: 'Failed to combine rules' });
  }
};


// Evaluate Rule
const evaluateRule = async (req, res) => {
  const { rule_id, user_data } = req.body;

  try {
    // Fetch the rule by its ID
    const rule = await Rule.findById(rule_id);

    if (!rule) {
      return res.status(404).json({ message: 'Rule not found' });
    }

    // Evaluate the rule's AST against the provided user data
    const result = evaluateAST(rule.ast, user_data);

    res.status(200).json({ result });
  } catch (error) {
    res.status(400).json({ error: 'Failed to evaluate rule' });
  }
};

module.exports = { createRule, combineRules, evaluateRule };
