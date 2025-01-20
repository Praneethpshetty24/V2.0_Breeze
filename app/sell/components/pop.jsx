"use client"

import { AlertTriangle } from "lucide-react"
import { useState } from "react"

export default function WarningPopup({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-lg bg-zinc-900 p-6 shadow-2xl">
        <div className="flex flex-col items-center gap-4 text-center">
          {/* Warning Icon */}
          <div className="rounded-full bg-purple-500/10 p-3">
            <AlertTriangle className="h-6 w-6 text-purple-500" />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-white">Warning</h2>
            <p className="text-sm text-zinc-400">
              You are attempting to sell these shares before the lock-in period of 10 years has expired. This action
              cannot be undone and full amount will not be returned.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex w-full gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 rounded-md border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-500"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

