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

// Extract role type from Customer interface
type CustomerRole = Customer['primaryContact']['role'];

// Create role options from the Customer type
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

const defaultStore: Omit<Store, 'id'> = {
  name: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  phone: '',
  modules: defaultModules,
  operatingHours: {
    monday: { open: '09:00', close: '17:00' },
    tuesday: { open: '09:00', close: '17:00' },
    wednesday: { open: '09:00', close: '17:00' },
    thursday: { open: '09:00', close: '17:00' },
    friday: { open: '09:00', close: '17:00' },
    saturday: null,
    sunday: null
  }
};

const DEFAULT_AVATAR =
  'https://ui-avatars.com/api/?background=0D8ABC&color=fff';

export default function AddCustomerModal({
  customers,
  isOpen,
  onClose,
  onAdd
}: AddCustomerModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
  const [attemptedNextStep, setAttemptedNextStep] = useState(false);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsUploading(true);
        setUploadError(null);

        // Show preview immediately
        const reader = new FileReader();
        reader.onloadend = () => {
          setAvatarPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Upload the file
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
    logo: '',
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
      role: 'admin' as CustomerRole // Default role
    },
    subscription: {
      plan: 'basic' as const, // Updated to match Customer type
      status: 'inactive' as const, // Updated to match Customer type
      startDate: new Date().toISOString(),
      renewalDate: new Date(
        Date.now() + 365 * 24 * 60 * 60 * 1000
      ).toISOString()
    },
    stores: [],
    modules: DEFAULT_MODULES
  });

  const validateStep = () => {
    if (currentStep === 1) {
      const emailExists = customers.some(
        (element) => element.email === formData.email
      );
      if (emailExists) {
        toast.error('Email already exists');
        return false;
      }
    }

    setCurrentStep((prev) => prev + 1);
  };

  const handleNextStep = async () => {
    validateStep();
  };

  // Validation functions
  const validateStep1 = () => {
    const requiredFields = [
      'name',
      'email',
      'company',
      'phone',
      'billingAddress.street',
      'billingAddress.city',
      'billingAddress.state',
      'billingAddress.zipCode',
      'billingAddress.country'
    ];

    const isEmpty = (value: string) => !value.trim();

    return requiredFields.every((field) => {
      const value = field.includes('.')
        ? field.split('.').reduce((obj, key) => obj[key], formData as any)
        : formData[field as keyof typeof formData];
      return !isEmpty(value as string);
    });
  };

  const validateStep2 = () => {
    const requiredFields = [
      'primaryContact.name',
      'primaryContact.email',
      'primaryContact.phone'
    ];

    const isEmpty = (value: string) => !value.trim();

    return requiredFields.every((field) => {
      const value = field
        .split('.')
        .reduce((obj, key) => obj[key], formData as any);
      return !isEmpty(value as string);
    });
  };

  // Handle field touch
  const handleFieldTouch = (fieldName: string) => {
    setTouchedFields((prev) => new Set(prev).add(fieldName));
  };

  // Check if field should show error
  const shouldShowError = (fieldName: string) => {
    return (
      (touchedFields.has(fieldName) || attemptedNextStep) &&
      !formData[fieldName as keyof typeof formData]
    );
  };

  const handleNext = () => {
    setAttemptedNextStep(true);
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
      setAttemptedNextStep(false);
    } else {
      // Mark all fields as touched to show errors
      const allFields = [
        'name',
        'email',
        'company',
        'phone',
        'billingAddress.street',
        'billingAddress.city',
        'billingAddress.state',
        'billingAddress.zipCode',
        'billingAddress.country'
      ];
      setTouchedFields(new Set(allFields));
    }
  };

  // Input class generator
  const getInputClassName = (fieldName: string, value: string) => {
    const baseClasses =
      'w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2';
    const shouldShowFieldError =
      (touchedFields.has(fieldName) || attemptedNextStep) && !value;

    return `${baseClasses} ${
      shouldShowFieldError
        ? 'border-red-500 focus:ring-red-500'
        : 'border-gray-200 focus:ring-blue-500'
    }`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
      return;
    }

    try {
      const organizationData = {
        name: formData.name,
        email: formData.email,
        company: formData.company,
        phone: formData.phone,
        logo: formData.logo || DEFAULT_AVATAR,

        billing_address: {
          street: formData.billingAddress.street,
          city: formData.billingAddress.city,
          state: formData.billingAddress.state,
          zipCode: formData.billingAddress.zipCode,
          country: formData.billingAddress.country
        },

        primary_contact: {
          name: formData.primaryContact.name,
          email: formData.primaryContact.email,
          phone: formData.primaryContact.phone,
          role: formData.primaryContact.role // This will now be correctly typed
        },

        subscription: {
          plan: formData.subscription.plan,
          status: formData.subscription.status,
          startDate: formData.subscription.startDate,
          renewalDate: formData.subscription.renewalDate
        },

        pos_integration: {
          type: 'NONE',
          provider: null,
          configuration: {
            webhookUrl: '',
            callbackUrl: '',
            settings: {}
          }
        }
      };

      await onAdd(organizationData);

      setFormData({
        name: '',
        email: '',
        company: '',
        phone: '',
        logo: '',
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
          role: 'admin'
        },
        subscription: {
          plan: 'basic',
          status: 'inactive',
          startDate: new Date().toISOString(),
          renewalDate: new Date(
            Date.now() + 365 * 24 * 60 * 60 * 1000
          ).toISOString()
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
            <p className="text-sm text-gray-500 mt-1">
              Step {currentStep} of 2
            </p>
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
                  <h4 className="text-sm font-medium text-gray-700">
                    Company Logo
                  </h4>
                  <p className="text-sm text-gray-500 mt-1">
                    Upload a company logo or profile picture
                  </p>
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
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    onBlur={() => handleFieldTouch('name')}
                    className={getInputClassName('name', formData.name)}
                  />
                  {shouldShowError('name') && (
                    <p className="text-red-500 text-sm mt-1">
                      This field is required
                    </p>
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
                    onChange={(e) =>
                      setFormData({ ...formData, company: e.target.value })
                    }
                    onBlur={() => handleFieldTouch('company')}
                    className={getInputClassName('company', formData.company)}
                  />
                  {shouldShowError('company') && (
                    <p className="text-red-500 text-sm mt-1">
                      This field is required
                    </p>
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
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    onBlur={() => handleFieldTouch('email')}
                    className={getInputClassName('email', formData.email)}
                  />
                  {shouldShowError('email') && (
                    <p className="text-red-500 text-sm mt-1">
                      This field is required
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="(XXX) XXX-XXXX"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    onBlur={() => handleFieldTouch('phone')}
                    className={getInputClassName('phone', formData.phone)}
                  />
                  {shouldShowError('phone') && (
                    <p className="text-red-500 text-sm mt-1">
                      This field is required
                    </p>
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
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          billingAddress: {
                            ...formData.billingAddress,
                            street: e.target.value
                          }
                        })
                      }
                      onBlur={() => handleFieldTouch('billingAddress.street')}
                      className={getInputClassName(
                        'billingAddress.street',
                        formData.billingAddress.street
                      )}
                    />
                    {shouldShowError('billingAddress.street') && (
                      <p className="text-red-500 text-sm mt-1">
                        This field is required
                      </p>
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
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          billingAddress: {
                            ...formData.billingAddress,
                            city: e.target.value
                          }
                        })
                      }
                      onBlur={() => handleFieldTouch('billingAddress.city')}
                      className={getInputClassName(
                        'billingAddress.city',
                        formData.billingAddress.city
                      )}
                    />
                    {shouldShowError('billingAddress.city') && (
                      <p className="text-red-500 text-sm mt-1">
                        This field is required
                      </p>
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
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          billingAddress: {
                            ...formData.billingAddress,
                            state: e.target.value
                          }
                        })
                      }
                      onBlur={() => handleFieldTouch('billingAddress.state')}
                      className={getInputClassName(
                        'billingAddress.state',
                        formData.billingAddress.state
                      )}
                    />
                    {shouldShowError('billingAddress.state') && (
                      <p className="text-red-500 text-sm mt-1">
                        This field is required
                      </p>
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
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          billingAddress: {
                            ...formData.billingAddress,
                            zipCode: e.target.value
                          }
                        })
                      }
                      onBlur={() => handleFieldTouch('billingAddress.zipCode')}
                      className={getInputClassName(
                        'billingAddress.zipCode',
                        formData.billingAddress.zipCode
                      )}
                    />
                    {shouldShowError('billingAddress.zipCode') && (
                      <p className="text-red-500 text-sm mt-1">
                        This field is required
                      </p>
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
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          billingAddress: {
                            ...formData.billingAddress,
                            country: e.target.value
                          }
                        })
                      }
                      onBlur={() => handleFieldTouch('billingAddress.country')}
                      className={getInputClassName(
                        'billingAddress.country',
                        formData.billingAddress.country
                      )}
                    />
                    {shouldShowError('billingAddress.country') && (
                      <p className="text-red-500 text-sm mt-1">
                        This field is required
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium mb-4">
                Primary Contact & Subscription
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.primaryContact.name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        primaryContact: {
                          ...formData.primaryContact,
                          name: e.target.value
                        }
                      })
                    }
                    onBlur={() => handleFieldTouch('primaryContact.name')}
                    className={getInputClassName(
                      'primaryContact.name',
                      formData.primaryContact.name
                    )}
                  />
                  {shouldShowError('primaryContact.name') && (
                    <p className="text-red-500 text-sm mt-1">
                      This field is required
                    </p>
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
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        primaryContact: {
                          ...formData.primaryContact,
                          email: e.target.value
                        }
                      })
                    }
                    onBlur={() => handleFieldTouch('primaryContact.email')}
                    className={getInputClassName(
                      'primaryContact.email',
                      formData.primaryContact.email
                    )}
                  />
                  {shouldShowError('primaryContact.email') && (
                    <p className="text-red-500 text-sm mt-1">
                      This field is required
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="(XXX) XXX-XXXX"
                    value={formData.primaryContact.phone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        primaryContact: {
                          ...formData.primaryContact,
                          phone: e.target.value
                        }
                      })
                    }
                    onBlur={() => handleFieldTouch('primaryContact.phone')}
                    className={getInputClassName(
                      'primaryContact.phone',
                      formData.primaryContact.phone
                    )}
                  />
                  {shouldShowError('primaryContact.phone') && (
                    <p className="text-red-500 text-sm mt-1">
                      This field is required
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.primaryContact.role}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        primaryContact: {
                          ...formData.primaryContact,
                          role: e.target.value as CustomerRole
                        }
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {roleOptions.map((role) => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
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
                            plan: e.target.value as
                              | 'BASIC'
                              | 'PREMIUM'
                              | 'ENTERPRISE'
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
