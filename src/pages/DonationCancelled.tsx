import React from 'react';
import { XCircle, ArrowLeft, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const DonationCancelled: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-8 text-center">
        {/* Cancelled Icon */}
        <div className="mb-6">
          <div className="bg-gray-100 rounded-full p-4 w-20 h-20 mx-auto mb-4">
            <XCircle className="w-12 h-12 text-gray-600 mx-auto" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Donation Cancelled</h1>
          <p className="text-lg text-gray-600">Your donation was not processed</p>
        </div>

        {/* Message */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
          <p className="text-gray-700 mb-4">
            No worries! Your donation was cancelled and no charges were made to your payment method.
          </p>
          <p className="text-gray-600 text-sm">
            If you experienced any issues during the donation process, please try again or contact our support team.
          </p>
        </div>

        {/* Still Want to Help */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Heart className="w-5 h-5 text-emerald-600" />
            <h2 className="text-xl font-semibold text-emerald-900">Still Want to Help?</h2>
          </div>
          <p className="text-emerald-800 mb-4">
            Every contribution, no matter the size, makes a real difference in protecting Ontario's endangered species.
          </p>
          <div className="text-sm text-emerald-700">
            <p>• Your donation funds critical conservation research</p>
            <p>• Helps protect and restore natural habitats</p>
            <p>• Supports species recovery programs</p>
            <p>• Enables community education initiatives</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="/"
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Map
          </Link>
          <button
            onClick={() => window.location.reload()}
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 border border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors"
          >
            <Heart className="w-4 h-4" />
            Try Donating Again
          </button>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Need help? Contact our support team for assistance with donations or technical issues.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DonationCancelled;