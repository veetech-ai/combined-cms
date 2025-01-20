import React, { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import { Store } from '../../types/store';
import { DEFAULT_MODULES } from '../../types/module';
import { useCustomer } from '../../contexts/CustomerContext';
import { storeService } from '../../services/storeService';
import { organizationService } from '../../services/organizationService';
import { toast } from 'react-hot-toast';
import { formatPhoneNumber, validateZipCode, validatePhoneNumber } from '../../utils/validation';

interface AddStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (store: Omit<Store, 'id'>) => void;
  organizationId?: string;
  organizationName?: string;
}

const defaultOperatingHours = {
  monday: { open: '09:00', close: '17:00' },
  tuesday: { open: '09:00', close: '17:00' },
  wednesday: { open: '09:00', close: '17:00' },
  thursday: { open: '09:00', close: '17:00' },
  friday: { open: '09:00', close: '17:00' },
  saturday: null,
  sunday: null
};

interface FormErrors {
  name?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

export default function AddStoreModal({
  isOpen,
  onClose,
  onAdd,
  organizationId,
  organizationName
}: AddStoreModalProps) {
  const [formData, setFormData] = useState<Omit<Store, 'id'>>({
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    modules: DEFAULT_MODULES.map((m) => ({
      ...m,
      stats: {
        activeUsers: 0,
        activeDevices: 0,
        lastUpdated: new Date().toISOString()
      }
    })),
    operatingHours: defaultOperatingHours,
    organizationId: organizationId || ''
  });

  const [organizationList, setOrganizationList] = useState<Array<{ id: string; name: string }> | null>(null);
  const [error, setError] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!organizationId) {
      const fetchOrganizations = async () => {
        try {
          const data = await organizationService.fetchAllOrganizations();
          setOrganizationList(data);
        } catch (err) {
          console.error('Failed to fetch organizations');
          toast.error('Failed to fetch organizations');
        }
      };

      fetchOrganizations();
    }
  }, [organizationId]);

  // Handle input changes with validation
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Apply formatting based on field type
    switch (name) {
      case 'phone':
        formattedValue = formatPhoneNumber(value);
        break;
      case 'zipCode':
        formattedValue = value.replace(/\D/g, '').slice(0, 5);
        break;
      default:
        break;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue
    }));

    validateField(name, formattedValue);
  };

  // Validate individual field
  const validateField = (name: string, value: string) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'name':
        if (!value.trim()) {
          newErrors.name = 'Store name is required';
        } else if (value.length < 2) {
          newErrors.name = 'Store name must be at least 2 characters';
        } else {
          delete newErrors.name;
        }
        break;

      case 'phone':
        if (!value.trim()) {
          newErrors.phone = 'Phone number is required';
        } else if (!validatePhoneNumber(value)) {
          newErrors.phone = 'Please enter a valid phone number';
        } else {
          delete newErrors.phone;
        }
        break;

      case 'address':
        if (!value.trim()) {
          newErrors.address = 'Address is required';
        } else if (value.length < 5) {
          newErrors.address = 'Please enter a complete address';
        } else {
          delete newErrors.address;
        }
        break;

      case 'city':
        if (!value.trim()) {
          newErrors.city = 'City is required';
        } else {
          delete newErrors.city;
        }
        break;

      case 'state':
        if (!value.trim()) {
          newErrors.state = 'State is required';
        } else {
          delete newErrors.state;
        }
        break;

      case 'zipCode':
        if (!validateZipCode(value)) {
          newErrors.zipCode = 'Please enter a valid ZIP code';
        } else {
          delete newErrors.zipCode;
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle field blur for validation
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, formData[name as keyof typeof formData] as string);
  };

  // Validate all fields before submission
  const validateForm = () => {
    const fieldsToValidate = ['name', 'phone', 'address', 'city', 'state', 'zipCode'];
    let isValid = true;

    fieldsToValidate.forEach((field) => {
      const fieldValue = formData[field as keyof typeof formData] as string;
      if (!validateField(field, fieldValue)) {
        isValid = false;
      }
      setTouched((prev) => ({ ...prev, [field]: true }));
    });

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please correct the errors before submitting');
      return;
    }

    if (!organizationId && !formData.organizationId) {
      setError(true);
      return;
    }

    try {
      const storeData = {
        name: formData.name,
        location: formData.address,
        phone: formData.phone,
        address: {
          street: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode
        },
        modules: formData.modules,
        operatingHours: formData.operatingHours,
        organizationId: organizationId || formData.organizationId
      };

      onAdd(storeData);
      toast.success('Store created successfully');
      onClose();

      // Reset form
      setFormData({
        ...formData,
        name: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        phone: '',
      });
    } catch (error) {
      console.error('Error creating store:', error);
      toast.error('Failed to create store. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold">Add New Store</h2>
            {organizationId ? (
              <div className="mt-2">
                <p className="text-sm text-gray-600">
                  Adding store for organization: <span className="font-medium">{organizationName}</span>
                </p>
              </div>
            ) : (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Organization Name <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.organizationId}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      organizationId: e.target.value
                    })
                  }
                  className={`w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 ${
                    error && 'border-red-500'
                  } focus:ring-blue-500`}
                >
                  <option value="" disabled>
                    Select Organization
                  </option>
                  {organizationList?.map((org) => (
                    <option key={org.id} value={org.id}>
                      {org.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Store Information */}
            <div>
              <h3 className="text-lg font-medium mb-4">Store Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Store Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.name && touched.name
                        ? 'border-red-500 focus:ring-red-200'
                        : 'border-gray-200 focus:ring-blue-500'
                    }`}
                  />
                  {errors.name && touched.name && (
                    <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="(XXX) XXX-XXXX"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.phone && touched.phone
                        ? 'border-red-500 focus:ring-red-200'
                        : 'border-gray-200 focus:ring-blue-500'
                    }`}
                  />
                  {errors.phone && touched.phone && (
                    <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                  )}
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.address && touched.address
                        ? 'border-red-500 focus:ring-red-200'
                        : 'border-gray-200 focus:ring-blue-500'
                    }`}
                  />
                  {errors.address && touched.address && (
                    <p className="mt-1 text-sm text-red-500">{errors.address}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.city && touched.city
                        ? 'border-red-500 focus:ring-red-200'
                        : 'border-gray-200 focus:ring-blue-500'
                    }`}
                  />
                  {errors.city && touched.city && (
                    <p className="mt-1 text-sm text-red-500">{errors.city}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.state && touched.state
                        ? 'border-red-500 focus:ring-red-200'
                        : 'border-gray-200 focus:ring-blue-500'
                    }`}
                  />
                  {errors.state && touched.state && (
                    <p className="mt-1 text-sm text-red-500">{errors.state}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    required
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.zipCode && touched.zipCode
                        ? 'border-red-500 focus:ring-red-200'
                        : 'border-gray-200 focus:ring-blue-500'
                    }`}
                  />
                  {errors.zipCode && touched.zipCode && (
                    <p className="mt-1 text-sm text-red-500">{errors.zipCode}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={18} />
              <span>Add Store</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
