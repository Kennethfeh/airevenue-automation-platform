'use client'

import { openSimpleCheckoutModal } from '@/lib/simple-checkout'

export function InteractiveButtons() {
  return (
    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
      <button
        onClick={() => window.location.href = '/contact'}
        className="bg-white text-[#FF4A00] hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-lg transition-all"
      >
        Get Free Analysis ($497 Value)
      </button>

      <div className="text-white/80 text-sm">or</div>

      <button
        onClick={() => openSimpleCheckoutModal('Strategy Consultation', 'one-time', 497)}
        className="border-white text-white hover:bg-white hover:text-[#FF4A00] px-8 py-4 text-lg font-semibold rounded-lg border-2 transition-all"
      >
        Get Started - $497
      </button>
    </div>
  )
}