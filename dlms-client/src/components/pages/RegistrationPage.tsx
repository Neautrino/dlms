'use client'

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { atom, useAtom } from 'jotai';
import { UserRole, UserAccount, UserMetadata, LaborMetadata, ManagerMetadata } from '@/types/user';
import { useWallet } from '@solana/wallet-adapter-react';
import { Upload, X, Plus, Check, ChevronRight, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';

// Single atom for all form state
const formStateAtom = atom({
  // Form step
  step: 1,
  
  // Basic user info
  role: null as UserRole | null,
  name: '',
  bio: '',
  gender: '',
  dateOfBirth: '',
  languages: [] as string[],
  city: '',
  state: '',
  postalCode: '',
  country: '',
  verificationDocuments: '',
  relevantDocuments: '',
  
  // Labor specific fields
  experience: [] as string[],
  skills: [] as string[],
  certifications: [] as string[],
  workHistory: [] as { title: string; description: string; duration: string; }[],
  
  // Manager specific fields
  companyDetails: {
    company: '',
    industry: '',
    founded: undefined as number | undefined,
    location: '',
    industryFocus: [] as string[],
  },
  managementExperience: undefined as number | undefined,
});

// Registration component
export default function Registration() {
  const router = useRouter();
  const { publicKey } = useWallet();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [currentSkill, setCurrentSkill] = useState('');
  const [currentLanguage, setCurrentLanguage] = useState('');
  const [currentExperience, setCurrentExperience] = useState('');
  const [currentCertification, setCurrentCertification] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [currentWorkHistory, setCurrentWorkHistory] = useState({
    title: '',
    description: '',
    duration: ''
  });

  // Theme integration
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Form state
  const [formState, setFormState] = useAtom(formStateAtom);

  // Handle initial mount and theme
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const isDarkMode = theme === 'dark';

  // Toggle dark/light mode
  const toggleDarkMode = () => {
    setTheme(isDarkMode ? 'light' : 'dark');
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Add a skill to the skills array
  const addSkill = () => {
    if (currentSkill.trim() && !formState.skills.includes(currentSkill.trim())) {
      setFormState({
        ...formState,
        skills: [...formState.skills, currentSkill.trim()]
      });
      setCurrentSkill('');
    }
  };

  // Remove a skill from the skills array
  const removeSkill = (skillToRemove: string) => {
    setFormState({
      ...formState,
      skills: formState.skills.filter(skill => skill !== skillToRemove)
    });
  };

  // Add a language to the languages array
  const addLanguage = () => {
    if (currentLanguage.trim() && !formState.languages.includes(currentLanguage.trim())) {
      setFormState({
        ...formState,
        languages: [...formState.languages, currentLanguage.trim()]
      });
      setCurrentLanguage('');
    }
  };

  // Remove a language from the languages array
  const removeLanguage = (languageToRemove: string) => {
    setFormState({
      ...formState,
      languages: formState.languages.filter(language => language !== languageToRemove)
    });
  };

  // Add experience to the experience array
  const addExperience = () => {
    if (currentExperience.trim() && !formState.experience.includes(currentExperience.trim())) {
      setFormState({
        ...formState,
        experience: [...formState.experience, currentExperience.trim()]
      });
      setCurrentExperience('');
    }
  };

  // Remove experience from the experience array
  const removeExperience = (experienceToRemove: string) => {
    setFormState({
      ...formState,
      experience: formState.experience.filter(experience => experience !== experienceToRemove)
    });
  };

  // Add certification to the certifications array
  const addCertification = () => {
    if (currentCertification.trim() && !formState.certifications.includes(currentCertification.trim())) {
      setFormState({
        ...formState,
        certifications: [...formState.certifications, currentCertification.trim()]
      });
      setCurrentCertification('');
    }
  };

  // Remove certification from the certifications array
  const removeCertification = (certificationToRemove: string) => {
    setFormState({
      ...formState,
      certifications: formState.certifications.filter(certification => certification !== certificationToRemove)
    });
  };

  // Add work history entry
  const addWorkHistory = () => {
    if (currentWorkHistory.title.trim() && currentWorkHistory.description.trim() && currentWorkHistory.duration.trim()) {
      setFormState({
        ...formState,
        workHistory: [...formState.workHistory, { ...currentWorkHistory }]
      });
      setCurrentWorkHistory({ title: '', description: '', duration: '' });
    }
  };

  // Remove work history entry
  const removeWorkHistory = (indexToRemove: number) => {
    setFormState({
      ...formState,
      workHistory: formState.workHistory.filter((_, index) => index !== indexToRemove)
    });
  };

  // Handle role selection
  const handleRoleSelection = (role: UserRole) => {
    setFormState({
      ...formState,
      role,
      step: 2
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      if (!publicKey) {
        throw new Error('Wallet not connected');
      }

      if (!formState.role) {
        throw new Error('Please select a role');
      }

      // Construct metadata object based on role
      const metadata: UserMetadata = {
        name: formState.name,
        bio: formState.bio,
        profileImage: profileImage || undefined,
        gender: formState.gender || undefined,
        dateOfBirth: formState.dateOfBirth ? new Date(formState.dateOfBirth) : undefined,
        languages: formState.languages.length > 0 ? formState.languages : undefined,
        city: formState.city || undefined,
        state: formState.state || undefined,
        postalCode: formState.postalCode || undefined,
        country: formState.country || undefined,
        verificationDocuments: formState.verificationDocuments || undefined,
        relevantDocuments: formState.relevantDocuments || undefined,
      };

      // Add role-specific fields
      if (formState.role === UserRole.Labour) {
        (metadata as LaborMetadata).experience = formState.experience.length > 0 ? formState.experience : undefined;
        (metadata as LaborMetadata).skillsets = formState.skills.length > 0 ? formState.skills : undefined;
        (metadata as LaborMetadata).certifications = formState.certifications.length > 0 ? formState.certifications : undefined;
        (metadata as LaborMetadata).workHistory = formState.workHistory.length > 0 ? formState.workHistory : undefined;
      } else {
        (metadata as ManagerMetadata).companyDetails = {
          ...formState.companyDetails,
          industryFocus: formState.companyDetails.industryFocus && formState.companyDetails.industryFocus.length > 0
            ? formState.companyDetails.industryFocus
            : undefined
        };
        (metadata as ManagerMetadata).managementExperience = formState.managementExperience;
      }

      // Initial user account data
      const userAccount: Partial<UserAccount> = {
        authority: publicKey.toString(),
        name: formState.name,
        metadata_uri: '', // Will be generated and populated by backend
        active: true,
        verified: false,
        role: formState.role,
        spam: false,
      };

      // Send data to your blockchain backend
      const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          account: userAccount,
          metadata: metadata,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      // Registration success - redirect to dashboard
      router.push(formState.role === UserRole.Labour ? '/labor-dashboard' : '/manager-dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get section titles based on step
  const getSectionTitle = (step: number) => {
    switch (step) {
      case 1: return "Choose Role";
      case 2: return "Basic Details";
      case 3: return formState.role === UserRole.Labour ? "Work Details" : "Company Details";
      default: return "";
    }
  };

  // Form steps rendering
  const renderFormStep = () => {
    switch (formState.step) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6 flex flex-col items-center"
          >
            <h2 className="text-2xl font-light text-center">Choose Role</h2>

            <div className="grid grid-cols-2 gap-8 w-full max-w-md mt-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => handleRoleSelection(UserRole.Labour)}
                className={`p-8 rounded-lg border-2 flex flex-col items-center justify-center transition-colors ${isDarkMode
                    ? 'bg-gray-900 border-gray-700 hover:border-indigo-600'
                    : 'bg-white border-gray-200 hover:border-indigo-400'
                  }`}
              >
                <div className="text-center">
                  <div className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'
                    }`}>
                    Labour
                  </div>
                  <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Looking for work
                  </p>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => handleRoleSelection(UserRole.Manager)}
                className={`p-8 rounded-lg border-2 flex flex-col items-center justify-center transition-colors ${isDarkMode
                    ? 'bg-gray-900 border-gray-700 hover:border-indigo-600'
                    : 'bg-white border-gray-200 hover:border-indigo-400'
                  }`}
              >
                <div className="text-center">
                  <div className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'
                    }`}>
                    Manager
                  </div>
                  <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Hiring talent
                  </p>
                </div>
              </motion.button>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-light mb-6">Basic Details</h2>

            <div className="space-y-4">
              <div>
                <label htmlFor="userName" className={`block text-sm mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Full Name
                </label>
                <input
                  type="text"
                  id="userName"
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border ${isDarkMode
                      ? 'bg-gray-900 border-gray-700 text-white focus:border-indigo-500'
                      : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-400'
                    } focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label htmlFor="userBio" className={`block text-sm mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Bio
                </label>
                <textarea
                  id="userBio"
                  value={formState.bio}
                  onChange={(e) => setFormState({ ...formState, bio: e.target.value })}
                  rows={3}
                  className={`w-full px-4 py-2 rounded-lg border ${isDarkMode
                      ? 'bg-gray-900 border-gray-700 text-white focus:border-indigo-500'
                      : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-400'
                    } focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                  placeholder="Tell us about yourself"
                />
              </div>

              <div>
                <label className={`block text-sm mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Profile Picture
                </label>
                <div className="flex items-center space-x-4">
                  <div className={`relative h-16 w-16 rounded-full flex items-center justify-center overflow-hidden border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-300'
                    }`}>
                    {profileImage ? (
                      <img src={profileImage} alt="Profile preview" className="h-full w-full object-cover" />
                    ) : (
                      <Upload className={`h-6 w-6 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    )}
                  </div>
                  <label className={`px-4 py-2 rounded-lg text-sm cursor-pointer transition-colors ${isDarkMode
                      ? 'bg-gray-800 hover:bg-gray-700 text-gray-200'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}>
                    Upload Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="userGender" className={`block text-sm mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Gender
                  </label>
                  <select
                    id="userGender"
                    value={formState.gender}
                    onChange={(e) => setFormState({ ...formState, gender: e.target.value })}
                    className={`w-full px-4 py-2 rounded-lg border ${isDarkMode
                        ? 'bg-gray-900 border-gray-700 text-white focus:border-indigo-500'
                        : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-400'
                      } focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="userDateOfBirth" className={`block text-sm mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    id="userDateOfBirth"
                    value={formState.dateOfBirth}
                    onChange={(e) => setFormState({ ...formState, dateOfBirth: e.target.value })}
                    className={`w-full px-4 py-2 rounded-lg border ${isDarkMode
                        ? 'bg-gray-900 border-gray-700 text-white focus:border-indigo-500'
                        : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-400'
                      } focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Languages
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={currentLanguage}
                    onChange={(e) => setCurrentLanguage(e.target.value)}
                    className={`flex-1 px-4 py-2 rounded-lg border ${isDarkMode
                        ? 'bg-gray-900 border-gray-700 text-white focus:border-indigo-500'
                        : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-400'
                      } focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                    placeholder="Add a language"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLanguage())}
                  />
                  <button
                    type="button"
                    onClick={addLanguage}
                    className={`p-2 rounded-lg ${isDarkMode
                        ? 'bg-gray-800 hover:bg-gray-700 text-gray-200'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                  >
                    <Plus size={20} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formState.languages.map((language, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-1 px-3 py-1 rounded-full ${isDarkMode
                          ? 'bg-gray-800 text-gray-300'
                          : 'bg-gray-100 text-gray-700'
                        }`}
                    >
                      <span className="text-sm">{language}</span>
                      <button
                        type="button"
                        onClick={() => removeLanguage(language)}
                        className={`h-4 w-4 rounded-full flex items-center justify-center ${isDarkMode
                            ? 'text-gray-400 hover:text-gray-200'
                            : 'text-gray-500 hover:text-gray-700'
                          }`}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="userCity" className={`block text-sm mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    City
                  </label>
                  <input
                    type="text"
                    id="userCity"
                    value={formState.city}
                    onChange={(e) => setFormState({ ...formState, city: e.target.value })}
                    className={`w-full px-4 py-2 rounded-lg border ${isDarkMode
                        ? 'bg-gray-900 border-gray-700 text-white focus:border-indigo-500'
                        : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-400'
                      } focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                    placeholder="Enter your city"
                  />
                </div>

                <div>
                  <label htmlFor="userState" className={`block text-sm mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    State/Province
                  </label>
                  <input
                    type="text"
                    id="userState"
                    value={formState.state}
                    onChange={(e) => setFormState({ ...formState, state: e.target.value })}
                    className={`w-full px-4 py-2 rounded-lg border ${isDarkMode
                        ? 'bg-gray-900 border-gray-700 text-white focus:border-indigo-500'
                        : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-400'
                      } focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                    placeholder="Enter your state"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="userPostalCode" className={`block text-sm mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Postal Code
                  </label>
                  <input
                    type="text"
                    id="userPostalCode"
                    value={formState.postalCode}
                    onChange={(e) => setFormState({ ...formState, postalCode: e.target.value })}
                    className={`w-full px-4 py-2 rounded-lg border ${isDarkMode
                        ? 'bg-gray-900 border-gray-700 text-white focus:border-indigo-500'
                        : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-400'
                      } focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                    placeholder="Enter postal code"
                  />
                </div>

                <div>
                  <label htmlFor="userCountry" className={`block text-sm mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Country
                  </label>
                  <input
                    type="text"
                    id="userCountry"
                    value={formState.country}
                    onChange={(e) => setFormState({ ...formState, country: e.target.value })}
                    className={`w-full px-4 py-2 rounded-lg border ${isDarkMode
                        ? 'bg-gray-900 border-gray-700 text-white focus:border-indigo-500'
                        : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-400'
                      } focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                    placeholder="Enter your country"
                  />
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => setFormState({ ...formState, step: 3 })}
              className={`mt-6 w-full md:w-auto md:self-end flex items-center justify-center gap-2 px-6 py-2 rounded-lg ${isDarkMode
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                } transition-colors`}
            >
              Continue
              <ChevronRight size={16} />
            </motion.button>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-light mb-6">
              {formState.role === UserRole.Labour ? "Work Details" : "Company Details"}
            </h2>

            <div className="space-y-4">
              {formState.role === UserRole.Labour ? (
                <>
                  <div>
                    <label className={`block text-sm mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Skills
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={currentSkill}
                        onChange={(e) => setCurrentSkill(e.target.value)}
                        className={`flex-1 px-4 py-2 rounded-lg border ${isDarkMode
                            ? 'bg-gray-900 border-gray-700 text-white focus:border-indigo-500'
                            : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-400'
                          } focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                        placeholder="Add a skill"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                      />
                      <button
                        type="button"
                        onClick={addSkill}
                        className={`p-2 rounded-lg ${isDarkMode
                            ? 'bg-gray-800 hover:bg-gray-700 text-gray-200'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                          }`}
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formState.skills.map((skill, index) => (
                        <div
                          key={index}
                          className={`flex items-center gap-1 px-3 py-1 rounded-full ${isDarkMode
                              ? 'bg-gray-800 text-gray-300'
                              : 'bg-gray-100 text-gray-700'
                            }`}
                        >
                          <span className="text-sm">{skill}</span>
                          <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            className={`h-4 w-4 rounded-full flex items-center justify-center ${isDarkMode
                                ? 'text-gray-400 hover:text-gray-200'
                                : 'text-gray-500 hover:text-gray-700'
                              }`}
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Experience
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={currentExperience}
                        onChange={(e) => setCurrentExperience(e.target.value)}
                        className={`flex-1 px-4 py-2 rounded-lg border ${isDarkMode
                            ? 'bg-gray-900 border-gray-700 text-white focus:border-indigo-500'
                            : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-400'
                          } focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                        placeholder="Add experience"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addExperience())}
                      />
                      <button
                        type="button"
                        onClick={addExperience}
                        className={`p-2 rounded-lg ${isDarkMode
                            ? 'bg-gray-800 hover:bg-gray-700 text-gray-200'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                          }`}
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formState.experience.map((experience, index) => (
                        <div
                          key={index}
                          className={`flex items-center gap-1 px-3 py-1 rounded-full ${isDarkMode
                              ? 'bg-gray-800 text-gray-300'
                              : 'bg-gray-100 text-gray-700'
                            }`}
                        >
                          <span className="text-sm">{experience}</span>
                          <button
                            type="button"
                            onClick={() => removeExperience(experience)}
                            className={`h-4 w-4 rounded-full flex items-center justify-center ${isDarkMode
                                ? 'text-gray-400 hover:text-gray-200'
                                : 'text-gray-500 hover:text-gray-700'
                              }`}
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Certifications
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={currentCertification}
                        onChange={(e) => setCurrentCertification(e.target.value)}
                        className={`flex-1 px-4 py-2 rounded-lg border ${isDarkMode
                            ? 'bg-gray-900 border-gray-700 text-white focus:border-indigo-500'
                            : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-400'
                          } focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                        placeholder="Add certification"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCertification())}
                      />
                      <button
                        type="button"
                        onClick={addCertification}
                        className={`p-2 rounded-lg ${isDarkMode
                            ? 'bg-gray-800 hover:bg-gray-700 text-gray-200'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                          }`}
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formState.certifications.map((certification, index) => (
                        <div
                          key={index}
                          className={`flex items-center gap-1 px-3 py-1 rounded-full ${isDarkMode
                              ? 'bg-gray-800 text-gray-300'
                              : 'bg-gray-100 text-gray-700'
                            }`}
                        >
                          <span className="text-sm">{certification}</span>
                          <button
                            type="button"
                            onClick={() => removeCertification(certification)}
                            className={`h-4 w-4 rounded-full flex items-center justify-center ${isDarkMode
                                ? 'text-gray-400 hover:text-gray-200'
                                : 'text-gray-500 hover:text-gray-700'
                              }`}
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Work History
                    </label>
                    <div className="space-y-3 mb-3">
                      <div>
                        <input
                          type="text"
                          value={currentWorkHistory.title}
                          onChange={(e) => setCurrentWorkHistory({ ...currentWorkHistory, title: e.target.value })}
                          className={`w-full px-4 py-2 rounded-lg border ${isDarkMode
                              ? 'bg-gray-900 border-gray-700 text-white focus:border-indigo-500'
                              : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-400'
                            } focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                          placeholder="Job title"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          value={currentWorkHistory.duration}
                          onChange={(e) => setCurrentWorkHistory({ ...currentWorkHistory, duration: e.target.value })}
                          className={`w-full px-4 py-2 rounded-lg border ${isDarkMode
                              ? 'bg-gray-900 border-gray-700 text-white focus:border-indigo-500'
                              : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-400'
                            } focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                          placeholder="Duration (e.g., Jan 2020 - Dec 2022)"
                        />
                      </div>
                      <div>
                        <textarea
                          value={currentWorkHistory.description}
                          onChange={(e) => setCurrentWorkHistory({ ...currentWorkHistory, description: e.target.value })}
                          rows={2}
                          className={`w-full px-4 py-2 rounded-lg border ${isDarkMode
                              ? 'bg-gray-900 border-gray-700 text-white focus:border-indigo-500'
                              : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-400'
                            } focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                          placeholder="Job description"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={addWorkHistory}
                      className={`px-4 py-2 rounded-lg text-sm transition-colors ${isDarkMode
                          ? 'bg-gray-800 hover:bg-gray-700 text-gray-200'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                    >
                      Add Work History
                    </button>

                    <div className="mt-4 space-y-3">
                      {formState.workHistory.map((work, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
                            } relative`}
                        >
                          <button
                            type="button"
                            onClick={() => removeWorkHistory(index)}
                            className={`absolute top-2 right-2 h-6 w-6 rounded-full flex items-center justify-center ${isDarkMode
                                ? 'bg-gray-700 text-gray-400 hover:text-gray-200'
                                : 'bg-gray-200 text-gray-500 hover:text-gray-700'
                              }`}
                          >
                            <X size={14} />
                          </button>
                          <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                            {work.title}
                          </div>
                          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {work.duration}
                          </div>
                          <div className={`text-sm mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {work.description}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="userVerificationDocuments" className={`block text-sm mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Verification Documents
                    </label>
                    <textarea
                      id="userVerificationDocuments"
                      value={formState.verificationDocuments}
                      onChange={(e) => setFormState({ ...formState, verificationDocuments: e.target.value })}
                      rows={2}
                      className={`w-full px-4 py-2 rounded-lg border ${isDarkMode
                          ? 'bg-gray-900 border-gray-700 text-white focus:border-indigo-500'
                          : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-400'
                        } focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                      placeholder="List any verification documents"
                    />
                  </div>

                  <div>
                    <label htmlFor="userRelevantDocuments" className={`block text-sm mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Relevant Documents
                    </label>
                    <textarea
                      id="userRelevantDocuments"
                      value={formState.relevantDocuments}
                      onChange={(e) => setFormState({ ...formState, relevantDocuments: e.target.value })}
                      rows={2}
                      className={`w-full px-4 py-2 rounded-lg border ${isDarkMode
                          ? 'bg-gray-900 border-gray-700 text-white focus:border-indigo-500'
                          : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-400'
                        } focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                      placeholder="List any relevant documents"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label htmlFor="companyName" className={`block text-sm mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Company Name
                    </label>
                    <input
                      type="text"
                      id="companyName"
                      value={formState.companyDetails.company || ''}
                      onChange={(e) => setFormState({
                        ...formState,
                        companyDetails: { ...formState.companyDetails, company: e.target.value }
                      })}
                      className={`w-full px-4 py-2 rounded-lg border ${isDarkMode
                          ? 'bg-gray-900 border-gray-700 text-white focus:border-indigo-500'
                          : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-400'
                        } focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                      placeholder="Enter company name"
                    />
                  </div>

                  <div>
                    <label htmlFor="companyIndustry" className={`block text-sm mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Industry
                    </label>
                    <input
                      type="text"
                      id="companyIndustry"
                      value={formState.companyDetails.industry || ''}
                      onChange={(e) => setFormState({
                        ...formState,
                        companyDetails: { ...formState.companyDetails, industry: e.target.value }
                      })}
                      className={`w-full px-4 py-2 rounded-lg border ${isDarkMode
                          ? 'bg-gray-900 border-gray-700 text-white focus:border-indigo-500'
                          : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-400'
                        } focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                      placeholder="Enter industry"
                    />
                  </div>

                  <div>
                    <label htmlFor="companyFounded" className={`block text-sm mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Year Founded
                    </label>
                    <input
                      type="number"
                      id="companyFounded"
                      value={formState.companyDetails.founded || ''}
                      onChange={(e) => setFormState({
                        ...formState,
                        companyDetails: { ...formState.companyDetails, founded: parseInt(e.target.value) }
                      })}
                      className={`w-full px-4 py-2 rounded-lg border ${isDarkMode
                          ? 'bg-gray-900 border-gray-700 text-white focus:border-indigo-500'
                          : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-400'
                        } focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                      placeholder="Enter year founded"
                    />
                  </div>

                  <div>
                    <label htmlFor="companyLocation" className={`block text-sm mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Company Location
                    </label>
                    <input
                      type="text"
                      id="companyLocation"
                      value={formState.companyDetails.location || ''}
                      onChange={(e) => setFormState({
                        ...formState,
                        companyDetails: { ...formState.companyDetails, location: e.target.value }
                      })}
                      className={`w-full px-4 py-2 rounded-lg border ${isDarkMode
                          ? 'bg-gray-900 border-gray-700 text-white focus:border-indigo-500'
                          : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-400'
                        } focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                      placeholder="Enter company location"
                    />
                  </div>

                  <div>
                    <label htmlFor="managementExperience" className={`block text-sm mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Management Experience (years)
                    </label>
                    <input
                      type="number"
                      id="managementExperience"
                      value={formState.managementExperience || ''}
                      onChange={(e) => setFormState({
                        ...formState,
                        managementExperience: parseInt(e.target.value)
                      })}
                      className={`w-full px-4 py-2 rounded-lg border ${isDarkMode
                          ? 'bg-gray-900 border-gray-700 text-white focus:border-indigo-500'
                          : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-400'
                        } focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                      placeholder="Enter years of management experience"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="flex justify-between mt-8">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => setFormState({ ...formState, step: 2 })}
                className={`px-6 py-2 rounded-lg border ${isDarkMode
                    ? 'border-gray-700 text-gray-300 hover:bg-gray-800'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                  } transition-colors`}
              >
                Back
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-2 rounded-lg ${isDarkMode
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white disabled:bg-indigo-800 disabled:cursor-not-allowed'
                    : 'bg-indigo-500 hover:bg-indigo-600 text-white disabled:bg-indigo-300 disabled:cursor-not-allowed'
                  } transition-colors`}
              >
                {isSubmitting ? 'Submitting...' : 'Complete Registration'}
              </motion.button>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className={`min-h-screen py-12 transition-colors ${isDarkMode ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Form Card */}
          <main className="flex-1 flex flex-col items-center order-1 md:order-none">
            <div className={`w-full max-w-2xl p-10 rounded-2xl border ${isDarkMode ? 'bg-gray-900 border-gray-800 shadow-2xl' : 'bg-white border-gray-200 shadow-xl'}`}>
              <h1 className="text-3xl font-bold mb-2 text-center">Registration</h1>
              <p className={`mb-8 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Create your DLabor account</p>
              <form onSubmit={handleSubmit} className="space-y-6">
                {renderFormStep()}
              </form>
              {errorMessage && (
                <div className={`mt-4 p-3 rounded-lg ${isDarkMode ? 'bg-red-900/50 text-red-200' : 'bg-red-100 text-red-800'}`}>{errorMessage}</div>
              )}
            </div>
          </main>

          {/* Sidebar Stepper on the right */}
          <aside className="w-full md:w-1/3 flex-shrink-0 order-2 md:order-2 flex flex-col items-end">
            <div className="w-full flex flex-col gap-6 items-end mt-8 md:mt-0">
              {[
                { label: 'Choose Role', step: 1 },
                { label: 'Basic Details', step: 2 },
                { label: formState.role === UserRole.Labour ? 'Work Details' : 'Company Details', step: 3 },
              ].map(({ label, step }, idx) => {
                const isActive = formState.step === step;
                return (
                  <button
                    key={step}
                    className={`flex items-center gap-3 w-64 justify-end px-6 py-4 rounded-xl border transition-all duration-200 shadow-md
                      ${isActive
                        ? isDarkMode
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-500 scale-105 font-bold shadow-xl'
                          : 'bg-gradient-to-r from-indigo-400 to-purple-400 text-white border-indigo-400 scale-105 font-bold shadow-xl'
                        : isDarkMode
                          ? 'bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800/40'
                          : 'bg-transparent border-gray-300 text-gray-600 hover:bg-gray-100'}
                      ${formState.step > step ? 'opacity-70' : ''}
                    `}
                    style={{ minHeight: isActive ? 64 : 48 }}
                    disabled={formState.step < step}
                    onClick={() => formState.step > step && setFormState({ ...formState, step })}
                  >
                    <span className={`h-10 w-10 flex items-center justify-center rounded-full border-2 text-xl
                      ${isActive
                        ? isDarkMode ? 'border-white bg-white/20 text-white' : 'border-white bg-white/20 text-white'
                        : isDarkMode ? 'border-gray-700 bg-gray-900 text-gray-400' : 'border-gray-300 bg-white text-gray-400'}
                    `}>
                      {step}
                    </span>
                    <span className="flex-1 text-right">{label}</span>
                  </button>
                );
              })}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
