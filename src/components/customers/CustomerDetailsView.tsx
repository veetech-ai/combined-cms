import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Store as StoreIcon,
  Plus,
  Loader,
  UserCircle
} from 'lucide-react';
import { Organization } from '../../types';
import StoreCard from './StoreCard';
import CustomerPosIntegration from '../pos/CustomerPosIntegration';
import ModulesList from './ModulesList';
import StoreDetailsView from '../stores/StoreDetailsView';
import { organizationService } from '../../services/organizationService';
import { toast } from 'react-hot-toast';

const DEFAULT_AVATAR =
  'https://ui-avatars.com/api/?background=0D8ABC&color=fff';

interface CustomerDetailsViewProps {
  customerId: string;
  onBack: () => void;
  onModuleToggle: (
    storeId: string | null,
    moduleId: string,
    enabled: boolean
  ) => void;
  onPosUpdate: (posIntegration: Organization['posIntegration']) => void;
}

export default function CustomerDetailsView({
  customerId,
  onBack,
  onModuleToggle,
  onPosUpdate
}: CustomerDetailsViewProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'pos'>('overview');
  const [selectedStore, setSelectedStore] = useState<string | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrganizationDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await organizationService.getOrganizationById(customerId);
        setOrganization(data);
      } catch (err) {
        setError(
          'Unable to load organization details. Please try again later.'
        );
        toast.error('Failed to load organization details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrganizationDetails();
  }, [customerId]);

  const selectedStoreData = organization?.stores?.find(
    (store) => store.id === selectedStore
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2 text-gray-600">
          <Loader className="animate-spin" size={20} />
          <span>Loading organization details...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={onBack}
          className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Go Back</span>
        </button>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-gray-600 mb-4">Organization not found</p>
        <button
          onClick={onBack}
          className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft size={20} />
          <span>Go Back</span>
        </button>
      </div>
    );
  }

  if (selectedStore && selectedStoreData) {
    return (
      <StoreDetailsView
        store={{ ...selectedStoreData, customerName: organization.name }}
        onBack={() => setSelectedStore(null)}
        onModuleToggle={(moduleId, enabled) =>
          onModuleToggle(selectedStore, moduleId, enabled)
        }
      />
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100">
            {organization.logo ? (
              <img
                src={organization.logo}
                alt={`${organization.name} logo`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = DEFAULT_AVATAR;
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-blue-100">
                <UserCircle className="w-10 h-10 text-blue-600" />
              </div>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {organization.name}
            </h1>
            <p className="text-gray-600">{organization.company}</p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('pos')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'pos'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              POS Integration
            </button>
          </nav>
        </div>
      </div>

      {activeTab === 'overview' ? (
        <>
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-medium text-gray-700 mb-4">
                Contact Information
              </h3>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-gray-500">Email:</span>{' '}
                  {organization.email}
                </p>
                <p>
                  <span className="text-gray-500">Phone:</span>{' '}
                  {organization.phone}
                </p>
                <p>
                  <span className="text-gray-500">Website:</span>{' '}
                  {organization.website || 'N/A'}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-medium text-gray-700 mb-4">
                Billing Address
              </h3>
              <div className="space-y-2 text-sm">
                <p>{organization.billingStreet}</p>
                <p>
                  {organization.billingCity}, {organization.billingState}{' '}
                  {organization.billingZip}
                </p>
                <p>{organization.billingCountry}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-medium text-gray-700 mb-4">Subscription</h3>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-gray-500">Plan:</span>{' '}
                  {organization.subscriptionPlan}
                </p>
                <p>
                  <span className="text-gray-500">Status:</span>{' '}
                  {organization.subscriptionStatus}
                </p>
                {organization.subscriptionRenewal && (
                  <p>
                    <span className="text-gray-500">Renewal:</span>{' '}
                    {new Date(
                      organization.subscriptionRenewal
                    ).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Stores</h2>
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Plus size={18} />
                <span>Add Store</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {organization.stores?.map((store) => (
                <StoreCard
                  key={store.id}
                  store={store}
                  onClick={() => setSelectedStore(store.id)}
                  onModuleToggle={(moduleId, enabled) =>
                    onModuleToggle(store.id, moduleId, enabled)
                  }
                />
              ))}
            </div>
          </div>
        </>
      ) : (
        <CustomerPosIntegration
          customer={organization}
          onUpdate={(posIntegration) => onPosUpdate(posIntegration)}
        />
      )}
    </div>
  );
}
