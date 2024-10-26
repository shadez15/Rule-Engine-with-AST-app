app.post('/evaluate-rule', async (req, res) => {
    const { rule_id, user_data } = req.body;
    
    const rule = await Rule.findById(rule_id).populate('ast');
    
    const evaluateAST = (node, data) => {
      if (node.type === 'operand') {
        return eval(node.value); 
      } else if (node.type === 'operator') {
        if (node.value === 'AND') {
          return evaluateAST(node.left, data) && evaluateAST(node.right, data);
        } else if (node.value === 'OR') {
          return evaluateAST(node.left, data) || evaluateAST(node.right, data);
        }
      }
    };
  
    const result = evaluateAST(rule.ast, user_data);
    res.json({ result });
  });
  