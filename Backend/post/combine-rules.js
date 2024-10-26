app.post('/combine-rules', async (req, res) => {
    const { rule_ids } = req.body; 
  
    const rules = await Rule.find({ _id: { $in: rule_ids } }).populate('ast');
 
    const combinedRoot = new Node({
      type: 'operator',
      value: 'AND',
      left: rules[0].ast,
      right: rules[1].ast 
    });
    await combinedRoot.save();
  
    const combinedRule = new Rule({ name: 'combined_rule', ast: combinedRoot._id });
    await combinedRule.save();
  
    res.json({ message: 'Rules combined', rule: combinedRule });
  });
  