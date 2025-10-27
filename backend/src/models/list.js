import { DataTypes } from 'sequelize';
import { randomUUID } from 'node:crypto';

export default (sequelize) => {
  const List = sequelize.define(
    'List',
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
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: 'lists',
      timestamps: true,
    },
  );

  List.associate = (models) => {
    List.belongsTo(models.User, { foreignKey: 'user_id', as: 'owner' });
  };

  return List;
};
