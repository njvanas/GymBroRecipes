import React, { useEffect, useState } from 'react';
import { get } from 'idb-keyval';
import { createClient } from '@supabase/supabase-js';
import Button from './ui/Button';
import { Card, CardHeader, CardContent } from './ui/Card';
import { PhotosIcon, PlusIcon } from './ui/icons';
import { useToast } from './ui/Toast';
import LoadingSpinner from './ui/LoadingSpinner';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

const ProgressPhotos = () => {
  const [user, setUser] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    async function loadUser() {
      try {
        const stored = await get('user');
        setUser(stored || { is_paid: false });
      } catch (error) {
        console.error('Error loading user:', error);
        toast.error('Failed to load user data');
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, [toast]);

  useEffect(() => {
    if (user?.is_paid && supabase) {
      loadPhotos();
    }
  }, [user]);

  async function loadPhotos() {
    if (!supabase || !user) return;
    try {
      const { data, error } = await supabase.storage
        .from('progress_photos')
        .list(user.id);
      if (error) throw error;
      setPhotos(data || []);
    } catch (err) {
      console.error('Error loading photos', err);
      toast.error('Failed to load progress photos');
    }
  }

  async function handleUpload(e) {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    
    setUploading(true);
    const filePath = `${user.id}/${Date.now()}-${file.name}`;
    
    try {
      if (!supabase) throw new Error('Supabase not configured');
      const { error } = await supabase.storage
        .from('progress_photos')
        .upload(filePath, file);
      if (error) throw error;
      
      toast.success('Progress photo uploaded successfully');
      await loadPhotos();
    } catch (err) {
      console.error('Upload failed', err);
      toast.error('Failed to upload progress photo');
    } finally {
      setUploading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl mb-4">
          <PhotosIcon className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gradient">
          Progress Photos
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Document your transformation journey with progress photos. Visual tracking helps you see changes that numbers can't capture.
        </p>
      </div>

      {!user?.is_paid || !supabase ? (
        <Card className="animate-slide-up">
          <CardContent className="text-center py-12">
            <div className="w-24 h-24 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <PhotosIcon className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Upgrade for Progress Photos
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">
              Upload and store your progress photos securely in the cloud. Track your visual transformation over time with unlimited photo storage.
            </p>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Unlimited photo storage
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Secure cloud backup
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Multi-device access
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Timeline view
                </div>
              </div>
              <Button size="lg" className="mt-6">
                Upgrade to Pro
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Upload Section */}
          <Card className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <CardHeader>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <PlusIcon className="w-6 h-6 text-pink-500" />
                Upload Progress Photo
              </h2>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:border-pink-400 dark:hover:border-pink-500 transition-colors">
                <PhotosIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Choose a progress photo
                </p>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Upload JPG, PNG or HEIC files up to 10MB
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUpload}
                  disabled={uploading}
                  className="hidden"
                  id="photo-upload"
                />
                <label htmlFor="photo-upload">
                  <Button
                    as="span"
                    loading={uploading}
                    className="cursor-pointer"
                  >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    {uploading ? 'Uploading...' : 'Select Photo'}
                  </Button>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Photos Gallery */}
          {photos.length > 0 ? (
            <Card className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <PhotosIcon className="w-6 h-6 text-blue-500" />
                  Your Progress Gallery ({photos.length} photos)
                </h2>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {photos.map((photo) => {
                    const url = supabase?.storage
                      .from('progress_photos')
                      .getPublicUrl(`${user.id}/${photo.name}`).data.publicUrl;
                    
                    return (
                      <div
                        key={photo.name}
                        className="group relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200"
                      >
                        <img
                          src={url}
                          alt="Progress"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-end">
                          <div className="p-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <p className="text-sm font-medium">
                              {new Date(photo.created_at || photo.name.split('-')[0]).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <CardContent className="text-center py-12">
                <PhotosIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No progress photos yet
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Upload your first progress photo to start tracking your visual transformation.
                </p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default ProgressPhotos;