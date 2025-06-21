import React, { useEffect, useState } from 'react';
import { CheckCircle, Heart, ArrowLeft, Share2 } from 'lucide-react';
import { useSearchParams, Link } from 'react-router-dom';

const DonationSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [copied, setCopied] = useState(false);

  const shareUrl = window.location.origin;
  const shareText = "I just donated to help protect endangered species in Ontario! Join me in making a difference. 🌿";

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Ontario Endangered Species Conservation',
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback to copying to clipboard
      try {
        await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.log('Error copying to clipboard:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-8 text-center">
        {/* Success Icon */}
        <div className="mb-6">
          <div className="bg-green-100 rounded-full p-4 w-20 h-20 mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Thank You!</h1>
          <p className="text-lg text-gray-600">Your donation has been processed successfully</p>
        </div>

        {/* Success Message */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Heart className="w-5 h-5 text-emerald-600" />
            <h2 className="text-xl font-semibold text-emerald-900">Making a Real Impact</h2>
          </div>
          <p className="text-emerald-800 mb-4">
            Your generous contribution will directly support conservation efforts for endangered species across Ontario. 
            Every donation helps fund research, habitat protection, and species recovery programs.
          </p>
          <div className="text-sm text-emerald-700">
            <p>✓ Habitat restoration and protection</p>
            <p>✓ Species monitoring and research</p>
            <p>✓ Community education programs</p>
            <p>✓ Emergency intervention for critical species</p>
          </div>
        </div>

        {/* Receipt Info */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-600">
            A receipt has been sent to your email address. 
            {sessionId && (
              <span className="block mt-1 font-mono text-xs text-gray-500">
                Transaction ID: {sessionId.slice(-8)}
              </span>
            )}
          </p>
        </div>

        {/* Share Section */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Help Spread the Word</h3>
          <p className="text-gray-600 text-sm mb-4">
            Share this conservation initiative with your friends and family to multiply your impact.
          </p>
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            {copied ? 'Copied!' : 'Share'}
          </button>
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
            className="flex-1 px-6 py-3 border border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors"
          >
            Donate Again
          </button>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Your donation is secure and processed through Stripe. 
            For questions about your donation, please contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DonationSuccess;