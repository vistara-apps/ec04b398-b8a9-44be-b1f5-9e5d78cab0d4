'use client';

import { useState } from 'react';
import { Bell, Search, User, Settings } from 'lucide-react';
import { ConnectWallet } from '@coinbase/onchainkit/wallet';

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="bg-surface border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-sm">SP</span>
              </div>
              <span className="text-xl font-bold text-text-primary">StreamPredict</span>
            </div>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted w-4 h-4" />
              <input
                type="text"
                placeholder="Search streamers, predictions..."
                className="w-full pl-10 pr-4 py-2 bg-bg border border-gray-700 rounded-md text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                onFocus={() => setIsSearchOpen(true)}
                onBlur={() => setIsSearchOpen(false)}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <button className="p-2 text-text-muted hover:text-text-primary transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            
            <button className="p-2 text-text-muted hover:text-text-primary transition-colors">
              <Settings className="w-5 h-5" />
            </button>

            <ConnectWallet className="btn-primary" />
          </div>
        </div>
      </div>
    </header>
  );
}
