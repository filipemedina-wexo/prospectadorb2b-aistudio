
import React, { useState } from 'react';
import type { Tag } from '../types';

interface TagsProps {
  tags: Tag[];
  addTag: (name: string, color: string) => void;
  deleteTag: (tagId: string) => void;
}

const Tags: React.FC<TagsProps> = ({ tags, addTag, deleteTag }) => {
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#3b82f6');
  
  const handleAddTag = () => {
    if (!newTagName.trim()) return;
    addTag(newTagName, newTagColor);
    setNewTagName('');
    setNewTagColor('#3b82f6');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800">Criar Nova Tag</h3>
        <div className="flex items-end space-x-4 mt-4">
          <div className="flex-grow">
            <label htmlFor="tag-name" className="block text-sm font-medium text-gray-700 mb-1">Nome da Tag</label>
            <input
              type="text"
              id="tag-name"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              className="block w-full px-3 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="tag-color" className="block text-sm font-medium text-gray-700 mb-1">Cor</label>
            <input
              type="color"
              id="tag-color"
              value={newTagColor}
              onChange={(e) => setNewTagColor(e.target.value)}
              className="block w-12 h-10 p-1 bg-white border border-gray-300 rounded-lg cursor-pointer"
            />
          </div>
          <button
            onClick={handleAddTag}
            className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm font-medium shadow-sm"
          >
            Adicionar Tag
          </button>
        </div>
      </div>
      
      <div className="mt-6 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800">Tags Existentes</h3>
        <div className="mt-4 space-y-2">
          {tags.map(tag => (
            <div key={tag.id} className="flex items-center justify-between p-2 border-b">
              <span 
                className="px-3 py-1 text-sm font-medium rounded-full" 
                style={{ backgroundColor: `${tag.color}30`, color: tag.color }}
              >
                {tag.name}
              </span>
              <button onClick={() => deleteTag(tag.id)} className="text-red-500 hover:text-red-700 text-sm">
                Excluir
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tags;