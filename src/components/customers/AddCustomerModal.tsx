import React, { useState } from 'react';
import { X, Plus, Trash2, UserCircle, Camera } from 'lucide-react';
import { Customer, Store } from '../../types/customer';
import { DEFAULT_MODULES } from '../../types/module';
import { DEFAULT_POS_INTEGRATION } from '../../types/pos';
import { toast, Toaster } from 'react-hot-toast';
import { uploadImage } from '../../services/imageService';

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (
    customer: Omit<Customer, 'id' | 'avatar' | 'createdAt' | 'updatedAt'>
  ) => void;
}

type CustomerRole = Customer['primaryContact']['role'];

const roleOptions: { value: CustomerRole; label: string }[] = [
  { value: 'super_admin', label: 'Super Admin' },
  { value: 'admin', label: 'Admin' },
  { value: 'manager', label: 'Manager' }
] as const;

const defaultModules = [
  { id: 'venue', name: 'Venue Management', isEnabled: false },
  { id: 'kiosk', name: 'Kiosk System', isEnabled: false },
  { id: 'kitchen', name: 'Kitchen Display', isEnabled: false },
  { id: 'rewards', name: 'Rewards Program', isEnabled: false }
];

const DEFAULT_AVATAR =
  'https://ui-avatars.com/api/?background=0D8ABC&color=fff';

interface FormErrors {
  name?: string;
  email?: string;
  company?: string;
  phone?: string;
  billingAddress?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  primaryContact?: {
    name?: string;
    email?: string;
    phone?: string;
    role?: string;
  };
}

