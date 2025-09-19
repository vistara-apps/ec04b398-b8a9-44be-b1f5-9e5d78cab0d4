'use client';

import { useState } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import { MOCK_STREAMERS, PREDICTION_CATEGORIES } from '../lib/constants';

interface CreatePredictionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PredictionOption {
  text: string;
  id: string;
}

export function CreatePredictionModal({ isOpen, onClose }: CreatePredictionModalProps) {
  const [formData, setFormData] = useState({
    streamerId: '',
    prompt: '',
    category: '',
    duration: '4', // hours
  });
  
  const [options, setOptions] = useState<PredictionOption[]>([
    { id: '1', text: 'Yes' },
    { id: '2', text: 'No' }
  ]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.streamerId || !formData.prompt || options.length < 2) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    onClose();
    
    // Reset form
    setFormData({
      streamerId: '',
      prompt: '',
      category: '',
      duration: '4',
    });
    setOptions([
      { id: '1', text: 'Yes' },
      { id: '2', text: 'No' }
    ]);
    
    alert('Prediction market created successfully!');
  };

  const addOption = () => {
    const newId = (options.length + 1).toString();
    setOptions([...options, { id: newId, text: '' }]);
  };

  const removeOption = (id: string) => {
    if (options.length > 2) {
      setOptions(options.filter(opt => opt.id !== id));
    }
  };

  const updateOption = (id: string, text: string) => {
    setOptions(options.map(opt => opt.id === id ? { ...opt, text } : opt));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface border border-gray-700 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-text-primary">Create Prediction Market</h2>
          <button
            onClick={onClose}
            className="p-1 text-text-muted hover:text-text-primary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Streamer Selection */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Streamer
            </label>
            <select
              value={formData.streamerId}
              onChange={(e) => setFormData({ ...formData, streamerId: e.target.value })}
              className="input w-full"
              required
            >
              <option value="">Select a streamer</option>
              {MOCK_STREAMERS.map(streamer => (
                <option key={streamer.streamerId} value={streamer.streamerId}>
                  {streamer.displayName} ({streamer.tokenName})
                </option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="input w-full"
            >
              <option value="">Select category</option>
              {PREDICTION_CATEGORIES.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Prediction Prompt */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Prediction Question
            </label>
            <textarea
              value={formData.prompt}
              onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
              placeholder="e.g., Will Ninja reach 50K viewers today?"
              className="input w-full h-20 resize-none"
              required
            />
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Duration (hours)
            </label>
            <input
              type="number"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              min="1"
              max="168"
              className="input w-full"
              required
            />
          </div>

          {/* Options */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-text-primary">
                Prediction Options
              </label>
              <button
                type="button"
                onClick={addOption}
                className="text-accent hover:text-accent/80 text-sm flex items-center space-x-1"
              >
                <Plus className="w-4 h-4" />
                <span>Add Option</span>
              </button>
            </div>
            <div className="space-y-2">
              {options.map((option, index) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={option.text}
                    onChange={(e) => updateOption(option.id, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className="input flex-1"
                    required
                  />
                  {options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeOption(option.id)}
                      className="p-2 text-error hover:text-error/80 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !formData.streamerId || !formData.prompt}
              className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating...' : 'Create Prediction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
