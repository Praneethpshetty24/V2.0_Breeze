"use client"
import React from 'react';

const Popup = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
      <div className="bg-white bg-opacity-10 p-6 rounded-lg backdrop-filter backdrop-blur-lg shadow-xl z-50 max-w-md w-full mx-4 border border-purple-500/20">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-white mb-4">Email Notification Alert</h3>
          <p className="text-gray-200 mb-6">
            As a guest user, you won't receive email notifications for important updates and alerts. Sign in with Google to enable email notifications.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-300"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-300"
            >
              Continue Anyway
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Popup;