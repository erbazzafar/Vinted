import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { toast } from 'sonner'
import axios from 'axios'
import { PlusCircle, Edit3, Trash2 } from 'lucide-react'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'

interface WithDrawBank {
    _id?: string
    accountHolderName: string
    accountNo: string,
    iban: string,
    bankName: string
    bankStatus: 'active' | 'inactive' | string
    userId: string
}

export default function UserAddBank() {
    const id = Cookies.get('userId') || ''
    const token = Cookies.get('user-token') || ''

    const [withdrawBanks, setWithdrawBanks] = useState<WithDrawBank[]>([])
    const [formBank, setFormBank] = useState<WithDrawBank>({
        accountHolderName: '',
        accountNo: '',
        iban: '',
        bankName: '',
        bankStatus: 'active',
        userId: id,
    })

    const [addBankModalOpen, setAddBankModalOpen] = useState(false)
    const [editBankModalOpen, setEditBankModalOpen] = useState(false)
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
    const [currentBankId, setCurrentBankId] = useState<string | null>(null)

    useEffect(() => {
        getUserBanks()
    }, [])

    const getUserBanks = async () => {
        if (!id) return toast.error('userId is required')
        try {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/bank/userBank/${id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            if (response.status !== 200 && response.status !== 201)
                return toast.error('Error getting the bank(s)')

            const banks = Array.isArray(response.data.data) ? response.data.data : [response.data.data]
            setWithdrawBanks(banks)
        } catch (error) {
            console.error(error)
            toast.error('Error fetching Bank(s) !!')
        }
    }

    const addNewBank = async () => {
        if (!formBank.accountHolderName.trim())
            return toast.error('Account Holder Name is required.')
        if (!formBank.iban || !formBank.iban.trim()) return toast.error('IBAN is required')
        if (!formBank.bankName) return toast.error('Please Enter the Bank Name')

        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/bank/create`,
                {
                    accountHolderName: formBank.accountHolderName,
                    accountNo: formBank.accountNo,
                    bankName: formBank.bankName,
                    iban: formBank.iban,
                    bankStatus: 'active',
                    userId: formBank.userId,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            if (response.status !== 200 && response.status !== 201)
                return toast.error('Error in Response')

            toast.success('Bank Added Successfully')
            setAddBankModalOpen(false)
            setFormBank({
                ...formBank,
                accountHolderName: '',
                accountNo: '',
                bankName: '',
                iban: ''
            })
            getUserBanks()
        } catch (error) {
            console.error(error)
            toast.error('Error submitting the Form')
        }
    }

    const openEditModalWithBank = (bank: WithDrawBank) => {
        setFormBank({ ...bank })
        setCurrentBankId(bank._id || null)
        setEditBankModalOpen(true)
    }

    const editBank = async () => {
        if (!currentBankId) return toast.error('No bank selected to edit')
        if (!formBank.accountHolderName.trim())
            return toast.error('Account Holder Name is required.')
        if (!formBank.iban || !formBank.iban.trim())
            return toast.error('IBAN is required')
        if (!formBank.bankName || !formBank.bankName.trim())
            return toast.error('Bank Name is required')
        try {
            const payload = {
                accountHolderName: formBank.accountHolderName,
                accountNo: formBank.accountNo,
                bankName: formBank.bankName,
                bankStatus: formBank.bankStatus,
                iban: formBank.iban
            }
            const response = await axios.put(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/bank/update/${currentBankId}`,
                payload,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            if (response.status !== 200 && response.status !== 201)
                return toast.error('Error updating bank')
            toast.success('Bank updated successfully')
            setEditBankModalOpen(false)
            setCurrentBankId(null)
            getUserBanks()
        } catch (error) {
            console.error(error)
            toast.error('Error while Editing the Bank Info')
        }
    }

    const updateBankStatus = async (bank: WithDrawBank) => {
        if (!bank._id) return
        const updatedBank = { ...bank, bankStatus: bank.bankStatus === 'active' ? 'inactive' : 'active' }

        try {
            const response = await axios.put(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/bank/update/${bank._id}`,
                updatedBank,
                {
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                }
            )
            toast.success(`Bank status updated to "${updatedBank.bankStatus}"`)
            getUserBanks() // refetch banks
        } catch (error) {
            console.error(error)
            toast.error('Error updating bank status')
        }
    }

    const confirmDeleteOrChangeStatus = (bankId: string) => {
        setCurrentBankId(bankId)
        setDeleteConfirmOpen(true)
    }

    const deleteBank = async (bankId: string) => {
        try {
            const response = await axios.delete(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/bank/delete/${bankId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            if (response.status !== 200 && response.status !== 201)
                return toast.error('Error Deleting the bank')
            toast.success('Bank is deleted Successfully')
            setDeleteConfirmOpen(false)
            getUserBanks()
        } catch (error) {
            console.error(error)
            toast.error('Error deleting the bank')
        }
    }

    const changeStatusFromDeleteModal = async () => {
        if (!currentBankId) return
        const bank = withdrawBanks.find((b) => b._id === currentBankId)
        if (!bank) return toast.error('Bank not found')
        await updateBankStatus(bank)
        setDeleteConfirmOpen(false)
        setCurrentBankId(null)
    }

    // Custom toggle component
    const StatusToggle = ({ status, onClick }: { status: string; onClick: () => void }) => {
        const isActive = status === 'active'
        return (
            <div
                onClick={onClick}
                className={`cursor-pointer w-14 h-7 rounded-full flex items-center p-1 transition-all duration-300 shadow-inner ${isActive
                    ? 'bg-green-500 justify-end hover:bg-green-600'
                    : 'bg-gray-300 justify-start hover:bg-gray-400'
                    }`}
            >
                <div className="w-5 h-5 bg-white rounded-full shadow-lg transition-transform duration-300" />
            </div>
        )
    }

    return (
        <div className="w-full mx-auto min-h-screen p-4 md:p-6">
            <div className="bg-gray-50 p-4 md:p-6 rounded-lg shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
                    <p className="text-sm text-gray-600">Manage your withdrawal bank account(s)</p>
                    <button
                        className="bg-gray-700 hover:bg-gray-800 text-white px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 w-full sm:w-auto font-medium transition-colors duration-200 shadow-sm hover:shadow-md"
                        onClick={() => {
                            setFormBank({
                                accountHolderName: '',
                                accountNo: '',
                                iban: '',
                                bankName: '',
                                bankStatus: 'active',
                                userId: id,
                            })
                            setAddBankModalOpen(true)
                        }}
                    >
                        <PlusCircle className="w-5 h-5" />
                        Add Withdrawal Bank
                    </button>
                </div>

                {withdrawBanks.length === 0 ? (
                    <div className="p-8 bg-white rounded-lg border-2 border-dashed border-gray-300 text-center">
                        <p className="text-gray-500 text-lg">No bank added yet.</p>
                        <p className="text-gray-400 text-sm mt-2">Add your first bank account to get started</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200">
                        <table className="min-w-full bg-white divide-y divide-gray-200">
                            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                                <tr>
                                    <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">#</th>
                                    <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Account Title</th>
                                    <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Account No</th>
                                    <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">IBAN</th>
                                    <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Bank Name</th>
                                    <th className="py-4 px-6 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                                    <th className="py-4 px-6 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Change Status</th>
                                    <th className="py-4 px-6 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {withdrawBanks.map((bank, index) => (
                                    <tr key={bank._id} className="hover:bg-gray-50 transition-colors duration-150">
                                        <td className="py-4 px-6 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                                        <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-900">{bank.accountHolderName}</td>
                                        <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-700">{bank.accountNo || '-'}</td>
                                        <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-700 font-mono">{bank.iban || '-'}</td>
                                        <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-700">{bank.bankName}</td>
                                        <td className="py-4 px-6 whitespace-nowrap text-center">
                                            <span
                                                className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${bank.bankStatus === 'active'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                    }`}
                                            >
                                                {bank.bankStatus.charAt(0).toUpperCase() + bank.bankStatus.slice(1)}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 whitespace-nowrap text-center">
                                            <div className="flex justify-center">
                                                <StatusToggle
                                                    status={bank.bankStatus}
                                                    onClick={() => updateBankStatus(bank)}
                                                />
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 whitespace-nowrap text-center">
                                            <div className="flex items-center justify-center gap-3">
                                                <button
                                                    onClick={() => openEditModalWithBank(bank)}
                                                    title="Edit"
                                                    className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors duration-150"
                                                >
                                                    <Edit3 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => confirmDeleteOrChangeStatus(bank._id || '')}
                                                    title="Delete"
                                                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors duration-150"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Add Bank Modal */}
            <Modal
                open={addBankModalOpen}
                onClose={() => setAddBankModalOpen(false)}
                className="flex items-center justify-center"
            >
                <Box className="bg-white rounded-xl shadow-2xl w-11/12 sm:w-96 md:w-[500px] max-h-[90vh] overflow-y-auto">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-2xl font-bold text-gray-800">Add Bank Account</h2>
                        <p className="text-sm text-gray-500 mt-1">Enter your bank details to enable withdrawals</p>
                    </div>
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Account Holder Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-gray-700 focus:border-transparent transition-all outline-none"
                                placeholder="Enter account holder name"
                                value={formBank.accountHolderName}
                                onChange={(e) =>
                                    setFormBank({ ...formBank, accountHolderName: e.target.value })
                                }
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Account Number
                            </label>
                            <input
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-gray-700 focus:border-transparent transition-all outline-none"
                                placeholder="Enter account number (optional)"
                                value={formBank.accountNo}
                                onChange={(e) =>
                                    setFormBank({ ...formBank, accountNo: e.target.value })
                                }
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                IBAN <span className="text-red-500">*</span>
                            </label>
                            <input
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-gray-700 focus:border-transparent transition-all outline-none font-mono"
                                placeholder="Enter IBAN"
                                value={formBank.iban}
                                onChange={(e) =>
                                    setFormBank({ ...formBank, iban: e.target.value })
                                }
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Bank Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-gray-700 focus:border-transparent transition-all outline-none"
                                placeholder="Enter bank name"
                                value={formBank.bankName}
                                onChange={(e) =>
                                    setFormBank({ ...formBank, bankName: e.target.value })
                                }
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Status
                            </label>
                            <input
                                className="w-full border border-gray-300 p-3 rounded-lg bg-gray-50 cursor-not-allowed text-gray-600"
                                value="Active"
                                readOnly
                            />
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button
                                className="flex-1 bg-gray-700 text-white px-4 py-3 rounded-lg hover:bg-gray-800 font-medium transition-colors duration-200 shadow-sm"
                                onClick={addNewBank}
                            >
                                Add Bank
                            </button>
                            <button
                                className="px-4 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium transition-colors duration-200"
                                onClick={() => setAddBankModalOpen(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </Box>
            </Modal>

            {/* Edit Bank Modal */}
            <Modal
                open={editBankModalOpen}
                onClose={() => setEditBankModalOpen(false)}
                className="flex items-center justify-center"
            >
                <Box className="bg-white rounded-xl shadow-2xl w-11/12 sm:w-96 md:w-[500px] max-h-[90vh] overflow-y-auto">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-2xl font-bold text-gray-800">Edit Bank Account</h2>
                        <p className="text-sm text-gray-500 mt-1">Update your bank account information</p>
                    </div>
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Account Holder Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-gray-700 focus:border-transparent transition-all outline-none"
                                placeholder="Enter account holder name"
                                value={formBank.accountHolderName}
                                onChange={(e) =>
                                    setFormBank({ ...formBank, accountHolderName: e.target.value })
                                }
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Account Number
                            </label>
                            <input
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-gray-700 focus:border-transparent transition-all outline-none"
                                placeholder="Enter account number (optional)"
                                value={formBank.accountNo}
                                onChange={(e) =>
                                    setFormBank({ ...formBank, accountNo: e.target.value })
                                }
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                IBAN <span className="text-red-500">*</span>
                            </label>
                            <input
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-gray-700 focus:border-transparent transition-all outline-none font-mono"
                                placeholder="Enter IBAN"
                                value={formBank.iban}
                                onChange={(e) =>
                                    setFormBank({ ...formBank, iban: e.target.value })
                                }
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Bank Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-gray-700 focus:border-transparent transition-all outline-none"
                                placeholder="Enter bank name"
                                value={formBank.bankName}
                                onChange={(e) =>
                                    setFormBank({ ...formBank, bankName: e.target.value })
                                }
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Status
                            </label>
                            <select
                                value={formBank.bankStatus}
                                onChange={(e) =>
                                    setFormBank({ ...formBank, bankStatus: e.target.value })
                                }
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-gray-700 focus:border-transparent transition-all outline-none"
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button
                                className="flex-1 bg-gray-700 text-white px-4 py-3 rounded-lg hover:bg-gray-800 font-medium transition-colors duration-200 shadow-sm"
                                onClick={editBank}
                            >
                                Update Bank
                            </button>
                            <button
                                className="px-4 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium transition-colors duration-200"
                                onClick={() => {
                                    setEditBankModalOpen(false)
                                    setFormBank({
                                        ...formBank,
                                        accountHolderName: '',
                                        accountNo: '',
                                        bankName: '',
                                        iban: '',
                                    })
                                    setCurrentBankId(null)
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </Box>
            </Modal>


            {/* Delete / Change Status Modal */}
            <Modal open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
                <Box className="bg-white p-6 rounded-lg shadow-xl w-11/12 sm:w-96 md:w-[500px] fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <h3 className="text-xl font-semibold mb-3 text-center text-gray-800">Delete Bank?</h3>
                    <p className="mb-6 text-sm text-gray-600 text-center">
                        Instead of deleting, you can change the status (active / inactive). Choose an option below.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            className="flex-1 flex items-center justify-center gap-2 bg-green-400 text-white px-4 py-2 rounded-md hover:bg-green-500 transition"
                            onClick={changeStatusFromDeleteModal}
                        >
                            <span>🔄</span> Change Status
                        </button>
                        <button
                            className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                            onClick={() => currentBankId && deleteBank(currentBankId)}
                        >
                            <span>🗑️</span> Delete Bank
                        </button>
                    </div>
                </Box>
            </Modal>

        </div>
    )
}
