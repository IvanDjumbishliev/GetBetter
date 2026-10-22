import { Button } from '@/components/ui/button';
import { getApiErrorMessage } from '@/lib/api-error';

export function QueryError({ error, onRetry }: { error: unknown; onRetry?: () => void }) {
  return (
    <div role="alert" className="rounded-lg border border-destructive/50 p-4 text-sm">
      <p className="text-destructive">{getApiErrorMessage(error)}</p>
      {onRetry && (
        <Button variant="outline" size="sm" className="mt-3" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
