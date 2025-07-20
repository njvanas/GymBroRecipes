import React, { useEffect, useState } from 'react';
import { get } from 'idb-keyval';
import { createClient } from '@supabase/supabase-js';

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

  useEffect(() => {
    async function loadUser() {
      const stored = await get('user');
      setUser(stored || { is_paid: false });
    }
    loadUser();
  }, []);

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
      await loadPhotos();
    } catch (err) {
      console.error('Upload failed', err);
    } finally {
      setUploading(false);
    }
  }

  if (!user) return null;

  if (!user.is_paid || !supabase) {
    return <p className="text-center">Upgrade to upload progress photos.</p>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Progress Photos</h2>
      <input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {photos.map((p) => {
          const url = supabase?.storage
            .from('progress_photos')
            .getPublicUrl(`${user.id}/${p.name}`).data.publicUrl;
          return <img key={p.name} src={url} alt="Progress" className="rounded" />;
        })}
      </div>
    </div>
  );
};

export default ProgressPhotos;
