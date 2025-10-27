import sequelize from '../config/database.js';
import defineUser from './user.js';
import defineLead from './lead.js';
import defineTag from './tag.js';
import defineList from './list.js';

const models = {};

models.User = defineUser(sequelize);
models.Lead = defineLead(sequelize);
models.Tag = defineTag(sequelize);
models.List = defineList(sequelize);

Object.values(models).forEach((model) => {
  if (typeof model.associate === 'function') {
    model.associate(models);
  }
});

export { sequelize };
export default models;
