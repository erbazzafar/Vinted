"use client"

import axios from 'axios'
import { toast } from 'sonner'
import Cookies from "js-cookie"
import React, { useEffect, useState } from 'react'
import { Upload, FileText, Camera, AlertCircle, CheckCircle } from 'lucide-react'

interface KYCFormData {
    fullName: string
    dateOfBirth: string
    nationality: string
    gender: string
    idType: string
    documents: {
        idFront: File | null
        idBack: File | null
        selfieWithId: File | null
    }
}

interface KYCErrors {
    fullName?: string
    dateOfBirth?: string
    nationality?: string
    gender?: string
    idType?: string
    documents?: {
        idFront?: string
        idBack?: string
        selfieWithId?: string
    }
}

const KfcSetting = () => {

    const userId = Cookies.get("userId");
    const [userKyc, setUserKyc] = useState<any>(null);

    const [formData, setFormData] = useState<KYCFormData>({
        fullName: '',
        dateOfBirth: '',
        nationality: '',
        gender: '',
        idType: '',
        documents: {
            idFront: null,
            idBack: null,
            selfieWithId: null
        }
    })

    const [errors, setErrors] = useState<KYCErrors>({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchUserKyc();
    }, [userId]);

    const fetchUserKyc = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/kyc/get/${userId}`, {
                headers: {
                    Authorization: `Bearer ${Cookies.get("user-token")}`
                }
            });
            if (response.status === 200) {
                setUserKyc(response.data.data);
            }
        } catch (error) {
            console.log("Error fetching user kyc: ", error);
            setUserKyc(null);
        } finally {
            setIsLoading(false);
        }
    }

    const handleInputChange = (field: string, value: string) => {
        if (field.includes('.')) {
            const [parent, child] = field.split('.')
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...(prev[parent as keyof KYCFormData] as any),
                    [child]: value
                }
            }))
        } else {
            setFormData(prev => ({
                ...prev,
                [field]: value
            }))
        }

        // Clear error when user starts typing
        if (errors[field as keyof KYCErrors]) {
            setErrors(prev => ({
                ...prev,
                [field]: undefined
            }))
        }
    }

    const handleFileUpload = (documentType: keyof KYCFormData['documents'], file: File | null) => {
        setFormData(prev => ({
            ...prev,
            documents: {
                ...prev.documents,
                [documentType]: file
            }
        }))
    }

    const validateForm = (): boolean => {
        const newErrors: KYCErrors = {}

        // Required field validations
        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required'
        }

        if (!formData.dateOfBirth) {
            newErrors.dateOfBirth = 'Date of birth is required'
        } else {
            const birthDate = new Date(formData.dateOfBirth)
            const today = new Date()
            const age = today.getFullYear() - birthDate.getFullYear()
            if (age < 18) {
                newErrors.dateOfBirth = 'You must be at least 18 years old'
            }
        }

        if (!formData.nationality.trim()) {
            newErrors.nationality = 'Nationality is required'
        }



        if (!formData.idType) {
            newErrors.idType = 'ID type is required'
        }


        // Document validations
        if (!formData.documents.idFront) {
            newErrors.documents = { ...newErrors.documents, idFront: 'Front ID document is required' }
        }

        if (!formData.documents.idBack && formData.idType !== 'passport') {
            newErrors.documents = { ...newErrors.documents, idBack: 'Back ID document is required' }
        }

        if (!formData.documents.selfieWithId) {
            newErrors.documents = { ...newErrors.documents, selfieWithId: 'Selfie with ID is required' }
        }


        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            toast.error('Please fix all validation errors before submitting')
            return
        }

        setIsSubmitting(true)

        try {
            // Create FormData for file uploads
            const formDataToSend = new FormData();

            // Add user ID
            formDataToSend.append('userId', userId);

            // Add text fields
            formDataToSend.append('fullName', formData.fullName);
            formDataToSend.append('dateOfBirth', formData.dateOfBirth);
            formDataToSend.append('nationality', formData.nationality);
            formDataToSend.append('gender', formData.gender);
            formDataToSend.append('idType', formData.idType);

            // Add file fields
            if (formData.documents.idFront) {
                formDataToSend.append('idFront', formData.documents.idFront);
            }
            if (formData.documents.idBack) {
                formDataToSend.append('idBack', formData.documents.idBack);
            }
            if (formData.documents.selfieWithId) {
                formDataToSend.append('selfieWithId', formData.documents.selfieWithId);
            }

            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/kyc/create`, formDataToSend, {
                headers: {
                    Authorization: `Bearer ${Cookies.get("user-token")}`,
                    'Content-Type': 'multipart/form-data',
                }
            });

            if (response.status !== 200) {
                toast.error('Error submitting KYC form. Please try again.')
                return
            }
            fetchUserKyc();
            toast.success('KYC form submitted successfully! Your verification is now under review.')

        } catch (error) {
            toast.error(error.response.data.message || 'Error submitting KYC form. Please try again.')
            console.error('KYC submission error:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const FileUploadField = ({
        label,
        documentType,
        required = true,
        description
    }: {
        label: string
        documentType: keyof KYCFormData['documents']
        required?: boolean
        description?: string
    }) => {
        const file = formData.documents[documentType]
        const error = errors.documents?.[documentType]

        return (
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
                {description && (
                    <p className="text-xs text-gray-500">{description}</p>
                )}
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
                    <div className="space-y-1 text-center">
                        {file ? (
                            <div className="flex items-center space-x-2 text-green-600">
                                <CheckCircle className="w-5 h-5" />
                                <span className="text-sm font-medium">{file.name}</span>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center">
                                <Upload className="w-8 h-8 text-gray-400" />
                                <div className="flex text-sm text-gray-600">
                                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                        <span>Upload a file</span>
                                        <input
                                            type="file"
                                            className="sr-only"
                                            accept="image/*,.pdf"
                                            onChange={(e) => handleFileUpload(documentType, e.target.files?.[0] || null)}
                                        />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                            </div>
                        )}
                    </div>
                </div>
                {error && (
                    <div className="flex items-center space-x-1 text-red-600 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        <span>{error}</span>
                    </div>
                )}
            </div>
        )
    }

    // KYC Status Component
    const KYCStatusCard = ({ status, declineReason }: { status: string, declineReason?: string }) => {
        const getStatusInfo = (status: string) => {
            switch (status.toLowerCase()) {
                case 'pending':
                    return {
                        title: 'KYC Under Review',
                        message: 'Your KYC verification is currently under review. This process typically takes up to 24 hours. You will be notified once the review is complete.',
                        icon: '⏳',
                        bgColor: 'bg-yellow-50',
                        borderColor: 'border-yellow-200',
                        textColor: 'text-yellow-800'
                    }
                case 'approved':
                    return {
                        title: 'KYC Approved',
                        message: 'Congratulations! Your KYC verification has been approved. You now have full access to all platform features.',
                        icon: '✅',
                        bgColor: 'bg-green-50',
                        borderColor: 'border-green-200',
                        textColor: 'text-green-800'
                    }
                case 'declined':
                case 'rejected':
                    return {
                        title: 'KYC Declined',
                        message: declineReason
                            ? `Your KYC verification has been declined. Reason: ${declineReason}. Please review the requirements and submit a new application with correct information.`
                            : 'Your KYC verification has been declined. Please review the requirements and submit a new application with correct information.',
                        icon: '❌',
                        bgColor: 'bg-red-50',
                        borderColor: 'border-red-200',
                        textColor: 'text-red-800'
                    }
                default:
                    return {
                        title: 'KYC Status Unknown',
                        message: 'Unable to determine your KYC status. Please contact support for assistance.',
                        icon: '❓',
                        bgColor: 'bg-gray-50',
                        borderColor: 'border-gray-200',
                        textColor: 'text-gray-800'
                    }
            }
        }

        const statusInfo = getStatusInfo(status)

        return (
            <div className={`max-w-4xl mx-auto p-6 rounded-lg shadow-lg border-2 ${statusInfo.bgColor} ${statusInfo.borderColor}`}>
                <div className="text-center">
                    <div className="text-6xl mb-4">{statusInfo.icon}</div>
                    <h2 className={`text-2xl font-bold mb-4 ${statusInfo.textColor}`}>
                        {statusInfo.title}
                    </h2>
                    <p className={`text-lg ${statusInfo.textColor} mb-6`}>
                        {statusInfo.message}
                    </p>

                    {/* Show decline reason separately if available */}
                    {declineReason && (status.toLowerCase() === 'declined' || status.toLowerCase() === 'rejected') && (
                        <div className="bg-red-100 border border-red-300 rounded-lg p-4 mb-6">
                            <h3 className="text-lg font-semibold text-red-800 mb-2">Decline Reason:</h3>
                            <p className="text-red-700">{declineReason}</p>
                        </div>
                    )}

                    {status.toLowerCase() === 'declined' || status.toLowerCase() === 'rejected' ? (
                        <button
                            onClick={() => {
                                setUserKyc(null)
                                setFormData({
                                    fullName: '',
                                    dateOfBirth: '',
                                    nationality: '',
                                    gender: '',
                                    idType: '',
                                    documents: {
                                        idFront: null,
                                        idBack: null,
                                        selfieWithId: null
                                    }
                                })
                                setErrors({})
                            }}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Submit New KYC Application
                        </button>
                    ) : null}
                </div>
            </div>
        )
    }

    // Loading Component
    const LoadingCard = () => (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading KYC Status</h2>
                <p className="text-gray-600">Please wait while we check your verification status...</p>
            </div>
        </div>
    )

    // Show loading state
    if (isLoading) {
        return <LoadingCard />
    }

    // Show KYC status if user has submitted KYC
    if (userKyc && userKyc.status) {
        return <KYCStatusCard status={userKyc.status} declineReason={userKyc.declineReason} />
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">KYC Verification</h2>
                <p className="text-gray-600">Complete your Know Your Customer verification to access all platform features.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information Section */}
                <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <FileText className="w-5 h-5 mr-2" />
                        Personal Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name (as per government ID) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.fullName}
                                onChange={(e) => handleInputChange('fullName', e.target.value)}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.fullName ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="Enter your full name as shown on ID"
                            />
                            {errors.fullName && (
                                <div className="flex items-center space-x-1 text-red-600 text-sm mt-1">
                                    <AlertCircle className="w-4 h-4" />
                                    <span>{errors.fullName}</span>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Date of Birth <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                value={formData.dateOfBirth}
                                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            />
                            {errors.dateOfBirth && (
                                <div className="flex items-center space-x-1 text-red-600 text-sm mt-1">
                                    <AlertCircle className="w-4 h-4" />
                                    <span>{errors.dateOfBirth}</span>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nationality <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.nationality}
                                onChange={(e) => handleInputChange('nationality', e.target.value)}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.nationality ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="Enter your nationality"
                            />
                            {errors.nationality && (
                                <div className="flex items-center space-x-1 text-red-600 text-sm mt-1">
                                    <AlertCircle className="w-4 h-4" />
                                    <span>{errors.nationality}</span>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Gender (optional)
                            </label>
                            <select
                                value={formData.gender}
                                onChange={(e) => handleInputChange('gender', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                                <option value="prefer-not-to-say">Prefer not to say</option>
                            </select>
                        </div>
                    </div>
                </div>



                {/* ID Information Section */}
                <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Government-issued ID Information</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                ID Type <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.idType}
                                onChange={(e) => handleInputChange('idType', e.target.value)}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.idType ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            >
                                <option value="">Select ID type</option>
                                <option value="passport">Passport</option>
                                <option value="national-id">National ID Card</option>
                                <option value="driving-license">Driving License</option>
                            </select>
                            {errors.idType && (
                                <div className="flex items-center space-x-1 text-red-600 text-sm mt-1">
                                    <AlertCircle className="w-4 h-4" />
                                    <span>{errors.idType}</span>
                                </div>
                            )}
                        </div>

                    </div>
                </div>

                {/* Document Upload Section */}
                <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Camera className="w-5 h-5 mr-2" />
                        Document Upload
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FileUploadField
                            label="Front of ID Card / Passport Main Page"
                            documentType="idFront"
                            description="Upload the front side of your ID or main page of passport"
                        />

                        {formData.idType !== 'passport' && (
                            <FileUploadField
                                label="Back of ID Card"
                                documentType="idBack"
                                description="Upload the back side of your ID card"
                            />
                        )}

                        <FileUploadField
                            label="Selfie with ID"
                            documentType="selfieWithId"
                            description="Take a selfie holding your ID next to your face"
                        />

                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={() => {
                            setFormData({
                                fullName: '',
                                dateOfBirth: '',
                                nationality: '',
                                gender: '',
                                idType: '',
                                documents: {
                                    idFront: null,
                                    idBack: null,
                                    selfieWithId: null
                                }
                            })
                            setErrors({})
                        }}
                        className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Reset Form
                    </button>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`px-8 py-2 rounded-md text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 ${isSubmitting
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit KYC Form'}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default KfcSetting
