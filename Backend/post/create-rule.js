const { Node, Rule } = require('./models/Rule');

app.post('/create-rule', async (req, res) => {
  const { rule_string } = req.body;

  const parseRuleString = (ruleStr) => {
    const [operand1, operator, operand2] = ruleStr.split(' ');
    return new Node({
      type: 'operator',
      value: operator,
      left: { type: 'operand', value: operand1 },
      right: { type: 'operand', value: operand2 }
    });
  };

  const rootNode = parseRuleString(rule_string);
  await rootNode.save();

  const newRule = new Rule({ name: 'rule1', ast: rootNode._id });
  await newRule.save();

  res.json({ message: 'Rule created', rule: newRule });
});
