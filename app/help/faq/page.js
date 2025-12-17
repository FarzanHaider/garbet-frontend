'use client'

import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { useTranslation } from '@/hooks/useTranslation'

export default function FAQPage() {
  const { t } = useTranslation()

  const faqs = [
    {
      question: 'How do I create an account?',
      answer: 'Click on the "Register" button in the top right corner, fill in your information, and verify your email address.'
    },
    {
      question: 'How do I make a deposit?',
      answer: 'Go to the Deposit page, select your preferred payment method, enter the amount, and follow the instructions.'
    },
    {
      question: 'How long do withdrawals take?',
      answer: 'Withdrawals are typically processed within 1-3 business days after admin approval.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept bank transfers, credit cards, Papara, and other popular payment methods in Turkey.'
    },
    {
      question: 'How do I verify my account?',
      answer: 'Upload your ID documents through the KYC section in your profile. Verification usually takes 24-48 hours.'
    },
    {
      question: 'Can I cancel a withdrawal request?',
      answer: 'Yes, you can cancel pending withdrawal requests from the Withdraw page.'
    }
  ]

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-dark font-display text-[#EAEAEA]">
      <Navbar />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <h1 className="text-white text-4xl font-bold mb-2">Frequently Asked Questions</h1>
            <p className="text-white/60 mb-8">Find answers to common questions</p>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-component-dark rounded-lg p-6 border border-white/10">
                  <h3 className="text-white text-lg font-semibold mb-2">{faq.question}</h3>
                  <p className="text-white/70">{faq.answer}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-component-dark rounded-lg border border-white/10">
              <h3 className="text-white text-lg font-semibold mb-2">Still have questions?</h3>
              <p className="text-white/70 mb-4">Contact our support team for assistance.</p>
              <Link href="/help/contact" className="inline-block bg-primary text-black px-6 py-2 rounded-lg font-bold hover:bg-yellow-400 transition-colors">
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

