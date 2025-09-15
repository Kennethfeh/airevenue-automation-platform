'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { CreditCard, Loader2, Lock, CheckCircle } from 'lucide-react'
import { openPaddleCheckout, getProduct, formatPrice, PRODUCTS } from '@/lib/paddle'
import toast from 'react-hot-toast'

interface PaddleButtonProps {
  productKey: keyof typeof PRODUCTS
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  customerEmail?: string
  customerName?: string
  customData?: Record<string, any>
  onSuccess?: () => void
  onError?: (error: Error) => void
  className?: string
  children?: React.ReactNode
}

export const PaddleButton: React.FC<PaddleButtonProps> = ({
  productKey,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  customerEmail,
  customerName,
  customData,
  onSuccess,
  onError,
  className = '',
  children
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const product = getProduct(productKey)

  const handlePayment = async () => {
    if (isLoading) return

    setIsLoading(true)

    try {
      await openPaddleCheckout({
        productId: product.id,
        customerEmail,
        customerName,
        customData: {
          ...customData,
          productKey,
          timestamp: Date.now()
        },
        successUrl: `${window.location.origin}/payment/success?product=${productKey}`,
        closeCallback: () => {
          setIsLoading(false)
        },
        popupCallback: (data) => {
          if (data.name === 'checkout.completed') {
            toast.success('Payment completed successfully!')
            onSuccess?.()
          } else if (data.name === 'checkout.error') {
            toast.error('Payment failed. Please try again.')
            onError?.(new Error('Payment failed'))
          }
          setIsLoading(false)
        }
      })
    } catch (error) {
      console.error('Payment error:', error)
      toast.error('Unable to process payment. Please try again.')
      onError?.(error as Error)
      setIsLoading(false)
    }
  }

  // Style variants
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-[#FF4A00] to-[#FF6B1A] text-white hover:shadow-lg hover:shadow-[#FF4A00]/25 border-0'
      case 'secondary':
        return 'bg-gray-900 text-white hover:bg-gray-800 border border-gray-900'
      case 'outline':
        return 'border-2 border-[#FF4A00] text-[#FF4A00] hover:bg-[#FF4A00] hover:text-white bg-transparent'
      default:
        return 'bg-gradient-to-r from-[#FF4A00] to-[#FF6B1A] text-white hover:shadow-lg hover:shadow-[#FF4A00]/25'
    }
  }

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-4 py-2 text-sm'
      case 'lg':
        return 'px-8 py-4 text-lg'
      default:
        return 'px-6 py-3 text-base'
    }
  }

  const baseStyles = `
    inline-flex items-center justify-center font-semibold rounded-lg
    transition-all duration-200 transform hover:scale-105
    focus:outline-none focus:ring-2 focus:ring-[#FF4A00] focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
    ${fullWidth ? 'w-full' : ''}
    ${getVariantStyles()}
    ${getSizeStyles()}
    ${className}
  `

  return (
    <motion.button
      onClick={handlePayment}
      disabled={isLoading}
      className={baseStyles}
      whileHover={{ scale: isLoading ? 1 : 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="flex items-center space-x-2">
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            {product.price === 0 ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <CreditCard className="w-4 h-4" />
            )}
          </>
        )}
        
        <span>
          {children || (
            <>
              {product.price === 0 ? 'Get Free Analysis' : `Buy Now - ${formatPrice(product.price)}`}
            </>
          )}
        </span>
        
        {!isLoading && product.price > 0 && (
          <Lock className="w-3 h-3 opacity-75" />
        )}
      </div>
      
      {isLoading && (
        <span className="ml-2 text-sm opacity-75">
          Opening secure checkout...
        </span>
      )}
    </motion.button>
  )
}

// Pre-configured button variants for common use cases
export const BuyNowButton: React.FC<Omit<PaddleButtonProps, 'variant'>> = (props) => (
  <PaddleButton {...props} variant="primary" />
)

export const GetStartedButton: React.FC<Omit<PaddleButtonProps, 'variant'>> = (props) => (
  <PaddleButton {...props} variant="primary">
    Get Started Now
  </PaddleButton>
)

export const LearnMoreButton: React.FC<Omit<PaddleButtonProps, 'variant'>> = (props) => (
  <PaddleButton {...props} variant="outline">
    Learn More
  </PaddleButton>
)

// Pricing card button component
interface PricingButtonProps extends Omit<PaddleButtonProps, 'productKey'> {
  productKey: keyof typeof PRODUCTS
  popular?: boolean
}

export const PricingButton: React.FC<PricingButtonProps> = ({ 
  productKey, 
  popular = false, 
  ...props 
}) => {
  const product = getProduct(productKey)
  
  return (
    <div className="space-y-2">
      <BuyNowButton 
        productKey={productKey}
        fullWidth
        size="lg"
        {...props}
      >
        {product.price === 0 ? 'Get Free Analysis' : 'Get Started'}
      </BuyNowButton>
      
      {product.price > 0 && (
        <div className="flex items-center justify-center space-x-1 text-xs text-gray-500">
          <Lock className="w-3 h-3" />
          <span>Secure payment by Paddle</span>
        </div>
      )}
      
      {popular && (
        <div className="text-center">
          <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
            Most Popular
          </span>
        </div>
      )}
    </div>
  )
}