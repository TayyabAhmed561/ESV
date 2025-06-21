import React, { useEffect, useState } from 'react';
import { Heart, Users, DollarSign, Calendar } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { mockSpecies } from '../../data/speciesData';

interface Donation {
  id: string;
  amount: number;
  currency: string;
  donor_name: string | null;
  species_id: string | null;
  message: string | null;
  anonymous: boolean;
  created_at: string;
}

const RecentDonations: React.FC = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalRaised, setTotalRaised] = useState(0);
  const [donorCount, setDonorCount] = useState(0);

  useEffect(() => {
    fetchRecentDonations();
  }, []);

  const fetchRecentDonations = async () => {
    try {
      const { data, error } = await supabase
        .from('donations')
        .select('*')
        .eq('status', 'completed')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      setDonations(data || []);
      
      // Calculate totals
      const total = (data || []).reduce((sum, donation) => sum + donation.amount, 0);
      setTotalRaised(total / 100); // Convert from cents
      setDonorCount(data?.length || 0);
    } catch (error) {
      console.error('Error fetching donations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSpeciesName = (speciesId: string | null) => {
    if (!speciesId) return 'General Conservation';
    const species = mockSpecies.find(s => s.id === speciesId);
    return species?.commonName || 'Unknown Species';
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md border border-emerald-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-emerald-200">
      {/* Header with Stats */}
      <div className="p-6 border-b border-emerald-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-emerald-600 p-2 rounded-lg">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Conservation Impact</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-emerald-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-700">Total Raised</span>
            </div>
            <p className="text-2xl font-bold text-emerald-900">
              ${totalRaised.toLocaleString()}
            </p>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">Donors</span>
            </div>
            <p className="text-2xl font-bold text-blue-900">{donorCount}</p>
          </div>
        </div>
      </div>

      {/* Recent Donations */}
      <div className="p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Recent Donations</h4>
        
        {donations.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Heart className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No donations yet. Be the first to contribute!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {donations.map((donation) => (
              <div key={donation.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900">
                      {donation.anonymous ? 'Anonymous Donor' : donation.donor_name || 'Anonymous'}
                    </span>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-600">
                      {getSpeciesName(donation.species_id)}
                    </span>
                  </div>
                  
                  {donation.message && !donation.anonymous && (
                    <p className="text-sm text-gray-600 italic">"{donation.message}"</p>
                  )}
                  
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-500">
                      {formatDate(donation.created_at)}
                    </span>
                  </div>
                </div>
                
                <div className="text-right">
                  <span className="font-bold text-emerald-600">
                    {formatAmount(donation.amount, donation.currency)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentDonations;