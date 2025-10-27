import { DataTypes } from 'sequelize';
import { randomUUID } from 'node:crypto';

const STATUSES = ['A contatar', 'Contatado', 'Negociação', 'Ganho', 'Perdido'];

const defaultJson = (value, fallback) => (value == null ? fallback : value);

export default (sequelize) => {
  const Lead = sequelize.define(
    'Lead',
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
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      website: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      address: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      gmb_rating: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0,
          max: 5,
        },
      },
      gmb_review_count: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      instagram_profile: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM(...STATUSES),
        allowNull: false,
        defaultValue: 'A contatar',
      },
      city: {
        type: DataTypes.STRING(120),
        allowNull: false,
      },
      neighborhood: {
        type: DataTypes.STRING(120),
        allowNull: true,
      },
      tags: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
      },
      listIds: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
      },
      observations: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
      },
      sources: {
        type: DataTypes.JSON,
        allowNull: true,
      },
    },
    {
      tableName: 'leads',
      timestamps: true,
    },
  );

  Lead.associate = (models) => {
    Lead.belongsTo(models.User, { foreignKey: 'user_id', as: 'owner' });
  };

  Lead.addHook('beforeValidate', (lead) => {
    lead.tags = defaultJson(lead.tags, []);
    lead.listIds = defaultJson(lead.listIds, []);
    lead.observations = defaultJson(lead.observations, []);
    lead.sources = defaultJson(lead.sources, []);
  });

  return Lead;
};
