import { DataTypes } from 'sequelize';
import { randomUUID } from 'node:crypto';

export default (sequelize) => {
  const Tag = sequelize.define(
    'Tag',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: () => randomUUID(),
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(120),
        allowNull: false,
      },
      color: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
    },
    {
      tableName: 'tags',
      timestamps: true,
    },
  );

  Tag.associate = (models) => {
    Tag.belongsTo(models.User, { foreignKey: 'user_id', as: 'owner' });
  };

  return Tag;
};
