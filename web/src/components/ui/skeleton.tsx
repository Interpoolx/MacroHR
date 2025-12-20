import { cn } from "@shared/lib/utils";
import React from 'react';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'text' | 'circular' | 'rectangular';
  lines?: number;
  width?: string | number;
  height?: string | number;
  animate?: boolean;
}

function Skeleton({
  className,
  variant = 'default',
  lines = 1,
  width,
  height,
  animate = true,
  ...props
}: SkeletonProps) {
  const baseClasses = 'bg-gray-200 dark:bg-gray-700 rounded transition-all duration-300';

  const variantClasses = {
    default: 'h-4 w-full',
    text: 'h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-md',
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  if (variant === 'text' && lines > 1) {
    return (
      <div className={cn('space-y-2', className)}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={cn(
              baseClasses,
              'h-4',
              index === lines - 1 ? 'w-3/4' : 'w-full',
              {
                'animate-pulse': animate,
              }
            )}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        animate && 'animate-pulse',
        className
      )}
      style={style}
      {...props}
    />
  );
}

/**
 * Card skeleton component
 */
export const CardSkeleton: React.FC<{ className?: string; showAvatar?: boolean }> = ({
  className,
  showAvatar = false,
}) => (
  <div className={cn('rounded-lg border border-gray-200 dark:border-gray-700 p-4', className)}>
    {showAvatar && (
      <div className="flex items-center space-x-4 mb-4">
        <Skeleton variant="circular" width={40} height={40} />
        <div className="flex-1">
          <Skeleton className="mb-2" width="60%" />
          <Skeleton width="40%" />
        </div>
      </div>
    )}

    <div className="space-y-3">
      <Skeleton className="h-6 w-3/4 mb-4" />
      <Skeleton lines={3} />
      <div className="flex space-x-2 pt-2">
        <Skeleton width={80} height={32} />
        <Skeleton width={80} height={32} />
      </div>
    </div>
  </div>
);

/**
 * List skeleton component
 */
export const ListSkeleton: React.FC<{
  items?: number;
  className?: string;
  showAvatar?: boolean;
}> = ({ items = 5, className, showAvatar = false }) => (
  <div className={cn('space-y-4', className)}>
    {Array.from({ length: items }).map((_, index) => (
      <CardSkeleton key={index} showAvatar={showAvatar} />
    ))}
  </div>
);

/**
 * Table skeleton component
 */
export const TableSkeleton: React.FC<{
  rows?: number;
  columns?: number;
  className?: string;
}> = ({ rows = 5, columns = 4, className }) => (
  <div className={cn('overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700', className)}>
    <div className="grid gap-px bg-gray-200 dark:bg-gray-700 p-0">
      {/* Header row */}
      {Array.from({ length: columns }).map((_, index) => (
        <div key={`header-${index}`} className="bg-white dark:bg-gray-800 p-3">
          <Skeleton height={20} />
        </div>
      ))}

      {/* Data rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <React.Fragment key={`row-${rowIndex}`}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div key={`cell-${rowIndex}-${colIndex}`} className="bg-white dark:bg-gray-800 p-3">
              <Skeleton height={16} />
            </div>
          ))}
        </React.Fragment>
      ))}
    </div>
  </div>
);

/**
 * Content area skeleton for tools and components
 */
export const ContentSkeleton: React.FC<{
  showPreview?: boolean;
  showCode?: boolean;
  className?: string;
}> = ({ showPreview = true, showCode = true, className }) => (
  <div className={cn('space-y-8', className)}>
    {/* Toolbar */}
    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
      <div className="flex space-x-2">
        <Skeleton width={80} height={32} />
        <Skeleton width={80} height={32} />
        {showCode && <Skeleton width={80} height={32} />}
      </div>
      <Skeleton width={120} height={32} />
    </div>

    {/* Content */}
    <div className="p-6">
      {showPreview && (
        <div className="mb-8">
          <Skeleton className="h-64 w-full mb-4" />
          <Skeleton lines={2} />
        </div>
      )}

      {showCode && (
        <div>
          <Skeleton className="h-48 w-full" />
        </div>
      )}
    </div>
  </div>
);

export { Skeleton };