'use client';

import { useState } from 'react';
import { generateMockPredictions } from '../lib/utils';
import { PredictionCard } from './PredictionCard';
import { CreatePredictionModal } from './CreatePredictionModal';
import { Plus, Filter } from 'lucide-react';

export function PredictionMarkets() {
  const [predictions] = useState(generateMockPredictions());
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'resolved'>('all');

  const filteredPredictions = predictions.filter(prediction => {
    if (filter === 'active') return !prediction.resolved;
    if (filter === 'resolved') return prediction.resolved;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Active Predictions</h2>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="bg-gray-800 border border-gray-700 rounded-md px-3 py-1 text-white text-sm"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create Prediction</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPredictions.map((prediction) => (
          <PredictionCard
            key={prediction.predictionId}
            prediction={prediction}
          />
        ))}
      </div>

      {filteredPredictions.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">No predictions found for the selected filter.</p>
        </div>
      )}

      <CreatePredictionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
