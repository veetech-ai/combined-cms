import React from 'react';
import ModulesGrid from './ModulesGrid';

export default function ModulesView() {
  return (
    <main className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Module Management</h1>
        <p className="text-gray-600 mt-1">
          Enable or disable modules and monitor their usage
        </p>
      </div>
      <ModulesGrid />
    </main>
  );
}