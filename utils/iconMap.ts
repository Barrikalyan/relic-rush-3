/**
 * Icon mapping for different node labels across categories.
 * Maps node labels to lucide-react icon components.
 */

import {
  Database,
  CheckCircle,
  RotateCcw,
  Lock,
  Shield,
  Key,
  Cpu,
  Clock,

  AlertCircle,
  HardDrive,
  FileQuestion,
  BarChart3,
  Activity,
} from 'lucide-react';

export type IconName = keyof typeof ICON_MAP;

const ICON_MAP = {
  Database,
  'User Input': Lock,
  'Validate Query': FileQuestion,
  'Commit': CheckCircle,
  'Rollback': RotateCcw,
  'Process': BarChart3,
  'Ready State': Cpu,
  'Running State': Activity,
  'Waiting State': Clock,
  'Terminated': AlertCircle,
  'Scheduler': Cpu,
  'I/O Request': HardDrive,
  'User': Activity,
  'Authentication': Lock,
  'Authorization': Shield,
  'Encrypt': Key,
  'Decrypt': Key,
  'Firewall': Shield,
  'Access Granted': CheckCircle,
  'Access Denied': AlertCircle,
} as const;

/**
 * Get icon component for a given label.
 * Falls back to a generic icon if label not found.
 */
export function getIconForLabel(label: string): React.ComponentType<{ size: number; className?: string }> {
  return (ICON_MAP[label as IconName] || Activity) as any;
}

export default ICON_MAP;
