'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import { atom, useAtom } from 'jotai';
import { UserRole, UserAccount, UserMetadata, FullUserData } from '@/types/user';
import { useWallet } from '@solana/wallet-adapter-react';
import { Upload, X, Plus, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Jotai atoms for form state
const userRoleAtom = atom<UserRole>(UserRole.Labor);
const userNameAtom = atom<string>('');
const userBioAtom = atom<string>('');
const userSkillsAtom = atom<string[]>([]);
const userExperienceAtom = atom<string[]>([]);
const userLanguagesAtom = atom<string[]>([]);
const userCertificationsAtom = atom<string[]>([]);
const userAvailabilityAtom = atom<string>('');
const userHourlyRateAtom = atom<number | undefined>(undefined);
const userPreferredLocationAtom = atom<string>('');
const userCompanyAtom = atom<string>('');
const userCompanyDetailsAtom = atom<UserMetadata['companyDetails']>({});

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

  // Form state atoms
  const [userRole, setUserRole] = useAtom(userRoleAtom);
  const [userName, setUserName] = useAtom(userNameAtom);
  const [userBio, setUserBio] = useAtom(userBioAtom);
  const [userSkills, setUserSkills] = useAtom(userSkillsAtom);
  const [formStep, setFormStep] = useAtom(formStepAtom);
  const [userExperience, setUserExperience] = useAtom(userExperienceAtom);
  const [userLanguages, setUserLanguages] = useAtom(userLanguagesAtom);
  const [userCertifications, setUserCertifications] = useAtom(userCertificationsAtom);
  const [userAvailability, setUserAvailability] = useAtom(userAvailabilityAtom);
  const [userHourlyRate, setUserHourlyRate] = useAtom(userHourlyRateAtom);
  const [userPreferredLocation, setUserPreferredLocation] = useAtom(userPreferredLocationAtom);
  const [userCompany, setUserCompany] = useAtom(userCompanyAtom);
  const [userCompanyDetails, setUserCompanyDetails] = useAtom(userCompanyDetailsAtom);

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

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      if (!publicKey) {
        throw new Error('Wallet not connected');
      }

      // Construct metadata object
      const metadata: UserMetadata = {
        name: userName,
        bio: userBio,
        profileImage: profileImage || undefined,
        skillsets: userSkills,
        experience: userExperience,
        languages: userLanguages,
        certifications: userCertifications,
        availability: userAvailability,
        hourlyRate: userHourlyRate,
        preferredLocation: userPreferredLocation,
      };

      // Add company details if role is Manager
      if (userRole === UserRole.Manager) {
        metadata.company = userCompany;
        metadata.companyDetails = userCompanyDetails;
      }

      // Initial user account data - backend will populate other fields
      const userAccount: Partial<UserAccount> = {
        authority: publicKey.toString(),
        name: userName,
        metadata_uri: '', // Will be generated and populated by backend
        active: true,
        verified: false, // Initial state
        role: userRole,
        spam: false,
      };

      // Send data to your blockchain backend
      // Replace this with your actual API call
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
      router.push(userRole === UserRole.Labor ? '/labor-dashboard' : '/manager-dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Form steps rendering
  const renderFormStep = () => {
    switch (formStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Basic Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  I am registering as a:
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setUserRole(UserRole.Labor)}
                    className={`p-4 rounded-lg border ${
                      userRole === UserRole.Labor
                        ? 'bg-purple-50 border-purple-300 dark:bg-purple-900/30 dark:border-purple-700'
                        : 'bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700'
                    } flex items-center justify-center transition-colors`}
                  >
                    <div className="text-center">
                      <div className={`text-lg font-medium ${
                        userRole === UserRole.Labor ? 'text-purple-700 dark:text-purple-300' : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        Labor
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">I'm looking for work</p>
                    </div>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setUserRole(UserRole.Manager)}
                    className={`p-4 rounded-lg border ${
                      userRole === UserRole.Manager
                        ? 'bg-purple-50 border-purple-300 dark:bg-purple-900/30 dark:border-purple-700'
                        : 'bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700'
                    } flex items-center justify-center transition-colors`}
                  >
                    <div className="text-center">
                      <div className={`text-lg font-medium ${
                        userRole === UserRole.Manager ? 'text-purple-700 dark:text-purple-300' : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        Manager
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">I'm hiring talent</p>
                    </div>
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="userName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="userName"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label htmlFor="userBio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Bio
                </label>
                <textarea
                  id="userBio"
                  value={userBio}
                  onChange={(e) => setUserBio(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Tell us about yourself"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Profile Picture
                </label>
                <div className="flex items-center space-x-4">
                  <div className="relative h-20 w-20 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden border-2 border-gray-300 dark:border-gray-600">
                    {profileImage ? (
                      <img src={profileImage} alt="Profile preview" className="h-full w-full object-cover" />
                    ) : (
                      <Upload className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  <label className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium text-sm cursor-pointer transition-colors">
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
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Professional Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Skills
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={currentSkill}
                    onChange={(e) => setCurrentSkill(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Add a skill"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors"
                  >
                    <Plus size={20} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {userSkills.map((skill, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200"
                    >
                      <span className="text-sm">{skill}</span>
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="h-4 w-4 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-800"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {userRole === UserRole.Labor ? (
                <>
                  <div>
                    <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Hourly Rate (USD)
                    </label>
                    <input
                      type="number"
                      id="hourlyRate"
                      value={userHourlyRate || ''}
                      onChange={(e) => setUserHourlyRate(e.target.value ? Number(e.target.value) : undefined)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter your hourly rate"
                    />
                  </div>

                  <div>
                    <label htmlFor="availability" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Availability
                    </label>
                    <select
                      id="availability"
                      value={userAvailability}
                      onChange={(e) => setUserAvailability(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Select availability</option>
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Freelance">Freelance</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="preferredLocation" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Preferred Location
                    </label>
                    <input
                      type="text"
                      id="preferredLocation"
                      value={userPreferredLocation}
                      onChange={(e) => setUserPreferredLocation(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Remote, on-site, or specific location"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Company Name
                    </label>
                    <input
                      type="text"
                      id="company"
                      value={userCompany}
                      onChange={(e) => setUserCompany(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter your company name"
                    />
                  </div>

                  <div>
                    <label htmlFor="companyIndustry" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Industry
                    </label>
                    <input
                      type="text"
                      id="companyIndustry"
                      value={userCompanyDetails?.industry || ''}
                      onChange={(e) => setUserCompanyDetails({...userCompanyDetails, industry: e.target.value})}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="e.g. Technology, Construction, etc."
                    />
                  </div>

                  <div>
                    <label htmlFor="companyWebsite" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Company Website
                    </label>
                    <input
                      type="url"
                      id="companyWebsite"
                      value={userCompanyDetails?.website || ''}
                      onChange={(e) => setUserCompanyDetails({...userCompanyDetails!, website: e.target.value})}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="https://example.com"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4 py-12"
    >
      <div className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-800">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-purple-700 dark:text-purple-400">DLabor</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Create your account to get started</p>
        </div>

        {errorMessage && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-4 rounded-lg border border-red-200 dark:border-red-800">
            {errorMessage}
          </div>
        )}

        {!publicKey ? (
          <div className="text-center py-8">
            <p className="text-gray-700 dark:text-gray-300 mb-4">Please connect your wallet to continue</p>
            <button 
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
              onClick={() => {}} // Replace with your wallet connection logic
            >
              Connect Wallet
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {renderFormStep()}

            <div className="mt-8 flex items-center justify-between">
              {formStep > 1 && (
                <button
                  type="button"
                  onClick={() => setFormStep(formStep - 1)}
                  className="px-6 py-2 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                  disabled={isSubmitting}
                >
                  Back
                </button>
              )}
              {formStep < 2 ? (
                <button
                  type="button" 
                  onClick={() => setFormStep(formStep + 1)}
                  className="ml-auto px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
                >
                  Continue
                </button>
              ) : (
                <button
                  type="submit"
                  className="ml-auto px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Check size={18} />
                      Complete Registration
                    </>
                  )}
                </button>
              )}
            </div>
            
            <div className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
              By registering, you agree to our Terms of Service and Privacy Policy
            </div>
          </form>
        )}
      </div>
    </motion.div>
  );
}