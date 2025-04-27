'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import { atom, useAtom } from 'jotai';
import { UserRole, UserAccount, UserMetadata, LaborMetadata, ManagerMetadata } from '@/types/user';
import { useWallet } from '@solana/wallet-adapter-react';
import { Upload, X, Plus, Check, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Jotai atoms for form state
const userRoleAtom = atom<UserRole | null>(null);
const userNameAtom = atom<string>('');
const userBioAtom = atom<string>('');
const userGenderAtom = atom<string>('');
const userDateOfBirthAtom = atom<string>('');
const userLanguagesAtom = atom<string[]>([]);
const userCityAtom = atom<string>('');
const userStateAtom = atom<string>('');
const userPostalCodeAtom = atom<string>('');
const userCountryAtom = atom<string>('');
const userVerificationDocumentsAtom = atom<string>('');
const userExperienceAtom = atom<string[]>([]);
const userSkillsAtom = atom<string[]>([]);
const userCertificationsAtom = atom<string[]>([]);
const userWorkHistoryAtom = atom<{ title: string; description: string; duration: string; }[]>([]);
const userRelevantDocumentsAtom = atom<string>('');
const userCompanyDetailsAtom = atom<{
  company?: string;
  industry?: string;
  founded?: number;
  location?: string;
  industryFocus?: string[];
}>({});
const userManagementExperienceAtom = atom<number | undefined>(undefined);

// Atom for form step
const formStepAtom = atom<number>(1);

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
  const [currentWorkHistory, setCurrentWorkHistory] = useState({
    title: '',
    description: '',
    duration: ''
  });
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Form state atoms
  const [userRole, setUserRole] = useAtom(userRoleAtom);
  const [userName, setUserName] = useAtom(userNameAtom);
  const [userBio, setUserBio] = useAtom(userBioAtom);
  const [userGender, setUserGender] = useAtom(userGenderAtom);
  const [userDateOfBirth, setUserDateOfBirth] = useAtom(userDateOfBirthAtom);
  const [userLanguages, setUserLanguages] = useAtom(userLanguagesAtom);
  const [userCity, setUserCity] = useAtom(userCityAtom);
  const [userState, setUserState] = useAtom(userStateAtom);
  const [userPostalCode, setUserPostalCode] = useAtom(userPostalCodeAtom);
  const [userCountry, setUserCountry] = useAtom(userCountryAtom);
  const [userVerificationDocuments, setUserVerificationDocuments] = useAtom(userVerificationDocumentsAtom);
  const [userExperience, setUserExperience] = useAtom(userExperienceAtom);
  const [userSkills, setUserSkills] = useAtom(userSkillsAtom);
  const [userCertifications, setUserCertifications] = useAtom(userCertificationsAtom);
  const [userWorkHistory, setUserWorkHistory] = useAtom(userWorkHistoryAtom);
  const [userRelevantDocuments, setUserRelevantDocuments] = useAtom(userRelevantDocumentsAtom);
  const [userCompanyDetails, setUserCompanyDetails] = useAtom(userCompanyDetailsAtom);
  const [userManagementExperience, setUserManagementExperience] = useAtom(userManagementExperienceAtom);
  const [formStep, setFormStep] = useAtom(formStepAtom);

  // Toggle dark/light mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
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
    if (currentSkill.trim() && !userSkills.includes(currentSkill.trim())) {
      setUserSkills([...userSkills, currentSkill.trim()]);
      setCurrentSkill('');
    }
  };

  // Remove a skill from the skills array
  const removeSkill = (skillToRemove: string) => {
    setUserSkills(userSkills.filter(skill => skill !== skillToRemove));
  };

  // Add a language to the languages array
  const addLanguage = () => {
    if (currentLanguage.trim() && !userLanguages.includes(currentLanguage.trim())) {
      setUserLanguages([...userLanguages, currentLanguage.trim()]);
      setCurrentLanguage('');
    }
  };

  // Remove a language from the languages array
  const removeLanguage = (languageToRemove: string) => {
    setUserLanguages(userLanguages.filter(language => language !== languageToRemove));
  };

  // Add experience to the experience array
  const addExperience = () => {
    if (currentExperience.trim() && !userExperience.includes(currentExperience.trim())) {
      setUserExperience([...userExperience, currentExperience.trim()]);
      setCurrentExperience('');
    }
  };

  // Remove experience from the experience array
  const removeExperience = (experienceToRemove: string) => {
    setUserExperience(userExperience.filter(experience => experience !== experienceToRemove));
  };

  // Add certification to the certifications array
  const addCertification = () => {
    if (currentCertification.trim() && !userCertifications.includes(currentCertification.trim())) {
      setUserCertifications([...userCertifications, currentCertification.trim()]);
      setCurrentCertification('');
    }
  };

  // Remove certification from the certifications array
  const removeCertification = (certificationToRemove: string) => {
    setUserCertifications(userCertifications.filter(certification => certification !== certificationToRemove));
  };

  // Add work history entry
  const addWorkHistory = () => {
    if (currentWorkHistory.title.trim() && currentWorkHistory.description.trim() && currentWorkHistory.duration.trim()) {
      setUserWorkHistory([...userWorkHistory, { ...currentWorkHistory }]);
      setCurrentWorkHistory({ title: '', description: '', duration: '' });
    }
  };

  // Remove work history entry
  const removeWorkHistory = (indexToRemove: number) => {
    setUserWorkHistory(userWorkHistory.filter((_, index) => index !== indexToRemove));
  };

  // Handle role selection
  const handleRoleSelection = (role: UserRole) => {
    setUserRole(role);
    setFormStep(2);
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

      if (!userRole) {
        throw new Error('Please select a role');
      }

      // Construct metadata object based on role
      const metadata: UserMetadata = {
        name: userName,
        bio: userBio,
        profileImage: profileImage || undefined,
        gender: userGender || undefined,
        dateOfBirth: userDateOfBirth ? new Date(userDateOfBirth) : undefined,
        languages: userLanguages.length > 0 ? userLanguages : undefined,
        city: userCity || undefined,
        state: userState || undefined,
        postalCode: userPostalCode || undefined,
        country: userCountry || undefined,
        verificationDocuments: userVerificationDocuments || undefined,
        relevantDocuments: userRelevantDocuments || undefined,
      };

      // Add role-specific fields
      if (userRole === UserRole.Labour) {
        (metadata as LaborMetadata).experience = userExperience.length > 0 ? userExperience : undefined;
        (metadata as LaborMetadata).skillsets = userSkills.length > 0 ? userSkills : undefined;
        (metadata as LaborMetadata).certifications = userCertifications.length > 0 ? userCertifications : undefined;
        (metadata as LaborMetadata).workHistory = userWorkHistory.length > 0 ? userWorkHistory : undefined;
      } else {
        (metadata as ManagerMetadata).companyDetails = {
          ...userCompanyDetails,
          industryFocus: userCompanyDetails.industryFocus && userCompanyDetails.industryFocus.length > 0 
            ? userCompanyDetails.industryFocus 
            : undefined
        };
        (metadata as ManagerMetadata).managementExperience = userManagementExperience;
      }

      // Initial user account data
      const userAccount: Partial<UserAccount> = {
        authority: publicKey.toString(),
        name: userName,
        metadata_uri: '', // Will be generated and populated by backend
        active: true,
        verified: false,
        role: userRole,
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
      router.push(userRole === UserRole.Labour ? '/labor-dashboard' : '/manager-dashboard');
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
      case 3: return userRole === UserRole.Labour ? "Work Details" : "Company Details";
      default: return "";
    }
  };

  // Form steps rendering
  const renderFormStep = () => {
    switch (formStep) {
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
                className={`p-8 rounded-lg border-2 flex flex-col items-center justify-center transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-900 border-gray-700 hover:border-purple-600' 
                    : 'bg-white border-gray-200 hover:border-purple-400'
                }`}
              >
                <div className="text-center">
                  <div className={`text-lg font-medium ${
                    isDarkMode ? 'text-white' : 'text-gray-800'
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
                className={`p-8 rounded-lg border-2 flex flex-col items-center justify-center transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-900 border-gray-700 hover:border-purple-600' 
                    : 'bg-white border-gray-200 hover:border-purple-400'
                }`}
              >
                <div className="text-center">
                  <div className={`text-lg font-medium ${
                    isDarkMode ? 'text-white' : 'text-gray-800'
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
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-gray-900 border-gray-700 text-white focus:border-purple-500' 
                      : 'bg-white border-gray-300 text-gray-900 focus:border-purple-400'
                  } focus:outline-none focus:ring-1 focus:ring-purple-500`}
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
                  value={userBio}
                  onChange={(e) => setUserBio(e.target.value)}
                  rows={3}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-gray-900 border-gray-700 text-white focus:border-purple-500' 
                      : 'bg-white border-gray-300 text-gray-900 focus:border-purple-400'
                  } focus:outline-none focus:ring-1 focus:ring-purple-500`}
                  placeholder="Tell us about yourself"
                />
              </div>

              <div>
                <label className={`block text-sm mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Profile Picture
                </label>
                <div className="flex items-center space-x-4">
                  <div className={`relative h-16 w-16 rounded-full flex items-center justify-center overflow-hidden border ${
                    isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-300'
                  }`}>
                    {profileImage ? (
                      <img src={profileImage} alt="Profile preview" className="h-full w-full object-cover" />
                    ) : (
                      <Upload className={`h-6 w-6 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    )}
                  </div>
                  <label className={`px-4 py-2 rounded-lg text-sm cursor-pointer transition-colors ${
                    isDarkMode
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
                    value={userGender}
                    onChange={(e) => setUserGender(e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      isDarkMode 
                        ? 'bg-gray-900 border-gray-700 text-white focus:border-purple-500' 
                        : 'bg-white border-gray-300 text-gray-900 focus:border-purple-400'
                    } focus:outline-none focus:ring-1 focus:ring-purple-500`}
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
                    value={userDateOfBirth}
                    onChange={(e) => setUserDateOfBirth(e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      isDarkMode 
                        ? 'bg-gray-900 border-gray-700 text-white focus:border-purple-500' 
                        : 'bg-white border-gray-300 text-gray-900 focus:border-purple-400'
                    } focus:outline-none focus:ring-1 focus:ring-purple-500`}
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
                    className={`flex-1 px-4 py-2 rounded-lg border ${
                      isDarkMode 
                        ? 'bg-gray-900 border-gray-700 text-white focus:border-purple-500' 
                        : 'bg-white border-gray-300 text-gray-900 focus:border-purple-400'
                    } focus:outline-none focus:ring-1 focus:ring-purple-500`}
                    placeholder="Add a language"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLanguage())}
                  />
                  <button
                    type="button"
                    onClick={addLanguage}
                    className={`p-2 rounded-lg ${
                      isDarkMode
                        ? 'bg-gray-800 hover:bg-gray-700 text-gray-200'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    <Plus size={20} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {userLanguages.map((language, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-1 px-3 py-1 rounded-full ${
                        isDarkMode
                          ? 'bg-gray-800 text-gray-300'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      <span className="text-sm">{language}</span>
                      <button
                        type="button"
                        onClick={() => removeLanguage(language)}
                        className={`h-4 w-4 rounded-full flex items-center justify-center ${
                          isDarkMode
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
                    value={userCity}
                    onChange={(e) => setUserCity(e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      isDarkMode 
                        ? 'bg-gray-900 border-gray-700 text-white focus:border-purple-500' 
                        : 'bg-white border-gray-300 text-gray-900 focus:border-purple-400'
                    } focus:outline-none focus:ring-1 focus:ring-purple-500`}
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
                    value={userState}
                    onChange={(e) => setUserState(e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      isDarkMode 
                        ? 'bg-gray-900 border-gray-700 text-white focus:border-purple-500' 
                        : 'bg-white border-gray-300 text-gray-900 focus:border-purple-400'
                    } focus:outline-none focus:ring-1 focus:ring-purple-500`}
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
                    value={userPostalCode}
                    onChange={(e) => setUserPostalCode(e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      isDarkMode 
                        ? 'bg-gray-900 border-gray-700 text-white focus:border-purple-500' 
                        : 'bg-white border-gray-300 text-gray-900 focus:border-purple-400'
                    } focus:outline-none focus:ring-1 focus:ring-purple-500`}
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
                    value={userCountry}
                    onChange={(e) => setUserCountry(e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      isDarkMode 
                        ? 'bg-gray-900 border-gray-700 text-white focus:border-purple-500' 
                        : 'bg-white border-gray-300 text-gray-900 focus:border-purple-400'
                    } focus:outline-none focus:ring-1 focus:ring-purple-500`}
                    placeholder="Enter your country"
                  />
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button" 
              onClick={() => setFormStep(3)}
              className={`mt-6 w-full md:w-auto md:self-end flex items-center justify-center gap-2 px-6 py-2 rounded-lg ${
                isDarkMode
                  ? 'bg-purple-600 hover:bg-purple-700 text-white'
                  : 'bg-purple-500 hover:bg-purple-600 text-white'
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
              {userRole === UserRole.Labour ? "Work Details" : "Company Details"}
            </h2>
            
            <div className="space-y-4">
              {userRole === UserRole.Labour ? (
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
                        className={`flex-1 px-4 py-2 rounded-lg border ${
                          isDarkMode 
                            ? 'bg-gray-900 border-gray-700 text-white focus:border-purple-500' 
                            : 'bg-white border-gray-300 text-gray-900 focus:border-purple-400'
                        } focus:outline-none focus:ring-1 focus:ring-purple-500`}
                        placeholder="Add a skill"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                      />
                      <button
                        type="button"
                        onClick={addSkill}
                        className={`p-2 rounded-lg ${
                          isDarkMode
                            ? 'bg-gray-800 hover:bg-gray-700 text-gray-200'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {userSkills.map((skill, index) => (
                        <div
                          key={index}
                          className={`flex items-center gap-1 px-3 py-1 rounded-full ${
                            isDarkMode
                              ? 'bg-gray-800 text-gray-300'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          <span className="text-sm">{skill}</span>
                          <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            className={`h-4 w-4 rounded-full flex items-center justify-center ${
                              isDarkMode
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
                        className={`flex-1 px-4 py-2 rounded-lg border ${
                          isDarkMode 
                            ? 'bg-gray-900 border-gray-700 text-white focus:border-purple-500' 
                            : 'bg-white border-gray-300 text-gray-900 focus:border-purple-400'
                        } focus:outline-none focus:ring-1 focus:ring-purple-500`}
                        placeholder="Add an experience"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addExperience())}
                      />
                      <button
                        type="button"
                        onClick={addExperience}
                        className={`p-2 rounded-lg ${
                          isDarkMode
                            ? 'bg-gray-800 hover:bg-gray-700 text-gray-200'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {userExperience.map((experience, index) => (
                        <div
                          key={index}
                          className={`flex items-center gap-1 px-3 py-1 rounded-full ${
                            isDarkMode
                              ? 'bg-gray-800 text-gray-300'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          <span className="text-sm">{experience}</span>
                          <button
                            type="button"
                            onClick={() => removeExperience(experience)}
                            className={`h-4 w-4 rounded-full flex items-center justify-center ${
                              isDarkMode
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
                        className={`flex-1 px-4 py-2 rounded-lg border ${
                          isDarkMode 
                            ? 'bg-gray-900 border-gray-700 text-white focus:border-purple-500' 
                            : 'bg-white border-gray-300 text-gray-900 focus:border-purple-400'
                        } focus:outline-none focus:ring-1 focus:ring-purple-500`}
                        placeholder="Add a certification"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCertification())}
                      />
                      <button
                        type="button"
                        onClick={addCertification}
                        className={`p-2 rounded-lg ${
                          isDarkMode
                            ? 'bg-gray-800 hover:bg-gray-700 text-gray-200'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {userCertifications.map((certification, index) => (
                        <div
                          key={index}
                          className={`flex items-center gap-1 px-3 py-1 rounded-full ${
                            isDarkMode
                              ? 'bg-gray-800 text-gray-300'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          <span className="text-sm">{certification}</span>
                          <button
                            type="button"
                            onClick={() => removeCertification(certification)}
                            className={`h-4 w-4 rounded-full flex items-center justify-center ${
                              isDarkMode
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
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={currentWorkHistory.title}
                          onChange={(e) => setCurrentWorkHistory({...currentWorkHistory, title: e.target.value})}
                          className={`px-4 py-2 rounded-lg border ${
                            isDarkMode 
                              ? 'bg-gray-900 border-gray-700 text-white focus:border-purple-500' 
                              : 'bg-white border-gray-300 text-gray-900 focus:border-purple-400'
                          } focus:outline-none focus:ring-1 focus:ring-purple-500`}
                          placeholder="Job title"
                        />
                        <input
                          type="text"
                          value={currentWorkHistory.duration}
                          onChange={(e) => setCurrentWorkHistory({...currentWorkHistory, duration: e.target.value})}
                          className={`px-4 py-2 rounded-lg border ${
                            isDarkMode 
                              ? 'bg-gray-900 border-gray-700 text-white focus:border-purple-500' 
                              : 'bg-white border-gray-300 text-gray-900 focus:border-purple-400'
                          } focus:outline-none focus:ring-1 focus:ring-purple-500`}
                          placeholder="Duration (e.g. 2020-2022)"
                        />
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={currentWorkHistory.description}
                          onChange={(e) => setCurrentWorkHistory({...currentWorkHistory, description: e.target.value})}
                          className={`flex-1 px-4 py-2 rounded-lg border ${
                            isDarkMode 
                              ? 'bg-gray-900 border-gray-700 text-white focus:border-purple-500' 
                              : 'bg-white border-gray-300 text-gray-900 focus:border-purple-400'
                          } focus:outline-none focus:ring-1 focus:ring-purple-500`}
                          placeholder="Description"
                        />
                        <button
                          type="button"
                          onClick={addWorkHistory}
                          className={`p-2 rounded-lg ${
                            isDarkMode
                              ? 'bg-gray-800 hover:bg-gray-700 text-gray-200'
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                          }`}
                        >
                          <Plus size={20} />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {userWorkHistory.map((work, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded-lg ${
                            isDarkMode
                              ? 'bg-gray-800 text-gray-300'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{work.title}</h4>
                              <p className="text-sm text-gray-500">{work.duration}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeWorkHistory(index)}
                              className={`h-6 w-6 rounded-full flex items-center justify-center ${
                                isDarkMode
                                  ? 'text-gray-400 hover:text-gray-200'
                                  : 'text-gray-500 hover:text-gray-700'
                              }`}
                            >
                              <X size={14} />
                            </button>
                          </div>
                          <p className="text-sm mt-1">{work.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                // Manager-specific fields
                <>
                  <div>
                    <label htmlFor="companyName" className={`block text-sm mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Company Name
                    </label>
                    <input
                      type="text"
                      id="companyName"
                      value={userCompanyDetails.company || ''}
                      onChange={(e) => setUserCompanyDetails({...userCompanyDetails, company: e.target.value})}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        isDarkMode 
                          ? 'bg-gray-900 border-gray-700 text-white focus:border-purple-500' 
                          : 'bg-white border-gray-300 text-gray-900 focus:border-purple-400'
                      } focus:outline-none focus:ring-1 focus:ring-purple-500`}
                      placeholder="Enter company name"
                    />
                  </div>

                  <div>
                    <label htmlFor="industry" className={`block text-sm mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Industry
                    </label>
                    <input
                      type="text"
                      id="industry"
                      value={userCompanyDetails.industry || ''}
                      onChange={(e) => setUserCompanyDetails({...userCompanyDetails, industry: e.target.value})}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        isDarkMode 
                          ? 'bg-gray-900 border-gray-700 text-white focus:border-purple-500' 
                          : 'bg-white border-gray-300 text-gray-900 focus:border-purple-400'
                      } focus:outline-none focus:ring-1 focus:ring-purple-500`}
                      placeholder="Enter industry"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="founded" className={`block text-sm mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Year Founded
                      </label>
                      <input
                        type="number"
                        id="founded"
                        value={userCompanyDetails.founded || ''}
                        onChange={(e) => setUserCompanyDetails({...userCompanyDetails, founded: parseInt(e.target.value)})}
                        className={`w-full px-4 py-2 rounded-lg border ${
                          isDarkMode 
                            ? 'bg-gray-900 border-gray-700 text-white focus:border-purple-500' 
                            : 'bg-white border-gray-300 text-gray-900 focus:border-purple-400'
                        } focus:outline-none focus:ring-1 focus:ring-purple-500`}
                        placeholder="Year"
                      />
                    </div>

                    <div>
                      <label htmlFor="managementExperience" className={`block text-sm mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Management Experience (Years)
                      </label>
                      <input
                        type="number"
                        id="managementExperience"
                        value={userManagementExperience || ''}
                        onChange={(e) => setUserManagementExperience(parseInt(e.target.value))}
                        className={`w-full px-4 py-2 rounded-lg border ${
                          isDarkMode 
                            ? 'bg-gray-900 border-gray-700 text-white focus:border-purple-500' 
                            : 'bg-white border-gray-300 text-gray-900 focus:border-purple-400'
                        } focus:outline-none focus:ring-1 focus:ring-purple-500`}
                        placeholder="Years of experience"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="location" className={`block text-sm mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Company Location
                    </label>
                    <input
                      type="text"
                      id="location"
                      value={userCompanyDetails.location || ''}
                      onChange={(e) => setUserCompanyDetails({...userCompanyDetails, location: e.target.value})}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        isDarkMode 
                          ? 'bg-gray-900 border-gray-700 text-white focus:border-purple-500' 
                          : 'bg-white border-gray-300 text-gray-900 focus:border-purple-400'
                      } focus:outline-none focus:ring-1 focus:ring-purple-500`}
                      placeholder="Company location"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="flex justify-between mt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button" 
                onClick={() => setFormStep(2)}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg ${
                  isDarkMode
                    ? 'bg-gray-800 hover:bg-gray-700 text-gray-200'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                } transition-colors`}
              >
                Back
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className={`flex items-center justify-center gap-2 px-6 py-2 rounded-lg ${
                  isDarkMode
                    ? 'bg-purple-600 hover:bg-purple-700 text-white'
                    : 'bg-purple-500 hover:bg-purple-600 text-white'
                } transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'Submitting...' : 'Complete Registration'}
                {!isSubmitting && <Check size={16} />}
              </motion.button>
            </div>
          </motion.div>
        );
        
      default:
        return null;
    }
  };

  // Main component structure
  return (
    <div className={`min-h-screen flex justify-center transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="container flex">
        {/* Main content area */}
        <div className="w-full lg:w-3/4 py-12 px-6">
          <div className="mb-8 flex justify-between items-center">
            <h1 className="text-3xl font-light">Registration</h1>
            <button 
              onClick={toggleDarkMode}
              className={`px-4 py-2 rounded-lg text-sm ${
                isDarkMode 
                  ? 'bg-gray-800 hover:bg-gray-700 text-gray-200' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
          
          {errorMessage && (
            <div className={`mb-4 p-4 rounded-lg ${
              isDarkMode ? 'bg-red-900/30 text-red-200' : 'bg-red-100 text-red-800'
            }`}>
              {errorMessage}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="max-w-3xl">
            {renderFormStep()}
          </form>
        </div>
        
        {/* Side navigation steps panel */}
        <div className="hidden lg:flex lg:w-1/4 py-12 px-6">
          <div className={`w-full p-6 rounded-lg ${
            isDarkMode ? 'bg-gray-900' : 'bg-white shadow-sm'
          }`}>
            <h3 className={`text-xl font-medium mb-6 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
              Registration Steps
            </h3>
            
            <div className="space-y-6">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-start">
                  <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center mr-3 ${
                    step === formStep
                      ? `${isDarkMode ? 'bg-purple-600 text-white' : 'bg-purple-500 text-white'}`
                      : step < formStep
                        ? `${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'}`
                        : `${isDarkMode ? 'bg-gray-800 text-gray-500' : 'bg-gray-100 text-gray-400'}`
                  }`}>
                    {step < formStep ? (
                      <Check size={16} />
                    ) : (
                      <span className="text-sm">{step}</span>
                    )}
                  </div>
                  <div>
                    <h4 className={`font-medium ${
                      step === formStep
                        ? isDarkMode ? 'text-white' : 'text-gray-900' 
                        : isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {getSectionTitle(step)}
                    </h4>
                    <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      {step === 1 && "Select your role"}
                      {step === 2 && "Enter your personal information"}
                      {step === 3 && (userRole === UserRole.Labour 
                        ? "Add your work experience and skills" 
                        : "Add your company details")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}