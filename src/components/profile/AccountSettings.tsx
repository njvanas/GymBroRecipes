import React, { useState } from 'react';
import { Mail, User, Lock, Save, Loader } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';

export const AccountSettings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const updateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        email: formData.email
      });

      if (error) throw error;

      toast.success('Email update request sent. Please check your new email for verification.');
      setFormData(prev => ({ ...prev, email: '' }));
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('user_profiles')
        .update({ display_name: formData.username })
        .eq('id', user.id);

      if (error) throw error;

      toast.success('Username updated successfully');
      setFormData(prev => ({ ...prev, username: '' }));
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (formData.newPassword !== formData.confirmPassword) {
        throw new Error('New passwords do not match');
      }

      const { error } = await supabase.auth.updateUser({
        password: formData.newPassword
      });

      if (error) throw error;

      toast.success('Password updated successfully');
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
        Account Settings
      </h2>

      {/* Email Update Form */}
      <form onSubmit={updateEmail} className="space-y-4">
        <div className="flex items-center gap-2">
          <Mail size={20} className="text-green-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Update Email
          </h3>
        </div>
        <div className="space-y-2">
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            placeholder="New email address"
            className="w-full px-4 py-2 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            required
          />
          <button
            type="submit"
            disabled={isLoading || !formData.email}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader className="animate-spin" size={20} /> : <Save size={20} />}
            Update Email
          </button>
        </div>
      </form>

      {/* Username Update Form */}
      <form onSubmit={updateUsername} className="space-y-4">
        <div className="flex items-center gap-2">
          <User size={20} className="text-green-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Update Username
          </h3>
        </div>
        <div className="space-y-2">
          <input
            type="text"
            value={formData.username}
            onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
            placeholder="New username"
            className="w-full px-4 py-2 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            required
          />
          <button
            type="submit"
            disabled={isLoading || !formData.username}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader className="animate-spin" size={20} /> : <Save size={20} />}
            Update Username
          </button>
        </div>
      </form>

      {/* Password Update Form */}
      <form onSubmit={updatePassword} className="space-y-4">
        <div className="flex items-center gap-2">
          <Lock size={20} className="text-green-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Update Password
          </h3>
        </div>
        <div className="space-y-4">
          <input
            type="password"
            value={formData.newPassword}
            onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
            placeholder="New password"
            className="w-full px-4 py-2 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            required
            minLength={6}
          />
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
            placeholder="Confirm new password"
            className="w-full px-4 py-2 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            required
            minLength={6}
          />
          <button
            type="submit"
            disabled={isLoading || !formData.newPassword || !formData.confirmPassword}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader className="animate-spin" size={20} /> : <Save size={20} />}
            Update Password
          </button>
        </div>
      </form>
    </div>
  );
};