export default function AddCustomerModal({
  isOpen,
  onClose,
  onAdd
}: AddCustomerModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsUploading(true);
        setUploadError(null);

        const reader = new FileReader();
        reader.onloadend = () => {
          setAvatarPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        const imageUrl = await uploadImage(file);
        setFormData((prev) => ({ ...prev, logo: imageUrl }));
      } catch (error) {
        console.error('Error uploading image:', error);
        setUploadError('Failed to upload image. Using default avatar.');
        setFormData((prev) => ({ ...prev, logo: DEFAULT_AVATAR }));
      } finally {
        setIsUploading(false);
      }
    }
  };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    billingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    primaryContact: {
      name: '',
      email: '',
      phone: '',
      role: 'super_admin' // Default role
    },
    subscription: {
      plan: 'BASIC' as const, // Default plan
      status: 'PENDING' as const,
      startDate: new Date().toISOString(),
      renewalDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
    },
    stores: [],
    modules: DEFAULT_MODULES
  });

  const validateStep = () => {
    const newErrors: FormErrors = {};

    if (currentStep === 1) {
      if (!formData.name.trim()) newErrors.name = 'Customer name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      if (!formData.company.trim()) newErrors.company = 'Company name is required';
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
      if (!formData.billingAddress.street.trim())
        newErrors.billingAddress = { ...newErrors.billingAddress, street: 'Street address is required' };
      if (!formData.billingAddress.city.trim())
        newErrors.billingAddress = { ...newErrors.billingAddress, city: 'City is required' };
      if (!formData.billingAddress.state.trim())
        newErrors.billingAddress = { ...newErrors.billingAddress, state: 'State is required' };
      if (!formData.billingAddress.zipCode.trim())
        newErrors.billingAddress = { ...newErrors.billingAddress, zipCode: 'ZIP code is required' };
      if (!formData.billingAddress.country.trim())
        newErrors.billingAddress = { ...newErrors.billingAddress, country: 'Country is required' };
    } else if (currentStep === 2) {
      if (!formData.primaryContact.name.trim())
        newErrors.primaryContact = { ...newErrors.primaryContact, name: 'Contact name is required' };
      if (!formData.primaryContact.email.trim())
        newErrors.primaryContact = { ...newErrors.primaryContact, email: 'Contact email is required' };
      if (!formData.primaryContact.phone.trim())
        newErrors.primaryContact = { ...newErrors.primaryContact, phone: 'Contact phone is required' };
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = async () => {
    if (!validateStep()) {
      toast.error('Please fill all required fields before proceeding.');
      return;
    }
    setCurrentStep((prev) => prev + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) {
      toast.error('Please fill all required fields before submitting.');
      return;
    }

    try {
      const organizationData = {
        name: formData.name,
        email: formData.email,
        company: formData.company,
        phone: formData.phone,
        logo: formData.logo || DEFAULT_AVATAR,
        website: formData.website,
        billingAddress: formData.billingAddress,
        primaryContact: formData.primaryContact,
        subscription: formData.subscription,
        posIntegration: DEFAULT_POS_INTEGRATION,
        stores: formData.stores,
        modules: formData.modules
      };

      await onAdd(organizationData);

      setFormData({
        name: '',
        email: '',
        company: '',
        phone: '',
        billingAddress: {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: ''
        },
        primaryContact: {
          name: '',
          email: '',
          phone: '',
          role: 'super_admin' // Reset to default role
        },
        subscription: {
          plan: 'BASIC', // Reset to default plan
          status: 'PENDING',
          startDate: new Date().toISOString(),
          renewalDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
        },
        stores: [],
        modules: DEFAULT_MODULES
      });

      setCurrentStep(1);
      onClose();
    } catch (error) {
      console.error('Error creating organization:', error);
      toast.error('Failed to create organization. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold">Add New Customer</h2>
            <p className="text-sm text-gray-500 mt-1">Step {currentStep} of 2</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium mb-4">Customer Information</h3>

              <div className="flex items-center space-x-6 mb-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100">
                    {isUploading ? (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      </div>
                    ) : avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="Avatar preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <UserCircle size={64} />
                      </div>
                    )}
                  </div>
                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors"
                  >
                    <Camera size={16} />
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                    disabled={isUploading}
                  />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Company Logo</h4>
                  <p className="text-sm text-gray-500 mt-1">Upload a company logo or profile picture</p>
                  {uploadError && (
                    <p className="text-sm text-red-500 mt-1">{uploadError}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Customer Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      setErrors((prev) => ({ ...prev, name: undefined }));
                    }}
                    onBlur={() => setTouched({ ...touched, name: true })}
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
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => {
                      setFormData({ ...formData, company: e.target.value });
                      setErrors((prev) => ({ ...prev, company: undefined }));
                    }}
                    onBlur={() => setTouched({ ...touched, company: true })}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.company && touched.company
                        ? 'border-red-500 focus:ring-red-200'
                        : 'border-gray-200 focus:ring-blue-500'
                    }`}
                  />
                  {errors.company && touched.company && (
                    <p className="mt-1 text-sm text-red-500">{errors.company}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      setErrors((prev) => ({ ...prev, email: undefined }));
                    }}
                    onBlur={() => setTouched({ ...touched, email: true })}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.email && touched.email
                        ? 'border-red-500 focus:ring-red-200'
                        : 'border-gray-200 focus:ring-blue-500'
                    }`}
                  />
                  {errors.email && touched.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => {
                      setFormData({ ...formData, phone: e.target.value });
                      setErrors((prev) => ({ ...prev, phone: undefined }));
                    }}
                    onBlur={() => setTouched({ ...touched, phone: true })}
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
              </div>

              <div className="space-y-4 mt-6">
                <h4 className="font-medium">Billing Address</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Street Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.billingAddress.street}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          billingAddress: {
                            ...formData.billingAddress,
                            street: e.target.value
                          }
                        });
                        setErrors((prev) => ({
                          ...prev,
                          billingAddress: { ...prev.billingAddress, street: undefined }
                        }));
                      }}
                      onBlur={() => setTouched({ ...touched, billingAddress: { ...touched.billingAddress, street: true } })}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                        errors.billingAddress?.street && touched.billingAddress?.street
                          ? 'border-red-500 focus:ring-red-200'
                          : 'border-gray-200 focus:ring-blue-500'
                      }`}
                    />
                    {errors.billingAddress?.street && touched.billingAddress?.street && (
                      <p className="mt-1 text-sm text-red-500">{errors.billingAddress.street}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.billingAddress.city}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          billingAddress: {
                            ...formData.billingAddress,
                            city: e.target.value
                          }
                        });
                        setErrors((prev) => ({
                          ...prev,
                          billingAddress: { ...prev.billingAddress, city: undefined }
                        }));
                      }}
                      onBlur={() => setTouched({ ...touched, billingAddress: { ...touched.billingAddress, city: true } })}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                        errors.billingAddress?.city && touched.billingAddress?.city
                          ? 'border-red-500 focus:ring-red-200'
                          : 'border-gray-200 focus:ring-blue-500'
                      }`}
                    />
                    {errors.billingAddress?.city && touched.billingAddress?.city && (
                      <p className="mt-1 text-sm text-red-500">{errors.billingAddress.city}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.billingAddress.state}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          billingAddress: {
                            ...formData.billingAddress,
                            state: e.target.value
                          }
                        });
                        setErrors((prev) => ({
                          ...prev,
                          billingAddress: { ...prev.billingAddress, state: undefined }
                        }));
                      }}
                      onBlur={() => setTouched({ ...touched, billingAddress: { ...touched.billingAddress, state: true } })}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                        errors.billingAddress?.state && touched.billingAddress?.state
                          ? 'border-red-500 focus:ring-red-200'
                          : 'border-gray-200 focus:ring-blue-500'
                      }`}
                    />
                    {errors.billingAddress?.state && touched.billingAddress?.state && (
                      <p className="mt-1 text-sm text-red-500">{errors.billingAddress.state}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ZIP Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.billingAddress.zipCode}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          billingAddress: {
                            ...formData.billingAddress,
                            zipCode: e.target.value
                          }
                        });
                        setErrors((prev) => ({
                          ...prev,
                          billingAddress: { ...prev.billingAddress, zipCode: undefined }
                        }));
                      }}
                      onBlur={() => setTouched({ ...touched, billingAddress: { ...touched.billingAddress, zipCode: true } })}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                        errors.billingAddress?.zipCode && touched.billingAddress?.zipCode
                          ? 'border-red-500 focus:ring-red-200'
                          : 'border-gray-200 focus:ring-blue-500'
                      }`}
                    />
                    {errors.billingAddress?.zipCode && touched.billingAddress?.zipCode && (
                      <p className="mt-1 text-sm text-red-500">{errors.billingAddress.zipCode}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.billingAddress.country}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          billingAddress: {
                            ...formData.billingAddress,
                            country: e.target.value
                          }
                        });
                        setErrors((prev) => ({
                          ...prev,
                          billingAddress: { ...prev.billingAddress, country: undefined }
                        }));
                      }}
                      onBlur={() => setTouched({ ...touched, billingAddress: { ...touched.billingAddress, country: true } })}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                        errors.billingAddress?.country && touched.billingAddress?.country
                          ? 'border-red-500 focus:ring-red-200'
                          : 'border-gray-200 focus:ring-blue-500'
                      }`}
                    />
                    {errors.billingAddress?.country && touched.billingAddress?.country && (
                      <p className="mt-1 text-sm text-red-500">{errors.billingAddress.country}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium mb-4">Primary Contact & Subscription</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.primaryContact.name}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        primaryContact: {
                          ...formData.primaryContact,
                          name: e.target.value
                        }
                      });
                      setErrors((prev) => ({
                        ...prev,
                        primaryContact: { ...prev.primaryContact, name: undefined }
                      }));
                    }}
                    onBlur={() => setTouched({ ...touched, primaryContact: { ...touched.primaryContact, name: true } })}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.primaryContact?.name && touched.primaryContact?.name
                        ? 'border-red-500 focus:ring-red-200'
                        : 'border-gray-200 focus:ring-blue-500'
                    }`}
                  />
                  {errors.primaryContact?.name && touched.primaryContact?.name && (
                    <p className="mt-1 text-sm text-red-500">{errors.primaryContact.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.primaryContact.email}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        primaryContact: {
                          ...formData.primaryContact,
                          email: e.target.value
                        }
                      });
                      setErrors((prev) => ({
                        ...prev,
                        primaryContact: { ...prev.primaryContact, email: undefined }
                      }));
                    }}
                    onBlur={() => setTouched({ ...touched, primaryContact: { ...touched.primaryContact, email: true } })}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.primaryContact?.email && touched.primaryContact?.email
                        ? 'border-red-500 focus:ring-red-200'
                        : 'border-gray-200 focus:ring-blue-500'
                    }`}
                  />
                  {errors.primaryContact?.email && touched.primaryContact?.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.primaryContact.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.primaryContact.phone}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        primaryContact: {
                          ...formData.primaryContact,
                          phone: e.target.value
                        }
                      });
                      setErrors((prev) => ({
                        ...prev,
                        primaryContact: { ...prev.primaryContact, phone: undefined }
                      }));
                    }}
                    onBlur={() => setTouched({ ...touched, primaryContact: { ...touched.primaryContact, phone: true } })}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.primaryContact?.phone && touched.primaryContact?.phone
                        ? 'border-red-500 focus:ring-red-200'
                        : 'border-gray-200 focus:ring-blue-500'
                    }`}
                  />
                  {errors.primaryContact?.phone && touched.primaryContact?.phone && (
                    <p className="mt-1 text-sm text-red-500">{errors.primaryContact.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.primaryContact.role}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        primaryContact: {
                          ...formData.primaryContact,
                          role: e.target.value as CustomerRole
                        }
                      });
                      setErrors((prev) => ({
                        ...prev,
                        primaryContact: { ...prev.primaryContact, role: undefined }
                      }));
                    }}
                    onBlur={() => setTouched({ ...touched, primaryContact: { ...touched.primaryContact, role: true } })}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.primaryContact?.role && touched.primaryContact?.role
                        ? 'border-red-500 focus:ring-red-200'
                        : 'border-gray-200 focus:ring-blue-500'
                    }`}
                  >
                    {roleOptions.map((role) => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                  {errors.primaryContact?.role && touched.primaryContact?.role && (
                    <p className="mt-1 text-sm text-red-500">{errors.primaryContact.role}</p>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-medium mb-4">Subscription Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Plan <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.subscription.plan}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          subscription: {
                            ...formData.subscription,
                            plan: e.target.value as 'BASIC' | 'PREMIUM' | 'ENTERPRISE'
                          }
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="BASIC">Basic</option>
                      <option value="PREMIUM">Premium</option>
                      <option value="ENTERPRISE">Enterprise</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 mt-6">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Previous
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            {currentStep === 1 && (
              <button
                type="button"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                onClick={handleNextStep}
              >
                Next
              </button>
            )}
            {currentStep === 2 && (
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Customer
              </button>
            )}
          </div>
        </form>
      </div>

      <Toaster />
    </div>
  );
}