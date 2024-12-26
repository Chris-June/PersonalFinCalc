import { format } from 'date-fns';
import { FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Document } from '@/lib/types';
import { DOCUMENT_CATEGORIES } from '@/lib/types';

interface RecentDocumentsProps {
  documents: Document[];
}

export function RecentDocuments({ documents }: RecentDocumentsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Recent Documents
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {documents.slice(0, 5).map((document) => (
            <div
              key={document.id}
              className="flex items-center justify-between"
            >
              <div>
                <p className="font-medium">{document.name}</p>
                <p className="text-sm text-muted-foreground">
                  {DOCUMENT_CATEGORIES[document.category]} • {format(new Date(document.created_at), 'PP')}
                </p>
              </div>
              <div className="text-sm text-muted-foreground">
                {(document.file_size / 1024 / 1024).toFixed(2)} MB
              </div>
            </div>
          ))}
          {documents.length === 0 && (
            <p className="text-center text-muted-foreground">
              No documents uploaded
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}