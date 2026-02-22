const joi = require('joi');


function validateTask(task) {
  const schema = joi.object({
    title: joi.string().min(3).max(50).required(),
    description: joi.string().max(500).allow(''),
    priority: joi.number().integer().min(1).max(5),
    category: joi.string().allow(''),
    deadline: joi.date(),
    taskType: joi.string().valid('work', 'personal', 'shopping', 'health', 'education', 'home', 'other').lowercase()
  });
  
  return schema.validate(task);
}

module.exports = validateTask;