import React, { useState, useEffect } from 'react';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { displayService } from '../../services/displayService';
import { storeService } from '../../services/storeService';
import { Display } from '../../types/display';
import DisplaysList from './DisplaysList';
import CreateDisplayModal from './CreateDisplayModal';
import StoreFilter from '../common/StoreFilter';
import type { Store } from '../../types/store';

export default function DisplaysView() {
  const [stores, setStores] = useState(null);
  const [selectedStoreId, setSelectedStoreId] = useState<string>('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoadingStores, setIsLoadingStores] = useState(true);
  const [isLoadingDisplays, setIsLoadingDisplays] = useState(false);
  // const queryClient = useQueryClient();

  useEffect(() => {
    const fetchStores = async () => {
      const storesData = await storeService.fetchAllStores();
      if (storesData) {
        setStores(storesData);
        setIsLoadingStores(false);
      }
    };

    fetchStores();
  }, []);

  // Hardcoded displays data
  // Hardcoded displays data (updated with necessary fields)
  const displays: Display[] = [
    {
      id: '1',
      name: 'Display 1',
      storeId: '1',
      status: 'online',
      hexCode: '#FF5733',
      lastSeen: '2025-01-23T10:30:00Z',
      store: { id: '1', name: 'Store 1' }
    },
    {
      id: '2',
      name: 'Display 2',
      storeId: '1',
      status: 'offline',
      hexCode: '#33FF57',
      lastSeen: '2025-01-23T10:35:00Z',
      store: { id: '1', name: 'Store 1' }
    },
    {
      id: '3',
      name: 'Display 3',
      storeId: '2',
      status: 'online',
      hexCode: '#3357FF',
      lastSeen: '2025-01-23T10:40:00Z',
      store: { id: '2', name: 'Store 2' }
    }
  ];

  // Fetch displays with proper type annotations
  // const { data: displays, isLoading: isLoadingDisplays } = useQuery<Display[]>({
  //   queryKey: ['displays', selectedStoreId],
  //   queryFn: () => displayService.getDisplays({ storeId: selectedStoreId || undefined })
  // });

  // Fetch stores with proper type annotations
  // const { data: stores, isLoading: isLoadingStores } = useQuery<Store[]>({
  //   queryKey: ['stores'],
  //   queryFn: storeService.getStores
  // });

  // Delete mutation with proper type safety
  // const deleteMutation = useMutation({
  //   mutationFn: (id: string) => displayService.deleteDisplay(id),
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ['displays'] });
  //   }
  // });

  // Update mutation with proper type safety
  // const updateMutation = useMutation({
  //   mutationFn: ({ id, data }: { id: string; data: Partial<Display> }) =>
  //     displayService.updateDisplay(id, data),
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ['displays'] });
  //   }
  // });

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this display?')) {
      // await deleteMutation.mutateAsync(id);
    }
  };

  const handleUpdate = async (id: string, data: Partial<Display>) => {
    // await updateMutation.mutateAsync({ id, data });
  };

  if (isLoadingStores) {
    return <div className="p-6">Loading stores...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Displays</h1>
          <p className="text-gray-600">Manage your digital displays</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Add Display
        </button>
      </div>

      <div className="mb-6">
        <StoreFilter
          stores={stores || []}
          selectedStoreId={selectedStoreId}
          onStoreSelect={setSelectedStoreId}
        />
      </div>

      {isLoadingDisplays ? (
        <div className="text-center py-4">Loading displays...</div>
      ) : (
        <DisplaysList
          displays={displays || []}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
        />
      )}

      {isCreateModalOpen && (
        <CreateDisplayModal
          stores={stores || []}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={() => {
            setIsCreateModalOpen(false);
            // queryClient.invalidateQueries({ queryKey: ['displays'] });
          }}
        />
      )}
    </div>
  );
}
