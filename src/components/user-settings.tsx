"use client"

import React, { useState, useEffect } from 'react'
import axios from "axios"
import { toast } from "sonner"
import Cookies from "js-cookie"

interface UserSettingsProps {
    vacationMode: boolean
    onVacationModeChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    notificationEnabled: boolean
    onNotificationChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const UserSettings: React.FC<UserSettingsProps> = ({
    vacationMode,
    onVacationModeChange,
    notificationEnabled,
    onNotificationChange
}) => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
                <div>
                    <h3 className="font-medium">Vacation Mode</h3>
                    <p className="text-sm text-gray-500">When enabled, your listings will be hidden from buyers</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={vacationMode}
                        onChange={onVacationModeChange}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-600"></div>
                </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
                <div>
                    <h3 className="font-medium">Notifications</h3>
                    <p className="text-sm text-gray-500">Receive notifications about your orders and messages</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={notificationEnabled}
                        onChange={onNotificationChange}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-600"></div>
                </label>
            </div>
        </div>
    )
}

export default UserSettings