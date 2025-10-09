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
    accountNo: string
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
        if (!formBank.accountNo) return toast.error('Please Enter your account number')
        if (!formBank.bankName) return toast.error('Please Enter the Bank Name')

        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/bank/create`,
                {
                    accountHolderName: formBank.accountHolderName,
                    accountNo: formBank.accountNo,
                    bankName: formBank.bankName,
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
        try {
            const payload = {
                accountHolderName: formBank.accountHolderName,
                accountNo: formBank.accountNo,
                bankName: formBank.bankName,
                bankStatus: formBank.bankStatus,
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
                className={`cursor-pointer w-12 h-6 rounded-full flex items-center p-1 transition-colors ${isActive ? 'bg-green-500 justify-end' : 'bg-red-500 justify-start'
                    }`}
            >
                <div className="w-4 h-4 bg-white rounded-full shadow-md transition-transform" />
            </div>
        )
    }

    return (
        <div className="w-full mx-auto min-h-screen p-4 md:p-6">
            <div className="bg-gray-50 p-4 md:p-6 rounded-lg shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
                    <p className="text-sm text-gray-600">Manage your withdrawal bank account(s)</p>
                    <button
                        className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded flex items-center justify-center gap-2 w-full sm:w-auto"
                        onClick={() => {
                            setFormBank({
                                accountHolderName: '',
                                accountNo: '',
                                bankName: '',
                                bankStatus: 'active',
                                userId: id,
                            })
                            setAddBankModalOpen(true)
                        }}
                    >
                        Add Withdrawl Bank <PlusCircle className="w-5 h-5" />
                    </button>
                </div>

                {withdrawBanks.length === 0 ? (
                    <div className="p-4 bg-white rounded border text-center text-gray-500">
                        No bank added yet.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border rounded">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="py-2 px-3 border text-left">#</th>
                                    <th className="py-2 px-3 border text-left">Account Title</th>
                                    <th className="py-2 px-3 border text-left">Account No</th>
                                    <th className="py-2 px-3 border text-left">Bank Name</th>
                                    <th className="py-2 px-3 border text-left">Status</th>
                                    <th className="py-2 px-3 border text-center">Change Status</th>
                                    <th className="py-2 px-3 border text-center">Edit</th>
                                    <th className="py-2 px-3 border text-center">Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {withdrawBanks.map((bank, index) => (
                                    <tr key={bank._id} className="hover:bg-gray-50">
                                        <td className="py-2 px-3 border">{index + 1}</td>
                                        <td className="py-2 px-3 border">{bank.accountHolderName}</td>
                                        <td className="py-2 px-3 border">{bank.accountNo}</td>
                                        <td className="py-2 px-3 border">{bank.bankName}</td>
                                        <td className="py-2 px-3 border text-center">
                                            <span
                                                className={`px-2 py-1 font-medium rounded-xl ${bank.bankStatus === 'active' ? 'bg-green-200 text-green-900' : 'bg-red-200 text-red-900'
                                                    }`}
                                            >
                                                {bank.bankStatus}
                                            </span>
                                        </td>
                                        <td className="py-2 px-3 border text-center">
                                            <div className="flex justify-center">
                                                <StatusToggle
                                                    status={bank.bankStatus}
                                                    onClick={() => updateBankStatus(bank)}
                                                />
                                            </div>
                                        </td>

                                        <td className="py-2 px-3 border text-center">
                                            <button onClick={() => openEditModalWithBank(bank)} title="edit">
                                                <Edit3 size={20} />
                                            </button>
                                        </td>
                                        <td className="py-2 px-3 border text-center">
                                            <button
                                                onClick={() => confirmDeleteOrChangeStatus(bank._id || '')}
                                                title="delete"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Add Bank Modal */}
            <Modal open={addBankModalOpen} onClose={() => setAddBankModalOpen(false)}>
                <Box className="bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-96 md:w-[500px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <h2 className="text-lg font-semibold mb-4">Add Bank</h2>
                    <div className="grid grid-cols-1 gap-3">
                        <input
                            className="border p-2 rounded"
                            placeholder="Account Holder Name"
                            value={formBank.accountHolderName}
                            onChange={(e) =>
                                setFormBank({ ...formBank, accountHolderName: e.target.value })
                            }
                        />
                        <input
                            className="border p-2 rounded"
                            placeholder="Account Number"
                            value={formBank.accountNo}
                            onChange={(e) =>
                                setFormBank({ ...formBank, accountNo: e.target.value })
                            }
                        />
                        <input
                            className="border p-2 rounded"
                            placeholder="Bank Name"
                            value={formBank.bankName}
                            onChange={(e) =>
                                setFormBank({ ...formBank, bankName: e.target.value })
                            }
                        />
                        {/* Read-only status input */}
                        <input
                            className="border p-2 rounded bg-gray-200 cursor-not-allowed"
                            value="Active"
                            readOnly
                        />
                        <button
                            className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
                            onClick={addNewBank}
                        >
                            Submit
                        </button>
                    </div>
                </Box>
            </Modal>

            {/* Edit Bank Modal */}
            <Modal open={editBankModalOpen} onClose={() => setEditBankModalOpen(false)}>
                <Box className="bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-96 md:w-[500px] fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <h2 className="text-lg font-semibold mb-4">Edit Bank</h2>
                    <div className="grid grid-cols-1 gap-3">
                        <input
                            className="border p-2 rounded"
                            placeholder="Account Holder Name"
                            value={formBank.accountHolderName}
                            onChange={(e) =>
                                setFormBank({ ...formBank, accountHolderName: e.target.value })
                            }
                        />
                        <input
                            className="border p-2 rounded"
                            placeholder="Account Number"
                            value={formBank.accountNo}
                            onChange={(e) =>
                                setFormBank({ ...formBank, accountNo: e.target.value })
                            }
                        />
                        <input
                            className="border p-2 rounded"
                            placeholder="Bank Name"
                            value={formBank.bankName}
                            onChange={(e) =>
                                setFormBank({ ...formBank, bankName: e.target.value })
                            }
                        />
                        {/* Updated dropdown */}
                        <select
                            value={formBank.bankStatus}
                            onChange={(e) =>
                                setFormBank({ ...formBank, bankStatus: e.target.value })
                            }
                            className="border p-2 rounded w-full"
                        >
                            <option value={formBank.bankStatus}>{formBank.bankStatus}</option>
                            <option value={formBank.bankStatus === 'active' ? 'inactive' : 'active'}>
                                {formBank.bankStatus === 'active' ? 'Inactive' : 'Active'}
                            </option>
                        </select>
                        <div className="flex flex-col sm:flex-row gap-y-2 sm:gap-y-0 sm:gap-x-4">
                            <button
                                className="cursor-pointer flex-1 bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
                                onClick={editBank}
                            >
                                Update Bank
                            </button>
                            <button
                                className="cursor-pointer flex-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                onClick={() => {
                                    setEditBankModalOpen(false)
                                    setFormBank({
                                        ...formBank,
                                        accountHolderName: '',
                                        accountNo: '',
                                        bankName: '',
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
