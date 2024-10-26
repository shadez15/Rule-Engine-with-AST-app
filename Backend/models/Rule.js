// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const nodeSchema = new Schema({
//   type: String, 
//   value: String, 
//   left: { type: Schema.Types.ObjectId, ref: 'Node' }, 
//   right: { type: Schema.Types.ObjectId, ref: 'Node' } 
// });

// const ruleSchema = new Schema({
//   name: String,
//   ast: { type: Schema.Types.ObjectId, ref: 'Node' },
//   created_at: { type: Date, default: Date.now }
// });

// const Node = mongoose.model('Node', nodeSchema);
// const Rule = mongoose.model('Rule', ruleSchema);

// module.exports = { Node, Rule };
const mongoose = require('mongoose');

// Define a schema for storing individual rules
const ruleSchema = new mongoose.Schema({
  rule_string: { type: String, required: true },  // The rule expression as a string
  ast: { type: Object },  // Optional: Storing the AST representation of the rule
  created_at: { type: Date, default: Date.now }
});

const Rule = mongoose.model('Rule', ruleSchema);

module.exports = Rule;
