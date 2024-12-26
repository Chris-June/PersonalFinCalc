import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import type { Document } from '@/lib/types';
import { useAuth } from '@/lib/auth';

export function useDocuments() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDocuments = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('profile_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments(data);
    } catch (error) {
      toast.error('Failed to fetch documents');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const uploadDocument = async (
    file: File,
    metadata: {
      name: string;
      description?: string;
      category: string;
    }
  ) => {
    if (!user) return;

    try {
      const filePath = `${user.id}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { error: insertError } = await supabase.from('documents').insert([{
        profile_id: user.id,
        name: metadata.name,
        description: metadata.description,
        category: metadata.category,
        file_path: filePath,
        file_type: file.type,
        file_size: file.size,
      }]);

      if (insertError) throw insertError;

      await fetchDocuments();
      toast.success('Document uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload document');
      console.error(error);
    }
  };

  const deleteDocument = async (document: Document) => {
    try {
      const { error: storageError } = await supabase.storage
        .from('documents')
        .remove([document.file_path]);

      if (storageError) throw storageError;

      const { error: dbError } = await supabase
        .from('documents')
        .delete()
        .eq('id', document.id);

      if (dbError) throw dbError;

      setDocuments(documents.filter((d) => d.id !== document.id));
      toast.success('Document deleted successfully');
    } catch (error) {
      toast.error('Failed to delete document');
      console.error(error);
    }
  };

  const downloadDocument = async (document: Document) => {
    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .download(document.file_path);

      if (error) throw error;

      const url = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = document.name;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error('Failed to download document');
      console.error(error);
    }
  };

  return {
    documents,
    loading,
    uploadDocument,
    deleteDocument,
    downloadDocument,
  };
}